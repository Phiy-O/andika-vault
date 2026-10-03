"use client";

import { X } from "lucide-react";
import { useEffect, useRef } from "react";

type ModalProps = {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  /** default footer: Cancel (transparent + border) + Confirm (purple) */
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm?: () => void;
  /** hide the default footer; render custom actions inside children */
  noFooter?: boolean;
};

/**
 * Reusable modal dialog styled for the site theme.
 * Default footer = Cancel (transparent w/ border) + Confirm (purple).
 * Customize via children / noFooter for any page-specific content.
 */
export function Modal({
  open,
  onClose,
  title,
  children,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  onConfirm,
  noFooter = false,
}: ModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open) {
      if (!dialog.open) dialog.showModal();
      document.body.style.overflow = "hidden";
    } else if (dialog.open) {
      dialog.close();
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  function handleBackdropClick(e: React.MouseEvent) {
    if (e.target === dialogRef.current) onClose();
  }

  return (
    <dialog
      ref={dialogRef}
      onClose={onClose}
      onClick={handleBackdropClick}
      className="fixed inset-0 z-50 m-auto w-full max-w-120 bg-transparent p-4 border-0 backdrop:bg-black/70 open:flex open:items-center open:justify-center"
    >
      <div className="w-full rounded-[18px] border border-line bg-surface shadow-[0_30px_80px_rgba(0,0,0,.5)]">
        {/* Header */}
        <div className="flex items-center justify-between gap-4 px-6 pt-5">
          {title && (
            <h2 className="m-0 text-base font-medium tracking-[-.02em] text-foreground">
              {title}
            </h2>
          )}
          <button
            onClick={onClose}
            aria-label="Close modal"
            className="ml-auto rounded-lg border border-line p-2 text-muted transition-colors hover:bg-surface hover:text-foreground cursor-pointer"
          >
            <X size={15} />
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-5">{children}</div>

        {/* Default footer */}
        {!noFooter && (
          <div className="flex justify-end gap-3 px-6 pb-6">
            <button
              onClick={onClose}
              className="rounded-lg border border-line px-5 py-2.5 text-sm text-muted transition-colors hover:bg-surface hover:text-foreground cursor-pointer"
            >
              {cancelLabel}
            </button>
            {onConfirm && (
              <button
                onClick={onConfirm}
                className="rounded-lg bg-purple px-5 py-2.5 text-sm font-medium text-[#17151c] transition-opacity hover:opacity-90 cursor-pointer"
              >
                {confirmLabel}
              </button>
            )}
          </div>
        )}
      </div>
    </dialog>
  );
}
