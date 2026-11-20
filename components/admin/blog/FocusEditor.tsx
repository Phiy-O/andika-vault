"use client";

import { useEffect, useRef } from "react";
import { ArrowLeft, Eye, Loader2 } from "lucide-react";
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
  onTitleChange: (value: string) => void;
  body: string;
  onBodyChange: (html: string) => void;
  mode: BodyMode;
  onModeChange: (mode: BodyMode) => void;
  editorKey: number;
  readTime: string;
  wordCount: number;
  bodyFormat: "html" | "markdown";
  isVisible: boolean;
  saving: boolean;
  canSave: boolean;
  onPreview: () => void;
  error?: string;
}

export function FocusEditor({
  open,
  onClose,
  title,
  onTitleChange,
  body,
  onBodyChange,
  mode,
  onModeChange,
  editorKey,
  readTime,
  wordCount,
  bodyFormat,
  isVisible,
  saving,
  canSave,
  onPreview,
  error,
}: FocusEditorProps) {
  const titleRef = useRef<HTMLInputElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    titleRef.current?.focus();
  }, [open]);

  function focusBody() {
    const target = bodyRef.current?.querySelector<HTMLElement>(
      '[contenteditable="true"], textarea'
    );
    target?.focus();
  }

  return (
    <FullscreenDialog
      open={open}
      onClose={onClose}
      label="Focus mode body editor"
      shortcut
      closeDisabled={saving}
    >
      <header className="flex flex-wrap items-center justify-between gap-3 border-b-2 border-line bg-surface px-4 py-3">
        <div className="flex min-w-0 flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            className={editorButtonSecondaryClass}
          >
            <ArrowLeft size={13} strokeWidth={2.2} aria-hidden="true" />
            Exit
          </button>
          <p className="font-jet text-[9px] font-bold uppercase tracking-[.12em]">
            <span className="text-purple">Focus // Write</span>
            <span className="mx-2 text-muted/50" aria-hidden="true">
              /
            </span>
            <span className="text-muted">{bodyFormat.toUpperCase()}</span>
          </p>
          <span
            className={`inline-flex h-6 items-center border border-line px-2 font-jet text-[8px] font-bold uppercase tracking-[.06em] ${
              isVisible
                ? "bg-background text-foreground"
                : "bg-admin-wash text-muted"
            }`}
          >
            {isVisible ? "Published" : "Draft"}
          </span>
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
            onClick={onPreview}
            disabled={saving}
            className={editorButtonSecondaryClass}
          >
            <Eye size={13} strokeWidth={2.2} aria-hidden="true" />
            Preview
          </button>
          <button
            type="submit"
            disabled={saving || !canSave}
            aria-describedby={!canSave ? "focus-save-hint" : undefined}
            className={editorButtonPrimaryClass}
          >
            {saving && (
              <Loader2 size={13} className="animate-spin" aria-hidden="true" />
            )}
            {saving ? "Saving..." : "Save"}
          </button>
        </div>
      </header>

      <div className="min-h-0 flex-1 overflow-y-auto p-4 sm:p-6">
        <div className="mx-auto w-full max-w-5xl">
          <input
            ref={titleRef}
            value={title}
            onChange={(event) => onTitleChange(event.target.value)}
            onKeyDown={(event) => {
              if (event.key !== "Enter" || event.nativeEvent.isComposing) return;
              event.preventDefault();
              focusBody();
            }}
            placeholder="Post title"
            aria-label="Post title"
            aria-required="true"
            autoComplete="off"
            enterKeyHint="next"
            className="mb-5 w-full border-x-0 border-t-0 border-b-2 border-line bg-transparent px-0 py-3 font-space text-2xl font-bold tracking-[-.04em] text-foreground outline-none transition-colors placeholder:text-muted/70 focus:border-purple focus-visible:outline-2 focus-visible:outline-purple focus-visible:outline-offset-0 sm:text-3xl"
          />
          <div ref={bodyRef}>
            <BodyEditor
              content={body}
              onChange={onBodyChange}
              mode={mode}
              onModeChange={onModeChange}
              editorKey={editorKey}
              tall
              variant="focus"
            />
          </div>
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
          <p className="font-jet text-[8px] uppercase tracking-[.08em] text-muted">
            Esc exits · Ctrl/Cmd + S saves
          </p>
          {!canSave && (
            <p
              id="focus-save-hint"
              className="font-jet text-[8px] font-bold uppercase tracking-[.08em] text-admin-alert"
            >
              Complete the required fields in the editor before saving.
            </p>
          )}
        </div>
      </footer>
    </FullscreenDialog>
  );
}
