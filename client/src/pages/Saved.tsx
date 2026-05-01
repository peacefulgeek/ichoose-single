import { useEffect, useState } from "react";
import { ArticleSummary } from "@/lib/api";
import ArticleCard from "@/components/ArticleCard";
import { Bookmark } from "lucide-react";
import { Link } from "wouter";

export default function Saved() {
  const [items, setItems] = useState<ArticleSummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (typeof window === "undefined") return;
    let slugs: string[] = [];
    try { slugs = JSON.parse(localStorage.getItem("sbd:saved") || "[]"); } catch {}
    if (slugs.length === 0) {
      setItems([]);
      setLoading(false);
      return;
    }
    Promise.all(slugs.map(s => fetch(`/api/articles/${s}`).then(r => r.ok ? r.json() : null)))
      .then(rs => {
        setItems(rs.filter((r): r is ArticleSummary => Boolean(r)));
        setLoading(false);
      });
  }, []);

  return (
    <div className="container py-10">
      <h1 className="text-3xl md:text-5xl font-extrabold flex items-center gap-3" style={{ color: "#2B2B2B" }}>
        <Bookmark style={{ color: "#E8604C" }} size={36} />
        Saved
      </h1>
      <p className="mt-2 max-w-xl" style={{ color: "#6B6B66" }}>
        Essays you bookmarked. Stored locally on this device.
      </p>
      <div className="mt-8">
        {loading && <p style={{ color: "#6B6B66" }}>Loading…</p>}
        {!loading && items.length === 0 && (
          <div className="py-16 text-center" style={{ color: "#6B6B66" }}>
            Nothing saved yet. <Link href="/articles" style={{ color: "#E8604C", fontWeight: 600 }}>Browse essays →</Link>
          </div>
        )}
        {items.length > 0 && (
          <div className="masonry">
            {items.map((a, i) => <ArticleCard key={a.slug} a={a} index={i} />)}
          </div>
        )}
      </div>
    </div>
  );
}
