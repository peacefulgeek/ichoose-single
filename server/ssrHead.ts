/**
 * SSR head injection.
 *
 * Strategy: register a dedicated SSR handler that takes ownership of the
 * HTML response for a fixed set of routes (root, /articles/[slug], static
 * hub pages). The handler reads the index.html template, runs it through
 * Vite's transformIndexHtml in dev (or through a no-op in prod), then
 * injects route-specific <title>, <meta>, canonical, OG/Twitter, and
 * JSON-LD blocks BEFORE the React shell is sent.
 *
 * This pattern is per master scope §13: head data must be present in the
 * raw HTML, not bolted on with a client-side useEffect.
 */
import express, { Request, Response, NextFunction, Express } from "express";
import fs from "node:fs";
import path from "node:path";
import type { ViteDevServer } from "vite";
import { getBySlug, listPublished } from "./dbArticles";
import {
  SITE_URL,
  SITE_NAME,
  SITE_DESCRIPTION,
  ROBOTS_META,
  AUTHOR_NAME,
  BUNNY_PULL_ZONE,
  BUNNY_FONT_CSS_URL,
} from "./siteConfig";

// Resolve relative to the project root rather than the source file location,
// because tsx-watch sometimes invokes module URLs from a parent directory.
const PROJECT_ROOT = process.cwd();
const CLIENT_TEMPLATE = path.resolve(PROJECT_ROOT, "client", "index.html");
const DIST_TEMPLATE = path.resolve(PROJECT_ROOT, "dist", "public", "index.html");

function buildFaqSchemaFromHtml(html: string, pageUrl: string): Record<string, unknown>[] {
  // Pull <h2> and <h3> headings that look like questions, then take the
  // following <p> as the answer. Outputs a FAQPage schema block when there
  // are at least 2 question/answer pairs.
  const re = /<h([23])[^>]*>([^<]*\?)\s*<\/h\1>\s*<p[^>]*>([\s\S]*?)<\/p>/gi;
  const items: { q: string; a: string }[] = [];
  let m: RegExpExecArray | null;
  while ((m = re.exec(html)) && items.length < 12) {
    const q = m[2].replace(/\s+/g, " ").trim();
    const a = m[3].replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
    if (q.length > 8 && a.length > 30) items.push({ q, a });
  }
  if (items.length < 2) return [];
  return [
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      url: pageUrl,
      mainEntity: items.map(({ q, a }) => ({
        "@type": "Question",
        name: q,
        acceptedAnswer: { "@type": "Answer", text: a },
      })),
    },
  ];
}

interface HeadData {
  title: string;
  description: string;
  canonical: string;
  ogImage: string | null;
  jsonLd: Record<string, unknown>[];
  robots: string;
  author: string;
}

