import { Link } from "wouter";
import { ArticleSummary } from "@/lib/api";
import { heroDataUrl } from "@/lib/heroPattern";

const CATEGORY_LABELS: Record<string, string> = {
  "intentional-singlehood": "Intentional Singlehood",
  "self-partnering": "Self-Partnering",
  "solo-living": "Solo Living",
  "solo-travel": "Solo Travel",
  "solo-finance": "Solo Finance",
  "single-women": "Single Women",
  "single-men": "Single Men",
  "single-parents": "Single Parents",
  "relationship-escalator": "Off-Escalator",
  "dating-on-your-terms": "On Your Terms",
};

export default function ArticleCard({ a, index = 0 }: { a: ArticleSummary; index?: number }) {
  const altClass = index % 5 === 1 ? "alt-1" : index % 5 === 3 ? "alt-2" : "";
  // Layer the CDN hero (when present) ON TOP of the deterministic gradient
  // so the card never looks broken before the WebP arrives at Bunny CDN.
  const fallback = `url("${heroDataUrl(a.slug, a.title)}")`;
  const heroBg = a.heroUrl ? `url("${a.heroUrl}"), ${fallback}` : fallback;
  const label = CATEGORY_LABELS[a.category] || a.category;
  return (
    <Link href={`/articles/${a.slug}`} className={`article-card ${altClass}`} aria-label={a.title}>
      <div className="hero" style={{ backgroundImage: heroBg }} role="img" aria-label="Decorative gradient" />
      <div className="overlay">
        <span className="cat">{label}</span>
        <h2>{a.title}</h2>
      </div>
    </Link>
  );
}
