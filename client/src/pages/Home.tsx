import { useArticles } from "@/lib/api";
import ArticleCard from "@/components/ArticleCard";
import { Link } from "wouter";
import { Loader2, ArrowRight } from "lucide-react";

export default function Home() {
  const { data, loading } = useArticles({ limit: 30 });

  return (
    <div>
      <section className="home-hero">
        <div className="container">
          <div className="max-w-3xl">
            <span
              className="inline-block text-xs font-semibold tracking-widest uppercase px-3 py-1 rounded-full"
              style={{ background: "#F8F2E5", color: "#2AA5A0" }}
            >
              Essays on intentional singlehood
            </span>
            <h1 className="mt-4">
              Choose your <span className="accent">own life,</span> on purpose.
            </h1>
            <p>
              Warm, image-rich essays on solo living, self-partnering, and dating on your own terms.
              Reviewed and edited by The Oracle Lover.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/articles"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full font-semibold"
                style={{ background: "#E8604C", color: "#FFFEF9" }}
              >
                Browse all articles <ArrowRight size={16} />
              </Link>
              <Link
                href="/about"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full font-semibold"
                style={{ background: "#FFFEF9", color: "#2B2B2B", border: "1px solid rgba(43,43,43,0.15)" }}
              >
                What this site is about
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="container py-10">
        <div className="flex items-baseline justify-between mb-6">
          <h2 className="text-2xl font-bold" style={{ color: "#2B2B2B" }}>Latest essays</h2>
          {data && (
            <span className="text-sm" style={{ color: "#6B6B66" }}>
              {data.total} published
            </span>
          )}
        </div>

        {loading && (
          <div className="flex items-center gap-3 py-12" style={{ color: "#6B6B66" }}>
            <Loader2 className="animate-spin" /> Loading essays…
          </div>
        )}

        {data && data.articles.length === 0 && (
          <div className="py-16 text-center" style={{ color: "#6B6B66" }}>
            New essays publish daily. The first ones are arriving now.
          </div>
        )}

        {data && data.articles.length > 0 && (
          <div className="masonry">
            {data.articles.map((a, i) => (
              <ArticleCard key={a.slug} a={a} index={i} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
