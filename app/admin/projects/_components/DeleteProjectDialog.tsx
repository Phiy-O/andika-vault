"use client";

import { useEffect, useRef, useState } from "react";
import { AlertCircle, AlertTriangle, Loader2, Trash2 } from "lucide-react";
import type { ProjectListItem } from "@/src/types";
import {
  articleLabel,
  mediaCount,
  pluralize,
  shortProjectId,
  statusLabel,
} from "./project-utils";

export function DeleteProjectDialog({
  open,
  projects,
  onClose,
  onConfirm,
}: {
  open: boolean;
  projects: ProjectListItem[];
  onClose: () => void;
  onConfirm: () => Promise<void>;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const cancelRef = useRef<HTMLButtonElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const count = projects.length;
  const primary = projects[0];
  const isBatch = count > 1;
  const media = projects.reduce((total, project) => total + mediaCount(project), 0);
  const allMarkdown = projects.every((project) => project.bodyFormat === "markdown");

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (open && !dialog.open) {
      setError(null);
      dialog.showModal();
      cancelRef.current?.focus();
    } else if (!open && dialog.open) {
      dialog.close();
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  async function handleConfirm() {
    if (busy) return;
    setBusy(true);
    setError(null);
    try {
      await onConfirm();
    } catch (cause) {
      setError(
        cause instanceof Error && cause.message
          ? cause.message
          : "The delete request failed. Please try again."
      );
    } finally {
      setBusy(false);
    }
  }

  function handleBackdropClick(event: React.MouseEvent<HTMLDialogElement>) {
    if (busy || event.target !== event.currentTarget) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const outside =
      event.clientX < rect.left ||
      event.clientX > rect.right ||
      event.clientY < rect.top ||
      event.clientY > rect.bottom;
    if (outside) onClose();
  }

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby="delete-project-title"
      aria-describedby="delete-project-description"
      onCancel={(event) => {
        event.preventDefault();
        if (!busy) onClose();
      }}
      onClick={handleBackdropClick}
      className="admin-dialog m-auto max-h-[90dvh] w-[512px] max-w-[calc(100vw-2rem)] overflow-y-auto border-2 border-line bg-surface p-0 text-foreground shadow-[6px_6px_0_var(--foreground)]"
    >
      <div className="flex flex-wrap items-center gap-x-3 gap-y-2 border-b-2 border-line p-4">
        <div className="flex min-w-0 items-center gap-2.5">
          <span className="grid size-8 shrink-0 place-items-center bg-admin-alert text-white">
            <AlertTriangle size={17} aria-hidden="true" />
          </span>
          <h2
            id="delete-project-title"
            className="font-space font-bold text-foreground"
            style={{
              margin: 0,
              fontSize: "18px",
              lineHeight: "22px",
              letterSpacing: "-.03em",
            }}
          >
            {isBatch ? `Delete ${count} projects?` : "Delete this project?"}
          </h2>
        </div>
        <span className="ml-auto shrink-0 border border-admin-alert px-2 py-1 font-jet text-[7.5px] font-bold uppercase leading-none tracking-[.08em] text-admin-alert">
          Destructive action
        </span>
      </div>

      <div className="space-y-4 p-4 sm:p-5">
        <p
          id="delete-project-description"
          className="m-0 text-[12.5px] leading-6 text-foreground"
        >
          {isBatch ? (
            <>
              This operation will permanently purge{" "}
              <strong className="font-semibold underline underline-offset-2">
                {count} project records
              </strong>{" "}
              from PostgreSQL, delete all referenced thumbnail and screenshot
              assets from Cloudinary, and remove them from the public project
              archive.
            </>
          ) : (
            <>
              This operation will permanently purge{" "}
              <strong className="font-semibold underline underline-offset-2">
                “{primary?.title}”
              </strong>{" "}
              from PostgreSQL, delete its referenced thumbnail and screenshot
              assets from Cloudinary, and remove the record from the public
              project archive.
            </>
          )}
        </p>

        <div className="border border-line bg-admin-wash/40 p-3 font-jet text-[8.5px] font-medium leading-[1.7] tracking-[.04em]">
          <dl className="m-0 grid grid-cols-[104px_minmax(0,1fr)] gap-x-3 gap-y-1">
            <dt className="uppercase text-muted">Target slug:</dt>
            <dd className="m-0 truncate text-right font-bold text-foreground">
              {isBatch || !primary
                ? `${count} project records`
                : `/projects/${primary.slug}`}
            </dd>

            <dt className="uppercase text-muted">Status:</dt>
            <dd className="m-0 truncate text-right font-bold uppercase text-admin-alert">
              {isBatch || !primary
                ? `Multi-select // ${count} records`
                : `${statusLabel(primary)} // ID ${shortProjectId(primary.id)}`}
            </dd>

            <dt className="uppercase text-muted">Bindings:</dt>
            <dd className="m-0 text-right font-bold text-foreground">
              {pluralize(media, "Media Asset")},{" "}
              {isBatch
                ? pluralize(count, allMarkdown ? "Markdown Article" : "Article")
                : primary
                  ? articleLabel(primary)
                  : "—"}
            </dd>
          </dl>
        </div>

        <div className="flex items-start gap-2 text-admin-alert">
          <AlertCircle
            size={13}
            className="mt-0.5 shrink-0"
            aria-hidden="true"
          />
          <p className="m-0 text-[10.5px] font-semibold leading-5">
            This action is non-reversible. A database snapshot will not be
            created.
          </p>
        </div>

        {error && (
          <p
            role="alert"
            className="m-0 border-2 border-admin-alert bg-admin-alert/10 px-3 py-2 text-[11.5px] leading-5 text-admin-alert"
          >
            {error}
          </p>
        )}
      </div>

      <div className="flex flex-wrap items-center justify-end gap-2 border-t-2 border-line p-4">
        <button
          ref={cancelRef}
          type="button"
          onClick={onClose}
          disabled={busy}
          className="inline-flex h-9 items-center justify-center border-2 border-line bg-surface px-4 font-space text-[12px] font-bold tracking-[-.01em] transition-colors hover:bg-admin-wash disabled:cursor-wait disabled:opacity-60"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={handleConfirm}
          disabled={busy || count === 0}
          className="inline-flex h-9 items-center justify-center gap-2 border-2 border-line bg-admin-alert px-4 font-space text-[12px] font-bold tracking-[-.01em] text-white shadow-[2px_2px_0_var(--foreground)] transition-colors hover:bg-[#951e18] disabled:cursor-wait disabled:opacity-70"
        >
          {busy ? (
            <Loader2 size={13} className="animate-spin" aria-hidden="true" />
          ) : (
            <Trash2 size={13} aria-hidden="true" />
          )}
          {busy
            ? "Deleting..."
            : isBatch
              ? `Delete ${count} Projects`
              : "Delete Project"}
        </button>
      </div>
    </dialog>
  );
}
