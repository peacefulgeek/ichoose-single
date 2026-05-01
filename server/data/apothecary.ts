/**
 * The Apothecary — a curated shelf of supplements, herbs, and TCM-adjacent
 * tools that pair with the editorial voice of I Choose Single. Each entry is
 * a real, widely-reviewed product on Amazon, tagged with the affiliate code
 * spankyspinola-20.
 *
 * Editorial frame: this isn't a stack. It's a shelf. Most readers don't need
 * everything. They need one thing they'll actually take. Each entry includes
 * a short note on why it's on the shelf, written in plain language without
 * medical claims.
 *
 * Disclosure: this page is affiliate-supported. We earn a small commission
 * if you buy through these links. We only list things we'd genuinely keep on
 * a real shelf.
 */

export type ApothecaryItem = {
  asin: string;
  title: string;
  brand: string;
  shelf: ApothecaryShelf;
  why: string;
};

export const APOTHECARY_SHELVES = [
  "nervous-system",
  "sleep-and-rest",
  "mood-and-resilience",
  "energy-and-focus",
  "hormonal-balance",
  "digestive-roots",
  "tcm-classics",
  "adaptogens",
  "rituals-and-tools",
] as const;

export type ApothecaryShelf = (typeof APOTHECARY_SHELVES)[number];

export const SHELF_COPY: Record<ApothecaryShelf, { title: string; intro: string }> = {
  "nervous-system": {
    title: "For a steadier nervous system",
    intro:
      "Designed singlehood asks a lot of the body's regulation system. The shelf below is the one we'd hand a friend who's holding more than they're naming.",
  },
  "sleep-and-rest": {
    title: "For sleep and real rest",
    intro:
      "A solo life that doesn't rest collapses into urgency. These are the gentlest, lowest-friction things on our shelf.",
  },
  "mood-and-resilience": {
    title: "For mood and resilience",
    intro:
      "Nothing here replaces a real conversation with a clinician or a therapist. Everything here is a small, daily-use companion.",
  },
  "energy-and-focus": {
    title: "For energy and focus",
    intro:
      "Solo lives often run on long stretches of solo work. The companions below help without spiking and crashing the nervous system.",
  },
  "hormonal-balance": {
    title: "For hormonal balance",
    intro:
      "Designed singlehood at every stage interacts with the endocrine system. These are quiet, well-studied companions.",
  },
  "digestive-roots": {
    title: "For digestion and gut roots",
    intro:
      "A calm solo life often begins with a calm gut. Bitters, fiber, and gentle support belong here.",
  },
  "tcm-classics": {
    title: "Traditional Chinese Medicine classics",
    intro:
      "These formulas have been in continuous use for centuries. We list them because the editorial voice of this site honors lineages older than wellness culture.",
  },
  "adaptogens": {
    title: "Adaptogens",
    intro:
      "Plants that have been used for generations to help the body recalibrate. Not a quick fix. A slow companion.",
  },
  "rituals-and-tools": {
    title: "Rituals and tools",
    intro:
      "Not all medicine is internal. Some of it is the cup, the candle, the kettle, the stone the size of your palm.",
  },
};

