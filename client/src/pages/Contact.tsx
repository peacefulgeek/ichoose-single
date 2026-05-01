import { useState } from "react";
import { Loader2, Send, Check, Mail } from "lucide-react";

const CONTACT_HERO = "https://ichoose-single.b-cdn.net/site/contact.webp";

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

  const inputStyle: React.CSSProperties = {
    borderColor: "rgba(42,15,51,0.18)",
    background: "#FBF7EE",
    color: "#1F1422",
    fontFamily: "Inter, system-ui, sans-serif",
  };

  return (
    <div>
      <section className="container py-16 md:py-24">
        <div className="grid md:grid-cols-12 gap-12 items-start">
          <div className="md:col-span-5">
            <div className="hero-photo grain" style={{ aspectRatio: "4 / 5", borderRadius: "1.5rem", overflow: "hidden", boxShadow: "0 30px 60px -20px rgba(74,25,66,0.30)" }}>
              <img src={CONTACT_HERO} alt="A warm, candle-lit writing desk where letters get answered" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            </div>
            <div className="mt-8 rounded-2xl p-6" style={{ background: "linear-gradient(135deg, #2A0F33, #4A1942)", color: "#FBF7EE" }}>
              <Mail size={24} style={{ color: "#F2B33D" }} />
              <h3 className="display-serif mt-3" style={{ color: "#FBF7EE", fontSize: "1.3rem" }}>We answer every letter.</h3>
              <p className="mt-2 text-sm" style={{ color: "rgba(251,247,238,0.82)", lineHeight: 1.6 }}>
                Editorial questions, story pitches, accuracy corrections.
                Usually within a few days, sometimes faster.
              </p>
            </div>
          </div>

          <div className="md:col-span-7">
            <span className="editorial-eyebrow">Write to the editor</span>
            <h1 className="display-serif mt-4" style={{ fontSize: "clamp(2rem, 4vw, 3.4rem)" }}>
              Send us a note. <em style={{ color: "#F25C54" }}>We read everything.</em>
            </h1>
            <p className="mt-5 text-lg" style={{ color: "rgba(31,20,34,0.72)", lineHeight: 1.65 }}>
              Pitches, corrections, the essay you wish someone would write , the inbox is a real one.
            </p>

            <form onSubmit={submit} className="mt-10 space-y-5">
              <div>
                <label className="block text-sm font-semibold mb-2" style={{ color: "#2A0F33", letterSpacing: "0.02em" }}>Your name</label>
                <input
                  value={name}
                  onChange={e => setName(e.target.value)}
                  required
                  className="w-full px-4 py-3 rounded-xl border transition-colors focus:outline-none focus:border-[#F25C54]"
                  style={inputStyle}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2" style={{ color: "#2A0F33", letterSpacing: "0.02em" }}>Your email</label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  className="w-full px-4 py-3 rounded-xl border focus:outline-none focus:border-[#F25C54]"
                  style={inputStyle}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2" style={{ color: "#2A0F33", letterSpacing: "0.02em" }}>Message</label>
                <textarea
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  required
                  rows={7}
                  className="w-full px-4 py-3 rounded-xl border focus:outline-none focus:border-[#F25C54]"
                  style={{ ...inputStyle, lineHeight: 1.6 }}
                />
              </div>
              <button
                type="submit"
                disabled={status === "sending"}
                className="btn-primary disabled:opacity-60"
              >
                {status === "sending" ? <><Loader2 className="animate-spin" size={16} /> Sending…</>
                  : status === "ok" ? <><Check size={16} /> Sent , thank you</>
                  : <><Send size={16} /> Send message</>}
              </button>
              {status === "ok" && (
                <p className="text-sm font-medium" style={{ color: "#1AA39A" }}>
                  Thank you. We'll be in touch.
                </p>
              )}
              {status === "err" && (
                <p className="text-sm font-medium" style={{ color: "#F25C54" }}>{errMsg}</p>
              )}
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}
