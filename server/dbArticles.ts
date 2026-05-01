/**
 * Article + cron-run query helpers. These wrap raw mysql2 (not drizzle)
 * to avoid the schema-mismatch state during early bootstrap. Once the
 * /api/_bootstrap-migrate route has run, articles and cron_runs are present
 * and these helpers Just Work™.
 */
import mysql from "mysql2/promise";

let _pool: mysql.Pool | null = null;

function pool(): mysql.Pool {
  if (!_pool) {
    const url = process.env.DATABASE_URL;
    if (!url) throw new Error("DATABASE_URL not set");
    _pool = mysql.createPool({
      uri: url,
      waitForConnections: true,
      connectionLimit: 5,
      multipleStatements: false,
    });
  }
  return _pool;
}

export interface ArticleRow {
  id: number;
  slug: string;
  title: string;
  description: string;
  body: string;
  tldr: string | null;
  category: string;
  tags: string[];
  authorName: string;
  authorCredential: string;
  heroUrl: string | null;
  status: "queued" | "published";
  asinsUsed: string[];
  wordCount: number;
  queuedAt: Date;
  publishedAt: Date | null;
  lastModifiedAt: Date;
  lastRefreshedAt: Date | null;
}

function castRow(r: any): ArticleRow {
  return {
    ...r,
    tags: typeof r.tags === "string" ? JSON.parse(r.tags) : r.tags || [],
    asinsUsed:
      typeof r.asinsUsed === "string" ? JSON.parse(r.asinsUsed) : r.asinsUsed || [],
  };
}

export async function listPublished(opts: { limit?: number; offset?: number; category?: string } = {}): Promise<ArticleRow[]> {
  const limit = Math.min(opts.limit ?? 50, 200);
  const offset = opts.offset ?? 0;
  let sql = "SELECT * FROM articles WHERE status='published'";
  const args: any[] = [];
  if (opts.category) {
    sql += " AND category = ?";
    args.push(opts.category);
  }
  sql += " ORDER BY publishedAt DESC LIMIT ? OFFSET ?";
  args.push(limit, offset);
  const [rows] = await pool().query(sql, args);
  return (rows as any[]).map(castRow);
}

export async function countPublished(): Promise<number> {
  const [rows] = await pool().query("SELECT COUNT(*) as c FROM articles WHERE status='published'");
  return Number((rows as any[])[0]?.c ?? 0);
}

export async function getBySlug(slug: string): Promise<ArticleRow | null> {
  const [rows] = await pool().query(
    "SELECT * FROM articles WHERE slug = ? AND status='published' LIMIT 1",
    [slug],
  );
  const r = (rows as any[])[0];
  return r ? castRow(r) : null;
}

export async function pickInternalCandidates(limit = 200): Promise<Array<{ slug: string; title: string; category: string; tags: string[] }>> {
  const [rows] = await pool().query(
    "SELECT slug, title, category, tags FROM articles WHERE status='published' ORDER BY publishedAt DESC LIMIT ?",
    [limit],
  );
  return (rows as any[]).map(r => ({
    slug: r.slug,
    title: r.title,
    category: r.category,
    tags: typeof r.tags === "string" ? JSON.parse(r.tags) : r.tags || [],
  }));
}

export async function insertArticle(a: {
  slug: string;
  title: string;
  description: string;
  body: string;
  tldr: string | null;
  category: string;
  tags: string[];
  heroUrl: string | null;
  status: "queued" | "published";
  asinsUsed: string[];
  wordCount: number;
  authorName: string;
  authorCredential: string;
  publishedAt: Date | null;
}): Promise<number> {
  const [res] = await pool().query(
    `INSERT INTO articles
      (slug, title, description, body, tldr, category, tags, heroUrl, status, asinsUsed, wordCount, authorName, authorCredential, publishedAt)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      a.slug,
      a.title,
      a.description,
      a.body,
      a.tldr,
      a.category,
      JSON.stringify(a.tags),
      a.heroUrl,
      a.status,
      JSON.stringify(a.asinsUsed),
      a.wordCount,
      a.authorName,
      a.authorCredential,
      a.publishedAt,
    ],
  );
  return (res as any).insertId as number;
}

export async function publishQueued(id: number, heroUrl: string | null): Promise<void> {
  await pool().query(
    "UPDATE articles SET status='published', publishedAt=NOW(), heroUrl=COALESCE(?, heroUrl) WHERE id=?",
    [heroUrl, id],
  );
}

export async function getOldestQueued(): Promise<ArticleRow | null> {
  const [rows] = await pool().query(
    "SELECT * FROM articles WHERE status='queued' ORDER BY queuedAt ASC LIMIT 1",
  );
  const r = (rows as any[])[0];
  return r ? castRow(r) : null;
}

export async function logCronRun(jobName: string, status: "success" | "skipped" | "error", message?: string): Promise<void> {
  await pool().query(
    "INSERT INTO cron_runs (jobName, status, message) VALUES (?, ?, ?)",
    [jobName, status, message ?? null],
  );
}

export async function recentCronRuns(limit = 50): Promise<Array<{ jobName: string; status: string; message: string | null; ranAt: Date }>> {
  const [rows] = await pool().query(
    "SELECT jobName, status, message, ranAt FROM cron_runs ORDER BY ranAt DESC LIMIT ?",
    [limit],
  );
  return rows as any[];
}

export async function distinctPublishDays(): Promise<number> {
  const [rows] = await pool().query(
    "SELECT COUNT(DISTINCT DATE(publishedAt)) as d FROM articles WHERE status='published'",
  );
  return Number((rows as any[])[0]?.d ?? 0);
}
