export default function Disclosures() {
  return (
    <div className="container py-12 max-w-3xl">
      <h1 className="text-3xl md:text-5xl font-extrabold" style={{ color: "#2B2B2B" }}>Affiliate disclosures</h1>
      <div className="prose-warm mt-6">
        <p>
          Single by Design is a participant in the Amazon Services LLC Associates Program, an affiliate advertising program designed
          to provide a means for sites to earn advertising fees by advertising and linking to Amazon.com. Our Amazon associate tag is
          <strong> spankyspinola-20</strong>.
        </p>
        <h2>How we choose products</h2>
        <p>
          The products we link to are ones our editor, The Oracle Lover, has personally used or has researched against multiple
          independent reviews. We don't accept paid placements, sponsored articles, or "review for review" trades.
        </p>
        <h2>What that means for you</h2>
        <p>
          When you click an Amazon link on Single by Design and buy something, we may earn a small commission at no extra cost to you.
          That commission is what keeps the site running, the essays free, and the editorial calendar honest.
        </p>
        <h2>What it doesn't mean</h2>
        <p>
          It doesn't change which products we recommend. We won't link to a product we wouldn't recommend to a friend. If a product
          gets discontinued, recalled, or quietly worse, we update the essay or pull the link.
        </p>
      </div>
    </div>
  );
}
