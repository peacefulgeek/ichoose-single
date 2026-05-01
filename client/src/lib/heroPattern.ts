/**
 * Programmatic hero generator. Since the repo cannot ship any images,
 * each article card gets a deterministic SVG-based gradient hero generated
 * from its slug. This gives every card a unique-feeling visual without
 * adding a single binary asset to the repo.
 */
const PALETTES: Array<[string, string, string]> = [
  ["#FFE5E0", "#FFB7A8", "#E8604C"], // coral wash
  ["#E0F2F1", "#B7E0DD", "#2AA5A0"], // teal wash
  ["#FFF4E0", "#FFE0BC", "#F2A65A"], // amber
  ["#F1E5FF", "#D9BEFF", "#8E5DBF"], // violet
  ["#E5F0FF", "#BCD6FF", "#5D8EE0"], // soft blue
  ["#FFE9F0", "#FFB7CD", "#E04C7B"], // rose
  ["#F0F5E5", "#CDDFAA", "#7DA84A"], // sage
  ["#FAF1E0", "#E6D6B5", "#A98863"], // sand
];

const SHAPES = ["circles", "arcs", "stripes", "scallops", "blobs"] as const;

function hash(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = (h * 16777619) >>> 0;
  }
  return h;
}

function pickShape(slug: string): typeof SHAPES[number] {
  return SHAPES[hash(slug) % SHAPES.length];
}

export function pickPalette(slug: string): [string, string, string] {
  return PALETTES[hash(slug + "p") % PALETTES.length];
}

export function buildHeroSvg(slug: string, title: string): string {
  const [a, b, c] = pickPalette(slug);
  const shape = pickShape(slug);
  const seed = hash(slug);

  const shapesXml = (() => {
    if (shape === "circles") {
      const out: string[] = [];
      for (let i = 0; i < 5; i++) {
        const cx = 50 + ((seed >> (i * 4)) & 0xff) * 1.4;
        const cy = 50 + ((seed >> (i * 4 + 8)) & 0xff) * 1.0;
        const r = 30 + ((seed >> (i * 5)) & 0x3f) * 1.4;
        out.push(`<circle cx="${cx}" cy="${cy}" r="${r}" fill="${c}" opacity="${0.10 + (i * 0.04)}"/>`);
      }
      return out.join("");
    }
    if (shape === "arcs") {
      return `<path d="M0,300 Q200,100 500,250 T1000,200" fill="none" stroke="${c}" stroke-width="3" opacity="0.35"/>
              <path d="M0,400 Q300,200 600,350 T1000,300" fill="none" stroke="${c}" stroke-width="2" opacity="0.25"/>
              <circle cx="${500 + (seed % 200)}" cy="${300 + ((seed >> 8) % 150)}" r="120" fill="${c}" opacity="0.18"/>`;
    }
    if (shape === "stripes") {
      const out: string[] = [];
      for (let i = 0; i < 6; i++) {
        out.push(`<rect x="${-100 + i * 200}" y="0" width="80" height="600" fill="${c}" opacity="0.10" transform="rotate(${15 + i * 2} 500 300)"/>`);
      }
      return out.join("");
    }
    if (shape === "scallops") {
      const out: string[] = [];
      for (let row = 0; row < 4; row++) {
        for (let col = 0; col < 8; col++) {
          out.push(`<circle cx="${col * 130 + (row % 2 ? 60 : 0)}" cy="${row * 110 + 80}" r="42" fill="${c}" opacity="${0.06 + ((seed >> (col + row)) & 0x07) * 0.012}"/>`);
        }
      }
      return out.join("");
    }
    // blobs
    return `<ellipse cx="${200 + (seed % 200)}" cy="${200 + ((seed >> 8) % 100)}" rx="220" ry="160" fill="${c}" opacity="0.20"/>
            <ellipse cx="${700 + ((seed >> 16) % 200)}" cy="${380 + ((seed >> 24) % 100)}" rx="240" ry="180" fill="${c}" opacity="0.16"/>`;
  })();

  const initial = (title || "").trim().charAt(0).toUpperCase() || "S";

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 600" preserveAspectRatio="xMidYMid slice">
    <defs>
      <linearGradient id="g${seed.toString(16)}" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="${a}"/>
        <stop offset="100%" stop-color="${b}"/>
      </linearGradient>
    </defs>
    <rect width="1000" height="600" fill="url(#g${seed.toString(16)})"/>
    ${shapesXml}
    <text x="60" y="540" font-family="Manrope, system-ui, sans-serif" font-size="180" font-weight="800" fill="${c}" opacity="0.18">${initial}</text>
  </svg>`;
}

export function heroDataUrl(slug: string, title: string): string {
  const svg = buildHeroSvg(slug, title);
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}
