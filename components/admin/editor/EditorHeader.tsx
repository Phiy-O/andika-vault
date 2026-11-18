"use client";

import type { ReactNode } from "react";
import { ArrowLeft, Copy, ExternalLink, Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/Toast";
import { copyText } from "@/components/admin/workspace/utils";

export const editorButtonSecondaryClass =
  "inline-flex h-10 items-center gap-2 border-2 border-line bg-surface px-4 font-jet text-[9px] font-bold uppercase tracking-[.08em] shadow-[2px_2px_0_var(--foreground)] transition-transform hover:-translate-y-0.5 hover:bg-admin-wash disabled:cursor-not-allowed disabled:opacity-50 motion-reduce:transform-none";

export const editorButtonPrimaryClass =
  "inline-flex h-10 items-center gap-2 border-2 border-line bg-purple px-4 font-space text-[12px] font-bold tracking-[-.01em] text-foreground shadow-[3px_3px_0_var(--foreground)] transition-transform hover:-translate-y-0.5 hover:bg-[#ef7e70] disabled:cursor-wait disabled:opacity-60 motion-reduce:transform-none";

interface EditorHeaderProps {
  eyebrow: string;
  eyebrowNote: string;
  title: string;
  description: string;
  meta?: ReactNode;
  actions?: ReactNode;
}

export function EditorHeader({
  eyebrow,
  eyebrowNote,
  title,
  description,
  meta,
  actions,
}: EditorHeaderProps) {
  return (
    <header className="mb-6 flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
      <div className="min-w-0">
        <p className="font-jet text-[9px] font-bold uppercase tracking-[.12em]">
          <span className="text-purple">{eyebrow}</span>
          <span className="mx-2 text-muted/50" aria-hidden="true">
            /
          </span>
          <span className="text-muted">{eyebrowNote}</span>
        </p>
        <h1
          className="font-space text-foreground"
          style={{
            fontSize: "clamp(30px, 3.4vw, 40px)",
            lineHeight: 1.05,
            fontWeight: 700,
            letterSpacing: "-.05em",
            margin: "4px 0 0",
          }}
        >
          {title}
        </h1>
        <p className="mt-1.5 max-w-[680px] font-sans text-[13px] leading-6 text-muted">
          {description}
        </p>
        {meta && <div className="mt-4 flex flex-wrap items-center gap-2">{meta}</div>}
      </div>
      {actions && (
        <div className="flex shrink-0 flex-wrap items-center gap-3 lg:pt-5">
          {actions}
        </div>
      )}
    </header>
  );
}

interface EditorMetaChipProps {
  children: ReactNode;
  mono?: boolean;
}

export function EditorMetaChip({
  children,
  mono = true,
}: EditorMetaChipProps) {
  const fontClass = mono
    ? "font-jet text-[8px] font-bold uppercase tracking-[.06em]"
    : "font-sans normal-case tracking-normal text-[11px]";

  return (
    <span
      className={`inline-flex h-6 min-w-0 max-w-full items-center gap-1.5 border border-line bg-background px-2 ${fontClass}`}
    >
      <span className="min-w-0 truncate">{children}</span>
    </span>
  );
}

export function EditorPathChip({
  value,
  label,
}: {
  value: string;
  label?: string;
}) {
  const showToast = useToast();

  async function handleCopy() {
    try {
      await copyText(value);
      showToast("Public path copied");
    } catch {
      showToast("Could not copy path");
    }
  }

  return (
    <span className="inline-flex h-6 min-w-0 max-w-full items-center gap-1.5">
      <EditorMetaChip>{label ? `${label} ${value}` : value}</EditorMetaChip>
      <button
        type="button"
        onClick={() => void handleCopy()}
        aria-label="Copy public path"
        title="Copy path"
        className="grid size-6 shrink-0 place-items-center border border-line bg-background text-muted transition-colors hover:bg-admin-wash hover:text-foreground"
      >
        <Copy size={11} aria-hidden="true" />
      </button>
    </span>
  );
}

interface EditorHeaderActionsProps {
  backLabel: string;
  onBack: () => void;
  publicHref?: string | null;
  publicLabel: string;
  publicDisabledReason?: string;
  submitLabel: string;
  saving: boolean;
}

export function EditorHeaderActions({
  backLabel,
  onBack,
  publicHref,
  publicLabel,
  publicDisabledReason,
  submitLabel,
  saving,
}: EditorHeaderActionsProps) {
  return (
    <>
      <button
        type="button"
        onClick={onBack}
        disabled={saving}
        className={editorButtonSecondaryClass}
      >
        <ArrowLeft size={13} strokeWidth={2.2} aria-hidden="true" />
        {backLabel}
      </button>
      {publicHref ? (
        <a
          href={publicHref}
          target="_blank"
          rel="noreferrer"
          className={editorButtonSecondaryClass}
        >
          {publicLabel}
          <ExternalLink size={12} aria-hidden="true" />
        </a>
      ) : (
        <span title={publicDisabledReason}>
          <button type="button" disabled className={editorButtonSecondaryClass}>
            {publicLabel}
            <ExternalLink size={12} aria-hidden="true" />
          </button>
        </span>
      )}
      <button type="submit" disabled={saving} className={editorButtonPrimaryClass}>
        {saving && (
          <Loader2 size={13} className="animate-spin" aria-hidden="true" />
        )}
        {saving ? "Saving..." : submitLabel}
      </button>
    </>
  );
}
