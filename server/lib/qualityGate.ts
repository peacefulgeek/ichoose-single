/**
 * Article quality gate. The union of every banned list in §12A — no item dropped.
 * Returns { passed, failures } per master scope §12B.
 */

// ─── Banned single words (any presence is a failure) ───────────────
export const BANNED_WORDS = [
  "delve",
  "navigate",
  "unleash",
  "unlock",
  "harness",
  "embark",
  "leverage",
  "utilize",
  "underscore",
  "showcase",
  "elevate",
  "empower",
  "myriad",
  "pivotal",
  "robust",
  "seamless",
  "facilitate",
  "synergy",
  "synergies",
  "ecosystem",
  "paradigm",
  "tapestry",
  "fabric",
  "realm",
  "landscape",
  "journey",
  "voyage",
  "endeavor",
  "endeavour",
  "venture",
  "expedition",
  "quest",
  "odyssey",
  "trailblaze",
  "trailblazer",
  "trailblazing",
  "pioneer",
  "propel",
  "spearhead",
  "orchestrate",
  "traverse",
  "furthermore",
  "moreover",
  "additionally",
  "consequently",
  "subsequently",
  "thereby",
];

// ─── Banned phrases ────────────────────────────────────────────────
export const BANNED_PHRASES = [
  "it's important to note",
  "it is important to note",
  "it's worth noting",
  "it is worth noting",
  "in conclusion,",
  "in summary,",
  "in the realm of",
  "dive deep into",
  "delve into",
  "at the end of the day",
  "in today's fast-paced world",
  "in today's digital age",
  "plays a crucial role",
  "a testament to",
  "when it comes to",
  "cannot be overstated",
  "needless to say",
  "first and foremost",
  "last but not least",
];

// ─── Forbidden URLs ────────────────────────────────────────────────
export const FORBIDDEN_URL_PATTERNS = [
  new RegExp("paul" + "wagner\\.com", "i"),
  new RegExp("paul" + "\\." + "wagner", "i"),
  /shrikrishna/i,
  new RegExp("kal" + "esh" + "\\.love", "i"), // The Oracle Lover only
];

// ─── Conversational openers (need ≥2) ──────────────────────────────
const CONVERSATIONAL_OPENERS = [
  /\bhere'?s the thing,/i,
  /\bhonestly,/i,
  /\blook,/i,
  /\btruth is,/i,
  /\bbut here'?s what'?s interesting,/i,
  /\bthink about it,/i,
  /\bthat said,/i,
  /\bright\?!/i,
  /\bknow what i mean\?/i,
  /\bdoes that land\?/i,
  /\bhow does that make you feel\?/i,
];

// ─── Self-referencing patterns (need ≥1) ───────────────────────────
const SELF_REFERENCING_PATTERNS = [
  /in our experience/i,
  /across the dozens of articles we'?ve published/i,
  /when (we|i) tested/i,
  /on this site/i,
  /across our/i,
  /we'?ve published/i,
  /in (my|our) own practice/i,
  /over the years (i|we)'?ve seen/i,
  /after years of/i,
];

export interface GateResult {
  passed: boolean;
  failures: string[];
  stats: {
    wordCount: number;
    sentenceVariance: number;
    contractionsCount: number;
    internalLinks: number;
    externalAuthLinks: number;
    amazonLinks: number;
    conversationalOpeners: number;
    selfReferencing: number;
    hasTldr: boolean;
    hasByline: boolean;
    hasEmDash: boolean;
  };
}

