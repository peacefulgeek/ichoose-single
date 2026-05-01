/**
 * /api/apothecary — public JSON of all 50 ASINs grouped by shelf.
 * Affiliate URLs are pre-built with the spankyspinola-20 tag.
 */
import { Express } from "express";
import { groupByShelf, amazonUrlForAsin, APOTHECARY_ITEMS } from "./data/apothecary";

export function registerApothecaryRoutes(app: Express) {
  app.get("/api/apothecary", (_req, res) => {
    const groups = groupByShelf().map(g => ({
      ...g,
      items: g.items.map(i => ({ ...i, url: amazonUrlForAsin(i.asin) })),
    }));
    res.json({
      total: APOTHECARY_ITEMS.length,
      affiliateTag: "spankyspinola-20",
      shelves: groups,
    });
  });
}
