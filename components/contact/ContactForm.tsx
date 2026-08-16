"use client";

import { useState } from "react";
import { Send, CheckCircle2 } from "lucide-react";

export function ContactForm() {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">(
    "idle"
  );
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());
    setStatus("sending");
    setError("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) {
        setStatus("error");
        setError(body.error ?? "Failed to send message. Please try again.");
        return;
      }
      setStatus("sent");
      form.reset();
    } catch {
      setStatus("error");
      setError("Network error. Please try again.");
    }
  }

  if (status === "sent") {
    return (
      <div className="mt-10 rounded-lg border border-green-500/30 bg-green-500/10 px-6 py-8 text-center">
        <CheckCircle2 size={32} className="mx-auto mb-3 text-green-400" />
        <p className="text-foreground font-medium">Message sent!</p>
        <p className="mt-1 text-sm text-muted">
          Thank you for reaching out. I&apos;ll get back to you as soon as I
          can.
        </p>
      </div>
    );
  }

  return (
    <form className="mt-10 flex flex-col gap-5" onSubmit={handleSubmit}>
      <div className="flex flex-col gap-1.5">
        <label htmlFor="name" className="text-foreground text-[13px] tracking-[.06em] uppercase">
          Name
        </label>
        <input
          id="name"
          name="name"
          type="text"
          required
          placeholder="Your name"
          className="bg-transparent border border-line rounded-lg px-5 py-4 text-foreground text-[15px] outline-none transition-all duration-200 placeholder:text-muted/50 focus:border-purple focus:shadow-[0_0_8px_rgba(169,139,255,.15)]"
        />
      </div>
      <div className="flex flex-col gap-1.5">
        <label htmlFor="email" className="text-foreground text-[13px] tracking-[.06em] uppercase">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          placeholder="you@example.com"
          className="bg-transparent border border-line rounded-lg px-5 py-4 text-foreground text-[15px] outline-none transition-all duration-200 placeholder:text-muted/50 focus:border-purple focus:shadow-[0_0_8px_rgba(169,139,255,.15)]"
        />
      </div>
      <div className="flex flex-col gap-1.5">
        <label htmlFor="message" className="text-foreground text-[13px] tracking-[.06em] uppercase">
          Message
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={5}
          placeholder="Tell me about your project…"
          className="bg-transparent border border-line rounded-lg px-5 py-4 text-foreground text-[15px] outline-none transition-all duration-200 placeholder:text-muted/50 focus:border-purple focus:shadow-[0_0_8px_rgba(169,139,255,.15)] resize-y min-h-[120px]"
        />
      </div>
      {status === "error" && (
        <p className="m-0 text-sm text-red-400">{error}</p>
      )}
      <button
        type="submit"
        disabled={status === "sending"}
        className="inline-flex items-center justify-center gap-3 rounded-lg text-base py-4 px-7 transition-all duration-200 hover:-translate-y-0.5 bg-gradient-to-br from-[#a98bff] to-[#7391ff] text-[#f0f0f0] hover:brightness-[1.05] hover:shadow-[0_0_16px_rgba(255,255,255,.25)] w-fit max-md:w-full max-md:py-3 max-md:px-5 max-md:text-xs disabled:cursor-not-allowed disabled:opacity-60"
      >
        {status === "sending" ? "Sending…" : "Send message"}
        <Send size={16} aria-hidden="true" />
      </button>
      <p className="text-muted/60 text-[11px] mt-0">
        Your message is stored securely and only visible to me.
      </p>
    </form>
  );
}