"use client";

import { Loader2, X } from "lucide-react";
import { FullscreenDialog } from "@/components/admin/editor/FullscreenDialog";
import {
  editorButtonPrimaryClass,
  editorButtonSecondaryClass,
} from "@/components/admin/editor/EditorHeader";
import { BodyEditor, type BodyMode } from "./BodyEditor";

interface FocusEditorProps {
  open: boolean;
  onClose: () => void;
  title: string;
  body: string;
  onBodyChange: (html: string) => void;
  mode: BodyMode;
  onModeChange: (mode: BodyMode) => void;
  editorKey: number;
  readTime: string;
  wordCount: number;
  bodyFormat: "html" | "markdown";
  saving: boolean;
  canSave: boolean;
  error?: string;
}

export function FocusEditor({
  open,
  onClose,
  title,
  body,
  onBodyChange,
  mode,
  onModeChange,
  editorKey,
  readTime,
  wordCount,
  bodyFormat,
  saving,
  canSave,
  error,
}: FocusEditorProps) {
  return (
    <FullscreenDialog
      open={open}
      onClose={onClose}
      label="Focus mode body editor"
      shortcut
    >
      <header className="flex flex-wrap items-center justify-between gap-3 border-b-2 border-line bg-surface px-4 py-3">
        <div className="min-w-0">
          <p className="font-jet text-[9px] font-bold uppercase tracking-[.12em]">
            <span className="text-purple">Focus // Body</span>
            <span className="mx-2 text-muted/50" aria-hidden="true">
              /
            </span>
            <span className="text-muted">{bodyFormat.toUpperCase()}</span>
          </p>
          <p className="mt-0.5 truncate font-space text-sm font-bold tracking-[-.02em] text-foreground">
            {title || "Untitled post"}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex h-6 items-center border border-line bg-background px-2 font-jet text-[8px] font-bold uppercase tracking-[.06em] text-muted">
            {wordCount.toLocaleString()} words
          </span>
          <span className="inline-flex h-6 items-center border border-line bg-background px-2 font-jet text-[8px] font-bold uppercase tracking-[.06em] text-muted">
            {readTime}
          </span>
          <button
            type="button"
            onClick={onClose}
            aria-label="Exit focus mode"
            className="grid size-9 place-items-center border-2 border-line bg-background text-foreground transition-colors hover:bg-admin-wash"
          >
            <X size={14} aria-hidden="true" />
          </button>
        </div>
      </header>

      <div className="min-h-0 flex-1 overflow-y-auto p-4 sm:p-6">
        <div className="mx-auto w-full max-w-5xl">
          <BodyEditor
            content={body}
            onChange={onBodyChange}
            mode={mode}
            onModeChange={onModeChange}
            editorKey={editorKey}
            tall
          />
        </div>
      </div>

      <footer className="border-t-2 border-line bg-surface px-4 py-3">
        {error && (
          <p
            role="alert"
            className="mb-2 border-2 border-admin-alert bg-[#f9e8e6] px-3 py-2 font-sans text-xs leading-5 text-admin-alert"
          >
            {error}
          </p>
        )}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="min-w-0">
            <p className="font-jet text-[8px] uppercase tracking-[.08em] text-muted">
              Esc exits · Ctrl/Cmd + S saves
            </p>
            {!canSave && (
              <p className="mt-1 font-jet text-[8px] font-bold uppercase tracking-[.08em] text-admin-alert">
                Complete the required fields in the editor before saving.
              </p>
            )}
          </div>
          <div className="flex shrink-0 flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className={editorButtonSecondaryClass}
            >
              Exit focus
            </button>
            <button
              type="submit"
              disabled={saving || !canSave}
              className={editorButtonPrimaryClass}
            >
              {saving && (
                <Loader2 size={13} className="animate-spin" aria-hidden="true" />
              )}
              {saving ? "Saving..." : "Save"}
            </button>
          </div>
        </div>
      </footer>
    </FullscreenDialog>
  );
}
