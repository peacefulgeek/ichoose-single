/**
 * One-shot bootstrap migration. Calls `pnpm drizzle-kit push` semantics
 * directly through the in-process drizzle connection that's already healthy.
 * Mounted at GET /api/_bootstrap-migrate so we can fire it from curl.
 */
import { Express } from "express";
import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import fs from "fs";
import path from "path";

let migrated = false;

export function registerBootstrapMigration(app: Express) {
  app.get("/api/_bootstrap-migrate", async (_req, res) => {
    if (migrated) {
      return res.json({ ok: true, alreadyMigrated: true });
    }
    const url = process.env.DATABASE_URL;
    if (!url) return res.status(500).json({ ok: false, reason: "no DATABASE_URL" });

    const conn = await mysql.createConnection({ uri: url, multipleStatements: true });
    const ddl = `
      CREATE TABLE IF NOT EXISTS articles (
        id INT AUTO_INCREMENT PRIMARY KEY,
        slug VARCHAR(200) NOT NULL UNIQUE,
        title VARCHAR(300) NOT NULL,
        description VARCHAR(500) NOT NULL DEFAULT '',
        body LONGTEXT NOT NULL,
        tldr TEXT,
        category VARCHAR(80) NOT NULL,
        tags JSON NOT NULL,
        authorName VARCHAR(80) NOT NULL DEFAULT 'The Oracle Lover',
        authorCredential VARCHAR(200) NOT NULL DEFAULT '',
        heroUrl TEXT,
        status ENUM('queued','published') NOT NULL DEFAULT 'queued',
        asinsUsed JSON NOT NULL,
        wordCount INT NOT NULL DEFAULT 0,
        queuedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        publishedAt TIMESTAMP NULL,
        lastModifiedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        lastRefreshedAt TIMESTAMP NULL,
        INDEX articles_status_idx (status),
        INDEX articles_published_at_idx (publishedAt),
        INDEX articles_category_idx (category)
      );
    `;
    const cron = `
      CREATE TABLE IF NOT EXISTS cron_runs (
        id INT AUTO_INCREMENT PRIMARY KEY,
        jobName VARCHAR(80) NOT NULL,
        status ENUM('success','skipped','error') NOT NULL,
        message TEXT,
        ranAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        INDEX cron_runs_job_name_idx (jobName),
        INDEX cron_runs_ran_at_idx (ranAt)
      );
    `;
    const results: Array<{ stmt: string; ok: boolean; err?: string }> = [];
    for (const stmt of [ddl, cron]) {
      try {
        await conn.query(stmt);
        results.push({ stmt: stmt.split("\n")[1].trim().slice(0, 60), ok: true });
      } catch (e: any) {
        results.push({ stmt: stmt.split("\n")[1].trim().slice(0, 60), ok: false, err: String(e.message).slice(0, 200) });
      }
    }
    const [tables] = await conn.query("SHOW TABLES");
    await conn.end();
    migrated = true;
    res.json({ ok: true, results, tables });
  });
}
