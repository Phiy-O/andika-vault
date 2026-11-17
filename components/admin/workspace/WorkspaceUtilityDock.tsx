"use client";

import { Keyboard, RotateCcw, Search } from "lucide-react";
import type {
  WorkspacePipelineStat,
  WorkspaceShortcut,
} from "./types";

function Kbd({ children }: { children: React.ReactNode }) {
  return (
    <kbd className="grid h-5 min-w-5 place-items-center border border-line bg-surface px-1 font-jet text-[8px] font-bold leading-none shadow-[1px_1px_0_var(--foreground)]">
      {children}
    </kbd>
  );
}

export function WorkspaceUtilityDock({
  pipelineTitle,
  pipelineDescription,
  pipelineStats,
  query,
  nounPlural,
  shortcuts,
  onResetFilters,
}: {
  pipelineTitle: string;
  pipelineDescription: string;
  pipelineStats: WorkspacePipelineStat[];
  query: string;
  nounPlural: string;
  shortcuts: WorkspaceShortcut[];
  onResetFilters: () => void;
}) {
  return (
    <section
      aria-label="Workspace utilities"
      className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3"
    >
      <article className="flex min-h-[252px] flex-col border-2 border-line bg-surface p-4 shadow-[3px_3px_0_var(--foreground)]">
        <div className="flex items-center justify-between gap-2">
          <p className="m-0 font-jet text-[8px] font-bold uppercase leading-4 tracking-[.14em]">
            Content pipeline
          </p>
          <span
            className="size-2 rounded-full bg-admin-success"
            aria-hidden="true"
          />
        </div>
        <p className="m-0 mt-1.5 font-space text-[17px] font-bold leading-6 tracking-[-.03em]">
          {pipelineTitle}
        </p>
        <p className="m-0 mt-1.5 text-[11.5px] leading-5 text-muted">
          {pipelineDescription}
        </p>

        <dl className="m-0 mt-auto space-y-1 border-t border-line/40 pt-3 font-jet text-[8px] font-medium uppercase leading-4 tracking-[.03em]">
          {pipelineStats.map((stat) => (
            <div
              key={stat.label}
              className="flex items-baseline justify-between gap-3"
            >
              <dt className="text-muted">{stat.label}:</dt>
              <dd
                className={`m-0 text-right font-bold ${
                  stat.tone === "success" ? "text-admin-success" : ""
                }`}
              >
                {stat.value}
              </dd>
            </div>
          ))}
        </dl>
      </article>

      <article className="flex min-h-[252px] flex-col border-2 border-line bg-surface p-4 shadow-[3px_3px_0_var(--foreground)]">
        <div className="flex items-start justify-between gap-2">
          <p className="m-0 font-jet text-[8px] font-bold uppercase leading-4 tracking-[.14em]">
            Pattern specimen //{" "}
            <span className="text-muted">Zero state</span>
          </p>
          <span className="shrink-0 border border-line bg-surface px-1.5 py-0.5 font-jet text-[7px] font-bold uppercase leading-4 tracking-[.04em]">
            Null_state
          </span>
        </div>

        <div className="mt-2 flex flex-1 flex-col items-center justify-center border-2 border-dashed border-line/45 bg-admin-wash/20 px-4 py-4 text-center">
          <Search size={22} strokeWidth={1.6} aria-hidden="true" />
          <p className="m-0 mt-2 font-space text-[12px] font-bold leading-4 tracking-[-.01em]">
            {query.trim()
              ? `No ${nounPlural} found matching “${query.trim()}”`
              : `No ${nounPlural} found matching “quantum”`}
          </p>
          <p className="m-0 mt-1 text-[10px] leading-4 text-muted">
            Try relaxing filters or search term.
          </p>
          <button
            type="button"
            onClick={onResetFilters}
            className="mt-3 inline-flex h-7 items-center gap-1 border border-line bg-surface px-2.5 font-jet text-[8px] font-bold uppercase tracking-[.04em] shadow-[1px_1px_0_var(--foreground)] transition-colors hover:bg-admin-wash"
          >
            <RotateCcw size={9} aria-hidden="true" />
            Reset filters
          </button>
        </div>

        <p className="m-0 mt-2 text-right font-jet text-[7px] font-medium uppercase tracking-[.06em] text-muted">
          Design system specimen
        </p>
      </article>

      <article className="flex min-h-[252px] flex-col border-2 border-line bg-surface p-4 shadow-[3px_3px_0_var(--foreground)] md:col-span-2 xl:col-span-1">
        <div className="flex items-center justify-between gap-2">
          <p className="m-0 font-jet text-[8px] font-bold uppercase leading-4 tracking-[.14em]">
            Keyboard shortcuts
          </p>
          <Keyboard size={15} strokeWidth={1.6} aria-hidden="true" />
        </div>

        <ul className="m-0 mt-2 list-none space-y-1.5 p-0">
          {shortcuts.map((shortcut) => (
            <li
              key={shortcut.label}
              className="flex items-center justify-between gap-2 font-jet text-[8.5px] font-medium uppercase leading-5"
            >
              <span>{shortcut.label}</span>
              <span className="flex shrink-0 items-center gap-1">
                {shortcut.keys.map((key) => (
                  <Kbd key={key}>{key}</Kbd>
                ))}
              </span>
            </li>
          ))}
        </ul>

        <p className="m-0 mt-auto border-t border-line/40 pt-3 font-jet text-[7px] font-medium uppercase leading-4 tracking-[.06em] text-muted">
          Ctrl replaces ⌘ on Windows and Linux
        </p>
      </article>
    </section>
  );
}
