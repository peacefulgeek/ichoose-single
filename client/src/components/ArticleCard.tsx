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

type Size = "default" | "tall" | "square" | "wide";

export default function ArticleCard({
  a,
  index = 0,
  size,
}: {
  a: ArticleSummary;
  index?: number;
  size?: Size;
}) {
  // pick a size variant deterministically if not given
  const sizeClass: Size =
    size ?? (["default", "tall", "default", "square", "wide", "default"][index % 6] as Size);

  const fallback = heroDataUrl(a.slug, a.title);
  const label = CATEGORY_LABELS[a.category] || a.category;

  return (
    <Link href={`/articles/${a.slug}`} className={`ed-card ${sizeClass}`} aria-label={a.title}>
      <div className="ed-photo">
        <img
          src={a.heroUrl || fallback}
          alt={a.title}
          loading="lazy"
          decoding="async"
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).src = fallback;
          }}
        />
      </div>
      <div className="ed-meta">
        <span className="ed-cat">{label}</span>
        <h3>{a.title}</h3>
      </div>
    </Link>
  );
}
