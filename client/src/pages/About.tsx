import { Link } from "wouter";

export default function About() {
  return (
    <div className="container py-12 max-w-3xl">
      <h1 className="text-3xl md:text-5xl font-extrabold" style={{ color: "#2B2B2B" }}>About Single by Design</h1>
      <div className="prose-warm mt-6">
        <p>
          Single by Design is a magazine of warm, quietly opinionated essays for people who are choosing single life on purpose.
          We don't think of singlehood as a holding pattern. We treat it as a real shape of a life: a daily practice with rituals,
          finances, friendships, and creative time of its own.
        </p>
        <h2>Our editorial standard</h2>
        <p>
          Every essay on this site is reviewed by <Link href="/author/the-oracle-lover">The Oracle Lover</Link> before it ships.
          We never publish anonymously. Each piece carries a TL;DR, an author byline, a publication date, internal links to related
          essays, and at least one external citation to authoritative reporting or peer-reviewed research.
        </p>
        <p>
          We participate in the Amazon Associates program. The few products we recommend are ones our editor has personally used
          or vetted. <Link href="/disclosures">Read our full affiliate disclosure</Link>.
        </p>
        <h2>What we don't do</h2>
        <ul>
          <li>We don't shame readers into "settling down."</li>
          <li>We don't write thinly disguised advertorials.</li>
          <li>We don't generate content without human review.</li>
        </ul>
        <h2>Get in touch</h2>
        <p>
          Editorial questions, story pitches, and accuracy corrections all go to our <Link href="/contact">contact page</Link>. We
          reply.
        </p>
      </div>
    </div>
  );
}
