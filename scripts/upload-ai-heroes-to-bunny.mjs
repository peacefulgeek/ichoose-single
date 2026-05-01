#!/usr/bin/env node
/**
 * Mirror the 35 AI-generated images from the Manus asset CDN to Bunny CDN
 * as compressed WebP, then write the resulting Bunny URLs back into a SQL
 * patch the app can apply.
 *
 *   1. Reads scripts/image-manifest.json (35 entries: 30 article + 5 site)
 *   2. Downloads each compressed-webp URL into a tmpdir
 *   3. Re-encodes through sharp at quality 80 (smaller, normalized)
 *   4. PUTs to bunny zone "ichoose-single" under /heroes/<slug>.webp and
 *      /site/<key>.webp respectively
 *   5. Writes /tmp/bunny-ai-results.json with {site:{...}, articles:[{slug,bunnyUrl}]}
 *   6. Deletes the tmpdir
 *
 * Usage:  BUNNY_STORAGE_KEY=<key> node scripts/upload-ai-heroes-to-bunny.mjs
 */
import sharp from "sharp";
import fs from "node:fs/promises";
import path from "node:path";
import os from "node:os";

const STORAGE_HOST = "https://ny.storage.bunnycdn.com";
const STORAGE_ZONE = "ichoose-single";
const STORAGE_KEY  = process.env.BUNNY_STORAGE_KEY || "39cdf3d9-91d2-4e3b-aca368eaf43e-738b-4b57";
const PULL_ZONE    = "https://ichoose-single.b-cdn.net";

async function downloadAndCompress(url) {
  const r = await fetch(url);
  if (!r.ok) throw new Error(`download ${url} -> ${r.status}`);
  const ab = await r.arrayBuffer();
  const buf = Buffer.from(ab);
  // re-encode through sharp: webp q=80 effort=5 — typically smaller than incoming
  const out = await sharp(buf).webp({ quality: 80, effort: 5 }).toBuffer();
  return out;
}

async function uploadToBunny(remotePath, bytes) {
  const url = `${STORAGE_HOST}/${STORAGE_ZONE}/${remotePath}`;
  const r = await fetch(url, {
    method: "PUT",
    headers: { AccessKey: STORAGE_KEY, "Content-Type": "image/webp" },
    body: bytes,
  });
  if (!r.ok) {
    const t = await r.text().catch(() => "");
    throw new Error(`bunny PUT ${remotePath} -> ${r.status} ${t}`);
  }
  return `${PULL_ZONE}/${remotePath}`;
}

async function main() {
  const manifestPath = path.resolve("scripts/image-manifest.json");
  const m = JSON.parse(await fs.readFile(manifestPath, "utf8"));

  const tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), "ichoose-ai-"));
  console.log(`[bunny-ai] tmpdir ${tmpDir}`);

  const out = { site: {}, articles: [] };
  let ok = 0, fail = 0;

  // site keys
  for (const [key, val] of Object.entries(m.site)) {
    try {
      const buf = await downloadAndCompress(val.webp);
      await fs.writeFile(path.join(tmpDir, `site_${key}.webp`), buf);
      const url = await uploadToBunny(`site/${key}.webp`, buf);
      out.site[key] = url;
      console.log(`  + site/${key}.webp -> ${url}  (${buf.length} bytes)`);
      ok++;
    } catch (e) {
      console.warn(`  ! site/${key}.webp failed: ${e.message}`);
      fail++;
    }
  }

  // articles
  for (const a of m.articles) {
    try {
      const buf = await downloadAndCompress(a.webp);
      await fs.writeFile(path.join(tmpDir, `${a.slug}.webp`), buf);
      const url = await uploadToBunny(`heroes/${a.slug}.webp`, buf);
      out.articles.push({ slug: a.slug, bunnyUrl: url });
      console.log(`  + heroes/${a.slug}.webp -> ${url}  (${buf.length} bytes)`);
      ok++;
    } catch (e) {
      console.warn(`  ! heroes/${a.slug}.webp failed: ${e.message}`);
      fail++;
    }
  }

  await fs.writeFile("/tmp/bunny-ai-results.json", JSON.stringify(out, null, 2));
  console.log(`[bunny-ai] wrote /tmp/bunny-ai-results.json`);

  try { await fs.rm(tmpDir, { recursive: true, force: true }); console.log(`[bunny-ai] cleaned ${tmpDir}`); } catch {}
  console.log(`[bunny-ai] done: ok=${ok} fail=${fail}`);
  if (fail > 0) process.exit(2);
}

main().catch(e => {
  console.error(e);
  process.exit(1);
});
