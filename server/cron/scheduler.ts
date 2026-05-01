/**
 * Cron scheduler — runs in the same process as Express.
 *
 * Jobs:
 *   - dailyPublish: runs every 6h, publishes a queued article OR generates+publishes
 *     a fresh one if queue is empty. Daily cap of 2 published articles per UTC day.
 *   - generateQueue: runs every 4h, ensures we have ≥3 queued articles for tomorrow.
 *   - asinHealthCheck: runs daily at 03:17 UTC, hits each ASIN URL, logs broken.
 *   - sitemapWarm: every 30 min, hits /sitemap.xml so caches stay warm.
 *
 * Per master scope §11. Logs every run to cron_runs table.
 */
import cron from "node-cron";
import { generateOneArticle } from "../lib/generateArticle";
import {
  insertArticle,
  publishQueued,
  getOldestQueued,
  logCronRun,
  countPublished,
} from "../dbArticles";
import { ASIN_CATALOG } from "../data/asinCatalog";
import { verifyAsins } from "../lib/matchProducts";

// Phase-aware daily cap. Master scope §17:
//   phase 1 (0–59 published)  → 3 articles/day staggered (ramp)
//   phase 2 (60+ published)    → 2 articles/day staggered (steady-state)
function phaseCap(publishedTotal: number): number {
  return publishedTotal < 60 ? 3 : 2;
}
const DAILY_CAP_OVERRIDE = process.env.DAILY_PUBLISH_CAP
  ? parseInt(process.env.DAILY_PUBLISH_CAP, 10)
  : null;

async function runJob(name: string, fn: () => Promise<{ status: "success" | "skipped" | "error"; message?: string }>) {
  try {
    const r = await fn();
    await logCronRun(name, r.status, r.message);
    console.log(`[cron:${name}] ${r.status}${r.message ? " — " + r.message : ""}`);
  } catch (e: any) {
    await logCronRun(name, "error", e.message?.slice(0, 500));
    console.warn(`[cron:${name}] error:`, e.message);
  }
}

async function publishedToday(): Promise<number> {
  const { default: mysql } = await import("mysql2/promise");
  const conn = await mysql.createConnection({ uri: process.env.DATABASE_URL! });
  const [rows] = await conn.query(
    "SELECT COUNT(*) AS c FROM articles WHERE status='published' AND DATE(publishedAt) = UTC_DATE()",
  );
  await conn.end();
  return Number((rows as any[])[0]?.c || 0);
}

async function dailyPublish(): Promise<{ status: "success" | "skipped" | "error"; message?: string }> {
  const today = await publishedToday();
  const total = await countPublished();
  const cap = DAILY_CAP_OVERRIDE ?? phaseCap(total);
  if (today >= cap) {
    return { status: "skipped", message: `daily cap reached (${today}/${cap}, phase=${total < 60 ? 1 : 2})` };
  }
  // Try queue first
  const queued = await getOldestQueued();
  if (queued) {
    await publishQueued(queued.id, queued.heroUrl);
    return { status: "success", message: `published queued #${queued.id} ${queued.slug}` };
  }
  // Otherwise generate fresh and publish
  const { article } = await generateOneArticle();
  const id = await insertArticle({
    ...article,
    publishedAt: new Date(),
    status: "published",
    heroUrl: null,
  });
  return { status: "success", message: `generated+published #${id} ${article.slug}` };
}

async function generateQueue(): Promise<{ status: "success" | "skipped" | "error"; message?: string }> {
  const { default: mysql } = await import("mysql2/promise");
  const conn = await mysql.createConnection({ uri: process.env.DATABASE_URL! });
  const [rows] = await conn.query("SELECT COUNT(*) AS c FROM articles WHERE status='queued'");
  await conn.end();
  const queuedCount = Number((rows as any[])[0]?.c || 0);
  if (queuedCount >= 3) return { status: "skipped", message: `queue ok (${queuedCount})` };

  const { article } = await generateOneArticle();
  await insertArticle({
    ...article,
    publishedAt: null,
    status: "queued",
    heroUrl: null,
  });
  return { status: "success", message: `queued ${article.slug}` };
}

async function asinHealthCheck(): Promise<{ status: "success" | "skipped" | "error"; message?: string }> {
  // Use the canonical verifyAsins helper so cron and tests share one
  // implementation (master scope §10D, named-param contract).
  const { valid, invalid } = await verifyAsins({
    asins: ASIN_CATALOG.map(p => p.asin),
    live: true,
    concurrency: 4,
  });
  if (invalid.length === 0) {
    return { status: "success", message: `${valid.length} ASINs healthy` };
  }
  return {
    status: "success",
    message: `valid=${valid.length} invalid=${invalid.length} (${invalid.slice(0, 5).map(i => `${i.asin}:${i.reason}`).join(", ")})`,
  };
}

/**
 * refreshMonthly: bumps last_modified_at on the oldest 10% of articles so
 * Google's freshness signals stay healthy. (Master scope §17.)
 */
