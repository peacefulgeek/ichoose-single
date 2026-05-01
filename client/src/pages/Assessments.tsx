import { useEffect, useState } from "react";
import { Link } from "wouter";
import { ArrowRight, Clock } from "lucide-react";

type Assessment = {
  slug: string;
  title: string;
  intro: string;
  why: string;
  items: { id: string; prompt: string }[];
  bands: { min: number; max: number; label: string; takeaway: string; linkSlug: string; linkAnchor: string }[];
};

const ASSESS_HERO = "https://ichoose-single.b-cdn.net/site/assessments.webp";

const TILE_BG = [
  { bg: "linear-gradient(135deg, #2A0F33 0%, #4A1942 100%)", sym: "I" },
  { bg: "linear-gradient(135deg, #F25C54 0%, #D9412F 100%)", sym: "II" },
  { bg: "linear-gradient(135deg, #1AA39A 0%, #0F6E68 100%)", sym: "III" },
  { bg: "linear-gradient(135deg, #4A1942 0%, #2A0F33 100%)", sym: "IV" },
  { bg: "linear-gradient(135deg, #F2B33D 0%, #D99024 100%)", sym: "V" },
  { bg: "linear-gradient(135deg, #1F1422 0%, #4A1942 100%)", sym: "VI" },
  { bg: "linear-gradient(135deg, #F25C54 0%, #F2B33D 100%)", sym: "VII" },
  { bg: "linear-gradient(135deg, #1AA39A 0%, #2A0F33 100%)", sym: "VIII" },
  { bg: "linear-gradient(135deg, #4A1942 0%, #F25C54 100%)", sym: "IX" },
  { bg: "linear-gradient(135deg, #2A0F33 0%, #1AA39A 100%)", sym: "X" },
  { bg: "linear-gradient(135deg, #F2B33D 0%, #F25C54 100%)", sym: "XI" },
];

function tileFor(idx: number) {
  return TILE_BG[idx % TILE_BG.length];
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
    <div>
      {/* Hero band */}
      <section className="section-plum">
        <div className="container py-20 md:py-24 grid md:grid-cols-12 gap-10 items-center">
          <div className="md:col-span-7">
            <span className="editorial-eyebrow" style={{ color: "#F2B33D" }}>Self-assessments</span>
            <h1 className="display-serif mt-4" style={{ color: "#FBF7EE", fontSize: "clamp(2.2rem, 5vw, 4.2rem)" }}>
              Eleven gentle audits of a designed solo life.
            </h1>
            <p className="mt-6 text-lg" style={{ color: "rgba(251,247,238,0.85)", lineHeight: 1.65, maxWidth: "36rem" }}>
              No accounts. No tracking. No verdicts. Five-to-seven minutes each, scored in your head,
              with takeaway copy written in the same voice as the essays. Mirrors, not measuring sticks.
            </p>
            <div className="mt-8 flex items-center gap-4 text-sm" style={{ color: "rgba(251,247,238,0.65)" }}>
              <Clock size={16} style={{ color: "#F2B33D" }} />
              <span>~6 minutes per quiz · all eleven free</span>
            </div>
          </div>
          <div className="md:col-span-5 hero-photo grain" style={{ aspectRatio: "5 / 4", borderRadius: "1.5rem", overflow: "hidden" }}>
            <img src={ASSESS_HERO} alt="A spread of vibrant assessment cards on a richly colored table" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          </div>
        </div>
      </section>

      <section className="container py-16 md:py-20">
        {loading ? (
          <p className="text-center" style={{ color: "rgba(31,20,34,0.55)" }}>Loading the field guide…</p>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {list.map((a, i) => {
              const tile = tileFor(i);
              return (
                <Link key={a.slug} href={`/assessments/${a.slug}`} className="quiz-tile" style={{ background: tile.bg }}>
                  <div>
                    <span className="symbol">{tile.sym}</span>
                    <span className="editorial-eyebrow block mt-3" style={{ color: "#F2B33D" }}>
                      {a.items.length} statements
                    </span>
                    <h3 className="mt-3">{a.title}</h3>
                    <p className="mt-3" style={{ color: "rgba(251,247,238,0.78)", lineHeight: 1.55 }}>
                      {a.why}
                    </p>
                  </div>
                  <div className="mt-6 inline-flex items-center gap-2 font-semibold text-sm" style={{ color: "#F2B33D" }}>
                    Take the quiz <ArrowRight size={14} />
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
