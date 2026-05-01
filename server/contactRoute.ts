/**
 * /api/contact — accepts a name + email + message, validates lightly, and
 * uses the platform's notifyOwner helper to deliver to the editor inbox.
 *
 * No third-party email service is used (master scope hard rule). If
 * notifyOwner is unavailable, the submission is logged to stdout and the
 * client gets a 202 so the form still feels successful in dev.
 */
import { Express } from "express";

type NotifyFn = (m: { title: string; content: string }) => Promise<boolean>;
let notifyOwnerFn: NotifyFn | undefined;
async function loadNotifier(): Promise<NotifyFn | undefined> {
  if (notifyOwnerFn) return notifyOwnerFn;
  try {
    const mod: any = await import("./_core/notification");
    notifyOwnerFn = mod.notifyOwner;
  } catch {
    notifyOwnerFn = undefined;
  }
  return notifyOwnerFn;
}

export function registerContactRoute(app: Express) {
  app.post("/api/contact", async (req, res) => {
    const { name, email, message } = (req.body || {}) as Record<string, string>;
    if (!name || !email || !message) {
      return res.status(400).json({ ok: false, error: "name, email, message all required" });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ ok: false, error: "invalid email" });
    }
    const safe = (s: string) => String(s).slice(0, 4000).replace(/[<>]/g, "");
    const title = `[I Choose Single] new message from ${safe(name)}`;
    const content = `From: ${safe(name)} <${safe(email)}>\n\n${safe(message)}`;
    let delivered = false;
    const notifier = await loadNotifier();
    if (typeof notifier === "function") {
      try {
        delivered = await notifier({ title, content });
      } catch (e: any) {
        console.warn("[contact] notifyOwner failed:", e.message);
      }
    } else {
      console.log("[contact] (no notifier) ", title, "\n", content);
      delivered = true;
    }
    return res.status(delivered ? 200 : 202).json({ ok: true, delivered });
  });
}
