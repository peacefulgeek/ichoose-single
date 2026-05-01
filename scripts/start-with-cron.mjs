#!/usr/bin/env node
/**
 * Production launcher for I Choose Single.
 *
 * Per MASTER_SCOPE_AUDIT_AND_EXECUTE.md §11, the cron schedule file MUST live
 * at this path (scripts/start-with-cron.mjs). It boots the compiled Express
 * server which itself starts the in-process cron scheduler.
 *
 * Cron jobs (defined in server/cron/scheduler.ts):
 *   - dailyPublish     "7 */6 * * *"   — every 6 hours; daily cap = 2 articles
 *   - generateQueue    "23 */4 * * *"  — every 4 hours; ensures ≥3 queued
 *   - asinHealthCheck  "17 3 * * *"    — daily 03:17 UTC; verifies every ASIN
 *   - sitemapWarm      "*/30 * * * *"  — every 30 minutes; cache primer
 *
 * AUTO_GEN_ENABLED=false disables the scheduler at runtime.
 */
import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = resolve(__dirname, "..");

const entry = process.env.SBD_ENTRY || "dist/index.js";

const child = spawn(process.execPath, [entry], {
  cwd: projectRoot,
  env: {
    ...process.env,
    NODE_ENV: process.env.NODE_ENV || "production",
    AUTO_GEN_ENABLED: process.env.AUTO_GEN_ENABLED ?? "true",
  },
  stdio: "inherit",
});

child.on("exit", code => {
  process.exit(code ?? 0);
});

["SIGINT", "SIGTERM"].forEach(sig => {
  process.on(sig, () => {
    child.kill(sig);
  });
});
