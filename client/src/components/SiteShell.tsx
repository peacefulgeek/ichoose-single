import { Link, useLocation } from "wouter";
import { ReactNode } from "react";
import { Home, Search, Bookmark, User } from "lucide-react";

const NAV = [
  { href: "/", label: "Home" },
  { href: "/articles", label: "Articles" },
  { href: "/assessments", label: "Assessments" },
  { href: "/apothecary", label: "Apothecary" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export default function SiteShell({ children }: { children: ReactNode }) {
  const [path] = useLocation();
  const isActive = (h: string) => path === h || (h !== "/" && path.startsWith(h));

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: "#FFFEF9" }}>
      <header className="site-header">
        <div className="container flex items-center justify-between py-3">
          <Link href="/" className="brand">
            I Choose Single<span className="dot">.</span>
          </Link>
          <nav className="nav hidden md:flex items-center gap-1">
            {NAV.map(item => (
              <Link
                key={item.href}
                href={item.href}
                style={{ color: isActive(item.href) ? "#E8604C" : "#2B2B2B" }}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </header>

      <main className="flex-1">{children}</main>

      <footer className="footer">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <div className="brand text-lg font-extrabold" style={{ color: "#2B2B2B" }}>
                I Choose Single<span style={{ color: "#E8604C" }}>.</span>
              </div>
              <p className="mt-2 text-sm" style={{ color: "#6B6B66" }}>
                Warm essays on intentional singlehood, solo living, and self-partnering.
              </p>
            </div>
            <div className="text-sm">
              <div className="font-semibold mb-2" style={{ color: "#2B2B2B" }}>Read</div>
              <ul className="space-y-1.5">
                <li><Link href="/articles" style={{ color: "#6B6B66" }}>All articles</Link></li>
                <li><Link href="/assessments" style={{ color: "#6B6B66" }}>Self-assessments</Link></li>
                <li><Link href="/apothecary" style={{ color: "#6B6B66" }}>The Apothecary</Link></li>
                <li><Link href="/author/the-oracle-lover" style={{ color: "#6B6B66" }}>The Oracle Lover</Link></li>
                <li><Link href="/search" style={{ color: "#6B6B66" }}>Search</Link></li>
              </ul>
            </div>
            <div className="text-sm">
              <div className="font-semibold mb-2" style={{ color: "#2B2B2B" }}>Site</div>
              <ul className="space-y-1.5">
                <li><Link href="/about" style={{ color: "#6B6B66" }}>About</Link></li>
                <li><Link href="/disclosures" style={{ color: "#6B6B66" }}>Affiliate disclosures</Link></li>
                <li><Link href="/privacy" style={{ color: "#6B6B66" }}>Privacy</Link></li>
                <li><Link href="/contact" style={{ color: "#6B6B66" }}>Contact</Link></li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-6 border-t text-xs" style={{ borderColor: "rgba(43,43,43,0.10)", color: "#6B6B66" }}>
            © {new Date().getFullYear()} I Choose Single. All essays reviewed by The Oracle Lover.
            We participate in the Amazon Associates program; product links may earn us a small commission.
          </div>
        </div>
      </footer>

      {/* Mobile bottom tab bar */}
      <nav className="mobile-tabs" aria-label="Bottom navigation">
        <Link href="/" className={isActive("/") && path === "/" ? "active" : ""}>
          <Home strokeWidth={2} />
          <span>Home</span>
        </Link>
        <Link href="/search" className={isActive("/search") ? "active" : ""}>
          <Search strokeWidth={2} />
          <span>Search</span>
        </Link>
        <Link href="/saved" className={isActive("/saved") ? "active" : ""}>
          <Bookmark strokeWidth={2} />
          <span>Saved</span>
        </Link>
        <Link href="/about" className={isActive("/about") ? "active" : ""}>
          <User strokeWidth={2} />
          <span>About</span>
        </Link>
      </nav>
    </div>
  );
}
