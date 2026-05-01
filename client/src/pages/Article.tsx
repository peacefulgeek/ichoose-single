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
      <div className="container py-20 flex items-center gap-3" style={{ color: "#6B6B66" }}>
        <Loader2 className="animate-spin" /> Loading essay…
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="container py-20 text-center">
        <h1 className="text-2xl font-bold">Essay not found</h1>
        <p style={{ color: "#6B6B66" }} className="mt-2">It may have been retired or moved.</p>
        <Link href="/articles" className="inline-block mt-4 px-5 py-2 rounded-full" style={{ background: "#E8604C", color: "#FFFEF9" }}>
          Browse all essays
        </Link>
      </div>
    );
  }

  // Bunny CDN hero on top, deterministic gradient underneath as fallback.
  const fallback = heroDataUrl(data.slug, data.title);
  const hero = data.heroUrl ? `url("${data.heroUrl}"), url("${fallback}")` : `url("${fallback}")`;
  const datetime = new Date(data.publishedAt);
  const modified = new Date(data.lastModifiedAt);

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
      {/* Full-bleed hero band */}
      <div
        className="w-full"
        style={{
          backgroundImage: `linear-gradient(180deg, rgba(255,254,249,0) 30%, #FFFEF9 100%), ${hero}`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          aspectRatio: "16 / 6",
          minHeight: 220,
        }}
      />

      <div className="container -mt-12 relative">
        <div className="max-w-3xl">
          <Link href={`/articles?cat=${data.category}`} className="inline-block text-xs font-semibold uppercase tracking-widest px-3 py-1 rounded-full" style={{ background: "#FFFEF9", color: "#E8604C", border: "1px solid #F8E2DD" }}>
            {data.category.replace(/-/g, " ")}
          </Link>
          <h1 className="mt-3 text-3xl md:text-5xl font-extrabold leading-[1.05]" style={{ color: "#2B2B2B" }}>
            {data.title}
          </h1>
          <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 items-center text-sm" style={{ color: "#6B6B66" }}>
            <span>By <Link href="/author/the-oracle-lover" style={{ color: "#E8604C", fontWeight: 600 }}>{data.authorName}</Link></span>
            <span className="inline-flex items-center gap-1.5">
              <Calendar size={14} />
              <time dateTime={datetime.toISOString()}>{datetime.toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" })}</time>
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

      <div className="container py-8">
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

            <div className="flex flex-wrap gap-3 mt-8 pt-6 border-t" style={{ borderColor: "rgba(43,43,43,0.10)" }}>
              <button onClick={toggleSave} className="inline-flex items-center gap-2 px-4 py-2 rounded-full font-medium" style={{ background: saved ? "#2AA5A0" : "#F8F2E5", color: saved ? "#FFFEF9" : "#2B2B2B" }}>
                <Bookmark size={16} fill={saved ? "currentColor" : "none"} /> {saved ? "Saved" : "Save for later"}
              </button>
              <button
                onClick={() => {
                  if (typeof navigator !== "undefined" && (navigator as any).share) {
                    (navigator as any).share({ title: data.title, url: window.location.href });
                  } else if (typeof navigator !== "undefined") {
                    navigator.clipboard.writeText(window.location.href);
                  }
                }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full font-medium"
                style={{ background: "#FFFEF9", color: "#2B2B2B", border: "1px solid rgba(43,43,43,0.15)" }}
              >
                <Share2 size={16} /> Share this essay
              </button>
            </div>
          </div>

          <aside className="lg-only">
            <div className="sticky top-24 space-y-6">
              <div className="p-5 rounded-2xl" style={{ background: "#F8F2E5" }}>
                <div className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: "#2AA5A0" }}>About the author</div>
                <div className="font-semibold text-lg" style={{ color: "#2B2B2B" }}>The Oracle Lover</div>
                <p className="mt-2 text-sm" style={{ color: "#6B6B66" }}>
                  Editor and reviewer at Single by Design. Writes essays on intentional singlehood and self-partnering, and reviews every product link before it ships.
                </p>
                <Link href="/author/the-oracle-lover" className="inline-block mt-3 text-sm font-semibold" style={{ color: "#E8604C" }}>Read more from this author →</Link>
              </div>
              {data.internalLinks.length > 0 && (
                <div className="p-5 rounded-2xl border" style={{ borderColor: "rgba(43,43,43,0.10)" }}>
                  <div className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: "#E8604C" }}>Read next</div>
                  <ul className="space-y-3">
                    {data.internalLinks.slice(0, 4).map(l => (
                      <li key={l.slug}>
                        <Link href={`/articles/${l.slug}`} className="font-medium" style={{ color: "#2B2B2B" }}>
                          {l.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              <div className="p-5 rounded-2xl" style={{ background: "#FFFEF9", border: "1px solid rgba(43,43,43,0.10)" }}>
                <div className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: "#2AA5A0" }}>Affiliate disclosure</div>
                <p className="text-sm" style={{ color: "#6B6B66" }}>
                  Single by Design is a participant in the Amazon Services LLC Associates Program. As an Amazon Associate we earn from qualifying purchases. <Link href="/disclosures" style={{ color: "#E8604C" }}>Read the full disclosure</Link>.
                </p>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </article>
  );
}
