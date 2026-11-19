"use client";

import { useEffect, useRef } from "react";
import type { FormEvent, ReactNode } from "react";
import { Loader2 } from "lucide-react";
import { shortRecordId } from "@/components/admin/workspace/utils";
import {
  editorButtonPrimaryClass,
  editorButtonSecondaryClass,
} from "./EditorHeader";
import { useUnsavedGuard } from "./useEditorState";

interface EditorShellProps {
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  section: string;
  mode: "new" | "edit";
  recordId?: string;
  header: ReactNode;
  rail: ReactNode;
  error?: string;
  dirty: boolean;
  saving: boolean;
  submitLabel: string;
  cancelLabel?: string;
  onCancel: () => void;
  children: ReactNode;
}

export function EditorShell({
  onSubmit,
  section,
  mode,
  recordId,
  header,
  rail,
  error,
  dirty,
  saving,
  submitLabel,
  cancelLabel,
  onCancel,
  children,
}: EditorShellProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const errorRef = useRef<HTMLDivElement>(null);

  useUnsavedGuard({ dirty, saving });

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "s") {
        event.preventDefault();
        const blockingDialog = document.querySelector(
          "dialog[open]:not([data-editor-shortcut='allow'])"
        );
        if (!saving && !blockingDialog) {
          formRef.current?.requestSubmit();
        }
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [saving]);

  useEffect(() => {
    if (!error) return;
    errorRef.current?.scrollIntoView({
      block: "nearest",
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "auto"
        : "smooth",
    });
  }, [error]);

  const stateLabel = saving
    ? "Saving changes"
    : dirty
      ? "Unsaved changes"
      : mode === "new"
        ? "No changes yet"
        : "All changes saved";
  const stateChipClass = `inline-flex h-6 items-center gap-1.5 px-2 font-jet text-[8px] font-bold uppercase tracking-[.06em] ${
    saving || dirty ? "bg-purple text-foreground" : "border border-line bg-background"
  }`;
  const stateDotClass = `size-1.5 ${saving || dirty ? "bg-surface" : "bg-admin-success"}`;
  const statusState = (
    <>
      <span className={stateDotClass} aria-hidden="true" />
      <span aria-live="polite">{stateLabel}</span>
    </>
  );
  const actionState = (
    <>
      <span className={stateDotClass} aria-hidden="true" />
      <span>{stateLabel}</span>
    </>
  );

  return (
    <form ref={formRef} onSubmit={onSubmit} className="pb-4">
      <div
        aria-label="Editor status"
        className="mb-4 flex min-h-11 flex-wrap items-center justify-between gap-x-4 gap-y-2 border-2 border-line bg-surface px-2.5 py-2 shadow-[2px_2px_0_var(--foreground)]"
      >
        <div className="flex min-w-0 flex-wrap items-center gap-x-3 gap-y-1.5">
          <span className="inline-flex h-5 shrink-0 items-center gap-1.5 bg-purple px-2 font-jet text-[9px] font-bold uppercase leading-none tracking-[.08em]">
            <span className="size-1.5 bg-surface" aria-hidden="true" />
            Sync ready
          </span>
          <p className="min-w-0 truncate font-jet text-[9px] font-medium uppercase leading-4 tracking-[.08em] text-muted">
            <span className="text-foreground">Workspace // {section}</span>
            <span className="mx-2 text-muted/50" aria-hidden="true">
              /
            </span>
            Editor
            <span className="mx-2 text-muted/50" aria-hidden="true">
              /
            </span>
            {recordId ? `Record ${shortRecordId(recordId)}` : "New record"}
          </p>
        </div>
        <div className="flex shrink-0 flex-wrap items-center gap-2">
          <span className={stateChipClass}>{statusState}</span>
          <span className="font-jet text-[8px] font-bold uppercase tracking-[.06em] text-muted">
            Mode // {mode === "new" ? "New" : "Edit"}
          </span>
          <span className="hidden h-6 items-center gap-1.5 border border-line bg-background px-2 font-jet text-[8px] font-bold uppercase tracking-[.06em] sm:inline-flex">
            <span className="size-1.5 bg-admin-success" aria-hidden="true" />
            Live database
          </span>
        </div>
      </div>

      {header}

      {error && (
        <div
          ref={errorRef}
          role="alert"
          className="mb-5 border-2 border-admin-alert bg-[#f9e8e6] px-4 py-3 font-sans text-sm leading-6 text-admin-alert shadow-[2px_2px_0_var(--foreground)]"
        >
          {error}
        </div>
      )}

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_330px]">
        <div className="min-w-0 space-y-5">{children}</div>
        {rail}
      </div>

      <div className="sticky bottom-0 z-30 -mx-4 mt-6 border-t-2 border-line bg-background px-4 py-3 sm:-mx-6 sm:px-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex min-w-0 flex-wrap items-center gap-2">
            <span className={stateChipClass}>{actionState}</span>
            {error && !saving && (
              <span className="inline-flex h-6 items-center gap-1.5 border-2 border-admin-alert bg-[#f9e8e6] px-2 font-jet text-[8px] font-bold uppercase tracking-[.06em] text-admin-alert">
                Save failed
              </span>
            )}
            <span className="font-jet text-[8px] uppercase tracking-[.08em] text-muted">
              Ctrl/Cmd + S to save
            </span>
          </div>
          <div className="flex shrink-0 flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={onCancel}
              disabled={saving}
              className={editorButtonSecondaryClass}
            >
              {cancelLabel ?? "Cancel"}
            </button>
            <button
              type="submit"
              disabled={saving}
              className={editorButtonPrimaryClass}
            >
              {saving && (
                <Loader2 size={13} className="animate-spin" aria-hidden="true" />
              )}
              {saving ? "Saving..." : submitLabel}
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}
