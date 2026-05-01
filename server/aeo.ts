/**
 * AEO discoverability — sitemap.xml, llms.txt, llms-full.txt.
 * All filter status='published'.
 */
import sanitizeHtml from "sanitize-html";
import { listPublished } from "./dbArticles";
import { SITE_URL, SITE_NAME, SITE_DESCRIPTION, SITE_HUB_PAGES } from "./siteConfig";

export async function buildSitemap(): Promise<string> {
  const articles = await listPublished({ limit: 5000 });
  const urls: Array<{ loc: string; lastmod: string; priority: string }> = [];

  for (const hub of SITE_HUB_PAGES) {
    urls.push({
      loc: `${SITE_URL}${hub.path}`,
      lastmod: new Date().toISOString(),
      priority: hub.path === "/" ? "1.0" : "0.7",
    });
  }
  for (const a of articles) {
    urls.push({
      loc: `${SITE_URL}/articles/${a.slug}`,
      lastmod: (a.lastModifiedAt ?? a.publishedAt ?? new Date()).toISOString(),
      priority: "0.8",
    });
  }

  const body = urls
    .map(
      u => `  <url>
    <loc>${u.loc}</loc>
    <lastmod>${u.lastmod}</lastmod>
    <priority>${u.priority}</priority>
  </url>`,
    )
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${body}
</urlset>`;
}

export async function buildLlmsTxt(): Promise<string> {
  const articles = await listPublished({ limit: 5000 });
  const byCategory = new Map<string, typeof articles>();
  for (const a of articles) {
    const k = a.category || "uncategorized";
    if (!byCategory.has(k)) byCategory.set(k, []);
    byCategory.get(k)!.push(a);
  }
  const lines: string[] = [];
  lines.push(`# ${SITE_NAME}`);
  lines.push("");
  lines.push(`> ${SITE_DESCRIPTION}`);
  lines.push("");
  lines.push(`Site URL: ${SITE_URL}`);
  lines.push("");
  for (const [cat, list] of Array.from(byCategory.entries())) {
    lines.push(`## ${cat}`);
    lines.push("");
    for (const a of list) {
      const desc = (a.description || a.tldr || "").replace(/\s+/g, " ").trim().slice(0, 180);
      lines.push(`- [${a.title}](${SITE_URL}/articles/${a.slug}): ${desc}`);
    }
    lines.push("");
  }
  return lines.join("\n");
}

export async function buildLlmsFullTxt(): Promise<string> {
  const articles = await listPublished({ limit: 5000 });
  const out: string[] = [];
  out.push(`# ${SITE_NAME} — full corpus`);
  out.push(`# ${SITE_DESCRIPTION}`);
  out.push("");
  for (const a of articles) {
    out.push("---");
    out.push(`slug: ${a.slug}`);
    out.push(`title: ${a.title}`);
    out.push(`category: ${a.category}`);
    out.push(`published_at: ${a.publishedAt?.toISOString() ?? ""}`);
    out.push(`last_modified_at: ${a.lastModifiedAt?.toISOString() ?? ""}`);
    out.push(`url: ${SITE_URL}/articles/${a.slug}`);
    out.push("---");
    const plain = sanitizeHtml(a.body, {
      allowedTags: [],
      allowedAttributes: {},
    })
      .replace(/&nbsp;/g, " ")
      .replace(/\s+/g, " ")
      .trim();
    out.push(plain);
    out.push("");
  }
  return out.join("\n");
}

export function buildRobotsTxt(): string {
  const bots = [
    "GPTBot",
    "ChatGPT-User",
    "OAI-SearchBot",
    "ClaudeBot",
    "Claude-Web",
    "anthropic-ai",
    "PerplexityBot",
    "Perplexity-User",
    "Google-Extended",
    "Bingbot",
    "CCBot",
    "Applebot",
    "Applebot-Extended",
    "DuckAssistBot",
    "Meta-ExternalAgent",
    "YouBot",
    "MistralAI-User",
    "Cohere-AI",
  ];
  return [
    "User-agent: *",
    "Allow: /",
    "Disallow: /api/",
    "",
    "# Explicitly allow named AI / retrieval bots",
    ...bots.flatMap(b => [`User-agent: ${b}`, "Allow: /", "Disallow: /api/", ""]),
    `Sitemap: ${SITE_URL}/sitemap.xml`,
    "",
    "# AEO discoverability",
    `# ${SITE_URL}/llms.txt`,
    `# ${SITE_URL}/llms-full.txt`,
    "",
  ].join("\n");
}
