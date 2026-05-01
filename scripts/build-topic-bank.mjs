#!/usr/bin/env node
// One-shot: build a 500-item topic bank in voice and write it to
// server/data/topicBank.ts.  Run once locally; result is committed.
//
//   node scripts/build-topic-bank.mjs
//
import fs from "node:fs";
import path from "node:path";

// 30 voiced stems pulled from existing essays in the bank.
const STEMS = [
  "The Quiet Power of {anchor}",
  "Why I Stopped Treating {anchor} Like a Backup Plan",
  "The Single Person's Guide to {anchor} Without the Pity",
  "How a Single Woman Reclaims {anchor}",
  "What Friendship Becomes When You Stop Performing Around {anchor}",
  "The Art of {anchor} for People Who Used to Wait for a Plus One",
  "Solo Rituals That Don't Require a Spouse to Plan {anchor}",
  "Why I Started Taking {anchor} Seriously as a Single Adult",
  "The Truth About {anchor} No One Posted on Instagram",
  "Building a Habit Around {anchor} on a Real-Person Budget",
  "What Happens to Your Calendar When You Take {anchor} Seriously",
  "The Single Woman's Field Guide to {anchor}",
  "Why the Holidays Hit Different When {anchor} Is Yours Alone",
  "The Quiet Math of {anchor} in Your Thirties",
  "Conscious Uncoupling From the Story That {anchor} Comes From a Couple",
  "I Choose Single at Fifty: What {anchor} Taught Me",
  "Why {anchor} Became My Most Romantic Possession",
  "What I Tell My Married Friends About {anchor}",
  "The Ritual Slowness of {anchor} on a Solo Saturday",
  "Without the Performance: {anchor} on Your Own Terms",
  "The Slow Goodbye to the Story That {anchor} Means You're Behind",
  "Why I Started Approaching {anchor} Like My Future Depended On It",
  "The Single Person's Permission Slip for {anchor}",
  "What a Year of {anchor} Taught Me About Being Loved",
  "How to Throw Yourself a {anchor} When You're Single by Design",
  "The Single Woman's Case for {anchor} on Her Own Terms",
  "Sleeping Alone, On Purpose, and Liking {anchor}",
  "Why Single Men in Their Fifties Are Quietly Reinventing {anchor}",
  "The Solo Traveler's Practice of {anchor} Without Hiding",
  "Dating on Your Own Terms: A Field Guide to {anchor}",
];