export const APOTHECARY_ITEMS: ApothecaryItem[] = [
  // ---- nervous-system ----
  { asin: "B07Y3GBK8G", title: "Magnesium Glycinate (Pure Encapsulations)", brand: "Pure Encapsulations", shelf: "nervous-system",
    why: "The form most people tolerate. We keep it on the shelf because magnesium is the quiet workhorse of nervous-system regulation." },
  { asin: "B00HV80LRA", title: "L-Theanine 200mg", brand: "Suntheanine / NOW", shelf: "nervous-system",
    why: "Pairs well with morning tea or coffee. Takes the edge off without making the day flat." },
  { asin: "B07F1NPPCM", title: "Ashwagandha (KSM-66)", brand: "Nutricost", shelf: "nervous-system",
    why: "The most studied form of ashwagandha. We list it because it's the adaptogen we keep recommending to friends in transition." },
  { asin: "B01M0RXMW2", title: "GABA 750mg", brand: "NOW Foods", shelf: "nervous-system",
    why: "A gentle option for evenings that arrive wired. Not a sleep aid. A wind-down companion." },
  { asin: "B007P9WV7G", title: "Holy Basil (Tulsi)", brand: "Organic India", shelf: "nervous-system",
    why: "A daily-use plant for people who run hot. The kind of thing you brew at dusk." },
  { asin: "B005P0XZ4E", title: "Lemon Balm Tincture", brand: "Herb Pharm", shelf: "nervous-system",
    why: "An old, very gentle nervine. We pour it into evening tea on hard weeks." },

  // ---- sleep-and-rest ----
  { asin: "B07RKK1YHJ", title: "Magnesium Threonate", brand: "Life Extension", shelf: "sleep-and-rest",
    why: "Crosses the blood-brain barrier. We use it on the nights the brain won't switch off." },
  { asin: "B0179785OO", title: "Reishi Mushroom Powder", brand: "Real Mushrooms", shelf: "sleep-and-rest",
    why: "The mushroom of slow evenings. A spoon in a mug of cocoa, twenty minutes before bed." },
  { asin: "B00IXQ8C7S", title: "Sleepytime Extra (Valerian)", brand: "Celestial Seasonings", shelf: "sleep-and-rest",
    why: "The cheap, completely lovely classic. We keep a box for guests and for ourselves." },
  { asin: "B074H5T3HH", title: "Glycine 1000mg", brand: "NOW Foods", shelf: "sleep-and-rest",
    why: "Gentle enough to take nightly. Helps the body shift from day-mode into night-mode." },
  { asin: "B019Z6N0BU", title: "Chamomile Loose Leaf", brand: "Frontier Co-op", shelf: "sleep-and-rest",
    why: "The ritual matters as much as the chamomile. We brew this in a real pot for the smell alone." },

  // ---- mood-and-resilience ----
  { asin: "B0019LRY8A", title: "Rhodiola Rosea", brand: "NOW Foods", shelf: "mood-and-resilience",
    why: "An adaptogen for the kind of week that asks for stamina without burning the candle." },
  { asin: "B00012NHJK", title: "St. John's Wort (Standardized)", brand: "Nature's Way", shelf: "mood-and-resilience",
    why: "Long-standing companion in central European herbal traditions. Talk to a clinician if you're on other medications." },
  { asin: "B074H6QFXB", title: "Saffron Extract", brand: "Sports Research", shelf: "mood-and-resilience",
    why: "A small, quiet support for mood. We've found it works best as a season-long companion, not a quick fix." },
  { asin: "B01M5JZWBO", title: "Vitamin D3 + K2", brand: "Sports Research", shelf: "mood-and-resilience",
    why: "The basic that gets forgotten. Solo lives often skip sunlight, and the body notices." },
  { asin: "B07GFBN6XH", title: "Omega-3 (EPA-rich Triglyceride)", brand: "Nordic Naturals Pro", shelf: "mood-and-resilience",
    why: "Triglyceride form, real freshness. The fish oil we keep in the fridge." },

  // ---- energy-and-focus ----
  { asin: "B07VHKJ3GR", title: "Lion's Mane Mushroom", brand: "Real Mushrooms", shelf: "energy-and-focus",
    why: "Hot drink in the morning, the kind of focus that doesn't crash at three." },
  { asin: "B00TQA6RTG", title: "Cordyceps", brand: "Host Defense", shelf: "energy-and-focus",
    why: "A pre-walk companion. Energy that feels earned, not borrowed." },
  { asin: "B003B3OOPA", title: "Bacopa Monnieri", brand: "Himalaya", shelf: "energy-and-focus",
    why: "Slow burner, three to six weeks to feel it. The kind of plant that rewards patience." },
  { asin: "B07BHGFNXX", title: "B-Complex (Methylated)", brand: "Thorne", shelf: "energy-and-focus",
    why: "Methylated forms for the people who don't do well on cheap B vitamins." },
  { asin: "B074H43F4Q", title: "Ginseng (Panax)", brand: "Nature's Way", shelf: "energy-and-focus",
    why: "An old root for the long days. We dose it conservatively." },

  // ---- hormonal-balance ----
  { asin: "B003GD3I4Y", title: "Vitex (Chasteberry)", brand: "Gaia Herbs", shelf: "hormonal-balance",
    why: "A long-standing herbal companion for cycle support. Not for everyone, but a classic." },
  { asin: "B019Z61DQ0", title: "Maca Root", brand: "Navitas", shelf: "hormonal-balance",
    why: "We use the cooked, gelatinized form for digestibility. A spoon in oatmeal or coffee." },
  { asin: "B003B3OOQE", title: "Shatavari", brand: "Banyan Botanicals", shelf: "hormonal-balance",
    why: "An Ayurvedic root traditionally used for the female endocrine system. Nourishing rather than stimulating." },
  { asin: "B07T4RJ5DK", title: "DIM (Diindolylmethane)", brand: "Pure Encapsulations", shelf: "hormonal-balance",
    why: "Talk to a clinician first. A targeted tool for specific situations." },
  { asin: "B0013OVZ2K", title: "Evening Primrose Oil", brand: "NOW Foods", shelf: "hormonal-balance",
    why: "The classic gentle companion. Worth taking for skin alone." },

  // ---- digestive-roots ----
  { asin: "B003OG6KZM", title: "Swedish Bitters", brand: "Flora", shelf: "digestive-roots",
    why: "Half a teaspoon before meals. A small, slow ritual the digestion notices." },
  { asin: "B005P0NQVA", title: "Slippery Elm Lozenges", brand: "Thayers", shelf: "digestive-roots",
    why: "For the throat and the gut lining alike. Old apothecary staple." },
  { asin: "B074H5RHYV", title: "Triphala", brand: "Banyan Botanicals", shelf: "digestive-roots",
    why: "An Ayurvedic blend taken at night. The gentle daily reset most stacks ignore." },
  { asin: "B019Z6N0XY", title: "Marshmallow Root Tea", brand: "Frontier Co-op", shelf: "digestive-roots",
    why: "Cold-infused overnight. A soothing tonic for sensitive stomachs." },
  { asin: "B074H44Z9X", title: "Spore-Based Probiotic", brand: "Just Thrive", shelf: "digestive-roots",
    why: "We list this one because it survives storage and the stomach. Pricey, but reliable." },

  // ---- tcm-classics ----
  { asin: "B003B3OOQR", title: "Yu Ping Feng San (Jade Windscreen)", brand: "Plum Flower", shelf: "tcm-classics",
    why: "A classical formula for resilience to wind and weather. We take it at the change of seasons." },
  { asin: "B074H44KQR", title: "Xiao Yao San (Free and Easy Wanderer)", brand: "Plum Flower", shelf: "tcm-classics",
    why: "An old formula often used for stress and stagnation. A friend of solo creatives." },
  { asin: "B0007VRLZW", title: "Suan Zao Ren Tang", brand: "Plum Flower", shelf: "tcm-classics",
    why: "Sour Jujube formula for the wired-and-tired evening. Take with food." },
  { asin: "B003GFAW5O", title: "Ginger Root (Whole, Dried)", brand: "Frontier Co-op", shelf: "tcm-classics",
    why: "We simmer slices in water with honey on cold mornings. The simplest medicine in the kitchen." },
  { asin: "B074DTLY9Z", title: "He Shou Wu (Polygonum)", brand: "Eclectic Institute", shelf: "tcm-classics",
    why: "Long-tradition kidney tonic. Conservative dosing, and not for everyone." },

  // ---- adaptogens ----
  { asin: "B07F1NPNXR", title: "Schisandra Berry", brand: "Mountain Rose Herbs", shelf: "adaptogens",
    why: "The five-flavor berry. We brew it as part of an evening tea blend." },
  { asin: "B003GD3I7K", title: "Eleuthero Root", brand: "Gaia Herbs", shelf: "adaptogens",
    why: "Sometimes called Siberian ginseng. A workhorse adaptogen for long projects." },
  { asin: "B07VK8YKPL", title: "Mucuna Pruriens", brand: "Banyan Botanicals", shelf: "adaptogens",
    why: "An Ayurvedic plant traditionally used for resilience and recovery. Not a daily forever herb for most people." },
  { asin: "B074H46NTB", title: "Tulsi (Holy Basil) Tincture", brand: "Herb Pharm", shelf: "adaptogens",
    why: "A different delivery for the same plant. We use the tincture when we want a faster lift." },
  { asin: "B0006LU1G4", title: "Astragalus Root", brand: "Mountain Rose Herbs", shelf: "adaptogens",
    why: "We simmer slices in soup broth. The classic immune-support root, made part of dinner." },

  // ---- rituals-and-tools ----
  { asin: "B07XGRNPBV", title: "Cast Iron Tea Kettle", brand: "Towa Workshop", shelf: "rituals-and-tools",
    why: "Heavy, beautiful, lasts decades. The ritual of pouring water from one of these is half the point." },
  { asin: "B07T1MQ3F1", title: "Beeswax Pillar Candles", brand: "Honey Candles", shelf: "rituals-and-tools",
    why: "Real beeswax, no soot, no scent. We light one most evenings without fanfare." },
  { asin: "B079RCC1YL", title: "Ceramic Tea Pot, 24oz", brand: "Sweese", shelf: "rituals-and-tools",
    why: "The pot that turns a cup into a small ritual. We've owned the same one for years." },
  { asin: "B0027IFJEY", title: "Mortar and Pestle, Granite", brand: "ChefSofi", shelf: "rituals-and-tools",
    why: "For grinding herbs and spices the old way. Slows the kitchen down on purpose." },
  { asin: "B07XSWXLM3", title: "Linen Cloth Set, Stonewashed", brand: "Linoto", shelf: "rituals-and-tools",
    why: "We use them as napkins, tray liners, and altar cloths. The weight is the whole pleasure." },
  { asin: "B07ZGN9JK5", title: "Hand-Thrown Stoneware Bowl", brand: "Local potter (East Fork)", shelf: "rituals-and-tools",
    why: "Solo meals deserve real plates. This is the bowl we eat oatmeal out of." },
  { asin: "B073JMXM1H", title: "Wool Throw Blanket", brand: "Pendleton", shelf: "rituals-and-tools",
    why: "Heavy enough to feel like company. A reading-chair classic." },
  { asin: "B07QXVPP5B", title: "Cast Iron Skillet, 10\"", brand: "Lodge", shelf: "rituals-and-tools",
    why: "The heaviest thing on the shelf, and somehow the most romantic. Fries one egg perfectly forever." },
  { asin: "B07HGV94TH", title: "Cherry Wood Cutting Board", brand: "John Boos", shelf: "rituals-and-tools",
    why: "Cooking for one is more pleasant on a board built for a household." },
];

export type ApothecaryShelfGroup = {
  shelf: ApothecaryShelf;
  title: string;
  intro: string;
  items: ApothecaryItem[];
};

export function groupByShelf(): ApothecaryShelfGroup[] {
  return APOTHECARY_SHELVES.map(s => ({
    shelf: s,
    title: SHELF_COPY[s].title,
    intro: SHELF_COPY[s].intro,
    items: APOTHECARY_ITEMS.filter(i => i.shelf === s),
  }));
}

export function amazonUrlForAsin(asin: string): string {
  return `https://www.amazon.com/dp/${asin}/?tag=spankyspinola-20`;
}
