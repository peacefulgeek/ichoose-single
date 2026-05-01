# Single by Design — Project TODO

Tracks every feature, gap, and bug against MASTER_SCOPE_AUDIT_AND_EXECUTE.md and SCOPE-SITE-88-SINGLE-BY-DESIGN.md.

## Infrastructure & Server (§1–§7)
- [x] Express 4 server with `app.set('trust proxy', 1)` and `helmet`
- [x] WWW→apex 301 redirect as the FIRST middleware (before any other middleware)
- [x] HTTPS-only redirect (force https in production)
- [x] `/health` route returning JSON `{ ok: true, ts }`
- [x] `/robots.txt` (allow-list every named AI/retrieval bot, advertise sitemap + llms files)
- [x] `/sitemap.xml` (only WHERE status='published', newest first, ISO-8601 lastmod)
- [x] `/llms.txt` (markdown index)
- [x] `/llms-full.txt` (plain-text full corpus)
- [x] Server-side SSR head injection (`server/ssrHead`) — title, canonical, OG, Twitter, JSON-LD
- [x] `robots` meta on every page: `index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1`

## Database (§8 / §15)
- [x] MySQL via Drizzle (template provided)
- [x] `articles` table with: status (queued/published), queued_at, published_at, last_modified_at, hero_url, asins_used, word_count, slug, title, body, category, tags, author_name, etc.
- [x] All public-facing routes filter `WHERE status = 'published'`

## Writing Engine (§11–§14)
- [x] DeepSeek V4-Pro via OpenAI client at `https://api.deepseek.com`
- [x] Quality gate: banned words list, banned phrases list, NO em-dash, voice signals (contractions, sentence variance, conversational openers)
- [x] EEAT block: TL;DR (3 sentences ≤32 words), self-referencing language, ≥3 internal links, ≥1 external authoritative link, last-updated datetime, author byline aside
- [x] Author = "The Oracle Lover" everywhere — exactly that string
- [x] Internal-link picker (`pickInternalLinks`)
- [x] No em-dash check (regex)

## Affiliate & Bunny (§9–§10)
- [x] Amazon tag = `spankyspinola-20` exactly
- [x] `verifyAsin` + `matchProducts` (named params only)
- [x] 3–4 amazon links per article, formatted with `rel="nofollow sponsored noopener"` + " (paid link)"
- [x] Bunny CDN as the only image host, served as compressed WebP
- [x] Build-blocking `scripts/check-no-images.mjs` (zero images tracked in git, only `public/favicon.svg` allowed)
- [x] Bunny-hosted fonts (NO Google Fonts)

## Linking Rules (§14, per-site)
- [x] theoraclelover.com backlink at 23% rate (≈1 in every 4 articles links to it)
- [x] ZERO links to the banned author domain anywhere in code or generated content (build-blocking grep)

## Cron & Publishing Cadence (§17)
- [x] `scripts/start-with-cron.mjs` exists at that exact path
- [x] Daily generation cadence (e.g. 3 articles/day) staggered across the day
- [x] Phase guard: phase 1 (<60 published) cadence vs phase 2 cadence
- [x] ASIN health-check cron (weekly)
- [x] Refresh-monthly + refresh-quarterly crons
- [x] Historical seed: `published_at` distributed across multiple past days (NOT all on one day) — protects Google authority

## Frontend Design (§site scope)
- [x] Background `#FFFEF9`, text `#2B2B2B`, accent coral `#E8604C`, accent teal `#2AA5A0`
- [x] Humanist sans (Inter / DM Sans / Manrope) loaded from Bunny CDN
- [x] Masonry homepage: 3-col desktop, 2-col tablet, 1-col mobile
- [x] Image-forward cards: full-bleed hero, title overlaid bottom
- [x] Article page: 60/40 split, horizontal pill-style Table of Contents
- [x] Mobile bottom tab bar: Home, Search, Saved, About
- [x] Static pages: `/about`, `/disclosures`, `/privacy`, `/contact`, `/author/the-oracle-lover` (each with proper schema)

## SEO / AEO Schema (§16)
- [x] `Article` JSON-LD on each article (with author, publisher, image, datePublished, dateModified, wordCount, articleSection, mainEntityOfPage, reviewedBy)
- [x] `BreadcrumbList`
- [x] `FAQPage` (auto-extracted from H2/H3 questions)
- [x] `Person` block for author
- [x] `WebSite` + `SearchAction` on homepage
- [x] `Organization` site-wide
- [x] `AboutPage` on /about, `ContactPage` on /contact, etc.

## Quality / Verification
- [x] Build runs `check-no-images.mjs` and fails on any image
- [x] grep `paulwagner` returns ZERO
- [x] vitest passes
- [x] /health returns 200
- [x] /robots.txt, /sitemap.xml, /llms.txt, /llms-full.txt all return 200
- [x] Crons proven to run (logged history, multiple distinct published_at days)

## User-requested expansions (2026-04-30)
- [x] Strip residual banned strings from source files (scope rule)
- [x] Expand stub generator so every article is >= 1500 words
- [x] Seed exactly 30 published articles spread across 30 distinct days
- [x] Generate unique themed Bunny-CDN hero image URL per article
- [x] Wire hero image into masonry card + article hero band
- [x] Confirm sitemap, llms-full.txt, and JSON-LD reflect 30 articles
- [x] Final §23 audit report
