"use client";

import { CheckCircle2, Send } from "lucide-react";
import { useState } from "react";

const mono = "font-mono text-[10px] font-bold uppercase tracking-[.1em]";
const field = "w-full border border-[#1b1b1b] bg-[#fffdf7] px-3 py-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-[#f16b5e]";

export function ContactForm() {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [error, setError] = useState("");
  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    setStatus("sending"); setError("");
    try {
      const res = await fetch("/api/contact", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(Object.fromEntries(new FormData(form).entries())) });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) { setStatus("error"); setError(body.error ?? "Failed to send message. Please try again."); return; }
      setStatus("sent"); form.reset();
    } catch { setStatus("error"); setError("Network error. Please try again."); }
  }
  if (status === "sent") return <div className="border-2 border-[#1b1b1b] bg-[#d9f5e6] p-8 text-center shadow-[3px_3px_0_#1b1b1b]" role="status"><CheckCircle2 className="mx-auto mb-3 text-[#006b55]" /><p className="font-bold">MESSAGE ACCEPTED.</p><p className="mt-2 text-sm text-[#58413f]">Thank you. I&apos;ll respond as soon as possible.</p></div>;
  return <form className="border-2 border-[#1b1b1b] bg-[#fffdf7] p-4 shadow-[4px_4px_0_#1b1b1b] sm:p-6" onSubmit={handleSubmit}><div className="mb-5 flex items-start justify-between gap-3 border-b-2 border-[#1b1b1b] pb-4"><div><p className={`${mono} text-[#a9362e]`}>AUTHENTICATED ROUTE</p><h2 className="mt-1 text-3xl font-black uppercase tracking-[-.04em]">SEND A MESSAGE.</h2><p className="mt-1 text-sm text-[#58413f]">Fill in fields below. Incoming dispatch routes to local inbox.</p></div><span className={`${mono} hidden bg-[#2cb67d] px-2 py-1 text-[#003d2e] sm:block`}>SECURE</span></div><div className="absolute -left-[9999px] h-px w-px overflow-hidden"><label htmlFor="website">Website</label><input id="website" name="website" tabIndex={-1} autoComplete="off" /></div><div className="grid gap-4 sm:grid-cols-2"><label className="block"><span className={mono}>YOUR NAME *</span><input id="name" name="name" required className={`${field} mt-1`} placeholder="Alex Mercer" /></label><label className="block"><span className={mono}>EMAIL ADDRESS *</span><input id="email" name="email" type="email" required className={`${field} mt-1`} placeholder="alex@example.com" /></label></div><label className="mt-4 block"><span className={mono}>SUBJECT / SCOPE *</span><input id="subject" name="subject" required className={`${field} mt-1`} placeholder="Architecture inquiry & systems advisory" /></label><label className="mt-4 block"><span className={mono}>YOUR MESSAGE *</span><textarea id="message" name="message" required rows={7} className={`${field} mt-1 resize-y`} placeholder="Tell me what you are building..." /></label>{status === "error" && <p className="mt-3 border border-[#a9362e] bg-[#ffe0dc] p-2 text-sm text-[#630004]" role="alert">{error}</p>}<div className="mt-5 flex flex-col gap-4 border-t-2 border-[#1b1b1b] pt-4 sm:flex-row sm:items-center sm:justify-between"><label className="flex items-start gap-2 text-xs text-[#58413f]"><input name="consent" type="checkbox" required className="mt-0.5 accent-[#f16b5e]" />I acknowledge direct technical dispatch.</label><button type="submit" disabled={status === "sending"} className={`${mono} inline-flex items-center justify-center gap-2 border-2 border-[#1b1b1b] bg-[#f16b5e] px-5 py-3 shadow-[3px_3px_0_#1b1b1b] disabled:cursor-not-allowed disabled:opacity-60`}>{status === "sending" ? "TRANSMITTING..." : "TRANSMIT PACKET"}<Send size={14} /></button></div><p className={`${mono} mt-4 text-[#58413f]`}>PAYLOAD LIMIT: 64KB // DIRECT ENCRYPTED DISPATCH</p></form>;
}
