"use client";

import { Check, Link2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";

type CopyStatus = "idle" | "copied" | "error";

export function CopyArticleLink() {
  const [status, setStatus] = useState<CopyStatus>("idle");
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, []);

  const resetLater = () => {
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setStatus("idle"), 2200);
  };

  const copyLink = async () => {
    const url = window.location.href;
    let copied = false;

    try {
      await navigator.clipboard.writeText(url);
      copied = true;
    } catch {
      copied = false;
    }

    if (!copied) {
      try {
        const textarea = document.createElement("textarea");
        textarea.value = url;
        textarea.setAttribute("readonly", "");
        textarea.style.position = "fixed";
        textarea.style.opacity = "0";
        document.body.appendChild(textarea);
        textarea.select();
        copied = document.execCommand("copy");
        document.body.removeChild(textarea);
      } catch {
        copied = false;
      }
    }

    setStatus(copied ? "copied" : "error");
    resetLater();
  };

  const label =
    status === "copied"
      ? "LINK COPIED"
      : status === "error"
        ? "COPY FAILED"
        : "COPY ARTICLE LINK";

  return (
    <>
      <button
        type="button"
        onClick={copyLink}
        className="inline-flex cursor-pointer items-center gap-2 border-2 border-[#1b1b1b] bg-[#f16b5e] px-[18px] py-2.5 font-mono text-[11px] font-bold uppercase tracking-[.05em] text-[#630004] shadow-[2px_2px_0_#1b1b1b] transition-all hover:-translate-y-0.5 hover:shadow-[3px_3px_0_#1b1b1b] active:translate-y-0 active:shadow-[1px_1px_0_#1b1b1b]"
      >
        {status === "copied" ? (
          <Check size={13} aria-hidden="true" />
        ) : (
          <Link2 size={13} aria-hidden="true" />
        )}
        {label}
      </button>
      <span role="status" aria-live="polite" className="sr-only">
        {status === "copied"
          ? "Article link copied to clipboard"
          : status === "error"
            ? "Could not copy article link"
            : ""}
      </span>
    </>
  );
}
