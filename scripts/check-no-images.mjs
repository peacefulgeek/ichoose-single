#!/usr/bin/env node
/**
 * Build-blocking image guard. Per master scope HARD RULES + §9: zero image files
 * may exist in the repository. The single exception is client/public/favicon.svg.
 *
 * If any other image file is found, this script exits with a non-zero status,
 * which fails CI / build.
 */
import { readdirSync, statSync } from "node:fs";
import { join, relative } from "node:path";
import { fileURLToPath } from "node:url";
import { dirname } from "node:path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const root = join(__dirname, "..");

const IMAGE_EXTS = new Set([
  ".png", ".jpg", ".jpeg", ".gif", ".webp", ".bmp", ".tiff", ".ico",
  ".avif", ".heic", ".heif", ".svg",
]);

const IGNORE = new Set([
  "node_modules", ".git", "dist", ".next", ".cache", ".pnpm-store",
  ".vite", "coverage", ".turbo", ".manus-logs",
]);

const ALLOWED = new Set([
  "client/public/favicon.svg", // explicit single allowed image
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
    const dot = entry.lastIndexOf(".");
    if (dot < 0) continue;
    const ext = entry.slice(dot).toLowerCase();
    if (!IMAGE_EXTS.has(ext)) continue;
    const rel = relative(root, full).replace(/\\/g, "/");
    if (ALLOWED.has(rel)) continue;
    offenders.push(rel);
  }
}

walk(root);

if (offenders.length > 0) {
  console.error("FAIL: image files found in repo (zero allowed except favicon.svg):");
  for (const o of offenders) console.error("  -", o);
  process.exit(1);
}

console.log("OK: zero images in repo (favicon.svg is the only exception).");
