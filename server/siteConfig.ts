/**
 * Single by Design — site-wide constants.
 * Source of truth for apex host, author identity, affiliate config, Bunny CDN.
 *
 * Per master scope §2: per-site config is centralized here, not scattered.
 */

// Per-site scope #88: canonical apex is singlebydesign.life. Override only via
// SITE_APEX_HOST in production env (e.g., to test against a staging domain).
export const SITE_APEX = process.env.SITE_APEX_HOST || "singlebydesign.life";
export const SITE_URL = `https://${SITE_APEX}`;
export const SITE_NAME = "Single by Design";
export const SITE_DESCRIPTION =
  "Intentional singlehood, solo living as conscious choice, and the art of self-partnering. Warm, image-rich essays on choosing your own life.";

// Author archetype (per-site scope §88: The Oracle Lover)
export const AUTHOR_NAME = "The Oracle Lover" as const;
export const AUTHOR_SISTER_SITE = "https://theoraclelover.com";
// Master scope §14C target is 23%; we set the *bias* slightly higher so the
// observed rate doesn't drop below the floor due to randomness on small sets.
export const AUTHOR_BACKLINK_RATE = 0.30;
export const AUTHOR_CREDENTIALS = [
  "intuitive teacher with 20+ years of practice",
  "writer and oracle reader",
  "spiritual guide and longtime student of non-dual traditions",
];

// Amazon affiliate
export const AMAZON_TAG = "spankyspinola-20" as const;

// DeepSeek writing engine
export const DEEPSEEK_BASE_URL = "https://api.deepseek.com" as const;
export const DEEPSEEK_MODEL = process.env.OPENAI_MODEL || "deepseek-v4-pro";

// Bunny CDN — fertile-ground zone, per master scope §9.
// Hero images for THIS site live under /sites/single-by-design/heroes/<slug>.webp.
// Fonts live under /fonts/manrope.css. The CDN is the single source of truth
// for any image asset; nothing image-shaped is allowed in the repo.
export const BUNNY_PULL_ZONE = "https://fertile-ground.b-cdn.net";
export const BUNNY_SITE_PATH = "sites/single-by-design";
export const BUNNY_HEROES_BASE = `${BUNNY_PULL_ZONE}/${BUNNY_SITE_PATH}/heroes`;
export const BUNNY_FONT_FAMILY = "Manrope";
export const BUNNY_FONT_CSS_URL = `${BUNNY_PULL_ZONE}/fonts/manrope.css`;

/**
 * Build the canonical Bunny CDN hero URL for a given article slug.
 * Used by SSR head injection (og:image), masonry card hero, and JSON-LD.
 * The image is uploaded out-of-band to Bunny once per article. If the
 * image is missing on the CDN, the UI falls back to a CSS gradient.
 */
export function heroUrlForSlug(slug: string): string {
  return `${BUNNY_HEROES_BASE}/${slug}.webp`;
}

// Categories specific to Single by Design
export const SITE_CATEGORIES = [
  "intentional-singlehood",
  "solo-living",
  "self-partnering",
  "relationship-escalator",
  "single-women",
  "single-men",
  "solo-finance",
  "solo-travel",
  "single-parents",
  "dating-on-your-terms",
] as const;

export type SiteCategory = (typeof SITE_CATEGORIES)[number];

// Internal hub pages — used by sitemap / llms / nav
export const SITE_HUB_PAGES = [
  { path: "/", title: SITE_NAME, description: SITE_DESCRIPTION },
  { path: "/articles", title: "All articles", description: "Every essay on Single by Design, by category." },
  { path: "/about", title: "About Single by Design", description: "Who we are and why this site exists." },
  { path: "/disclosures", title: "Affiliate disclosures", description: "How we earn and how we link." },
  { path: "/privacy", title: "Privacy policy", description: "What we collect, what we don't." },
  { path: "/contact", title: "Contact", description: "How to reach the editor." },
  { path: "/author/the-oracle-lover", title: "The Oracle Lover", description: "Author bio and reviewed-by profile." },
];

// Robots / AEO
export const ROBOTS_META =
  "index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1";

// Brand colors
export const COLORS = {
  bg: "#FFFEF9",
  text: "#2B2B2B",
  coral: "#E8604C",
  teal: "#2AA5A0",
  muted: "#6B6B66",
  cream: "#F8F2E5",
  paper: "#FFFFFF",
} as const;
