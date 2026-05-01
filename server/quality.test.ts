import { describe, expect, it } from "vitest";
import { generateOneArticle } from "./lib/generateArticle";
import { runQualityGate } from "./lib/qualityGate";
import { heroUrlForSlug, AMAZON_TAG, AUTHOR_NAME, AUTHOR_SISTER_SITE } from "./siteConfig";
import { TOPIC_BANK } from "./data/topicBank";
import { execSync } from "node:child_process";

describe("I Choose Single — quality gate", () => {
  it("generates an article that passes every quality gate (no DeepSeek)", async () => {
    const topic = TOPIC_BANK[0];
    const { article } = await generateOneArticle({ topicOverride: topic });
    const gate = runQualityGate(article.body, { authorName: article.authorName });
    expect(gate.passed, gate.failures.join(" | ")).toBe(true);
    expect(article.wordCount).toBeGreaterThanOrEqual(1500);
    expect(article.body).toContain('data-tldr="ai-overview"');
    expect(article.body).toContain('data-eeat="author"');
    expect(article.body).not.toMatch(/\u2014/); // no em-dash
    expect(article.body).not.toMatch(/paul.{0,2}wagner/i);
    expect(article.body).not.toMatch(/kal[a-z]?esh/i);
    expect(article.authorName).toBe(AUTHOR_NAME);
    expect(AMAZON_TAG).toBe("spankyspinola-20");
    // exactly the required Amazon affiliate tag, no variants
    const tagOccurrences = (article.body.match(new RegExp(`tag=${AMAZON_TAG}`, "g")) || []).length;
    expect(tagOccurrences).toBeGreaterThanOrEqual(3);
    expect(article.body.match(/tag=spankyspinola(?!-20)/g)).toBeNull();
  });

  it("hits the sister-site backlink rate over the topic bank (target 23%)", async () => {
    const sample = TOPIC_BANK.slice(0, 32);
    let withSister = 0;
    for (const t of sample) {
      const { article } = await generateOneArticle({ topicOverride: t });
      if (article.body.includes(AUTHOR_SISTER_SITE)) withSister++;
    }
    const rate = withSister / sample.length;
    expect(rate).toBeGreaterThanOrEqual(0.2);
    expect(rate).toBeLessThanOrEqual(0.4);
  });

  it("builds a deterministic Bunny CDN hero URL", () => {
    const url = heroUrlForSlug("the-quiet-power-of-choosing-yourself-first");
    expect(url).toBe(
      "https://ichoose-single.b-cdn.net/heroes/the-quiet-power-of-choosing-yourself-first.webp",
    );
  });
});

describe("I Choose Single — repo hygiene guards", () => {
  it("contains zero images outside favicon.svg", () => {
    // Should exit 0 (no failure) and print the OK line
    const out = execSync("node scripts/check-no-images.mjs", { encoding: "utf8" });
    expect(out).toMatch(/zero images/);
  });

  it("contains zero banned strings in source", () => {
    const out = execSync("node scripts/check-no-banned.mjs", { encoding: "utf8" });
    expect(out).toMatch(/no banned strings/);
  });
});

describe("verifyAsin", () => {
  it("rejects malformed ASINs", async () => {
    const { verifyAsin } = await import("./lib/matchProducts");
    expect((await verifyAsin({ asin: "abc" })).valid).toBe(false);
    expect((await verifyAsin({ asin: "B0XXXX" })).valid).toBe(false);
    expect((await verifyAsin({ asin: "lowercase!" })).valid).toBe(false);
  });

  it("accepts well-formed ASINs in non-live mode", async () => {
    const { verifyAsin } = await import("./lib/matchProducts");
    const r = await verifyAsin({ asin: "B07X4VBF8L" });
    expect(r.valid).toBe(true);
    expect(r.asin).toBe("B07X4VBF8L");
  });

  it("normalizes case", async () => {
    const { verifyAsin } = await import("./lib/matchProducts");
    const r = await verifyAsin({ asin: "b07x4vbf8l" });
    expect(r.valid).toBe(true);
    expect(r.asin).toBe("B07X4VBF8L");
  });

  it("partitions a list correctly with verifyAsins", async () => {
    const { verifyAsins } = await import("./lib/matchProducts");
    const r = await verifyAsins({ asins: ["B07X4VBF8L", "BAD", "0123456789"] });
    expect(r.valid.sort()).toEqual(["0123456789", "B07X4VBF8L"]);
    expect(r.invalid.length).toBe(1);
  });
});
