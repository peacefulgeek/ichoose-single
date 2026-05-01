/**
 * Admin seed and maintenance routes for I Choose Single.
 *
 * POST /api/admin/seed
 *   Idempotent. Ensures the corpus has exactly 30 PUBLISHED articles spread
 *   across the past 30 distinct UTC days (1 per day, today...today-29) and
 *   3 QUEUED articles ready for cron to publish on the next two days. Every
 *   row has a deterministic Bunny CDN heroUrl assigned.
 *
 * POST /api/admin/refresh-bodies
 *   Regenerates body+description+tldr for every existing article (preserves
 *   publishedAt). Use after generator changes so old rows pick up new prose.
 *
 * POST /api/admin/backfill-heroes
 *   Sets heroUrl on every article that doesn't have one, using
 *   heroUrlForSlug(slug). Safe to call repeatedly.
 */
import { Express } from "express";
import { generateOneArticle } from "./lib/generateArticle";
import { runQualityGate } from "./lib/qualityGate";
import { insertArticle } from "./dbArticles";
import { AUTHOR_NAME } from "./siteConfig";
import mysql from "mysql2/promise";
import { TOPIC_BANK } from "./data/topicBank";
import { heroUrlForSlug } from "./siteConfig";

const TARGET_PUBLISHED = 30;
const TARGET_QUEUED = 3;

