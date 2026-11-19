"use client";

import { Rss } from "lucide-react";
import { useEffect, useState } from "react";
import type { TocHeading } from "@/src/lib/article-content";

type ArticleSidebarProps = {
  headings: TocHeading[];
  readTime: string;
  context: { label: string; value: string }[];
};

export function ArticleSidebar({
  headings,
  readTime,
  context,
}: ArticleSidebarProps) {
  const [activeId, setActiveId] = useState(headings[0]?.id ?? "");

  useEffect(() => {
    let frame = 0;

    const updateActiveHeading = () => {
      frame = 0;
      const offset = 120;
      let current = headings[0]?.id ?? "";

      for (const heading of headings) {
        const element = document.getElementById(heading.id);
        if (element && element.getBoundingClientRect().top <= offset) {
          current = heading.id;
        }
      }

      setActiveId((previous) => (previous === current ? previous : current));
    };

    const handleScroll = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(updateActiveHeading);
    };

    updateActiveHeading();
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [headings]);

  return (
    <aside className="order-first space-y-6 lg:order-none lg:sticky lg:top-24 lg:col-span-4 lg:self-start">
      <div className="border-2 border-[#1b1b1b] bg-[#fffdf7] p-[22px] shadow-[4px_4px_0_#1b1b1b]">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b-2 border-[#1b1b1b] pb-3.5">
          <p className="font-mono text-[11px] font-bold uppercase tracking-[.06em]">
            ON THIS PAGE
          </p>
          <span className="border border-[#1b1b1b] bg-[#e5e2e1] px-2 py-1 font-mono text-[10px] uppercase tracking-[.06em]">
            {readTime}
          </span>
        </div>

        <nav className="pt-2" aria-label="On this page">
          {headings.map((heading, index) => {
            const isActive = heading.id === activeId;

            return (
              <a
                key={heading.id}
                href={`#${heading.id}`}
                aria-current={isActive ? "location" : undefined}
                className={`flex items-start gap-2 border-l-4 py-2 pl-3 pr-2 font-mono text-[12px] leading-[1.35] tracking-[.04em] transition-colors ${
                  isActive
                    ? "border-[#a9362e] bg-[#faf6ee] text-[#1b1b1b]"
                    : "border-transparent text-[#58413f] hover:border-[#e8e0d3] hover:bg-[#faf6ee] hover:text-[#a9362e]"
                }`}
              >
                <span
                  className={
                    isActive
                      ? "shrink-0 text-[#a9362e]"
                      : "shrink-0 text-[#7b625f]"
                  }
                >
                  {String(index + 1).padStart(2, "0")}.
                </span>
                <span>{heading.label}</span>
              </a>
            );
          })}
        </nav>

        {context.length > 0 && (
          <div className="mt-3 border-t border-[#e8e0d3] pt-5">
            <p className="font-mono text-[10px] font-semibold uppercase tracking-[.08em] text-[#7b625f]">
              SYSTEM CONTEXT
            </p>
            <dl className="mt-3 space-y-1.5 font-mono text-[11px] tracking-[.04em]">
              {context.map((item) => (
                <div
                  key={item.label}
                  className="flex items-start justify-between gap-4"
                >
                  <dt className="text-[#58413f]">{item.label}:</dt>
                  <dd className="text-right font-bold text-[#1b1b1b]">
                    {item.value}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        )}
      </div>

      <div className="border-2 border-[#1b1b1b] bg-[#faf6ee] p-[18px] shadow-[2px_2px_0_#1b1b1b]">
        <div className="flex items-center gap-2">
          <Rss aria-hidden="true" className="size-3" />
          <p className="font-mono text-[11px] font-bold uppercase tracking-[.06em]">
            OPEN ARCHIVE FEED
          </p>
        </div>
        <p className="mt-2 text-[13px] leading-[1.5] text-[#58413f]">
          New dispatches are published directly to the raw RSS feed. No account
          required.
        </p>
        <a
          href="/api/blog/rss"
          target="_blank"
          rel="noreferrer"
          className="mt-2 inline-flex border border-[#e8e0d3] bg-[#fffdf7] px-1.5 py-0.5 font-mono text-[12px] text-[#58413f] transition-colors hover:border-[#1b1b1b] hover:text-[#a9362e]"
        >
          /api/blog/rss ↗
        </a>
      </div>
    </aside>
  );
}
