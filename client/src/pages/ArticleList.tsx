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
    <div>
      {/* Hero band */}
      <section className="section-plum">
        <div className="container py-16 md:py-20">
          <span className="editorial-eyebrow" style={{ color: "#F2B33D" }}>The archive</span>
          <h1 className="display-serif mt-4" style={{ color: "#FBF7EE", fontSize: "clamp(2.2rem, 5vw, 4rem)" }}>
            Every essay, <em style={{ color: "#F25C54" }}>browsable.</em>
          </h1>
          <p className="mt-5 text-lg" style={{ color: "rgba(251,247,238,0.82)", maxWidth: "36rem", lineHeight: 1.65 }}>
            Reviewed by The Oracle Lover. Two new essays publish each day.
            Use the filters to follow your mood.
          </p>
        </div>
      </section>

      <section className="container py-12 md:py-16">
        <div className="flex flex-wrap gap-2 mb-10 sticky top-20 z-10 py-3" style={{ background: "rgba(251,247,238,0.92)", backdropFilter: "blur(10px)", borderRadius: "0.75rem" }}>
          {CATS.map(c => (
            <button
              key={c.v}
              onClick={() => setCat(c.v)}
              className="px-4 py-2 rounded-full text-sm font-semibold transition-all"
              style={{
                background: cat === c.v ? "#2A0F33" : "#FBF7EE",
                color: cat === c.v ? "#FBF7EE" : "#2A0F33",
                border: cat === c.v ? "1px solid #2A0F33" : "1px solid rgba(42,15,51,0.18)",
              }}
            >
              {c.label}
            </button>
          ))}
        </div>

        {loading && (
          <div className="flex items-center gap-3 py-8" style={{ color: "rgba(31,20,34,0.55)" }}>
            <Loader2 className="animate-spin" /> Loading…
          </div>
        )}
        {data && data.articles.length > 0 ? (
          <div className="mag-grid">
            {data.articles.map((a, i) => {
              const span = i % 7 === 0 ? "span-3" : "span-2";
              const variant: "tall" | "square" | "wide" | "default" =
                i % 5 === 0 ? "wide" : i % 3 === 0 ? "tall" : i % 3 === 1 ? "square" : "default";
              return (
                <div key={a.slug} className={span}>
                  <ArticleCard a={a} index={i} size={variant} />
                </div>
              );
            })}
          </div>
        ) : !loading ? (
          <p style={{ color: "rgba(31,20,34,0.55)" }}>No essays in this category yet. Try another filter.</p>
        ) : null}
      </section>
    </div>
  );
}