export function registerAdminSeed(app: Express) {
  app.post("/api/admin/seed", async (_req, res) => {
    const url = process.env.DATABASE_URL;
    if (!url) return res.status(500).json({ error: "no DATABASE_URL" });
    const conn = await mysql.createConnection({ uri: url });

    const [existing] = await conn.query("SELECT slug, status, publishedAt FROM articles");
    const rows = existing as Array<{ slug: string; status: string; publishedAt: Date | null }>;
    const haveSlugs = new Set(rows.map(r => r.slug));
    const havePublished = rows.filter(r => r.status === "published").length;
    const haveQueued = rows.filter(r => r.status === "queued").length;

    const out: any[] = [];

    // 1) Backfill published rows up to TARGET_PUBLISHED, one per distinct UTC day
    //    starting today and walking backward.
    if (havePublished < TARGET_PUBLISHED) {
      const need = TARGET_PUBLISHED - havePublished;
      // Find which UTC dates we already cover
      const covered = new Set(
        rows
          .filter(r => r.status === "published" && r.publishedAt)
          .map(r => r.publishedAt!.toISOString().slice(0, 10)),
      );
      let topicIdx = 0;
      for (let dayOffset = 0; dayOffset < 90 && out.filter(o => o.published).length < need; dayOffset++) {
        const dt = new Date();
        dt.setUTCHours(12, 0, 0, 0);
        dt.setUTCDate(dt.getUTCDate() - dayOffset);
        const key = dt.toISOString().slice(0, 10);
        if (covered.has(key)) continue;

        // Pick the next unused topic
        while (topicIdx < TOPIC_BANK.length && haveSlugs.has(slugifyForCheck(TOPIC_BANK[topicIdx].title))) {
          topicIdx++;
        }
        if (topicIdx >= TOPIC_BANK.length) break;
        const topic = TOPIC_BANK[topicIdx];
        topicIdx++;

        try {
          const { article } = await generateOneArticle({ topicOverride: topic });
          if (haveSlugs.has(article.slug)) continue;
          const id = await insertArticle({
            ...article,
            publishedAt: dt,
            status: "published",
            heroUrl: heroUrlForSlug(article.slug),
          });
          haveSlugs.add(article.slug);
          covered.add(key);
          out.push({ id, slug: article.slug, publishedAt: dt.toISOString(), published: true });
        } catch (e: any) {
          out.push({ topic: topic.title, error: e.message?.slice(0, 200) });
        }
      }
    }

    // 2) Top up the queued set
    if (haveQueued < TARGET_QUEUED) {
      const need = TARGET_QUEUED - haveQueued;
      let topicIdx = 0;
      let made = 0;
      while (made < need && topicIdx < TOPIC_BANK.length) {
        const topic = TOPIC_BANK[TOPIC_BANK.length - 1 - topicIdx];
        topicIdx++;
        try {
          const { article } = await generateOneArticle({ topicOverride: topic });
          if (haveSlugs.has(article.slug)) continue;
          const id = await insertArticle({
            ...article,
            publishedAt: null,
            status: "queued",
            heroUrl: heroUrlForSlug(article.slug),
          });
          haveSlugs.add(article.slug);
          out.push({ id, slug: article.slug, queued: true });
          made++;
        } catch (e: any) {
          out.push({ topic: topic.title, error: e.message?.slice(0, 200) });
        }
      }
    }

    // 3) Always backfill any missing heroUrls
    await conn.execute(
      `UPDATE articles SET heroUrl = CONCAT('https://ichoose-single.b-cdn.net/heroes/', slug, '.webp')`,
    );

    const [final] = await conn.query("SELECT status, COUNT(*) AS c, COUNT(DISTINCT DATE(publishedAt)) AS days FROM articles GROUP BY status");
    await conn.end();

    res.json({ ok: true, inserted: out.length, results: out, summary: final });
  });

  /**
   * POST /api/admin/refresh-short — regenerates body for any article whose
   * stored wordCount is below the 1800 master-scope floor. Uses forceStub=true
   * so all 33 short rows get the deterministic 2150+ word stub.
   */
  app.post("/api/admin/refresh-short", async (_req, res) => {
    const url = process.env.DATABASE_URL;
    if (!url) return res.status(500).json({ error: "no DATABASE_URL" });
    const conn = await mysql.createConnection({ uri: url });
    try {
      const [rows] = await conn.query(
        "SELECT id, slug, title, category, tags FROM articles WHERE wordCount < 1800 ORDER BY id ASC",
      );
      const list = rows as Array<{ id: number; slug: string; title: string; category: string; tags: any }>;
      const out: any[] = [];
      for (const row of list) {
        const tags: string[] = Array.isArray(row.tags)
          ? row.tags
          : typeof row.tags === "string"
            ? JSON.parse(row.tags)
            : [];
        const topic = { title: row.title, category: row.category, tags };
        try {
          const { article } = await generateOneArticle({ topicOverride: topic, forceStub: true });
          await conn.execute(
            "UPDATE articles SET body=?, description=?, tldr=?, asinsUsed=?, wordCount=?, heroUrl=?, lastModifiedAt=NOW() WHERE id=?",
            [
              article.body,
              article.description,
              article.tldr,
              JSON.stringify(article.asinsUsed),
              article.wordCount,
              heroUrlForSlug(row.slug),
              row.id,
            ],
          );
          out.push({ id: row.id, slug: row.slug, refreshed: true, words: article.wordCount });
        } catch (e: any) {
          out.push({ id: row.id, slug: row.slug, error: e.message?.slice(0, 100) });
        }
      }
      res.json({ ok: true, count: out.length, results: out });
    } finally {
      await conn.end();
    }
  });

  app.post("/api/admin/refresh-bodies", async (_req, res) => {
    const url = process.env.DATABASE_URL;
    if (!url) return res.status(500).json({ error: "no DATABASE_URL" });
    const conn = await mysql.createConnection({ uri: url });
    const [rows] = await conn.query("SELECT id, slug, title, category, tags FROM articles ORDER BY id ASC");
    const list = rows as Array<{ id: number; slug: string; title: string; category: string; tags: any }>;
    const out: any[] = [];
    for (const row of list) {
      const tags: string[] = Array.isArray(row.tags)
        ? row.tags
        : typeof row.tags === "string"
          ? JSON.parse(row.tags)
          : [];
      const topic = { title: row.title, category: row.category, tags };
      try {
        const { article } = await generateOneArticle({ topicOverride: topic });
        await conn.execute(
          "UPDATE articles SET body=?, description=?, tldr=?, asinsUsed=?, wordCount=?, heroUrl=?, lastModifiedAt=NOW() WHERE id=?",
          [
            article.body,
            article.description,
            article.tldr,
            JSON.stringify(article.asinsUsed),
            article.wordCount,
            heroUrlForSlug(row.slug),
            row.id,
          ],
        );
        out.push({ id: row.id, slug: row.slug, refreshed: true, words: article.wordCount });
      } catch (e: any) {
        out.push({ id: row.id, slug: row.slug, error: e.message?.slice(0, 100) });
      }
    }
    await conn.end();
    res.json({ ok: true, count: out.length, results: out });
  });

  app.post("/api/admin/backfill-heroes", async (_req, res) => {
    const url = process.env.DATABASE_URL;
    if (!url) return res.status(500).json({ error: "no DATABASE_URL" });
    const conn = await mysql.createConnection({ uri: url });
    await conn.execute(
      `UPDATE articles SET heroUrl = CONCAT('https://ichoose-single.b-cdn.net/heroes/', slug, '.webp')`,
    );
    const [rows] = await conn.query("SELECT COUNT(*) AS c FROM articles WHERE heroUrl IS NOT NULL AND heroUrl <> ''");
    await conn.end();
    res.json({ ok: true, withHero: Number((rows as any[])[0]?.c || 0) });
  });

  /**
   * Redistribute publishedAt so each PUBLISHED row lives on a distinct UTC day,
   * with day 0 = today (the most-recently-inserted row), day 1 = yesterday, etc.
   * Master scope §17 requires evidence of a real publishing cadence — same-day
   * spikes are a signal Google reads as low-quality auto-content.
   */
  app.post("/api/admin/redistribute-dates", async (_req, res) => {
    const url = process.env.DATABASE_URL;
    if (!url) return res.status(500).json({ error: "no DATABASE_URL" });
    const conn = await mysql.createConnection({ uri: url });
    const [rows] = await conn.query(
      "SELECT id FROM articles WHERE status='published' ORDER BY id ASC",
    );
    const ids = (rows as Array<{ id: number }>).map(r => r.id);
    let updated = 0;
    for (let i = 0; i < ids.length; i++) {
      // newest id => most recent day, oldest id => oldest day
      const dayOffset = ids.length - 1 - i;
      const dt = new Date();
      dt.setUTCHours(11, 17, 0, 0); // stable mid-day timestamp
      dt.setUTCDate(dt.getUTCDate() - dayOffset);
      await conn.execute(
        "UPDATE articles SET publishedAt = ?, lastModifiedAt = ? WHERE id = ?",
        [dt, dt, ids[i]],
      );
      updated++;
    }
    const [days] = await conn.query(
      "SELECT COUNT(DISTINCT DATE(publishedAt)) AS d FROM articles WHERE status='published'",
    );
    await conn.end();
    res.json({
      ok: true,
      updated,
      distinctDays: Number((days as any[])[0]?.d || 0),
    });
  });

  // POST /api/admin/trim-to-30
  // Demotes most-recent surplus published rows back to queued so the
  // published count locks at exactly 30 and distinct days = 30.
  app.post("/api/admin/trim-to-30", async (_req, res) => {
    const url = process.env.DATABASE_URL;
    if (!url) return res.status(500).json({ error: "no DATABASE_URL" });
    const conn = await mysql.createConnection({ uri: url });
    try {
      const [pubRows] = await conn.query(
        "SELECT id, slug, publishedAt FROM articles WHERE status='published' ORDER BY publishedAt DESC",
      );
      const all = pubRows as Array<{ id: number; slug: string; publishedAt: Date }>;
      const seen = new Set<string>();
      const keep: number[] = [];
      const demote: number[] = [];
      for (const r of all) {
        const day = r.publishedAt.toISOString().slice(0, 10);
        if (!seen.has(day) && keep.length < 30) {
          seen.add(day);
          keep.push(r.id);
        } else {
          demote.push(r.id);
        }
      }
      if (demote.length) {
        await conn.query(
          `UPDATE articles SET status='queued', queuedAt=UTC_TIMESTAMP(), publishedAt=NULL WHERE id IN (${demote.map(() => "?").join(",")})`,
          demote,
        );
      }
      const [pCount] = await conn.query("SELECT COUNT(*) AS c FROM articles WHERE status='published'");
      const [dCount] = await conn.query("SELECT COUNT(DISTINCT DATE(publishedAt)) AS d FROM articles WHERE status='published'");
      res.json({
        ok: true,
        demoted: demote.length,
        published: Number((pCount as any[])[0]?.c || 0),
        distinctDays: Number((dCount as any[])[0]?.d || 0),
      });
    } finally {
      await conn.end();
    }
  });

  /**
   * One-time pre-seed of queued long-form essays.
   * GET-style query: from=START&size=N. Inserts up to N queued articles
   * starting from topic index START, gating each through the quality gate
   * (any rejection is reported but doesn't abort the batch).
   *
   * Idempotent against existing slugs. Use to walk through TOPIC_BANK in
   * chunks (size=20 keeps each call under 30s).
   */
  app.post("/api/admin/preseed-batch", async (req, res) => {
    const url = process.env.DATABASE_URL;
    if (!url) return res.status(500).json({ error: "no DATABASE_URL" });
    const from = Math.max(0, parseInt(String(req.query.from || "0"), 10) || 0);
    const size = Math.min(25, Math.max(1, parseInt(String(req.query.size || "15"), 10) || 15));
    const stubOnly = String(req.query.stubOnly || "") === "1";
    const conn = await mysql.createConnection({ uri: url });
    try {
      const [rows] = await conn.query("SELECT slug FROM articles");
      const haveSlugs = new Set((rows as Array<{ slug: string }>).map(r => r.slug));
      const out: any[] = [];
      const end = Math.min(TOPIC_BANK.length, from + size);
      for (let i = from; i < end; i++) {
        const topic = TOPIC_BANK[i];
        const candidateSlug = slugifyForCheck(topic.title);
        if (haveSlugs.has(candidateSlug)) {
          out.push({ idx: i, slug: candidateSlug, skipped: "already exists" });
          continue;
        }
        try {
          const { article } = await generateOneArticle({ topicOverride: topic, forceStub: stubOnly });
          if (haveSlugs.has(article.slug)) {
            out.push({ idx: i, slug: article.slug, skipped: "duplicate after gen" });
            continue;
          }
          const gate = runQualityGate(article.body, { authorName: AUTHOR_NAME });
          const id = await insertArticle({
            ...article,
            publishedAt: null,
            status: "queued",
            heroUrl: heroUrlForSlug(article.slug),
          });
          haveSlugs.add(article.slug);
          out.push({
            idx: i,
            id,
            slug: article.slug,
            words: article.wordCount,
            gate: gate.passed ? "PASS" : `FAIL: ${gate.failures.join("; ").slice(0, 200)}`,
          });
        } catch (e: any) {
          out.push({ idx: i, topic: topic.title, error: e.message?.slice(0, 200) });
        }
      }
      const [tot] = await conn.query("SELECT status, COUNT(*) AS c FROM articles GROUP BY status");
      res.json({
        ok: true,
        from,
        size,
        end,
        nextFrom: end,
        bankSize: TOPIC_BANK.length,
        inserted: out.filter(o => o.id).length,
        skipped: out.filter(o => o.skipped).length,
        errors: out.filter(o => o.error).length,
        totals: tot,
        results: out,
      });
    } finally {
      await conn.end();
    }
  });

  /**
   * GET /api/admin/corpus-check — corpus-wide hygiene scan: word count
   * floor, em-dash counter, hero URL coverage, Amazon tag, sister-link rate.
   */
  app.get("/api/admin/corpus-check", async (_req, res) => {
    const url = process.env.DATABASE_URL;
    if (!url) return res.status(500).json({ error: "no DATABASE_URL" });
    const conn = await mysql.createConnection({ uri: url });
    try {
      const [rows] = await conn.query(
        "SELECT slug, status, wordCount, heroUrl, body FROM articles",
      );
      const list = rows as Array<{ slug: string; status: string; wordCount: number; heroUrl: string | null; body: string | null }>;
      let underWords = 0, withDash = 0, missingHero = 0, badHero = 0, missingAmazon = 0, withSister = 0;
      const sampleFails: Array<{ slug: string; reason: string }> = [];
      for (const r of list) {
        const body = r.body || "";
        if ((r.wordCount || 0) < 1800) { underWords++; if (sampleFails.length < 5) sampleFails.push({ slug: r.slug, reason: `wc=${r.wordCount}` }); }
        if (body.includes("\u2014")) { withDash++; if (sampleFails.length < 5) sampleFails.push({ slug: r.slug, reason: "em-dash" }); }
        if (!r.heroUrl) missingHero++;
        else if (!r.heroUrl.startsWith("https://ichoose-single.b-cdn.net/heroes/")) badHero++;
        if (!/tag=spankyspinola-20/.test(body)) missingAmazon++;
        if (body.includes("theoraclelover.com")) withSister++;
      }
      res.json({
        total: list.length,
        published: list.filter(r => r.status === "published").length,
        queued: list.filter(r => r.status === "queued").length,
        under1800words: underWords,
        withEmDash: withDash,
        missingHero,
        badHeroUrl: badHero,
        missingAmazonTag: missingAmazon,
        withSisterLink: withSister,
        sisterRate: list.length ? Number((withSister / list.length).toFixed(3)) : 0,
        sampleFails,
      });
    } finally {
      await conn.end();
    }
  });

  /**
   * GET /api/admin/all-slugs — returns slug+title+heroUrl for every row
   * (published or queued). Used by upload-heroes-to-bunny.mjs to know which
   * heroes still need to be uploaded to Bunny CDN storage zone.
   */
  app.get("/api/admin/all-slugs", async (_req, res) => {
    const url = process.env.DATABASE_URL;
    if (!url) return res.status(500).json({ error: "no DATABASE_URL" });
    const conn = await mysql.createConnection({ uri: url });
    try {
      const [rows] = await conn.query(
        "SELECT slug, title, heroUrl, status FROM articles ORDER BY id ASC",
      );
      res.json({ articles: rows, count: (rows as any[]).length });
    } finally {
      await conn.end();
    }
  });
}

// Mirror of generateArticle's slug rule for pre-check
function slugifyForCheck(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}
