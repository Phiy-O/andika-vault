"use client";

import { useId } from "react";
import type { ReactNode } from "react";

interface EditorSectionProps {
  index: string;
  title: string;
  meta?: string;
  children: ReactNode;
}

export function EditorSection({
  index,
  title,
  meta,
  children,
}: EditorSectionProps) {
  const headingId = useId();

  return (
    <section
      aria-labelledby={headingId}
      className="border-2 border-line bg-surface shadow-[3px_3px_0_var(--foreground)]"
    >
      <div className="flex flex-wrap items-center justify-between gap-2 border-b-2 border-line bg-admin-wash px-3 py-2.5">
        <div className="flex min-w-0 items-center gap-2">
          <span
            aria-hidden="true"
            className="grid size-6 shrink-0 place-items-center bg-foreground font-jet text-[9px] font-bold text-background"
          >
            {index}
          </span>
          <h2
            id={headingId}
            className="font-space font-bold uppercase"
            style={{
              margin: 0,
              fontSize: "12px",
              lineHeight: "16px",
              fontWeight: 700,
              letterSpacing: ".04em",
            }}
          >
            {title}
          </h2>
        </div>
        {meta && (
          <span className="font-jet text-[8px] font-bold uppercase tracking-[.1em] text-muted">
            {meta}
          </span>
        )}
      </div>
      <div className="p-4 sm:p-5">{children}</div>
    </section>
  );
}
