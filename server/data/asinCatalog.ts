/**
 * Per-niche ASIN catalog for Single by Design. These are well-known, long-running
 * products in the solo-living / self-care / single-life space. The ASIN health
 * cron (§10F) verifies each one is still live; broken ones get marked and swapped.
 */
import { CatalogProduct } from "../lib/matchProducts";

export const ASIN_CATALOG: CatalogProduct[] = [
  {
    asin: "B07FZ8S74R",
    name: "Loop Quiet ear plugs for noise reduction",
    category: "solo-living",
    tags: ["solo-living", "self-care", "noise-sensitivity", "highly-sensitive"],
  },
  {
    asin: "B00E9M4XEE",
    name: "Lodge 8-inch cast iron skillet",
    category: "solo-living",
    tags: ["solo-living", "single-cooking", "kitchen", "self-partnering"],
  },
  {
    asin: "1612436471",
    name: "The Five Minute Journal — A Happier You in 5 Minutes a Day",
    category: "self-partnering",
    tags: ["self-partnering", "journaling", "morning-rituals", "gratitude"],
  },
  {
    asin: "1591846927",
    name: "Big Magic by Elizabeth Gilbert",
    category: "self-partnering",
    tags: ["self-partnering", "creativity", "single-women", "books"],
  },
  {
    asin: "0307352099",
    name: "The Untethered Soul by Michael A. Singer",
    category: "self-partnering",
    tags: ["self-partnering", "spiritual", "meditation", "books"],
  },
  {
    asin: "0143037145",
    name: "The Power of Now by Eckhart Tolle",
    category: "self-partnering",
    tags: ["self-partnering", "spiritual", "meditation", "books"],
  },
  {
    asin: "0735211299",
    name: "Atomic Habits by James Clear",
    category: "solo-living",
    tags: ["solo-living", "habits", "self-improvement", "books"],
  },
  {
    asin: "1635655021",
    name: "How to Be Single and Happy by Jenny Taitz",
    category: "intentional-singlehood",
    tags: ["intentional-singlehood", "single-women", "dating-on-your-terms", "books"],
  },
  {
    asin: "1101874295",
    name: "All the Single Ladies by Rebecca Traister",
    category: "intentional-singlehood",
    tags: ["intentional-singlehood", "single-women", "history", "books"],
  },
  {
    asin: "1608681076",
    name: "Conscious Uncoupling by Katherine Woodward Thomas",
    category: "relationship-escalator",
    tags: ["relationship-escalator", "divorce", "self-partnering", "books"],
  },
  {
    asin: "1608689050",
    name: "Going Solo by Eric Klinenberg",
    category: "solo-living",
    tags: ["solo-living", "single-people", "sociology", "books"],
  },
  {
    asin: "B07GR5MSKD",
    name: "Hatch Restore — Sound Machine, Smart Light, and Sunrise Alarm",
    category: "solo-living",
    tags: ["solo-living", "morning-rituals", "sleep", "self-care"],
  },
  {
    asin: "B08XLM78F2",
    name: "Bearaby Napper — weighted blanket made from organic cotton",
    category: "solo-living",
    tags: ["solo-living", "sleep", "anxiety", "self-care"],
  },
  {
    asin: "B07Q8WT5JH",
    name: "Yeti Rambler 14oz mug with magslider lid",
    category: "solo-living",
    tags: ["solo-living", "morning-rituals", "single-living", "kitchen"],
  },
  {
    asin: "0593329732",
    name: "Single On Purpose by John Kim",
    category: "intentional-singlehood",
    tags: ["intentional-singlehood", "single-men", "self-partnering", "books"],
  },
  {
    asin: "1577319281",
    name: "Pema Chödrön — When Things Fall Apart",
    category: "self-partnering",
    tags: ["self-partnering", "buddhism", "grief", "books"],
  },
  {
    asin: "B07VK7NN5N",
    name: "Theragun Mini portable percussive massager",
    category: "solo-living",
    tags: ["solo-living", "self-care", "wellness", "single-living"],
  },
  {
    asin: "1635617278",
    name: "The Subtle Art of Not Giving a F*ck by Mark Manson",
    category: "intentional-singlehood",
    tags: ["intentional-singlehood", "single-men", "self-improvement", "books"],
  },
];
