"use client";

import Link from "next/link";
import { RotateCcw, Search } from "lucide-react";

export function WorkspaceEmptyState({
  nounPlural,
  query,
  filtersActive,
  hasAnyItems,
  emptyDescription,
  newHref,
  newLabel,
  onReset,
}: {
  nounPlural: string;
  query: string;
  filtersActive: boolean;
  hasAnyItems: boolean;
  emptyDescription: string;
  newHref: string;
  newLabel: string;
  onReset: () => void;
}) {
  const title = !hasAnyItems
    ? `No ${nounPlural} in the studio yet.`
    : query.trim()
      ? `No ${nounPlural} found matching “${query.trim()}”`
      : filtersActive
        ? `No ${nounPlural} match these filters.`
        : `No ${nounPlural} to show.`;

  return (
    <div className="p-4">
      <div
        role="status"
        className="flex flex-col items-center justify-center gap-2 border-2 border-dashed border-line/45 bg-admin-wash/30 px-6 py-12 text-center"
      >
        <span className="mb-1 grid size-10 place-items-center border-2 border-line bg-surface shadow-[2px_2px_0_var(--foreground)]">
          <Search size={18} strokeWidth={1.8} aria-hidden="true" />
        </span>
        <p className="m-0 font-space text-[14px] font-bold leading-5 tracking-[-.02em]">
          {title}
        </p>
        <p className="m-0 max-w-sm text-[11.5px] leading-5 text-muted">
          {hasAnyItems
            ? "Try relaxing the filters or clearing the search term."
            : emptyDescription}
        </p>

        <div className="mt-2 flex flex-wrap items-center justify-center gap-2">
          {hasAnyItems && filtersActive && (
            <button
              type="button"
              onClick={onReset}
              className="inline-flex h-8 items-center gap-1.5 border-2 border-line bg-surface px-3 font-jet text-[8px] font-bold uppercase tracking-[.06em] shadow-[2px_2px_0_var(--foreground)] transition-transform hover:-translate-y-0.5 motion-reduce:transform-none"
            >
              <RotateCcw size={11} aria-hidden="true" />
              Reset filters
            </button>
          )}
          {!hasAnyItems && (
            <Link
              href={newHref}
              className="inline-flex h-8 items-center gap-1.5 border-2 border-line bg-purple px-3 font-jet text-[8px] font-bold uppercase tracking-[.06em] shadow-[2px_2px_0_var(--foreground)] transition-transform hover:-translate-y-0.5 motion-reduce:transform-none"
            >
              {newLabel}
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
