"use client";

import { useEffect, useState } from "react";

/**
 * Compares the current form values against a baseline captured on first render.
 * Returns true once the serialized values differ from the initial snapshot.
 */
export function useEditorDirty(values: unknown): boolean {
  const [baseline] = useState(() => JSON.stringify(values));
  const current = JSON.stringify(values);
  return current !== baseline;
}

/**
 * Warns on refresh/close while the form is dirty and not saving.
 * The listener is attached only when needed and removed on cleanup.
 */
export function useUnsavedGuard(options: {
  dirty: boolean;
  saving: boolean;
}): void {
  const { dirty, saving } = options;

  useEffect(() => {
    if (!dirty || saving) return;

    const handler = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = "";
    };

    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [dirty, saving]);
}

/**
 * Returns true when it is safe to navigate away.
 * Prompts with a native confirm dialog only when the form is dirty.
 */
export function confirmDiscard(dirty: boolean): boolean {
  if (!dirty) return true;
  return window.confirm("You have unsaved changes. Leave this page?");
}
