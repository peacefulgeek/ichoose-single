import { useParams, Link } from "wouter";
import { useArticle } from "@/lib/api";
import { Loader2, Calendar, FileText, Bookmark, Share2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { heroDataUrl } from "@/lib/heroPattern";

interface Heading {
  id: string;
  text: string;
}

function extractHeadings(html: string): Heading[] {
  const out: Heading[] = [];
  const re = /<h2[^>]*?id=["']([^"']+)["'][^>]*>([\s\S]*?)<\/h2>/gi;
  let m: RegExpExecArray | null;
  while ((m = re.exec(html))) {
    out.push({ id: m[1], text: m[2].replace(/<[^>]+>/g, "").trim() });
  }
  return out;
}

const CATEGORY_LABELS: Record<string, string> = {
  "intentional-singlehood": "Intentional Singlehood",
  "self-partnering": "Self-Partnering",
  "solo-living": "Solo Living",
  "solo-travel": "Solo Travel",
  "solo-finance": "Solo Finance",
  "single-women": "Single Women",
  "single-men": "Single Men",
  "single-parents": "Single Parents",
  "relationship-escalator": "Off the Escalator",
  "dating-on-your-terms": "Dating On Your Terms",
};

export default function Article() {
  const { slug } = useParams<{ slug: string }>();
  const { data, loading, error } = useArticle(slug);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const list = JSON.parse(localStorage.getItem("sbd:saved") || "[]");
      setSaved(list.includes(slug));
    } catch {}
  }, [slug]);

  const headings = useMemo(() => (data ? extractHeadings(data.bodyHtml) : []), [data]);

  if (loading) {
    return (
      <div className="container py-32 flex items-center gap-3" style={{ color: "rgba(31,20,34,0.55)" }}>
        <Loader2 className="animate-spin" /> Loading essay…
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="container py-32 text-center">
        <h1 className="display-serif" style={{ fontSize: "2.4rem" }}>Essay not found</h1>
        <p style={{ color: "rgba(31,20,34,0.55)" }} className="mt-3">It may have been retired or moved.</p>
        <Link href="/articles" className="btn-primary mt-6 inline-flex">
          Browse all essays
        </Link>
      </div>
    );
  }

  const heroImg = data.heroUrl || heroDataUrl(data.slug, data.title);
  const datetime = new Date(data.publishedAt);
  const modified = new Date(data.lastModifiedAt);
  const categoryLabel = CATEGORY_LABELS[data.category] || data.category.replace(/-/g, " ");

  function toggleSave() {
    try {
      const list = JSON.parse(localStorage.getItem("sbd:saved") || "[]");
      if (list.includes(slug)) {
        const next = list.filter((s: string) => s !== slug);
        localStorage.setItem("sbd:saved", JSON.stringify(next));
        setSaved(false);
      } else {
        const next = [slug, ...list];
        localStorage.setItem("sbd:saved", JSON.stringify(next));
        setSaved(true);
      }
    } catch {}
  }

  return (
    <article>
      {/* ============ Cinematic editorial hero ============ */}
      <section className="article-hero grain">
        <img src={heroImg} alt="" className="bg" />
        <div className="container relative py-24 md:py-32 inner">
          <div className="max-w-3xl">
            <Link href={`/articles?cat=${data.category}`} className="editorial-eyebrow inline-block" style={{ color: "#F2B33D" }}>
              {categoryLabel}
            </Link>
            <h1 className="mt-5">{data.title}</h1>
            <div className="mt-7 flex flex-wrap gap-x-6 gap-y-2 items-center text-sm" style={{ color: "rgba(251,247,238,0.86)" }}>
              <span>
                By <Link href="/author/the-oracle-lover" style={{ color: "#F2B33D", fontWeight: 600, textDecoration: "underline", textUnderlineOffset: 4 }}>{data.authorName}</Link>
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Calendar size={14} />
                <time dateTime={datetime.toISOString()}>
                  {datetime.toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" })}
                </time>
              </span>
              {modified.getTime() > datetime.getTime() + 24 * 3600 * 1000 && (
                <span className="text-xs">Updated <time dateTime={modified.toISOString()}>{modified.toLocaleDateString()}</time></span>
              )}
              <span className="inline-flex items-center gap-1.5">
                <FileText size={14} />
                {data.wordCount.toLocaleString()} words · ~{Math.max(1, Math.round(data.wordCount / 220))} min read
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ============ Body ============ */}
      <div className="container py-12 md:py-16">
        <div className="article-layout">
          <div>
            {headings.length > 0 && (
              <div className="toc-pills" aria-label="Table of contents">
                {headings.map(h => (
                  <a key={h.id} href={`#${h.id}`}>{h.text}</a>
                ))}
              </div>
            )}
            <div className="prose-warm" dangerouslySetInnerHTML={{ __html: data.bodyHtml }} />

            <div className="flex flex-wrap gap-3 mt-10 pt-8" style={{ borderTop: "1px solid rgba(42,15,51,0.12)" }}>
              <button
                onClick={toggleSave}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full font-semibold transition-colors"
                style={{
                  background: saved ? "#1AA39A" : "#FBF7EE",
                  color: saved ? "#FBF7EE" : "#2A0F33",
                  border: saved ? "none" : "1.5px solid #2A0F33",
                }}
              >
                <Bookmark size={16} fill={saved ? "currentColor" : "none"} />
                {saved ? "Saved" : "Save for later"}
              </button>
              <button
                onClick={() => {
                  if (typeof navigator !== "undefined" && (navigator as any).share) {
                    (navigator as any).share({ title: data.title, url: window.location.href });
                  } else if (typeof navigator !== "undefined") {
                    navigator.clipboard.writeText(window.location.href);
                  }
                }}
                className="btn-ghost"
                style={{ padding: "0.6rem 1.25rem", fontSize: "0.95rem" }}
              >
                <Share2 size={16} /> Share this essay
              </button>
            </div>
          </div>

          {/* ===== Sidebar ===== */}
          <aside className="lg-only">
            <div className="sticky top-24 space-y-5">
              <div className="rounded-2xl p-6" style={{ background: "linear-gradient(135deg, #2A0F33 0%, #4A1942 100%)", color: "#FBF7EE" }}>
                <div className="editorial-eyebrow" style={{ color: "#F2B33D" }}>About the author</div>
                <div className="font-serif text-xl mt-2" style={{ fontFamily: "Fraunces, serif", fontWeight: 600, color: "#FBF7EE" }}>
                  The Oracle Lover
                </div>
                <p className="mt-3 text-sm" style={{ color: "rgba(251,247,238,0.82)", lineHeight: 1.6 }}>
                  Editor and reviewer at I Choose Single. Writes about intentional singlehood,
                  self-partnering, and reviews every product link before it ships.
                </p>
                <Link
                  href="/author/the-oracle-lover"
                  className="inline-block mt-4 text-sm font-semibold"
                  style={{ color: "#F2B33D" }}
                >
                  Read more from this author →
                </Link>
              </div>

              {data.internalLinks.length > 0 && (
                <div className="rounded-2xl p-6" style={{ background: "#FBF7EE", border: "1px solid rgba(42,15,51,0.12)" }}>
                  <div className="editorial-eyebrow">Read next</div>
                  <ul className="space-y-3 mt-3">
                    {data.internalLinks.slice(0, 4).map(l => (
                      <li key={l.slug}>
                        <Link
                          href={`/articles/${l.slug}`}
                          className="font-serif text-base"
                          style={{ fontFamily: "Fraunces, serif", color: "#2A0F33", fontWeight: 500, lineHeight: 1.3, display: "block" }}
                        >
                          {l.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="rounded-2xl p-6" style={{ background: "rgba(26,163,154,0.08)", border: "1px solid rgba(26,163,154,0.20)" }}>
                <div className="editorial-eyebrow" style={{ color: "#1AA39A" }}>Affiliate disclosure</div>
                <p className="text-sm mt-2" style={{ color: "rgba(31,20,34,0.78)", lineHeight: 1.55 }}>
                  We participate in the Amazon Services LLC Associates Program. As an Amazon Associate
                  we earn from qualifying purchases.{" "}
                  <Link href="/disclosures" style={{ color: "#F25C54", fontWeight: 600 }}>Read more</Link>.
                </p>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </article>
  );
}
