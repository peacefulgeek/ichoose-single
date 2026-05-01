import { useEffect, useState } from "react";

type Item = { asin: string; title: string; brand: string; shelf: string; why: string; url: string };
type ShelfGroup = { shelf: string; title: string; intro: string; items: Item[] };

const SHELF_PALETTES: Record<string, [string, string]> = {
  "nervous-system": ["#FFE4D6", "#E8604C"],
  "sleep-and-rest": ["#E0E6F2", "#5567A0"],
  "mood-and-resilience": ["#FFF1D6", "#D9A24C"],
  "energy-and-focus": ["#FFE9D9", "#E8604C"],
  "hormonal-balance": ["#F4E0EE", "#A05583"],
  "digestive-roots": ["#E8E5D2", "#7E7438"],
  "tcm-classics": ["#E8DDDA", "#8D4E3F"],
  "adaptogens": ["#DCEEE9", "#2AA5A0"],
  "rituals-and-tools": ["#F4ECE0", "#7E5430"],
};

export default function Apothecary() {
  const [data, setData] = useState<{ total: number; affiliateTag: string; shelves: ShelfGroup[] } | null>(null);

  useEffect(() => {
    fetch("/api/apothecary").then(r => r.json()).then(setData);
  }, []);

  return (
    <div className="container py-12 md:py-16">
      <div className="max-w-3xl">
        <p className="text-sm uppercase tracking-[0.2em] text-[color:var(--coral)] font-medium">
          The Apothecary
        </p>
        <h1 className="mt-3 font-serif text-4xl md:text-6xl tracking-tight text-ink">
          A small shelf, kept honest.
        </h1>
        <p className="mt-5 text-lg text-ink/75 leading-relaxed">
          Fifty things, sorted onto nine shelves. None of this replaces a real conversation
          with a clinician or a herbalist. Everything here is something we'd actually keep at
          home, in a glass jar with a handwritten label.
        </p>
        <p className="mt-4 text-sm text-ink/55">
          This page is affiliate-supported. If you buy through these links we earn a small
          commission. The Amazon affiliate tag <code className="font-mono text-ink/70">spankyspinola-20</code> is
          attached to every product link below. Read the full <a href="/disclosures" className="text-[color:var(--coral)] underline">disclosures</a>.
        </p>
      </div>

      {!data ? (
        <p className="mt-12 text-ink/60">Loading the shelves...</p>
      ) : (
        <div className="mt-14 space-y-16">
          {data.shelves.map(g => {
            const [c1, c2] = SHELF_PALETTES[g.shelf] || ["#FFE4D6", "#E8604C"];
            return (
              <section key={g.shelf}>
                <div
                  className="rounded-3xl p-8 md:p-10 mb-6"
                  style={{ background: `linear-gradient(120deg, ${c1} 0%, ${c2}30 75%, ${c2}55 100%)` }}
                >
                  <p className="text-xs uppercase tracking-[0.22em] font-semibold text-ink/65">
                    Shelf · {g.items.length} items
                  </p>
                  <h2 className="mt-2 font-serif text-3xl md:text-4xl text-ink">{g.title}</h2>
                  <p className="mt-4 text-ink/75 max-w-2xl leading-relaxed">{g.intro}</p>
                </div>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {g.items.map(it => (
                    <a
                      key={it.asin}
                      href={it.url}
                      target="_blank"
                      rel="nofollow sponsored noopener"
                      className="block rounded-xl border border-ink/10 bg-paper p-5 hover:border-[color:var(--coral)] hover:shadow-md transition"
                    >
                      <p className="text-[10px] uppercase tracking-[0.2em] font-semibold text-ink/45">
                        {it.brand}
                      </p>
                      <h3 className="mt-2 font-serif text-lg text-ink leading-snug">{it.title}</h3>
                      <p className="mt-3 text-sm text-ink/70 leading-relaxed">{it.why}</p>
                      <p className="mt-4 text-sm font-medium text-[color:var(--teal)]">View on Amazon →</p>
                    </a>
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      )}
    </div>
  );
}
