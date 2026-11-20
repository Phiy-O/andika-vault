"use client";

import { useEffect, useRef } from "react";
import type { ReactNode } from "react";

let bodyScrollLocks = 0;

function lockBodyScroll() {
  bodyScrollLocks += 1;
  document.body.style.overflow = "hidden";
}

function unlockBodyScroll() {
  bodyScrollLocks = Math.max(0, bodyScrollLocks - 1);
  if (bodyScrollLocks === 0) {
    document.body.style.overflow = "";
  }
}

interface FullscreenDialogProps {
  open: boolean;
  onClose: () => void;
  label: string;
  shortcut?: boolean;
  children: ReactNode;
}

/**
 * Native full-viewport dialog used by the blog focus writer and preview.
 * Native `showModal()` provides focus trapping and `Esc`; children mount
 * only while open so embedded editors re-read their initial content.
 */
export function FullscreenDialog({
  open,
  onClose,
  label,
  shortcut,
  children,
}: FullscreenDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (open && !dialog.open) {
      dialog.showModal();
    } else if (!open && dialog.open) {
      dialog.close();
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    lockBodyScroll();
    return unlockBodyScroll;
  }, [open]);

  return (
    <dialog
      ref={dialogRef}
      onClose={onClose}
      aria-label={label}
      data-editor-shortcut={shortcut ? "allow" : undefined}
      className="fixed inset-0 z-50 m-0 h-dvh max-h-none w-screen max-w-none border-0 bg-background p-0 text-foreground backdrop:bg-foreground/60 open:flex open:flex-col"
    >
      {open && children}
    </dialog>
  );
}
