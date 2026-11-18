"use client";

import { X } from "lucide-react";
import { useEffect, useRef } from "react";

type ModalProps = {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  /** default footer: Cancel (secondary) + Confirm (primary coral) */
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm?: () => void;
  /** hide the default footer; render custom actions inside children */
  noFooter?: boolean;
};

/**
 * Reusable modal dialog styled for the admin studio theme.
 * Default footer = Cancel (secondary) + Confirm (primary coral).
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
      className="fixed inset-0 z-50 m-auto w-full max-w-120 bg-transparent p-4 border-0 backdrop:bg-foreground/60 open:flex open:items-center open:justify-center"
    >
      <div className="w-full border-2 border-line bg-surface shadow-[4px_4px_0_var(--foreground)]">
        {/* Header */}
        <div className="flex items-center justify-between gap-4 border-b-2 border-line px-5 py-4">
          {title && (
            <h2
              className="m-0 font-space text-base font-bold tracking-[-.02em] text-foreground"
              style={{
                margin: 0,
                fontSize: "16px",
                lineHeight: "1.25",
                fontWeight: 700,
                letterSpacing: "-.02em",
              }}
            >
              {title}
            </h2>
          )}
          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="ml-auto grid size-11 place-items-center border-2 border-line bg-background text-foreground transition-colors hover:bg-admin-wash"
          >
            <X size={15} />
          </button>
        </div>

        {/* Content */}
        <div className="px-5 py-5">{children}</div>

        {/* Default footer */}
        {!noFooter && (
          <div className="flex justify-end gap-3 border-t-2 border-line px-5 py-4">
            <button
              type="button"
              onClick={onClose}
              className="inline-flex h-10 items-center border-2 border-line bg-surface px-4 font-space text-[12px] font-bold tracking-[-.01em] text-foreground shadow-[2px_2px_0_var(--foreground)] transition-transform hover:-translate-y-0.5 hover:bg-admin-wash motion-reduce:transform-none"
            >
              {cancelLabel}
            </button>
            {onConfirm && (
              <button
                type="button"
                onClick={onConfirm}
                className="inline-flex h-10 items-center border-2 border-line bg-purple px-4 font-space text-[12px] font-bold tracking-[-.01em] text-foreground shadow-[3px_3px_0_var(--foreground)] transition-transform hover:-translate-y-0.5 hover:bg-[#ef7e70] motion-reduce:transform-none"
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
