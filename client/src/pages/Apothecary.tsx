import { useEffect, useState } from "react";
import { Link } from "wouter";
import { ArrowRight } from "lucide-react";

type Item = { asin: string; title: string; brand: string; shelf: string; why: string; url: string };
type ShelfGroup = { shelf: string; title: string; intro: string; items: Item[] };

const APO_HERO = "https://ichoose-single.b-cdn.net/site/apothecary.webp";

const SHELF_BG: Record<string, string> = {
  "nervous-system": "linear-gradient(135deg, #2A0F33 0%, #4A1942 100%)",
  "sleep-and-rest": "linear-gradient(135deg, #1F1422 0%, #2A0F33 100%)",
  "mood-and-resilience": "linear-gradient(135deg, #F2B33D 0%, #D99024 100%)",
  "energy-and-focus": "linear-gradient(135deg, #F25C54 0%, #D9412F 100%)",
  "hormonal-balance": "linear-gradient(135deg, #4A1942 0%, #F25C54 100%)",
  "digestive-roots": "linear-gradient(135deg, #1AA39A 0%, #0F6E68 100%)",
  "tcm-classics": "linear-gradient(135deg, #4A1942 0%, #2A0F33 100%)",
  "adaptogens": "linear-gradient(135deg, #1AA39A 0%, #2A0F33 100%)",
  "rituals-and-tools": "linear-gradient(135deg, #F2B33D 0%, #F25C54 100%)",
};

function shelfBg(shelf: string) {
  return SHELF_BG[shelf] || "linear-gradient(135deg, #2A0F33 0%, #4A1942 100%)";
}

export default function Apothecary() {
  const [data, setData] = useState<{ total: number; affiliateTag: string; shelves: ShelfGroup[] } | null>(null);

  useEffect(() => {
    fetch("/api/apothecary").then(r => r.json()).then(setData);
  }, []);

  return (
    <div>
      {/* Hero band */}
      <section className="section-coral" style={{ background: "linear-gradient(180deg, #FBF7EE 0%, #FBF7EE 100%)" }}>
        <div className="container py-16 md:py-24 grid md:grid-cols-12 gap-10 items-center">
          <div className="md:col-span-5 hero-photo grain" style={{ aspectRatio: "4 / 5", borderRadius: "1.5rem", overflow: "hidden", boxShadow: "0 30px 60px -20px rgba(74,25,66,0.35)" }}>
            <img src={APO_HERO} alt="A lush flat-lay of single-person apothecary supplies , herbs, teas, books, a lit candle" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          </div>
          <div className="md:col-span-7">
            <span className="editorial-eyebrow">The Apothecary</span>
            <h1 className="display-serif mt-4" style={{ fontSize: "clamp(2.2rem, 5vw, 4rem)" }}>
              A small shelf, <em>kept honest.</em>
            </h1>
            <p className="mt-5 text-lg" style={{ color: "rgba(31,20,34,0.78)", lineHeight: 1.65, maxWidth: "36rem" }}>
              About fifty things, sorted onto nine shelves. None of it replaces a real conversation with
              a clinician or a herbalist. Everything here is something we'd actually keep at home,
              in a glass jar with a handwritten label.
            </p>
            <p className="mt-4 text-sm" style={{ color: "rgba(31,20,34,0.55)", lineHeight: 1.6 }}>
              Affiliate-supported. We earn a small commission via{" "}
              <code style={{ fontFamily: "ui-monospace, monospace", color: "#2A0F33", background: "rgba(42,15,51,0.06)", padding: "0.1rem 0.35rem", borderRadius: 4 }}>spankyspinola-20</code>.
              {" "}<Link href="/disclosures" style={{ color: "#F25C54", textDecoration: "underline", fontWeight: 600 }}>Read the disclosures</Link>.
            </p>
          </div>
        </div>
      </section>

      <section className="container py-16 md:py-20">
        {!data ? (
          <p className="text-center" style={{ color: "rgba(31,20,34,0.55)" }}>Loading the shelves…</p>
        ) : (
          <div className="space-y-20">
            {data.shelves.map(g => (
              <section key={g.shelf}>
                <div className="rounded-3xl p-8 md:p-12 mb-8 grain" style={{ background: shelfBg(g.shelf), color: "#FBF7EE", position: "relative", overflow: "hidden" }}>
                  <span className="editorial-eyebrow" style={{ color: "#F2B33D" }}>
                    Shelf · {g.items.length} items
                  </span>
                  <h2 className="display-serif mt-3" style={{ fontSize: "clamp(1.6rem, 3vw, 2.4rem)", color: "#FBF7EE" }}>
                    {g.title}
                  </h2>
                  <p className="mt-4 max-w-2xl" style={{ color: "rgba(251,247,238,0.85)", lineHeight: 1.65 }}>{g.intro}</p>
                </div>
                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  {g.items.map(it => (
                    <a
                      key={it.asin}
                      href={it.url}
                      target="_blank"
                      rel="nofollow sponsored noopener"
                      className="apo-card block p-6"
                    >
                      <span className="editorial-eyebrow" style={{ fontSize: "0.65rem", letterSpacing: "0.2em" }}>
                        {it.brand}
                      </span>
                      <h3 className="mt-2 display-serif" style={{ fontSize: "1.18rem", lineHeight: 1.25, fontWeight: 600 }}>{it.title}</h3>
                      <p className="mt-3 text-sm" style={{ color: "rgba(31,20,34,0.72)", lineHeight: 1.55 }}>{it.why}</p>
                      <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold" style={{ color: "#1AA39A" }}>
                        View on Amazon <ArrowRight size={14} />
                      </span>
                    </a>
                  ))}
                </div>
              </section>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
