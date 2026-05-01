/**
 * Match products to an article. Named parameters only — never positional.
 * (The argument-flip bug brought down sites in the past, per master scope §10D.)
 */

export interface CatalogProduct {
  asin: string;
  name: string;
  category: string;
  tags: string[];
}

export function matchProducts({
  articleTitle,
  articleTags,
  articleCategory,
  catalog,
  minLinks = 3,
  maxLinks = 4,
}: {
  articleTitle: string;
  articleTags: string[];
  articleCategory: string;
  catalog: CatalogProduct[];
  minLinks?: number;
  maxLinks?: number;
}): CatalogProduct[] {
  if (typeof articleTitle !== "string") {
    throw new TypeError(`matchProducts: articleTitle must be string, got ${typeof articleTitle}`);
  }
  if (!Array.isArray(articleTags)) {
    throw new TypeError(`matchProducts: articleTags must be array, got ${typeof articleTags}`);
  }
  if (typeof articleCategory !== "string") {
    throw new TypeError(`matchProducts: articleCategory must be string, got ${typeof articleCategory}`);
  }
  if (!Array.isArray(catalog)) {
    throw new TypeError(`matchProducts: catalog must be array, got ${typeof catalog}`);
  }
  const scored = catalog.map(p => ({
    product: p,
    score: scoreProduct(p, articleTitle, articleTags, articleCategory),
  })).sort((a, b) => b.score - a.score);
  const take = Math.min(maxLinks, Math.max(minLinks, Math.min(scored.length, maxLinks)));
  return scored.slice(0, take).map(s => s.product);
}

function scoreProduct(p: CatalogProduct, title: string, tags: string[], category: string): number {
  let score = 0;
  if (p.category === category) score += 10;
  for (const tag of tags) if (p.tags.includes(tag)) score += 3;
  const titleWords = title.toLowerCase().split(/\W+/).filter(w => w.length > 3);
  const name = (p.name || "").toLowerCase();
  for (const w of titleWords) if (name.includes(w)) score += 2;
  return score;
}


/**
 * Validate an Amazon ASIN. Named-parameters only.
 *
 * Returns:
 *   { valid: true, asin: string }                      — well-formed and live
 *   { valid: false, asin: string, reason: string }     — invalid format or live check failed
 *
 * Format rule: 10 chars, [A-Z0-9]. We never call Amazon directly from the
 * sandbox at audit time (no PA-API key plumbing here). The optional `live`
 * mode performs a HEAD against /dp/{ASIN} so cron can quarantine dead ASINs.
 */
export interface VerifyAsinResult {
  valid: boolean;
  asin: string;
  reason?: string;
  status?: number;
}

export async function verifyAsin({
  asin,
  live = false,
  timeoutMs = 6000,
}: {
  asin: string;
  live?: boolean;
  timeoutMs?: number;
}): Promise<VerifyAsinResult> {
  if (typeof asin !== "string") {
    return { valid: false, asin: String(asin), reason: "asin-not-string" };
  }
  const trimmed = asin.trim().toUpperCase();
  if (!/^[A-Z0-9]{10}$/.test(trimmed)) {
    return { valid: false, asin: trimmed, reason: "asin-format" };
  }
  if (!live) return { valid: true, asin: trimmed };

  // Live HEAD against the canonical Amazon detail URL with a soft timeout.
  // Cron uses this to quarantine dead ASINs; never blocks rendering.
  const url = `https://www.amazon.com/dp/${trimmed}`;
  try {
    const ac = new AbortController();
    const t = setTimeout(() => ac.abort(), timeoutMs);
    const res = await fetch(url, {
      method: "HEAD",
      redirect: "follow",
      signal: ac.signal,
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; IChooseSingleBot/1.0; +https://ichoosesingle.com/about)",
      },
    });
    clearTimeout(t);
    if (res.status === 404) return { valid: false, asin: trimmed, reason: "asin-not-found", status: 404 };
    if (res.status >= 500) return { valid: false, asin: trimmed, reason: "asin-upstream-5xx", status: res.status };
    return { valid: true, asin: trimmed, status: res.status };
  } catch (e: any) {
    return { valid: false, asin: trimmed, reason: e?.name === "AbortError" ? "asin-timeout" : "asin-fetch-error" };
  }
}

/**
 * Verify a list of ASINs in parallel and return the survivors.
 * Used by the weekly ASIN health-check cron.
 */
export async function verifyAsins({
  asins,
  live = false,
  concurrency = 6,
}: {
  asins: string[];
  live?: boolean;
  concurrency?: number;
}): Promise<{ valid: string[]; invalid: VerifyAsinResult[] }> {
  const valid: string[] = [];
  const invalid: VerifyAsinResult[] = [];
  // simple concurrency window
  const queue = asins.slice();
  async function worker() {
    while (queue.length) {
      const a = queue.shift()!;
      const r = await verifyAsin({ asin: a, live });
      if (r.valid) valid.push(r.asin);
      else invalid.push(r);
    }
  }
  await Promise.all(Array.from({ length: concurrency }, () => worker()));
  return { valid, invalid };
}
