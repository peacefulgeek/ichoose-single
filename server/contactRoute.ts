/**
 * /api/contact — accepts a name + email + message, validates lightly, and
 * delivers via Nodemailer if SMTP env is configured.
 *
 * Per master scope hard rule: "No third-party email beyond Nodemailer."
 *
 * If SMTP_HOST / SMTP_USER / SMTP_PASS / CONTACT_TO are not present, the
 * submission is appended to a local log file and the client gets a 202 so
 * the form still feels successful. No Manus runtime is imported.
 */
import { Express } from "express";
import fs from "node:fs";
import path from "node:path";

type Mailer = {
  send: (m: { to: string; from: string; subject: string; text: string }) => Promise<void>;
};

let cachedMailer: Mailer | null | undefined;
async function loadMailer(): Promise<Mailer | null> {
  if (cachedMailer !== undefined) return cachedMailer;
  const host = process.env.SMTP_HOST;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  if (!host || !user || !pass) {
    cachedMailer = null;
    return null;
  }
  try {
    const nodemailer: any = await import("nodemailer").catch(() => null);
    if (!nodemailer) {
      cachedMailer = null;
      return null;
    }
    const transporter = nodemailer.default.createTransport({
      host,
      port: Number(process.env.SMTP_PORT || 587),
      secure: process.env.SMTP_SECURE === "true",
      auth: { user, pass },
    });
    cachedMailer = {
      async send({ to, from, subject, text }) {
        await transporter.sendMail({ to, from, subject, text });
      },
    };
  } catch {
    cachedMailer = null;
  }
  return cachedMailer;
}

function logFallback(title: string, content: string) {
  const dir = "/home/ubuntu/single-by-design/.contact-log";
  try {
    fs.mkdirSync(dir, { recursive: true });
    const stamp = new Date().toISOString().replace(/[:.]/g, "-");
    fs.writeFileSync(path.join(dir, `${stamp}.txt`), `${title}\n\n${content}`, "utf8");
  } catch {
    /* swallow — at worst we log to stdout */
  }
  console.log("[contact-fallback]", title, "\n", content);
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
    const to = process.env.CONTACT_TO;
    const from = process.env.CONTACT_FROM || `noreply@ichoosesingle.com`;
    const mailer = to ? await loadMailer() : null;
    let delivered = false;
    if (mailer && to) {
      try {
        await mailer.send({ to, from, subject: title, text: content });
        delivered = true;
      } catch (e: any) {
        console.warn("[contact] mailer failed:", e?.message);
        logFallback(title, content);
      }
    } else {
      logFallback(title, content);
    }
    return res.status(delivered ? 200 : 202).json({ ok: true, delivered });
  });
}
