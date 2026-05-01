/**
 * Public site routes (non-tRPC, non-API):
 *   /health                — JSON health check
 *   /robots.txt            — text/plain
 *   /sitemap.xml           — application/xml
 *   /llms.txt              — text/markdown
 *   /llms-full.txt         — text/plain (full corpus)
 *   /api/articles/:slug    — single article JSON (used by SSR head injection)
 *   /api/articles          — list (paginated) for client masonry
 *   /api/cron-health       — cron run history JSON for the operator dashboard
 */
import { Express } from "express";
import { buildSitemap, buildLlmsTxt, buildLlmsFullTxt, buildRobotsTxt } from "./aeo";
import {
  listPublished,
  countPublished,
  getBySlug,
  recentCronRuns,
  distinctPublishDays,
} from "./dbArticles";

export function registerSiteRoutes(app: Express) {
  app.get("/health", (_req, res) => {
    res.json({ ok: true, ts: new Date().toISOString() });
  });

  app.get("/robots.txt", (_req, res) => {
    res.type("text/plain").send(buildRobotsTxt());
  });

  app.get("/sitemap.xml", async (_req, res) => {
    try {
      const xml = await buildSitemap();
      res.type("application/xml").send(xml);
    } catch (e: any) {
      console.warn("[sitemap] error:", e.message);
      res.status(500).send("sitemap error");
    }
  });

  app.get("/llms.txt", async (_req, res) => {
    try {
      const txt = await buildLlmsTxt();
      res.type("text/markdown; charset=utf-8").send(txt);
    } catch (e: any) {
      res.status(500).send("llms error");
    }
  });

  app.get("/llms-full.txt", async (_req, res) => {
    try {
      const txt = await buildLlmsFullTxt();
      res.type("text/plain; charset=utf-8").send(txt);
    } catch (e: any) {
      res.status(500).send("llms-full error");
    }
  });

  app.get("/api/articles", async (req, res) => {
    try {
      const limit = parseInt(String(req.query.limit ?? "30"), 10) || 30;
      const offset = parseInt(String(req.query.offset ?? "0"), 10) || 0;
      const category = req.query.category ? String(req.query.category) : undefined;
      const articles = await listPublished({ limit, offset, category });
      const total = await countPublished();
      res.json({
        total,
        articles: articles.map(a => ({
          slug: a.slug,
          title: a.title,
          description: a.description,
          tldr: a.tldr,
          category: a.category,
          tags: a.tags,
          heroUrl: a.heroUrl,
          publishedAt: a.publishedAt,
          lastModifiedAt: a.lastModifiedAt,
          wordCount: a.wordCount,
          authorName: a.authorName,
        })),
      });
    } catch (e: any) {
      console.warn("[api/articles] error:", e.message);
      res.status(500).json({ error: e.message });
    }
  });

  app.get("/api/articles/:slug", async (req, res) => {
    try {
      const a = await getBySlug(req.params.slug);
      if (!a) return res.status(404).json({ error: "not found" });
      // extract internal links from body for the right rail
      const internalSet = new Map<string, string>();
      const re = /<a[^>]*href="\/articles\/([a-z0-9\-]+)\"[^>]*>([\s\S]*?)<\/a>/gi;
      let m: RegExpExecArray | null;
      while ((m = re.exec(a.body || ""))) {
        const slug = m[1];
        if (slug !== a.slug && !internalSet.has(slug)) internalSet.set(slug, m[2].replace(/<[^>]+>/g, "").trim());
      }
      const internalLinks = Array.from(internalSet.entries()).slice(0, 6).map(([slug, title]) => ({ slug, title }));
      // extract external link anchors
      const externalSet = new Map<string, string>();
      const re2 = /<a[^>]*href=\"(https?:\/\/[^\"]+)\"[^>]*>([\s\S]*?)<\/a>/gi;
      let m2: RegExpExecArray | null;
      while ((m2 = re2.exec(a.body || ""))) {
        if (m2[1].includes("amazon.com") || m2[1].includes("ichoosesingle")) continue;
        if (!externalSet.has(m2[1])) externalSet.set(m2[1], m2[2].replace(/<[^>]+>/g, "").trim());
      }
      const externalLinks = Array.from(externalSet.entries()).slice(0, 8).map(([url, anchor]) => ({ url, anchor }));
      res.json({
        slug: a.slug,
        title: a.title,
        description: a.description,
        tldr: a.tldr,
        category: a.category,
        tags: a.tags,
        heroUrl: a.heroUrl,
        publishedAt: a.publishedAt,
        lastModifiedAt: a.lastModifiedAt,
        wordCount: a.wordCount,
        authorName: a.authorName,
        bodyHtml: a.body,
        asinsUsed: a.asinsUsed || [],
        internalLinks,
        externalLinks,
      });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.get("/api/cron-health", async (_req, res) => {
    try {
      const runs = await recentCronRuns(100);
      const distinctDays = await distinctPublishDays();
      const total = await countPublished();
      // group by job
      const byJob: Record<string, { runs: number; lastRanAt: string | null; status: string }> = {};
      for (const r of runs) {
        if (!byJob[r.jobName]) {
          byJob[r.jobName] = { runs: 0, lastRanAt: null, status: r.status };
        }
        byJob[r.jobName].runs++;
        if (!byJob[r.jobName].lastRanAt) byJob[r.jobName].lastRanAt = r.ranAt.toISOString();
      }
      res.json({
        ok: true,
        publishedTotal: total,
        distinctPublishDays: distinctDays,
        byJob,
        recentRuns: runs.slice(0, 20),
      });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });
}
