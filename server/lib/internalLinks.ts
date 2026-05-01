/**
 * Pick internal articles that fit this topic. Returns title+slug suitable
 * for embedding as anchor text. Per master scope §14C.
 */
export function pickInternalLinks({
  topic,
  category,
  tags,
  pool,
  take = 4,
}: {
  topic: string;
  category: string;
  tags: string[];
  pool: Array<{ slug: string; title: string; category: string; tags: string[] }>;
  take?: number;
}): Array<{ slug: string; title: string }> {
  const tagSet = new Set((tags || []).map(t => t.toLowerCase()));
  const topicLower = (topic || "").toLowerCase();
  const scored = pool
    .map(p => {
      let score = 0;
      if (p.category === category) score += 6;
      for (const t of p.tags || []) if (tagSet.has(t.toLowerCase())) score += 2;
      const titleLower = (p.title || "").toLowerCase();
      for (const w of topicLower.split(/\W+/).filter(w => w.length > 4)) {
        if (titleLower.includes(w)) score += 1;
      }
      return { ...p, _score: score };
    })
    .filter(p => p._score > 0)
    .sort((a, b) => b._score - a._score);
  return scored.slice(0, take).map(p => ({ slug: p.slug, title: p.title }));
}
