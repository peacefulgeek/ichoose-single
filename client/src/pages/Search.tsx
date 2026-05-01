import { useState } from "react";
import { useArticles } from "@/lib/api";
import ArticleCard from "@/components/ArticleCard";
import { Search as SearchIcon, Loader2 } from "lucide-react";

export default function Search() {
  const [q, setQ] = useState("");
  const { data, loading } = useArticles({ q: q || undefined, limit: 60 });

  return (
    <div className="container py-10">
      <h1 className="text-3xl md:text-5xl font-extrabold" style={{ color: "#2B2B2B" }}>Search</h1>
      <p className="mt-2 max-w-xl" style={{ color: "#6B6B66" }}>
        Type a feeling, a phase of life, a kitchen tool. We'll surface essays that touch it.
      </p>
      <div className="mt-6 flex items-center gap-3 max-w-xl">
        <SearchIcon size={20} style={{ color: "#6B6B66" }} />
        <input
          value={q}
          onChange={e => setQ(e.target.value)}
          placeholder="Try: solo Sunday, single by design, dating on your terms"
          className="flex-1 px-4 py-3 rounded-full border"
          style={{ background: "#FFFEF9", borderColor: "rgba(43,43,43,0.15)" }}
        />
      </div>
      <div className="mt-8">
        {loading && <div className="flex items-center gap-3" style={{ color: "#6B6B66" }}><Loader2 className="animate-spin" /> Loading…</div>}
        {data && (
          <div className="masonry">
            {data.articles.map((a, i) => <ArticleCard key={a.slug} a={a} index={i} />)}
          </div>
        )}
      </div>
    </div>
  );
}
