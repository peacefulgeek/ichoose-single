import { useArticles } from "@/lib/api";
import ArticleCard from "@/components/ArticleCard";
import { Link } from "wouter";
import { Loader2, ArrowRight, Sparkles, Compass, Flame, BookOpen } from "lucide-react";

const HOME_HERO = "https://ichoose-single.b-cdn.net/site/home_hero.webp";
const ASSESS_HERO = "https://ichoose-single.b-cdn.net/site/assessments.webp";
const APO_HERO = "https://ichoose-single.b-cdn.net/site/apothecary.webp";

export default function Home() {
  const { data, loading } = useArticles({ limit: 30 });
  const articles = data?.articles || [];

  // hand-curate the magazine grid (different sizes for visual rhythm)
  const featured = articles[0];
  const secondary = articles.slice(1, 5);
  const grid = articles.slice(5, 17);
  const remaining = articles.slice(17);

  return (
    <div>
      {/* ============== HERO ============== */}
      <section className="home-hero">
        <div className="container relative py-20 md:py-28 grid md:grid-cols-12 gap-10 items-center">
          <div className="md:col-span-7">
            <span className="editorial-eyebrow" style={{ color: "#F2B33D" }}>
              Issue 01 , Solo, on purpose
            </span>
            <h1 className="mt-5 display-serif">
              Choose your <span className="coral">own life,</span><br />
              <em>on purpose.</em>
            </h1>
            <p className="mt-6 text-lg" style={{ maxWidth: "34rem" }}>
              Vibrant, image-rich essays on intentional singlehood, solo living, and self-partnering ,
              for anyone who's done waiting for a plus-one to start their real life.
              Every piece reviewed by The Oracle Lover.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/articles" className="btn-primary">
                Read the essays <ArrowRight size={16} />
              </Link>
              <Link href="/assessments" className="btn-ghost" style={{ borderColor: "rgba(251,247,238,0.85)", color: "#FBF7EE" }}>
                Take a self-assessment
              </Link>
            </div>
            <div className="mt-10 flex flex-wrap gap-6 text-sm" style={{ color: "rgba(251,247,238,0.78)" }}>
              <span className="flex items-center gap-2"><Sparkles size={15} style={{ color: "#F2B33D" }} /> Intentional, not lonely</span>
              <span className="flex items-center gap-2"><Compass size={15} style={{ color: "#1AA39A" }} /> Solo as practice</span>
              <span className="flex items-center gap-2"><Flame size={15} style={{ color: "#F25C54" }} /> Sensual self-partnership</span>
            </div>
          </div>
          <div className="md:col-span-5">
            <div className="hero-photo grain">
              <img src={HOME_HERO} alt="A radiant solo woman in golden hour light, sensual and self-possessed" />
            </div>
          </div>
        </div>
      </section>

      {/* ============== FEATURED + SECONDARY (magazine top of fold) ============== */}
      <section className="container py-14 md:py-20">
        <div className="flex items-end justify-between mb-8 flex-wrap gap-4">
          <div>
            <span className="editorial-eyebrow">This week's reading</span>
            <h2 className="mt-2 display-serif" style={{ fontSize: "clamp(1.6rem, 2.5vw, 2.5rem)" }}>
              The latest on living single, beautifully.
            </h2>
            <hr className="gold-rule mt-4" />
          </div>
          {data && (
            <span className="text-sm" style={{ color: "rgba(31,20,34,0.55)" }}>
              {data.total} essays • published twice a day
            </span>
          )}
        </div>

        {loading && (
          <div className="flex items-center gap-3 py-12" style={{ color: "rgba(31,20,34,0.55)" }}>
            <Loader2 className="animate-spin" /> Loading essays…
          </div>
        )}

        {!loading && articles.length === 0 && (
          <div className="py-16 text-center" style={{ color: "rgba(31,20,34,0.55)" }}>
            New essays publish daily. The first ones are arriving now.
          </div>
        )}

        {featured && (
          <div className="mag-grid">
            {/* hero feature , large */}
            <div className="span-4 row-2">
              <ArticleCard a={featured} index={0} size="wide" />
            </div>
            {/* color-block intro card */}
            <div className="span-2">
              <Link href="/about" className="ed-card color-coral" style={{ aspectRatio: "1 / 1" }}>
                <div className="ed-meta" style={{ position: "static", padding: "1.75rem" }}>
                  <span className="ed-cat" style={{ color: "rgba(251,247,238,0.85)" }}>Manifesto</span>
                  <h3 style={{ fontSize: "1.4rem", lineHeight: 1.18 }}>
                    Single by design isn't a stop on the way to married. It's the destination.
                  </h3>
                  <p style={{ marginTop: "0.75rem", fontSize: "0.92rem", opacity: 0.85 }}>
                    Read what this site believes →
                  </p>
                </div>
              </Link>
            </div>
            {secondary.map((a, i) => (
              <div key={a.slug} className="span-2">
                <ArticleCard a={a} index={i + 1} size="square" />
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ============== TEAL BAND , assessments CTA ============== */}
      <section className="section-teal">
        <div className="container py-16 md:py-20 grid md:grid-cols-2 gap-10 items-center">
          <div>
            <span className="editorial-eyebrow" style={{ color: "#F2B33D" }}>Self-Assessments</span>
            <h2 className="mt-3 display-serif" style={{ fontSize: "clamp(1.8rem, 3vw, 2.8rem)", color: "#FBF7EE" }}>
              Eleven questions that take the temperature of your single life.
            </h2>
            <p className="mt-5" style={{ color: "rgba(251,247,238,0.86)", lineHeight: 1.65, fontSize: "1.05rem" }}>
              Are you single by design or single by drift? How sensual is your solitude?
              Quick, honest, no-email-required quizzes that give you something real to think about.
            </p>
            <div className="mt-7">
              <Link href="/assessments" className="btn-primary">
                Take an assessment <ArrowRight size={16} />
              </Link>
            </div>
          </div>
          <div className="hero-photo grain" style={{ aspectRatio: "5 / 4", borderRadius: "1.5rem", overflow: "hidden" }}>
            <img src={ASSESS_HERO} alt="A vibrant tarot-like spread of self-assessment cards on a rich teal table" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          </div>
        </div>
      </section>

      {/* ============== MID GRID , more essays ============== */}
      {grid.length > 0 && (
        <section className="container py-16 md:py-20">
          <div className="flex items-end justify-between mb-8 flex-wrap gap-4">
            <div>
              <span className="editorial-eyebrow">More from the magazine</span>
              <h2 className="mt-2 display-serif" style={{ fontSize: "clamp(1.5rem, 2.2vw, 2.2rem)" }}>
                On rituals, friendship, money, and the warmth of a single Sunday.
              </h2>
              <hr className="gold-rule mt-4" />
            </div>
            <Link href="/articles" className="btn-ghost" style={{ padding: "0.6rem 1.2rem", fontSize: "0.92rem" }}>
              See all
            </Link>
          </div>
          <div className="mag-grid">
            {grid.slice(0, 12).map((a, i) => {
              const span = i === 0 || i === 5 ? "span-3" : "span-2";
              const variant: "tall" | "square" | "default" =
                i === 0 || i === 5 ? "wide" as any : i % 2 === 0 ? "tall" : "square";
              return (
                <div key={a.slug} className={span}>
                  <ArticleCard a={a} index={i + 5} size={variant === ("wide" as any) ? "wide" : variant} />
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* ============== APOTHECARY CTA , gold band ============== */}
      <section className="section-gold-band">
        <div className="container py-16 md:py-20 grid md:grid-cols-12 gap-10 items-center">
          <div className="md:col-span-5 hero-photo grain" style={{ aspectRatio: "4 / 5", borderRadius: "1.5rem", overflow: "hidden", boxShadow: "0 30px 60px -20px rgba(74,25,66,0.35)" }}>
            <img src={APO_HERO} alt="A lush flat-lay of single-person apothecary supplies , herbs, teas, books, a candle" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          </div>
          <div className="md:col-span-7">
            <span className="editorial-eyebrow" style={{ color: "#4A1942" }}>The Apothecary</span>
            <h2 className="mt-3 display-serif" style={{ fontSize: "clamp(1.8rem, 3vw, 2.8rem)", color: "#2A0F33" }}>
              The supplies for a single life worth living.
            </h2>
            <p className="mt-5" style={{ color: "#2A0F33", lineHeight: 1.65, fontSize: "1.05rem" }}>
              Curated supplements, herbs, books, and small rituals , every recommendation reviewed and explained.
              Built for one person who knows what their nervous system needs.
            </p>
            <div className="mt-7">
              <Link href="/apothecary" className="btn-ghost" style={{ borderColor: "#2A0F33", color: "#2A0F33" }}>
                <BookOpen size={16} /> Browse the shelves
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ============== REMAINING GRID ============== */}
      {remaining.length > 0 && (
        <section className="container py-16 md:py-20">
          <div className="mb-8">
            <span className="editorial-eyebrow">From the archive</span>
            <h2 className="mt-2 display-serif" style={{ fontSize: "clamp(1.5rem, 2.2vw, 2.2rem)" }}>
              Quiet pieces, slow Sundays, real money talk.
            </h2>
            <hr className="gold-rule mt-4" />
          </div>
          <div className="mag-grid">
            {remaining.map((a, i) => (
              <div key={a.slug} className={i % 5 === 0 ? "span-3" : "span-2"}>
                <ArticleCard a={a} index={i + 17} size={i % 3 === 0 ? "tall" : i % 3 === 1 ? "square" : "default"} />
              </div>
            ))}
          </div>
          <div className="mt-10 flex justify-center">
            <Link href="/articles" className="btn-primary">Browse every essay <ArrowRight size={16} /></Link>
          </div>
        </section>
      )}
    </div>
  );
}
