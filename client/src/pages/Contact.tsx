import { useState } from "react";
import { Loader2, Send, Check } from "lucide-react";

export default function Contact() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "ok" | "err">("idle");
  const [errMsg, setErrMsg] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");
    try {
      const r = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message }),
      });
      if (!r.ok) {
        const j = await r.json().catch(() => ({}));
        setStatus("err");
        setErrMsg(j.error || "Something went wrong. Try again in a moment.");
        return;
      }
      setStatus("ok");
      setName(""); setEmail(""); setMessage("");
    } catch (e: any) {
      setStatus("err");
      setErrMsg(e.message);
    }
  }

  return (
    <div className="container py-12 max-w-2xl">
      <h1 className="text-3xl md:text-5xl font-extrabold" style={{ color: "#2B2B2B" }}>Contact</h1>
      <p className="mt-3" style={{ color: "#6B6B66" }}>
        Editorial questions, story pitches, accuracy corrections. We read every message and reply within a few days.
      </p>

      <form onSubmit={submit} className="mt-8 space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1" style={{ color: "#2B2B2B" }}>Your name</label>
          <input value={name} onChange={e => setName(e.target.value)} required className="w-full px-4 py-2.5 rounded-xl border" style={{ borderColor: "rgba(43,43,43,0.15)", background: "#FFFEF9" }} />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1" style={{ color: "#2B2B2B" }}>Your email</label>
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} required className="w-full px-4 py-2.5 rounded-xl border" style={{ borderColor: "rgba(43,43,43,0.15)", background: "#FFFEF9" }} />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1" style={{ color: "#2B2B2B" }}>Message</label>
          <textarea value={message} onChange={e => setMessage(e.target.value)} required rows={6} className="w-full px-4 py-2.5 rounded-xl border" style={{ borderColor: "rgba(43,43,43,0.15)", background: "#FFFEF9" }} />
        </div>
        <button type="submit" disabled={status === "sending"} className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full font-semibold" style={{ background: "#E8604C", color: "#FFFEF9" }}>
          {status === "sending" ? <><Loader2 className="animate-spin" size={16} /> Sending…</> : status === "ok" ? <><Check size={16} /> Sent</> : <><Send size={16} /> Send message</>}
        </button>
        {status === "ok" && <p className="text-sm" style={{ color: "#2AA5A0" }}>Thank you. We'll be in touch.</p>}
        {status === "err" && <p className="text-sm" style={{ color: "#E8604C" }}>{errMsg}</p>}
      </form>
    </div>
  );
}
