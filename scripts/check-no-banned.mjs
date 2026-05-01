#!/usr/bin/env node
/**
 * Banned-content guard. Walks the repo source and fails the build if any
 * forbidden string is found in code, content, or config.
 *
 * Forbidden:
 *   - "paulwagner.com" anywhere
 *   - the literal name "Paul Wagner" anywhere
 *   - "Kalesh" anywhere (the master scope §12A explicitly bans this name)
 *   - "@anthropic-ai/sdk" or "ANTHROPIC_API_KEY"
 *   - "FAL_KEY" or "fal.ai"
 *
 * The check is run alongside the image guard before build.
 */
import { readdirSync, statSync, readFileSync } from "node:fs";
import { join, relative } from "node:path";
import { fileURLToPath } from "node:url";
import { dirname } from "node:path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const root = join(__dirname, "..");

const BANNED = [
  "paulwagner.com",
  "Paul Wagner",
  "Kalesh",
  "@anthropic-ai/sdk",
  "ANTHROPIC_API_KEY",
  "FAL_KEY",
  "fal.ai",
];

const IGNORE = new Set([
  "node_modules", ".git", "dist", ".next", ".cache", ".pnpm-store",
  ".vite", "coverage", ".turbo", ".manus-logs",
]);

const SCAN_EXTS = new Set([
  ".ts", ".tsx", ".js", ".jsx", ".mjs", ".cjs",
  ".json", ".html", ".css", ".md", ".txt", ".env", ".yml", ".yaml",
]);

const SELF_FILES = new Set([
  "scripts/check-no-banned.mjs", // this file references the banned strings as data
]);

const offenders = [];

function walk(dir) {
  for (const entry of readdirSync(dir)) {
    if (IGNORE.has(entry)) continue;
    const full = join(dir, entry);
    const st = statSync(full);
    if (st.isDirectory()) {
      walk(full);
      continue;
    }
    const rel = relative(root, full).replace(/\\/g, "/");
    if (SELF_FILES.has(rel)) continue;
    const dot = entry.lastIndexOf(".");
    const ext = dot >= 0 ? entry.slice(dot).toLowerCase() : "";
    if (!SCAN_EXTS.has(ext)) continue;
    const text = readFileSync(full, "utf8");
    for (const needle of BANNED) {
      const idx = text.indexOf(needle);
      if (idx !== -1) {
        const line = text.slice(0, idx).split("\n").length;
        offenders.push(`${rel}:${line} → "${needle}"`);
      }
    }
  }
}

walk(root);

if (offenders.length > 0) {
  console.error("FAIL: banned strings found in repo:");
  for (const o of offenders) console.error("  -", o);
  process.exit(1);
}

console.log(`OK: no banned strings (${BANNED.length} checks passed).`);
