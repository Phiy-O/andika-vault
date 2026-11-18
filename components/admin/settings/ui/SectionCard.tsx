"use client";

import { ReactNode } from "react";

interface SectionCardProps {
  title: string;
  description?: string;
  children: ReactNode;
}

export function SectionCard({ title, description, children }: SectionCardProps) {
  return (
    <section className="rounded-none border-2 border-foreground bg-surface p-6 shadow-[4px_4px_0_var(--foreground)]">
      <header className="mb-6">
        <h2 className="text-xl font-bold tracking-[-.03em] text-foreground">
          {title}
        </h2>
        {description && (
          <p className="mt-2 text-sm text-muted leading-relaxed">{description}</p>
        )}
      </header>
      <div className="grid gap-5 md:grid-cols-2">{children}</div>
    </section>
  );
}