async function refreshMonthly(): Promise<{ status: "success" | "skipped" | "error"; message?: string }> {
  const { default: mysql } = await import("mysql2/promise");
  const conn = await mysql.createConnection({ uri: process.env.DATABASE_URL! });
  try {
    const [countRows] = await conn.query("SELECT COUNT(*) AS c FROM articles WHERE status='published'");
    const total = Number((countRows as any[])[0]?.c || 0);
    const refreshN = Math.max(1, Math.ceil(total * 0.1));
    const [rows] = await conn.query(
      "SELECT id FROM articles WHERE status='published' ORDER BY lastModifiedAt ASC LIMIT ?",
      [refreshN],
    );
    const ids = (rows as any[]).map(r => r.id);
    if (ids.length === 0) return { status: "skipped", message: "no rows" };
    await conn.query(
      `UPDATE articles SET lastModifiedAt = UTC_TIMESTAMP() WHERE id IN (${ids.map(() => "?").join(",")})`,
      ids,
    );
    return { status: "success", message: `bumped lastModifiedAt on ${ids.length}/${total} rows` };
  } finally {
    await conn.end();
  }
}

/**
 * refreshQuarterly: regenerates the body of the oldest 5% of articles via
 * the writer engine, keeping the corpus contemporary without churning the
 * whole site. (Master scope §17.)
 */
async function refreshQuarterly(): Promise<{ status: "success" | "skipped" | "error"; message?: string }> {
  const { default: mysql } = await import("mysql2/promise");
  const conn = await mysql.createConnection({ uri: process.env.DATABASE_URL! });
  try {
    const [countRows] = await conn.query("SELECT COUNT(*) AS c FROM articles WHERE status='published'");
    const total = Number((countRows as any[])[0]?.c || 0);
    const refreshN = Math.max(1, Math.ceil(total * 0.05));
    const [rows] = await conn.query(
      "SELECT id, slug, title, category, tags FROM articles WHERE status='published' ORDER BY lastModifiedAt ASC LIMIT ?",
      [refreshN],
    );
    let updated = 0;
    for (const r of rows as any[]) {
      try {
        const tags = typeof r.tags === "string" ? JSON.parse(r.tags) : r.tags || [];
        const { article } = await generateOneArticle({
          topicOverride: { title: r.title, category: r.category || "intentional-singlehood", tags },
        });
        await conn.query(
          "UPDATE articles SET body = ?, description = ?, tldr = ?, wordCount = ?, lastModifiedAt = UTC_TIMESTAMP() WHERE id = ?",
          [article.body, article.description, article.tldr, article.wordCount, r.id],
        );
        updated++;
      } catch (e: any) {
        console.warn(`[cron:refreshQuarterly] skip #${r.id}:`, e.message);
      }
    }
    const rowCount = Array.isArray(rows) ? rows.length : 0;
    return { status: "success", message: `regenerated ${updated}/${rowCount} bodies` };
  } finally {
    await conn.end();
  }
}

async function sitemapWarm(): Promise<{ status: "success" | "skipped" | "error"; message?: string }> {
  const port = process.env.PORT || "3000";
  try {
    await fetch(`http://localhost:${port}/sitemap.xml`);
    const total = await countPublished();
    return { status: "success", message: `sitemap warm; published=${total}` };
  } catch (e: any) {
    return { status: "error", message: e.message };
  }
}

export function startCronJobs() {
  if (process.env.AUTO_GEN_ENABLED === "false") {
    console.log("[cron] AUTO_GEN_ENABLED=false — scheduler disabled");
    return;
  }

  // dailyPublish — staggered across the day at 04:07, 12:07, and 20:07 UTC.
  // The runJob itself enforces the phase-aware daily cap, so phase 2 will
  // simply skip the third slot.
  cron.schedule("7 4,12,20 * * *", () => runJob("dailyPublish", dailyPublish), { timezone: "UTC" });
  // generateQueue — every 4 hours at :23
  cron.schedule("23 */4 * * *", () => runJob("generateQueue", generateQueue), { timezone: "UTC" });
  // asinHealthCheck — weekly, Mondays at 03:17 UTC
  cron.schedule("17 3 * * 1", () => runJob("asinHealthCheck", asinHealthCheck), { timezone: "UTC" });
  // sitemapWarm — every 30 minutes
  cron.schedule("*/30 * * * *", () => runJob("sitemapWarm", sitemapWarm), { timezone: "UTC" });
  // refreshMonthly — 1st of each month at 02:11 UTC
  cron.schedule("11 2 1 * *", () => runJob("refreshMonthly", refreshMonthly), { timezone: "UTC" });
  // refreshQuarterly — 1st of Jan/Apr/Jul/Oct at 02:31 UTC
  cron.schedule("31 2 1 1,4,7,10 *", () => runJob("refreshQuarterly", refreshQuarterly), { timezone: "UTC" });

  // Kick the queue topper once at startup so we always have buffer.
  // The publish job intentionally runs ONLY on the cron schedule so dev
  // restarts don't inflate the daily count.
  setTimeout(() => runJob("startup-queue", generateQueue), 16000);
}
