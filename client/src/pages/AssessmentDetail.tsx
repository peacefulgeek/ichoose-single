import { useEffect, useMemo, useState } from "react";
import { useParams, Link } from "wouter";

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

export default function AssessmentDetail() {
  const params = useParams<{ slug: string }>();
  const [a, setA] = useState<Assessment | null>(null);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    setA(null);
    setAnswers({});
    setSubmitted(false);
    fetch(`/api/assessments/${params.slug}`).then(r => r.ok ? r.json() : null).then(setA);
  }, [params.slug]);

  const total = useMemo(() => Object.values(answers).reduce((s, v) => s + (v || 0), 0), [answers]);
  const allAnswered = a && Object.keys(answers).length === a.items.length;
  const band = useMemo(() => {
    if (!a) return null;
    return a.bands.find(b => total >= b.min && total <= b.max) || a.bands[a.bands.length - 1];
  }, [a, total]);

  if (!a) {
    return (
      <div className="container py-16">
        <p className="text-ink/60">Loading the assessment...</p>
      </div>
    );
  }

  const [c1, c2] = paletteFor(a.slug);
  return (
    <div className="container py-12 md:py-16 max-w-3xl">
      <Link href="/assessments" className="text-sm text-ink/55 hover:text-[color:var(--coral)]">
        ← All assessments
      </Link>
      <div
        className="mt-6 rounded-3xl p-8 md:p-12"
        style={{ background: `linear-gradient(135deg, ${c1} 0%, ${c2}33 60%, ${c2}55 100%)` }}
      >
        <p className="text-xs uppercase tracking-[0.22em] font-semibold text-ink/65">
          Self-assessment
        </p>
        <h1 className="mt-3 font-serif text-3xl md:text-5xl tracking-tight text-ink">{a.title}</h1>
        <p className="mt-5 text-ink/80 leading-relaxed">{a.why}</p>
        <p className="mt-3 text-sm text-ink/65">{a.intro}</p>
      </div>

      <div className="mt-10 space-y-6">
        {a.items.map((it, idx) => (
          <div key={it.id} className="rounded-xl border border-ink/10 bg-paper p-5">
            <p className="font-medium text-ink">
              <span className="mr-2 text-ink/45">{idx + 1}.</span>
              {it.prompt}
            </p>
            <div className="mt-4 flex items-center gap-2 flex-wrap">
              {[1, 2, 3, 4, 5].map(v => {
                const active = answers[it.id] === v;
                return (
                  <button
                    key={v}
                    type="button"
                    onClick={() => setAnswers(prev => ({ ...prev, [it.id]: v }))}
                    className={
                      "px-4 py-2 rounded-full text-sm font-medium border transition " +
                      (active
                        ? "bg-[color:var(--coral)] text-paper border-[color:var(--coral)]"
                        : "bg-cream/60 text-ink/75 border-ink/10 hover:bg-cream")
                    }
                  >
                    {v}
                  </button>
                );
              })}
              <span className="ml-3 text-xs text-ink/50 uppercase tracking-wide">
                1 = rarely · 5 = mostly true
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-10">
        <button
          type="button"
          disabled={!allAnswered}
          onClick={() => setSubmitted(true)}
          className={
            "rounded-full px-7 py-3 font-medium transition " +
            (allAnswered
              ? "bg-[color:var(--teal)] text-paper hover:opacity-90"
              : "bg-ink/10 text-ink/40 cursor-not-allowed")
          }
        >
          {allAnswered ? `See your takeaway · score ${total}` : "Answer all statements to score"}
        </button>
      </div>

      {submitted && band && (
        <div className="mt-10 rounded-2xl border border-[color:var(--teal)]/30 bg-[color:var(--cream)] p-7">
          <p className="text-xs uppercase tracking-[0.22em] font-semibold text-[color:var(--teal)]">
            Your score: {total}
          </p>
          <h2 className="mt-2 font-serif text-2xl md:text-3xl text-ink">{band.label}</h2>
          <p className="mt-4 text-ink/80 leading-relaxed">{band.takeaway}</p>
          <Link
            href={`/articles/${band.linkSlug}`}
            className="inline-block mt-5 text-[color:var(--coral)] font-medium underline-offset-4 hover:underline"
          >
            {band.linkAnchor} →
          </Link>
        </div>
      )}
    </div>
  );
}
