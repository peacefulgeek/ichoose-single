import { useArticles } from "@/lib/api";
import ArticleCard from "@/components/ArticleCard";
import { Loader2 } from "lucide-react";
import { useState } from "react";

const CATS = [
  { v: "", label: "All" },
  { v: "intentional-singlehood", label: "Intentional" },
  { v: "self-partnering", label: "Self-Partnering" },
  { v: "solo-living", label: "Solo Living" },
  { v: "solo-travel", label: "Solo Travel" },
  { v: "solo-finance", label: "Solo Finance" },
  { v: "single-women", label: "Single Women" },
  { v: "single-men", label: "Single Men" },
  { v: "dating-on-your-terms", label: "On Your Terms" },
];

export default function ArticleList() {
  const [cat, setCat] = useState("");
  const { data, loading } = useArticles({ limit: 60, category: cat || undefined });

  return (
    <div className="container py-10">
      <h1 className="text-3xl md:text-4xl font-extrabold" style={{ color: "#2B2B2B" }}>Every essay</h1>
      <p className="mt-2 max-w-2xl" style={{ color: "#6B6B66" }}>
        Reviewed by The Oracle Lover. New essays publish daily.
      </p>

      <div className="mt-6 flex flex-wrap gap-2">
        {CATS.map(c => (
          <button
            key={c.v}
            onClick={() => setCat(c.v)}
            className="px-4 py-1.5 rounded-full text-sm font-medium transition"
            style={{
              background: cat === c.v ? "#E8604C" : "#F8F2E5",
              color: cat === c.v ? "#FFFEF9" : "#2B2B2B",
              border: "1px solid rgba(43,43,43,0.06)",
            }}
          >
            {c.label}
          </button>
        ))}
      </div>

      <div className="mt-8">
        {loading && (
          <div className="flex items-center gap-3" style={{ color: "#6B6B66" }}>
            <Loader2 className="animate-spin" /> Loading…
          </div>
        )}
        {data && data.articles.length > 0 ? (
          <div className="masonry">
            {data.articles.map((a, i) => <ArticleCard key={a.slug} a={a} index={i} />)}
          </div>
        ) : !loading ? (
          <p style={{ color: "#6B6B66" }}>No essays in this category yet. Try another filter.</p>
        ) : null}
      </div>
    </div>
  );
}