// Anchors map onto category + tag set.
const ANCHORS = [
  { a: "a Sunday Morning Alone", category: "solo-living", tags: ["solo-living","morning-rituals","self-care"] },
  { a: "Cooking Dinner for One", category: "solo-living", tags: ["solo-living","single-cooking","kitchen"] },
  { a: "Sleeping Across the Whole Bed", category: "solo-living", tags: ["solo-living","self-care","intentional-singlehood"] },
  { a: "Owning a Home Alone", category: "solo-finance", tags: ["solo-finance","solo-living","single-women"] },
  { a: "Building Wealth Without a Partner", category: "solo-finance", tags: ["solo-finance","single-women","intentional-singlehood"] },
  { a: "Solo Travel With a Carry-On", category: "solo-travel", tags: ["solo-travel","intentional-singlehood","single-women"] },
  { a: "Eating Alone in a Restaurant", category: "solo-travel", tags: ["solo-travel","single-women","intentional-singlehood"] },
  { a: "Going to a Wedding Alone", category: "intentional-singlehood", tags: ["intentional-singlehood","single-women","friendship"] },
  { a: "Spending the Holidays Solo", category: "intentional-singlehood", tags: ["intentional-singlehood","holidays","self-care"] },
  { a: "A Friendship That Outlasted Three Relationships", category: "intentional-singlehood", tags: ["intentional-singlehood","friendship","single-women"] },
  { a: "Saying No Without an Apology", category: "single-women", tags: ["single-women","boundaries","self-partnering"] },
  { a: "A Birthday That You Plan for Yourself", category: "intentional-singlehood", tags: ["intentional-singlehood","single-living","self-care"] },
  { a: "Reading Books on a Slow Saturday", category: "self-partnering", tags: ["self-partnering","books","single-women"] },
  { a: "A Studio Apartment That Feels Like a Sanctuary", category: "solo-living", tags: ["solo-living","home","single-living"] },
  { a: "Dating Apps Without the Urgency", category: "dating-on-your-terms", tags: ["dating-on-your-terms","single-women","self-partnering"] },
  { a: "First Dates That You Don't Audition For", category: "dating-on-your-terms", tags: ["dating-on-your-terms","single-men","intentional-singlehood"] },
  { a: "A Single Father Raising Boys With Tenderness", category: "single-parents", tags: ["single-parents","single-men","intentional-singlehood"] },
  { a: "A Single Mother Refusing the Pity Script", category: "single-parents", tags: ["single-parents","single-women","intentional-singlehood"] },
  { a: "Conscious Uncoupling After a Long Marriage", category: "relationship-escalator", tags: ["relationship-escalator","divorce","self-partnering"] },
  { a: "Stepping Off the Relationship Escalator", category: "relationship-escalator", tags: ["relationship-escalator","intentional-singlehood","single-women"] },
  { a: "A Morning Walk That Replaces a Marriage Argument", category: "self-partnering", tags: ["self-partnering","morning-rituals","self-care"] },
  { a: "An Evening Practice That Steadies the Nervous System", category: "self-partnering", tags: ["self-partnering","self-care","spiritual"] },
  { a: "A Cast-Iron Skillet That Outlasts a Boyfriend", category: "solo-living", tags: ["solo-living","single-cooking","kitchen"] },
  { a: "A Calendar Built Around Friendship", category: "intentional-singlehood", tags: ["intentional-singlehood","friendship","single-women"] },
  { a: "A Quiet Tuesday That Feels Whole", category: "intentional-singlehood", tags: ["intentional-singlehood","single-living","self-care"] },
];

const slugify = (t) =>
  t.toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 90);

const seen = new Set();
const out = [];

for (const stem of STEMS) {
  for (const { a, category, tags } of ANCHORS) {
    const title = stem.replace("{anchor}", a);
    const slug = slugify(title);
    if (seen.has(slug)) continue;
    seen.add(slug);
    out.push({ title, category, tags });
    if (out.length >= 500) break;
  }
  if (out.length >= 500) break;
}

if (out.length < 500) {
  // Fill any remaining slots by appending a year suffix variant.
  let i = 1;
  while (out.length < 500 && i < 6) {
    for (const stem of STEMS) {
      for (const { a, category, tags } of ANCHORS) {
        const title = `${stem.replace("{anchor}", a)} (Volume ${i + 1})`;
        const slug = slugify(title);
        if (seen.has(slug)) continue;
        seen.add(slug);
        out.push({ title, category, tags });
        if (out.length >= 500) break;
      }
      if (out.length >= 500) break;
    }
    i++;
  }
}

const banner = `/**
 * Topic bank for I Choose Single — 500 voiced essay angles.
 * Generated by scripts/build-topic-bank.mjs (one-shot, then committed).
 * The cron rotates through these; duplicates avoided by slug.
 */
export interface Topic {
  title: string;
  category: string;
  tags: string[];
}

export const TOPIC_BANK: Topic[] = [
`;

const tail = `];\n`;

const lines = out
  .map((t) => {
    const ts = JSON.stringify(t.tags);
    return `  { title: ${JSON.stringify(t.title)}, category: ${JSON.stringify(t.category)}, tags: ${ts} },`;
  })
  .join("\n");

const target = path.resolve("server/data/topicBank.ts");
fs.writeFileSync(target, banner + lines + "\n" + tail, "utf8");
console.log(`wrote ${out.length} topics → ${target}`);
