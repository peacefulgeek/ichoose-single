/**
 * /api/assessments — list all 11 assessments + /api/assessments/:slug — single
 *
 * Page rendered client-side; SSR head wires JSON-LD (Quiz schema) per assessment.
 */
import { Express } from "express";
import { ASSESSMENTS } from "./data/assessments";

export function registerAssessmentsRoutes(app: Express) {
  app.get("/api/assessments", (_req, res) => {
    res.json({
      total: ASSESSMENTS.length,
      assessments: ASSESSMENTS.map(a => ({
        slug: a.slug,
        title: a.title,
        intro: a.intro,
        why: a.why,
        items: a.items,
        bands: a.bands,
      })),
    });
  });

  app.get("/api/assessments/:slug", (req, res) => {
    const a = ASSESSMENTS.find(x => x.slug === req.params.slug);
    if (!a) return res.status(404).json({ error: "not found" });
    res.json(a);
  });
}
