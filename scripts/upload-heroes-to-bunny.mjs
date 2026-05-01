#!/usr/bin/env node
/**
 * Generate and upload all hero WebPs (and favicon) to Bunny CDN storage zone "ichoose-single".
 *
 *   1. Pulls every published article slug from /api/articles
 *   2. For each slug, deterministically generates a 1600x1000 warm-toned
 *      gradient SVG, rasterizes to compressed WebP via sharp.
 *   3. PUTs the bytes to https://ny.storage.bunnycdn.com/ichoose-single/heroes/<slug>.webp
 *   4. Generates a 512x512 favicon.webp and uploads it to /favicon.webp.
 *   5. Deletes the local /tmp/ichoose-bunny working directory afterward.
 *
 * Usage: BUNNY_STORAGE_KEY=<key> node scripts/upload-heroes-to-bunny.mjs
 *
 * The key is read from BUNNY_STORAGE_KEY env or the hardcoded fallback (the
 * user provided it in chat). No image binaries are ever written into the
 * project tree — repo hygiene guard would fail.
 */
import sharp from "sharp";
import fs from "node:fs/promises";
import path from "node:path";
import os from "node:os";
import crypto from "node:crypto";

const STORAGE_HOST = "https://ny.storage.bunnycdn.com";
const STORAGE_ZONE = "ichoose-single";
const STORAGE_KEY = process.env.BUNNY_STORAGE_KEY || "39cdf3d9-91d2-4e3b-aca368eaf43e-738b-4b57";
const PULL_ZONE = "https://ichoose-single.b-cdn.net";
const SITE_URL = process.env.SITE_URL || "http://localhost:3000";

if (!STORAGE_KEY) {
  console.error("BUNNY_STORAGE_KEY env not set");
  process.exit(1);
}

const PALETTES = [
  // [from, mid, to] — warm cream / coral / teal / soft violet / amber
  ["#FFE4D6", "#F2B8A6", "#E8604C"],
  ["#FFF6E0", "#F2D8A6", "#D9A24C"],
  ["#E0F2EF", "#A6D9D5", "#2AA5A0"],
  ["#FFEFE4", "#F4C8B0", "#E8604C"],
  ["#FFF2D9", "#F2D2A0", "#C98445"],
  ["#E8F1EE", "#B9D6CF", "#3A8E89"],
  ["#FBE9D8", "#E8B894", "#B95C3D"],
  ["#FFFAF0", "#E8DCB8", "#A6843E"],
  ["#EAF5F2", "#A8D4CC", "#2D7C77"],
  ["#FFE9E2", "#F0B5A2", "#D14A38"],
];

function pickPalette(slug) {
  const h = crypto.createHash("md5").update(slug).digest();
  return PALETTES[h[0] % PALETTES.length];
}

function buildSvg(slug, title) {
  const [c1, c2, c3] = pickPalette(slug);
  // Two soft radial blobs over a linear-gradient base; subtle texture bands.
  const angle = (crypto.createHash("md5").update(slug).digest()[1] % 60) + 10;
  const t = (title || slug.replace(/-/g, " ")).slice(0, 60);
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 1000" width="1600" height="1000">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1" gradientTransform="rotate(${angle} 0.5 0.5)">
      <stop offset="0%" stop-color="${c1}"/>
      <stop offset="55%" stop-color="${c2}"/>
      <stop offset="100%" stop-color="${c3}"/>
    </linearGradient>
    <radialGradient id="b1" cx="0.25" cy="0.3" r="0.6">
      <stop offset="0%" stop-color="${c1}" stop-opacity="0.85"/>
      <stop offset="100%" stop-color="${c1}" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="b2" cx="0.78" cy="0.7" r="0.55">
      <stop offset="0%" stop-color="${c3}" stop-opacity="0.7"/>
      <stop offset="100%" stop-color="${c3}" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="1600" height="1000" fill="url(#g)"/>
  <rect width="1600" height="1000" fill="url(#b1)"/>
  <rect width="1600" height="1000" fill="url(#b2)"/>
  <g opacity="0.06" fill="#000">
    <rect x="0" y="200" width="1600" height="2"/>
    <rect x="0" y="500" width="1600" height="2"/>
    <rect x="0" y="800" width="1600" height="2"/>
  </g>
  <text x="80" y="930" font-family="Manrope, Inter, sans-serif" font-size="42" font-weight="600"
        fill="rgba(43,43,43,0.32)" letter-spacing="2">I CHOOSE SINGLE</text>
</svg>`;
}

async function generateWebp(slug, title) {
  const svg = Buffer.from(buildSvg(slug, title));
  return sharp(svg).webp({ quality: 78, effort: 5 }).toBuffer();
}

async function uploadToBunny(remotePath, bytes, contentType = "image/webp") {
  const url = `${STORAGE_HOST}/${STORAGE_ZONE}/${remotePath}`;
  const r = await fetch(url, {
    method: "PUT",
    headers: { AccessKey: STORAGE_KEY, "Content-Type": contentType },
    body: bytes,
  });
  if (!r.ok) {
    const t = await r.text().catch(() => "");
    throw new Error(`bunny PUT ${remotePath} -> ${r.status} ${t}`);
  }
  return `${PULL_ZONE}/${remotePath}`;
}

async function main() {
  console.log(`[bunny] uploading to zone ${STORAGE_ZONE} via ${STORAGE_HOST}`);
  // 1) Fetch slugs
  const r = await fetch(`${SITE_URL}/api/articles?limit=200`);
  if (!r.ok) throw new Error(`fetch articles failed: ${r.status}`);
  const { articles } = await r.json();
  console.log(`[bunny] ${articles.length} articles`);

  const tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), "ichoose-bunny-"));
  let ok = 0, fail = 0;
  for (const a of articles) {
    try {
      const buf = await generateWebp(a.slug, a.title);
      // write to /tmp for inspection (deleted at end)
      await fs.writeFile(path.join(tmpDir, `${a.slug}.webp`), buf);
      const url = await uploadToBunny(`heroes/${a.slug}.webp`, buf);
      console.log(`  + ${a.slug}.webp -> ${url}  (${buf.length} bytes)`);
      ok++;
    } catch (e) {
      console.warn(`  ! ${a.slug}.webp failed: ${e.message}`);
      fail++;
    }
  }

  // 2) Favicon
  try {
    const favSvg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64">
  <rect width="64" height="64" rx="14" fill="#FFFEF9"/>
  <text x="50%" y="58%" text-anchor="middle" font-family="Manrope, Inter, sans-serif"
        font-size="36" font-weight="700" fill="#E8604C">I</text>
  <circle cx="48" cy="48" r="5" fill="#2AA5A0"/>
</svg>`;
    const favBuf = await sharp(Buffer.from(favSvg)).resize(512, 512).webp({ quality: 90 }).toBuffer();
    const favUrl = await uploadToBunny("favicon.webp", favBuf);
    console.log(`  + favicon.webp -> ${favUrl}`);
  } catch (e) {
    console.warn(`  ! favicon.webp failed: ${e.message}`);
    fail++;
  }

  // 3) Wipe local working copies
  try {
    await fs.rm(tmpDir, { recursive: true, force: true });
    console.log(`[bunny] cleaned ${tmpDir}`);
  } catch {}

  console.log(`[bunny] done: ok=${ok} fail=${fail}`);
  if (fail > 0) process.exit(2);
}

main().catch(e => {
  console.error(e);
  process.exit(1);
});