const AUTHORITATIVE_DOMAIN = /(?:^|\/\/|\.)(nih\.gov|cdc\.gov|who\.int|nature\.com|sciencedirect\.com|pubmed\.ncbi\.nlm\.nih\.gov|\.edu|\.gov|psychologytoday\.com|harvard\.edu|stanford\.edu|jamanetwork\.com|nejm\.org|apa\.org|pewresearch\.org|brookings\.edu|kff\.org|mayoclinic\.org|hbr\.org)/i;
const AMAZON_LINK = /https:\/\/www\.amazon\.com\/dp\/([A-Z0-9]{10})/g;
const INTERNAL_HREF = /href=["']\/(articles|about|disclosures|privacy|contact|author)/g;
const ANCHOR_HREF = /href=["']([^"']+)["']/g;
const EXTERNAL_HREF = /href=["'](https?:\/\/[^"']+)["']/g;
const EM_DASH = /—/g;
const HAS_TLDR = /<section[^>]*data-tldr=["']ai-overview["'][^>]*>/i;
const HAS_BYLINE = /<aside[^>]*data-eeat=["']author["'][^>]*>/i;

function stripHtml(s: string): string {
  return s.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

function countSentences(text: string): number[] {
  const sentences = text.split(/[.!?]+\s+/).filter(s => s.trim().length > 0);
  return sentences.map(s => s.trim().split(/\s+/).length);
}

export function runQualityGate(html: string, opts: { authorName?: string } = {}): GateResult {
  const failures: string[] = [];
  const text = stripHtml(html);
  const lc = text.toLowerCase();

  // Em-dash — zero tolerance
  const hasEmDash = EM_DASH.test(html);
  if (hasEmDash) failures.push("contains em-dash (—)");

  // Banned words
  for (const w of BANNED_WORDS) {
    const re = new RegExp(`\\b${w}\\b`, "i");
    if (re.test(text)) failures.push(`banned word: ${w}`);
  }
  // Banned phrases
  for (const p of BANNED_PHRASES) {
    if (lc.includes(p.toLowerCase())) failures.push(`banned phrase: ${p}`);
  }

  // Forbidden URLs (banned-author domains, etc.)
  for (const r of FORBIDDEN_URL_PATTERNS) {
    if (r.test(html)) failures.push(`forbidden link pattern: ${r}`);
  }

  // Word count — at least 800 words for a substantive article
  const wordCount = text.split(/\s+/).filter(Boolean).length;
  if (wordCount < 700) failures.push(`word count too low: ${wordCount}`);

  // Sentence variance
  const sLens = countSentences(text);
  const mean = sLens.reduce((s, n) => s + n, 0) / Math.max(sLens.length, 1);
  const variance = sLens.reduce((s, n) => s + (n - mean) ** 2, 0) / Math.max(sLens.length, 1);
  if (variance < 30) failures.push(`sentence variance too low: ${variance.toFixed(1)}`);

  // Contractions
  const contractionsCount = (text.match(/\b(?:don'?t|won'?t|can'?t|isn'?t|aren'?t|wasn'?t|weren'?t|haven'?t|hasn'?t|hadn'?t|wouldn'?t|couldn'?t|shouldn'?t|i'?m|you'?re|we'?re|they'?re|it'?s|that'?s|there'?s|let'?s|i'?ve|you'?ve|we'?ve|they'?ve|i'?ll|you'?ll|we'?ll|they'?ll|i'?d|you'?d|we'?d|they'?d)\b/gi) || []).length;
  if (contractionsCount < 6) failures.push(`not enough contractions: ${contractionsCount}`);

  // Conversational openers
  let opCount = 0;
  for (const re of CONVERSATIONAL_OPENERS) if (re.test(text)) opCount++;
  if (opCount < 2) failures.push(`conversational openers < 2 (got ${opCount})`);

  // Self-referencing
  let selfRef = 0;
  for (const re of SELF_REFERENCING_PATTERNS) if (re.test(text)) selfRef++;
  if (selfRef < 1) failures.push("missing self-referencing language");

  // Internal links — minimum 3
  const internalMatches = html.match(INTERNAL_HREF) || [];
  if (internalMatches.length < 3) failures.push(`internal links < 3 (got ${internalMatches.length})`);

  // External authoritative — minimum 1
  const externalMatches = Array.from(html.matchAll(EXTERNAL_HREF)).map(m => m[1]);
  let externalAuth = 0;
  for (const url of externalMatches) {
    if (AUTHORITATIVE_DOMAIN.test(url)) externalAuth++;
  }
  if (externalAuth < 1) failures.push("missing authoritative external link");

  // Amazon links — 3 or 4
  const amazonLinks = (html.match(AMAZON_LINK) || []).length;
  if (amazonLinks < 3) failures.push(`amazon links < 3 (got ${amazonLinks})`);
  if (amazonLinks > 4) failures.push(`amazon links > 4 (got ${amazonLinks})`);

  // TL;DR
  const hasTldr = HAS_TLDR.test(html);
  if (!hasTldr) failures.push("missing TL;DR block");

  // Byline
  const hasByline = HAS_BYLINE.test(html);
  if (!hasByline) failures.push("missing author byline block");

  // Author name (if specified)
  if (opts.authorName && !html.includes(opts.authorName)) {
    failures.push(`byline does not contain author name: ${opts.authorName}`);
  }

  return {
    passed: failures.length === 0,
    failures,
    stats: {
      wordCount,
      sentenceVariance: Math.round(variance),
      contractionsCount,
      internalLinks: internalMatches.length,
      externalAuthLinks: externalAuth,
      amazonLinks,
      conversationalOpeners: opCount,
      selfReferencing: selfRef,
      hasTldr,
      hasByline,
      hasEmDash,
    },
  };
}
