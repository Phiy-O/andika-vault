"use client";

import { useId } from "react";
import type { ReactNode } from "react";

export function EditorRail({ children }: { children: ReactNode }) {
  return (
    <aside
      aria-label="Editor settings and preview"
      className="space-y-5 xl:sticky xl:top-[88px]"
    >
      {children}
    </aside>
  );
}

interface EditorPanelProps {
  index: string;
  title: string;
  meta?: string;
  children: ReactNode;
}

export function EditorPanel({
  index,
  title,
  meta,
  children,
}: EditorPanelProps) {
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
          <h3
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
          </h3>
        </div>
        {meta && (
          <span className="font-jet text-[8px] font-bold uppercase tracking-[.1em] text-muted">
            {meta}
          </span>
        )}
      </div>
      <div className="p-4">{children}</div>
    </section>
  );
}
