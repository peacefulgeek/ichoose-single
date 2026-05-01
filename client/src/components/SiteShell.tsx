import { Link, useLocation } from "wouter";
import { ReactNode } from "react";
import { Home, Search, Bookmark, User } from "lucide-react";

const NAV = [
  { href: "/", label: "Home" },
  { href: "/articles", label: "Essays" },
  { href: "/assessments", label: "Assessments" },
  { href: "/apothecary", label: "Apothecary" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

function Brand({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  const fs = size === "lg" ? "1.7rem" : size === "sm" ? "1.15rem" : "1.4rem";
  return (
    <span className="brand" style={{ fontSize: fs, lineHeight: 1 }}>
      I Choose <span className="accent">Single</span>
    </span>
  );
}

export default function SiteShell({ children }: { children: ReactNode }) {
  const [path] = useLocation();
  const isActive = (h: string) => path === h || (h !== "/" && path.startsWith(h));

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: "#FBF7EE" }}>
      <header className="site-header">
        <div className="container flex items-center justify-between py-4">
          <Link href="/"><Brand /></Link>
          <nav className="nav hidden md:flex items-center gap-0.5">
            {NAV.map(item => (
              <Link
                key={item.href}
                href={item.href}
                style={{
                  background: isActive(item.href) ? "#2A0F33" : undefined,
                  color: isActive(item.href) ? "#FBF7EE" : "#2A0F33",
                }}
              >
                {item.label}
              </Link>
            ))}
            <Link href="/search" style={{ color: "#2A0F33" }} aria-label="Search">
              <Search size={18} strokeWidth={2.2} />
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex-1">{children}</main>

      <footer className="footer">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <Link href="/"><Brand size="lg" /></Link>
              <p className="mt-3 text-sm" style={{ color: "rgba(251,247,238,0.78)", maxWidth: "28rem", lineHeight: 1.6 }}>
                Vibrant editorial essays on intentional singlehood, solo living, and self-partnering.
                Written by The Oracle Lover for anyone choosing their own life on purpose.
              </p>
              <div className="mt-5 flex gap-3">
                <Link href="/articles" className="btn-primary" style={{ padding: "0.6rem 1.1rem", fontSize: "0.92rem" }}>
                  Browse all essays
                </Link>
              </div>
            </div>
            <div className="text-sm">
              <h4>Read</h4>
              <ul className="space-y-2">
                <li><Link href="/articles">All essays</Link></li>
                <li><Link href="/assessments">Self-assessments</Link></li>
                <li><Link href="/apothecary">The Apothecary</Link></li>
                <li><Link href="/author/the-oracle-lover">The Oracle Lover</Link></li>
                <li><Link href="/search">Search</Link></li>
              </ul>
            </div>
            <div className="text-sm">
              <h4>Site</h4>
              <ul className="space-y-2">
                <li><Link href="/about">About</Link></li>
                <li><Link href="/contact">Contact</Link></li>
                <li><Link href="/disclosures">Affiliate disclosures</Link></li>
                <li><Link href="/privacy">Privacy</Link></li>
              </ul>
            </div>
          </div>
          <div className="mt-10 pt-6 text-xs" style={{ borderTop: "1px solid rgba(251,247,238,0.14)", color: "rgba(251,247,238,0.62)" }}>
            © {new Date().getFullYear()} I Choose Single , every essay reviewed by The Oracle Lover.
            We participate in the Amazon Associates program; product links may earn a small commission.
          </div>
        </div>
      </footer>

      <nav className="mobile-tabs" aria-label="Bottom navigation">
        <Link href="/" className={path === "/" ? "active" : ""}>
          <Home strokeWidth={2} />
          <span>Home</span>
        </Link>
        <Link href="/articles" className={isActive("/articles") ? "active" : ""}>
          <Search strokeWidth={2} />
          <span>Essays</span>
        </Link>
        <Link href="/assessments" className={isActive("/assessments") ? "active" : ""}>
          <Bookmark strokeWidth={2} />
          <span>Quizzes</span>
        </Link>
        <Link href="/about" className={isActive("/about") ? "active" : ""}>
          <User strokeWidth={2} />
          <span>About</span>
        </Link>
      </nav>
    </div>
  );
}
