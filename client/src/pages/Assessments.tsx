import { useEffect, useState } from "react";
import { Link } from "wouter";

type Assessment = {
  slug: string;
  title: string;
  intro: string;
  why: string;
  items: { id: string; prompt: string }[];
  bands: { min: number; max: number; label: string; takeaway: string; linkSlug: string; linkAnchor: string }[];
};

const PALETTES = [
  ["#FFE4D6", "#E8604C"], ["#FFF6E0", "#D9A24C"], ["#E0F2EF", "#2AA5A0"],
  ["#FFEFE4", "#E8604C"], ["#FFF2D9", "#C98445"], ["#E8F1EE", "#3A8E89"],
  ["#FBE9D8", "#B95C3D"], ["#FFFAF0", "#A6843E"], ["#EAF5F2", "#2D7C77"],
  ["#FFE9E2", "#D14A38"], ["#F4ECE0", "#7E5430"],
];

function paletteFor(slug: string) {
  let h = 0;
  for (let i = 0; i < slug.length; i++) h = (h * 31 + slug.charCodeAt(i)) >>> 0;
  return PALETTES[h % PALETTES.length];
}

export default function Assessments() {
  const [list, setList] = useState<Assessment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/assessments").then(r => r.json()).then(d => {
      setList(d.assessments || []);
      setLoading(false);
    });
  }, []);

  return (
    <div className="container py-12 md:py-16">
      <div className="max-w-3xl">
        <p className="text-sm uppercase tracking-[0.2em] text-[color:var(--coral)] font-medium">
          Self-assessments
        </p>
        <h1 className="mt-3 font-serif text-4xl md:text-6xl tracking-tight text-ink">
          Eleven gentle audits of a designed solo life.
        </h1>
        <p className="mt-5 text-lg text-ink/75 leading-relaxed">
          No accounts. No tracking. No verdicts. Each quiz is a five-to-seven-minute read,
          scored in your head, with takeaway copy written in the same voice as the essays.
          Use them as mirrors, not measuring sticks.
        </p>
      </div>

      {loading ? (
        <p className="mt-12 text-ink/60">Loading the field guide...</p>
      ) : (
        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {list.map(a => {
            const [c1, c2] = paletteFor(a.slug);
            return (
              <Link
                key={a.slug}
                href={`/assessments/${a.slug}`}
                className="group block overflow-hidden rounded-2xl border border-ink/10 bg-paper shadow-sm transition hover:shadow-lg hover:-translate-y-0.5"
              >
                <div
                  className="relative aspect-[4/3] flex items-end p-6"
                  style={{ background: `linear-gradient(135deg, ${c1} 0%, ${c2} 100%)` }}
                >
                  <span
                    className="text-xs uppercase tracking-[0.18em] font-semibold rounded-full bg-paper/85 px-3 py-1 text-ink"
                  >
                    {a.items.length} statements
                  </span>
                </div>
                <div className="p-6">
                  <h3 className="font-serif text-xl text-ink leading-snug group-hover:text-[color:var(--coral)] transition">
                    {a.title}
                  </h3>
                  <p className="mt-3 text-sm text-ink/70 leading-relaxed line-clamp-3">{a.why}</p>
                  <p className="mt-4 text-sm font-medium text-[color:var(--teal)]">
                    Take the quiz →
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
