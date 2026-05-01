import { useArticles } from "@/lib/api";
import ArticleCard from "@/components/ArticleCard";
import { Link } from "wouter";
import { Loader2 } from "lucide-react";

export default function Author() {
  const { data, loading } = useArticles({ limit: 60 });

  return (
    <div>
      <section className="home-hero">
        <div className="container max-w-4xl">
          <span className="inline-block text-xs font-semibold tracking-widest uppercase px-3 py-1 rounded-full" style={{ background: "#F8F2E5", color: "#2AA5A0" }}>
            Author profile
          </span>
          <h1 className="mt-4 text-3xl md:text-5xl font-extrabold leading-tight" style={{ color: "#2B2B2B" }}>
            The Oracle Lover
          </h1>
          <p className="mt-3 text-lg max-w-2xl" style={{ color: "#6B6B66" }}>
            Editor and reviewer at I Choose Single. Reviews and writes warm, opinionated essays on intentional singlehood,
            self-partnering, and solo living. Every essay on this site has passed through her hands.
          </p>
          <div className="mt-5 grid sm:grid-cols-3 gap-4 max-w-3xl">
            <div className="p-4 rounded-2xl" style={{ background: "#F8F2E5" }}>
              <div className="text-xs uppercase font-bold tracking-widest" style={{ color: "#2AA5A0" }}>Reviews per essay</div>
              <div className="text-2xl font-extrabold mt-1" style={{ color: "#2B2B2B" }}>2 passes</div>
            </div>
            <div className="p-4 rounded-2xl" style={{ background: "#F8F2E5" }}>
              <div className="text-xs uppercase font-bold tracking-widest" style={{ color: "#2AA5A0" }}>Years writing on this beat</div>
              <div className="text-2xl font-extrabold mt-1" style={{ color: "#2B2B2B" }}>Eight</div>
            </div>
            <div className="p-4 rounded-2xl" style={{ background: "#F8F2E5" }}>
              <div className="text-xs uppercase font-bold tracking-widest" style={{ color: "#2AA5A0" }}>Reach out</div>
              <Link href="/contact" className="text-base font-semibold" style={{ color: "#E8604C" }}>Contact The Oracle Lover →</Link>
            </div>
          </div>
        </div>
      </section>

      <section className="container py-10">
        <h2 className="text-2xl font-bold mb-6" style={{ color: "#2B2B2B" }}>Essays from this author</h2>
        {loading && <div className="flex items-center gap-3" style={{ color: "#6B6B66" }}><Loader2 className="animate-spin" /> Loading…</div>}
        {data && (
          <div className="masonry">
            {data.articles.map((a, i) => <ArticleCard key={a.slug} a={a} index={i} />)}
          </div>
        )}
      </section>
    </div>
  );
}