async function resolveHead(apex: string, urlPath: string): Promise<HeadData> {
  const cleanPath = urlPath === "/" ? "/" : urlPath.split("?")[0];
  const canonical = `https://${apex}${cleanPath}`;
  const robots = ROBOTS_META;
  const author = AUTHOR_NAME;

  // Article page
  const articleMatch = cleanPath.match(/^\/articles\/([a-z0-9\-]+)\/?$/i);
  if (articleMatch) {
    const slug = articleMatch[1];
    try {
      const a = await getBySlug(slug);
      if (a) {
        return {
          title: `${a.title} | ${SITE_NAME}`,
          description: (a.description || a.tldr || "").slice(0, 200),
          canonical,
          ogImage: a.heroUrl,
          robots,
          author,
          jsonLd: [
            {
              "@context": "https://schema.org",
              "@type": "Article",
              headline: a.title,
              description: a.description || a.tldr,
              datePublished: a.publishedAt?.toISOString(),
              dateModified: (a.lastModifiedAt || a.publishedAt)?.toISOString(),
              author: {
                "@type": "Person",
                name: AUTHOR_NAME,
                url: `${SITE_URL}/author/the-oracle-lover`,
              },
              publisher: {
                "@type": "Organization",
                name: SITE_NAME,
                url: SITE_URL,
                logo: {
                  "@type": "ImageObject",
                  url: `${SITE_URL}/favicon.svg`,
                },
              },
              mainEntityOfPage: { "@type": "WebPage", "@id": canonical },
              image: a.heroUrl ? [a.heroUrl] : undefined,
              keywords: a.tags?.join(", "),
              articleSection: a.category,
              wordCount: a.wordCount,
              reviewedBy: {
                "@type": "Person",
                name: AUTHOR_NAME,
                url: `${SITE_URL}/author/the-oracle-lover`,
              },
            },
            ...buildFaqSchemaFromHtml(a.body || "", canonical),
            {
              "@context": "https://schema.org",
              "@type": "BreadcrumbList",
              itemListElement: [
                { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
                {
                  "@type": "ListItem",
                  position: 2,
                  name: "Articles",
                  item: `${SITE_URL}/articles`,
                },
                { "@type": "ListItem", position: 3, name: a.title, item: canonical },
              ],
            },
          ],
        };
      }
    } catch {
      /* fall through to default */
    }
  }

  // Assessment detail page (/assessments/:slug) -> Quiz schema
  const assessmentMatch = cleanPath.match(/^\/assessments\/([a-z0-9\-]+)\/?$/i);
  if (assessmentMatch) {
    const slug = assessmentMatch[1];
    return {
      title: `Self-assessment | ${SITE_NAME}`,
      description: `A gentle five-to-seven-minute self-assessment from ${SITE_NAME}, written for the designed solo life.`,
      canonical,
      ogImage: null,
      robots,
      author,
      jsonLd: [
        {
          "@context": "https://schema.org",
          "@type": "Quiz",
          name: slug.replace(/-/g, " "),
          url: canonical,
          isPartOf: { "@type": "WebSite", name: SITE_NAME, url: SITE_URL },
          author: { "@type": "Person", name: AUTHOR_NAME, url: `${SITE_URL}/author/the-oracle-lover` },
        },
      ],
    };
  }

  // Author page
  if (/^\/author\/the-oracle-lover\/?$/i.test(cleanPath)) {
    return {
      title: `${AUTHOR_NAME} | ${SITE_NAME}`,
      description: `Author page for ${AUTHOR_NAME}, who reviews and writes essays on intentional singlehood for ${SITE_NAME}.`,
      canonical,
      ogImage: null,
      robots,
      author,
      jsonLd: [
        {
          "@context": "https://schema.org",
          "@type": "Person",
          name: AUTHOR_NAME,
          url: canonical,
          jobTitle: "Editor and reviewer",
          worksFor: { "@type": "Organization", name: SITE_NAME, url: SITE_URL },
        },
      ],
    };
  }

  // Static hub pages
  const hubTitles: Record<string, string> = {
    "/": SITE_NAME,
    "/articles": `All articles | ${SITE_NAME}`,
    "/about": `About | ${SITE_NAME}`,
    "/disclosures": `Affiliate disclosures | ${SITE_NAME}`,
    "/privacy": `Privacy policy | ${SITE_NAME}`,
    "/contact": `Contact | ${SITE_NAME}`,
    "/search": `Search | ${SITE_NAME}`,
    "/saved": `Saved | ${SITE_NAME}`,
    "/assessments": `Self-assessments | ${SITE_NAME}`,
    "/apothecary": `The Apothecary | ${SITE_NAME}`,
  };
  const title = hubTitles[cleanPath] || SITE_NAME;
  const description = SITE_DESCRIPTION;

  // Home: WebSite + Organization + ItemList of latest articles
  let jsonLd: Record<string, unknown>[] = [
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: SITE_NAME,
      url: SITE_URL,
      description: SITE_DESCRIPTION,
      inLanguage: "en",
      publisher: {
        "@type": "Organization",
        name: SITE_NAME,
        url: SITE_URL,
        logo: { "@type": "ImageObject", url: `${SITE_URL}/favicon.svg` },
      },
      potentialAction: {
        "@type": "SearchAction",
        target: {
          "@type": "EntryPoint",
          urlTemplate: `${SITE_URL}/search?q={search_term_string}`,
        },
        "query-input": "required name=search_term_string",
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      name: SITE_NAME,
      url: SITE_URL,
      logo: { "@type": "ImageObject", url: `${SITE_URL}/favicon.svg` },
    },
  ];

  // Per-page schema types for static hub pages
  const staticTypeMap: Record<string, string> = {
    "/about": "AboutPage",
    "/disclosures": "WebPage",
    "/privacy": "WebPage",
    "/contact": "ContactPage",
    "/search": "SearchResultsPage",
    "/saved": "CollectionPage",
    "/articles": "CollectionPage",
    "/assessments": "CollectionPage",
    "/apothecary": "CollectionPage",
  };
  if (staticTypeMap[cleanPath]) {
    jsonLd.push({
      "@context": "https://schema.org",
      "@type": staticTypeMap[cleanPath],
      name: hubTitles[cleanPath],
      url: canonical,
      isPartOf: { "@type": "WebSite", name: SITE_NAME, url: SITE_URL },
      breadcrumb: {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
          { "@type": "ListItem", position: 2, name: hubTitles[cleanPath], item: canonical },
        ],
      },
    });
  }

  if (cleanPath === "/") {
    try {
      const recent = await listPublished({ limit: 12 });
      jsonLd.push({
        "@context": "https://schema.org",
        "@type": "ItemList",
        name: `Latest essays on ${SITE_NAME}`,
        itemListElement: recent.map((a, i) => ({
          "@type": "ListItem",
          position: i + 1,
          url: `${SITE_URL}/articles/${a.slug}`,
          name: a.title,
        })),
      });
    } catch {
      /* ignore — non-fatal */
    }
  }

  return {
    title,
    description,
    canonical,
    ogImage: null,
    robots,
    author,
    jsonLd,
  };
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function buildHeadHtml(h: HeadData): string {
  const og = `
    <meta property="og:title" content="${escapeHtml(h.title)}" />
    <meta property="og:description" content="${escapeHtml(h.description)}" />
    <meta property="og:url" content="${h.canonical}" />
    <meta property="og:type" content="${h.jsonLd[0]?.["@type"] === "Article" ? "article" : "website"}" />
    <meta property="og:site_name" content="${SITE_NAME}" />
    ${h.ogImage ? `<meta property="og:image" content="${h.ogImage}" />` : ""}
    <meta name="twitter:card" content="${h.ogImage ? "summary_large_image" : "summary"}" />
    <meta name="twitter:title" content="${escapeHtml(h.title)}" />
    <meta name="twitter:description" content="${escapeHtml(h.description)}" />
    ${h.ogImage ? `<meta name="twitter:image" content="${h.ogImage}" />` : ""}
  `;
  const ldBlocks = h.jsonLd
    .map(
      block =>
        `<script type="application/ld+json">${JSON.stringify(block).replace(/</g, "\\u003c")}</script>`,
    )
    .join("\n    ");

  return `<title>${escapeHtml(h.title)}</title>
    <meta name="description" content="${escapeHtml(h.description)}" />
    <meta name="robots" content="${h.robots}" />
    <meta name="author" content="${escapeHtml(h.author)}" />
    <link rel="canonical" href="${h.canonical}" />
    <link rel="preconnect" href="${BUNNY_PULL_ZONE}" crossorigin />
    <link rel="stylesheet" href="${BUNNY_FONT_CSS_URL}" />
    ${og}
    ${ldBlocks}`;
}

function isSsrPath(p: string): boolean {
  if (p === "/") return true;
  if (/^\/(articles|assessments|apothecary|about|author|disclosures|privacy|contact|search|saved)(\/|$)/i.test(p)) {
    return true;
  }
  return false;
}

/**
 * Register SSR routes that own the HTML response for known paths.
 * Must be registered BEFORE Vite's middleware so we get to handle the
 * top-level navigation requests ourselves.
 */
export function registerSsrRoutes(app: Express, opts: { apex: string; vite?: ViteDevServer }) {
  const { apex, vite } = opts;
  const isDev = process.env.NODE_ENV !== "production";

  async function readTemplate(): Promise<string> {
    const file = isDev ? CLIENT_TEMPLATE : DIST_TEMPLATE;
    return fs.promises.readFile(file, "utf8");
  }

  async function ssrHandler(req: Request, res: Response, next: NextFunction) {
    if (req.method !== "GET") return next();
    if (!isSsrPath(req.path)) return next();
    if (req.path.startsWith("/api/")) return next();
    if (/\.(?:js|mjs|css|png|jpg|jpeg|webp|svg|ico|woff2?|map|json|xml|txt)$/i.test(req.path)) {
      return next();
    }
    const accept = req.headers.accept || "";
    if (!accept.includes("text/html") && accept !== "*/*" && accept !== "") return next();

    try {
      let template = await readTemplate();
      if (isDev && vite) {
        template = await vite.transformIndexHtml(req.originalUrl, template);
      }
      const headData = await resolveHead(apex, req.path);
      const headHtml = buildHeadHtml(headData);

      // Place injected head immediately after <meta name="theme-color" ...>
      // so it overrides every default that follows.
      const out = template.replace(
        /<!-- SSR_HEAD[^>]*-->/i,
        `<!-- ssr-head-injected -->\n    ${headHtml}\n    <!-- end ssr-head-injected -->`,
      );

      res.status(200).set({ "Content-Type": "text/html; charset=utf-8" }).end(out);
    } catch (e: any) {
      if (vite) vite.ssrFixStacktrace(e);
      next(e);
    }
  }

  app.use(ssrHandler);
}
