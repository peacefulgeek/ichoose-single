export default function Privacy() {
  return (
    <div className="container py-12 max-w-3xl">
      <h1 className="text-3xl md:text-5xl font-extrabold" style={{ color: "#2B2B2B" }}>Privacy policy</h1>
      <div className="prose-warm mt-6">
        <p>
          Single by Design respects your privacy. We collect the minimum amount of data needed to serve essays and improve them over time.
        </p>
        <h2>What we collect</h2>
        <ul>
          <li>Anonymized usage statistics (page views, referrers, country) via privacy-friendly analytics that don't track individuals across sites.</li>
          <li>Standard server logs (IP address, user agent, request path) retained for 30 days for security and debugging.</li>
          <li>Email addresses you voluntarily submit through the contact form.</li>
        </ul>
        <h2>What we do not do</h2>
        <ul>
          <li>We do not sell, rent, or trade your data.</li>
          <li>We do not use third-party advertising trackers.</li>
          <li>We do not embed social-media tracking pixels.</li>
        </ul>
        <h2>Cookies</h2>
        <p>
          We use a single first-party cookie for authenticated sessions when you sign in. We do not set cross-site tracking cookies.
        </p>
        <h2>Your rights</h2>
        <p>
          You can request deletion of any data we hold about you by writing to us through the contact page. We respond within 14 days.
        </p>
      </div>
    </div>
  );
}
