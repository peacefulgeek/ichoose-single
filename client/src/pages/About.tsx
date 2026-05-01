import { Link } from "wouter";
import { Heart, BookOpen, Sparkles, Mail } from "lucide-react";

const ABOUT_PORTRAIT = "https://ichoose-single.b-cdn.net/site/about_portrait.webp";

export default function About() {
  return (
    <div>
      {/* Hero with portrait */}
      <section className="section-plum">
        <div className="container py-20 md:py-24 grid md:grid-cols-12 gap-12 items-center">
          <div className="md:col-span-5 hero-photo grain" style={{ aspectRatio: "4 / 5", borderRadius: "1.5rem", overflow: "hidden", boxShadow: "0 30px 60px -20px rgba(0,0,0,0.55)" }}>
            <img src={ABOUT_PORTRAIT} alt="An intimate editorial portrait , a person at home in their own life" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          </div>
          <div className="md:col-span-7">
            <span className="editorial-eyebrow" style={{ color: "#F2B33D" }}>About this magazine</span>
            <h1 className="display-serif mt-4" style={{ color: "#FBF7EE", fontSize: "clamp(2.2rem, 5vw, 4.2rem)" }}>
              We treat single life as a <em style={{ color: "#F2B33D" }}>real shape of a life,</em> not a waiting room.
            </h1>
            <p className="mt-6 text-lg" style={{ color: "rgba(251,247,238,0.86)", lineHeight: 1.65 }}>
              I Choose Single is a magazine of warm, quietly opinionated essays for people choosing
              single life on purpose. Solo Sundays, slow finance, sensual self-partnering,
              friendships taken seriously, dating only when it actually feels good.
            </p>
          </div>
        </div>
      </section>

      <section className="container py-16 md:py-20">
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          <div className="rounded-2xl p-7" style={{ background: "linear-gradient(135deg, rgba(242,92,84,0.08), rgba(242,92,84,0.02))", border: "1px solid rgba(242,92,84,0.18)" }}>
            <Heart size={28} style={{ color: "#F25C54" }} />
            <h3 className="display-serif mt-3" style={{ fontSize: "1.3rem" }}>Honest, never preachy</h3>
            <p className="mt-2 text-sm" style={{ color: "rgba(31,20,34,0.72)", lineHeight: 1.6 }}>
              We don't shame anyone into settling, and we don't romanticize loneliness either.
              The writing is warm, the editing is real.
            </p>
          </div>
          <div className="rounded-2xl p-7" style={{ background: "linear-gradient(135deg, rgba(26,163,154,0.08), rgba(26,163,154,0.02))", border: "1px solid rgba(26,163,154,0.20)" }}>
            <BookOpen size={28} style={{ color: "#1AA39A" }} />
            <h3 className="display-serif mt-3" style={{ fontSize: "1.3rem" }}>Reviewed before publishing</h3>
            <p className="mt-2 text-sm" style={{ color: "rgba(31,20,34,0.72)", lineHeight: 1.6 }}>
              Every essay carries a byline, publication date, TL;DR, internal links, and at least one
              external citation. The Oracle Lover reads each piece before it ships.
            </p>
          </div>
          <div className="rounded-2xl p-7" style={{ background: "linear-gradient(135deg, rgba(242,179,61,0.10), rgba(242,179,61,0.02))", border: "1px solid rgba(242,179,61,0.25)" }}>
            <Sparkles size={28} style={{ color: "#F2B33D" }} />
            <h3 className="display-serif mt-3" style={{ fontSize: "1.3rem" }}>Picky affiliate links</h3>
            <p className="mt-2 text-sm" style={{ color: "rgba(31,20,34,0.72)", lineHeight: 1.6 }}>
              The Apothecary recommends only things our editor has personally used or vetted.
              We earn a small commission via Amazon Associates ({" "}
              <code style={{ fontFamily: "ui-monospace, monospace", fontSize: "0.85rem" }}>spankyspinola-20</code>
              {" "}). <Link href="/disclosures" style={{ color: "#F25C54", fontWeight: 600 }}>Disclosures</Link>.
            </p>
          </div>
        </div>

        <div className="prose-warm max-w-3xl mx-auto">
          <h2>Our editorial standard</h2>
          <p>
            Every essay on this site is reviewed by{" "}
            <Link href="/author/the-oracle-lover">The Oracle Lover</Link> before it ships. We never
            publish anonymously. Each piece carries a TL;DR, an author byline, a publication date,
            internal links to related essays, and at least one external citation to authoritative
            reporting or peer-reviewed research.
          </p>

          <blockquote>
            Single by design isn't a stop on the way to married. It's the destination, taken seriously,
            with all the rituals, finances, friendships, and creative time of any other shape of a life.
          </blockquote>

          <h2>What we don't do</h2>
          <ul>
            <li>We don't shame readers into "settling down."</li>
            <li>We don't write thinly disguised advertorials.</li>
            <li>We don't generate content without human review.</li>
          </ul>

          <h2>Get in touch</h2>
          <p>
            Editorial questions, story pitches, and accuracy corrections all go to our{" "}
            <Link href="/contact">contact page</Link>. We reply.
          </p>
        </div>

        <div className="mt-16 max-w-2xl mx-auto text-center">
          <Link href="/contact" className="btn-primary inline-flex">
            <Mail size={16} /> Send us a note
          </Link>
        </div>
      </section>
    </div>
  );
}
