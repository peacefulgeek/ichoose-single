import "dotenv/config";
import express from "express";
import helmet from "helmet";
import { createServer } from "http";
import net from "net";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { registerOAuthRoutes } from "./oauth";
// Manus storage proxy intentionally NOT mounted — Bunny CDN is the only image
// host on this site. Hero WebPs live at https://ichoose-single.b-cdn.net/heroes/.
import { appRouter } from "../routers";
import { createContext } from "./context";
import { serveStatic, setupVite } from "./vite";
import { registerBootstrapMigration } from "./bootstrapMigration";
import { registerSiteRoutes } from "../siteRoutes";
import { startCronJobs } from "../cron/scheduler";
import { registerAdminSeed } from "../adminSeed";
import { registerAssessmentsRoutes } from "../assessmentsRoutes";
import { registerApothecaryRoutes } from "../apothecaryRoutes";
import { registerContactRoute } from "../contactRoute";

function isPortAvailable(port: number): Promise<boolean> {
  return new Promise(resolve => {
    const server = net.createServer();
    server.listen(port, () => {
      server.close(() => resolve(true));
    });
    server.on("error", () => resolve(false));
  });
}

async function findAvailablePort(startPort: number = 3000): Promise<number> {
  for (let port = startPort; port < startPort + 20; port++) {
    if (await isPortAvailable(port)) {
      return port;
    }
  }
  throw new Error(`No available port found starting from ${startPort}`);
}

const APEX_HOST = process.env.SITE_APEX_HOST || "ichoosesingle.com";

async function startServer() {
  const app = express();
  const server = createServer(app);

  // ─────────────────────────────────────────────────────────────
  // §1: WWW → APEX 301 — MUST be the very first middleware.
  // No body parsing, no helmet, no anything else above this.
  // Also force HTTPS in production.
  // ─────────────────────────────────────────────────────────────
  app.set("trust proxy", 1);
  app.use((req, res, next) => {
    const host = (req.headers.host || "").toLowerCase();
    const proto = (req.headers["x-forwarded-proto"] as string) || req.protocol;

    // www → apex (always 301)
    if (host.startsWith("www.")) {
      const target = `https://${host.slice(4)}${req.originalUrl}`;
      return res.redirect(301, target);
    }
    // http → https in production only
    if (process.env.NODE_ENV === "production" && proto !== "https") {
      const target = `https://${host}${req.originalUrl}`;
      return res.redirect(301, target);
    }
    return next();
  });

  // Helmet (after redirect, before everything else)
  app.use(
    helmet({
      contentSecurityPolicy: false, // SSR-injected JSON-LD + Vite dev needs flexibility
      crossOriginEmbedderPolicy: false,
      crossOriginResourcePolicy: { policy: "cross-origin" },
    })
  );

  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ limit: "50mb", extended: true }));

  // Health check, sitemap, robots, llms, articles JSON, etc.
  registerSiteRoutes(app);
  registerBootstrapMigration(app);
  registerAdminSeed(app);
  registerAssessmentsRoutes(app);
  registerApothecaryRoutes(app);
  registerContactRoute(app);
  registerOAuthRoutes(app);

  // tRPC API
  app.use(
    "/api/trpc",
    createExpressMiddleware({
      router: appRouter,
      createContext,
    })
  );

  // SSR head injection is registered inside setupVite() / serveStatic()
  // BEFORE the catch-all that serves the React shell.

  if (process.env.NODE_ENV === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  const preferredPort = parseInt(process.env.PORT || "3000");
  const port = await findAvailablePort(preferredPort);

  if (port !== preferredPort) {
    console.log(`Port ${preferredPort} is busy, using port ${port} instead`);
  }

  server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}/`);
    if (process.env.AUTO_GEN_ENABLED !== "false") {
      try {
        startCronJobs();
        console.log("[cron] scheduler started");
      } catch (e) {
        console.warn("[cron] failed to start:", e);
      }
    }
  });
}

startServer().catch(console.error);
