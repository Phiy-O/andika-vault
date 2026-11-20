"use client";

import { useEffect } from "react";

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

/**
 * Locks page scrolling while `active` is true. The module-level counter is
 * shared by every dialog, so closing a nested dialog keeps the page locked
 * until the outermost dialog closes.
 */
export function useBodyScrollLock(active: boolean): void {
  useEffect(() => {
    if (!active) return;
    lockBodyScroll();
    return unlockBodyScroll;
  }, [active]);
}
