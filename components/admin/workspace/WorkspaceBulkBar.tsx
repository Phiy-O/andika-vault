"use client";

import { Eye, EyeOff, Loader2, Trash2, X } from "lucide-react";
import { formatCount } from "./utils";

export function WorkspaceBulkBar({
  count,
  busy,
  noun,
  archiveLabel,
  onPublish,
  onMoveToDraft,
  onDelete,
  onClear,
}: {
  count: number;
  busy: boolean;
  noun: string;
  archiveLabel: string;
  onPublish: () => void;
  onMoveToDraft: () => void;
  onDelete: () => void;
  onClear: () => void;
}) {
  return (
    <div
      role="region"
      aria-label={`Bulk ${noun} actions`}
      className="mb-4 flex min-h-11 flex-wrap items-center gap-x-3 gap-y-2 border-2 border-line bg-surface px-2.5 py-2 shadow-[3px_3px_0_var(--foreground)]"
    >
      <span className="inline-flex h-6 shrink-0 items-center bg-foreground px-2 font-jet text-[9px] font-bold uppercase leading-none tracking-[.08em] text-background">
        {formatCount(count)} selected
      </span>

      <p className="hidden min-w-0 flex-1 truncate font-jet text-[9px] font-medium uppercase leading-4 tracking-[.06em] text-muted md:block">
        Changes apply immediately to the {archiveLabel}.
      </p>

      <button
        type="button"
        onClick={onClear}
        disabled={busy}
        className="order-last inline-flex h-6 shrink-0 items-center gap-1 border-b border-line font-jet text-[8px] font-bold uppercase tracking-[.06em] text-muted transition-colors hover:text-foreground disabled:cursor-wait disabled:opacity-50 md:order-none"
      >
        Clear selection
        <X size={10} aria-hidden="true" />
      </button>

      <div className="ml-auto flex shrink-0 flex-wrap items-center gap-1.5">
        <button
          type="button"
          onClick={onPublish}
          disabled={busy}
          className="inline-flex h-7 items-center gap-1.5 border border-line bg-admin-mint px-2.5 font-jet text-[8px] font-bold uppercase tracking-[.06em] transition-colors hover:bg-[#5fd9aa] disabled:cursor-wait disabled:opacity-60"
        >
          {busy ? (
            <Loader2 size={11} className="animate-spin" aria-hidden="true" />
          ) : (
            <Eye size={11} aria-hidden="true" />
          )}
          Publish
        </button>
        <button
          type="button"
          onClick={onMoveToDraft}
          disabled={busy}
          className="inline-flex h-7 items-center gap-1.5 border border-line bg-background px-2.5 font-jet text-[8px] font-bold uppercase tracking-[.06em] transition-colors hover:bg-admin-wash disabled:cursor-wait disabled:opacity-60"
        >
          {busy ? (
            <Loader2 size={11} className="animate-spin" aria-hidden="true" />
          ) : (
            <EyeOff size={11} aria-hidden="true" />
          )}
          Move to draft
        </button>
        <button
          type="button"
          onClick={onDelete}
          disabled={busy}
          className="inline-flex h-7 items-center gap-1.5 border border-line bg-admin-alert px-2.5 font-jet text-[8px] font-bold uppercase tracking-[.06em] text-white transition-colors hover:bg-[#951e18] disabled:cursor-wait disabled:opacity-60"
        >
          {busy ? (
            <Loader2 size={11} className="animate-spin" aria-hidden="true" />
          ) : (
            <Trash2 size={11} aria-hidden="true" />
          )}
          Delete
        </button>
      </div>
    </div>
  );
}
