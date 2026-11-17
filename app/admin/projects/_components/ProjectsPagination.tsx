"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { formatCount } from "./project-utils";

function pageWindow(current: number, pageCount: number) {
  if (pageCount <= 5) {
    return Array.from({ length: pageCount }, (_, index) => index);
  }

  const start = Math.max(0, Math.min(current - 2, pageCount - 5));
  return Array.from({ length: 5 }, (_, index) => start + index);
}

export function ProjectsPagination({
  page,
  pageCount,
  total,
  pageStart,
  pageEnd,
  published,
  draft,
  featured,
  onPage,
}: {
  page: number;
  pageCount: number;
  total: number;
  pageStart: number;
  pageEnd: number;
  published: number;
  draft: number;
  featured: number;
  onPage: (page: number) => void;
}) {
  const pages = pageWindow(page, pageCount);
  const firstPage = pages[0] ?? 0;
  const lastPage = pages[pages.length - 1] ?? 0;

  return (
    <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 border-t-2 border-line px-3 py-2.5">
      <p className="flex min-w-0 items-center gap-2 font-jet text-[8.5px] font-medium uppercase leading-4 tracking-[.04em] text-muted">
        <span
          className="size-1.5 shrink-0 rounded-full bg-admin-success"
          aria-hidden="true"
        />
        <span className="min-w-0">
          Showing{" "}
          <span className="text-foreground">
            {total === 0 ? "0" : `${pageStart}–${pageEnd}`}
          </span>{" "}
          of <span className="text-foreground">{formatCount(total)}</span>{" "}
          projects ({formatCount(published)} Published, {formatCount(draft)}{" "}
          Draft, {formatCount(featured)} Featured)
        </span>
      </p>

      <nav
        aria-label="Project pagination"
        className="flex shrink-0 items-center gap-1"
      >
        <button
          type="button"
          onClick={() => onPage(page - 1)}
          disabled={page <= 0}
          className="inline-flex h-6 items-center gap-1 border border-line bg-surface px-2 font-jet text-[8px] font-bold uppercase tracking-[.06em] text-foreground transition-colors hover:bg-admin-wash disabled:cursor-not-allowed disabled:border-line/25 disabled:text-muted/50 disabled:hover:bg-surface"
        >
          <ChevronLeft size={10} aria-hidden="true" />
          Prev
        </button>

        {firstPage > 0 && (
          <span
            className="px-0.5 font-jet text-[9px] text-muted"
            aria-hidden="true"
          >
            …
          </span>
        )}

        {pages.map((value) => (
          <button
            key={value}
            type="button"
            onClick={() => onPage(value)}
            aria-current={value === page ? "page" : undefined}
            aria-label={`Page ${value + 1}`}
            className={`grid h-6 min-w-6 place-items-center border px-1 font-jet text-[9px] font-bold leading-none transition-colors ${
              value === page
                ? "border-line bg-foreground text-background"
                : "border-line bg-surface text-foreground hover:bg-admin-wash"
            }`}
          >
            {value + 1}
          </button>
        ))}

        {lastPage < pageCount - 1 && (
          <span
            className="px-0.5 font-jet text-[9px] text-muted"
            aria-hidden="true"
          >
            …
          </span>
        )}

        <button
          type="button"
          onClick={() => onPage(page + 1)}
          disabled={page >= pageCount - 1}
          className="inline-flex h-6 items-center gap-1 border border-line bg-surface px-2 font-jet text-[8px] font-bold uppercase tracking-[.06em] text-foreground transition-colors hover:bg-admin-wash disabled:cursor-not-allowed disabled:border-line/25 disabled:text-muted/50 disabled:hover:bg-surface"
        >
          Next
          <ChevronRight size={10} aria-hidden="true" />
        </button>
      </nav>
    </div>
  );
}
