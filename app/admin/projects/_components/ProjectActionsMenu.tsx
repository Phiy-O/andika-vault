"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import {
  Copy,
  Eye,
  EyeOff,
  ExternalLink,
  MoreHorizontal,
  Pencil,
  Star,
  StarOff,
  Trash2,
} from "lucide-react";
import type { ProjectListItem } from "@/src/types";
import type { ProjectActionHandlers } from "./types";

const itemClass =
  "flex w-full items-center gap-2 px-3 py-2 text-left font-space text-[11px] font-medium leading-4 text-foreground outline-none transition-colors hover:bg-admin-wash focus-visible:bg-admin-wash disabled:cursor-wait disabled:opacity-50";

export function ProjectActionsMenu({
  project,
  actions,
  className = "",
}: {
  project: ProjectListItem;
  actions: ProjectActionHandlers;
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const busy = actions.busyIds.has(project.id);

  useEffect(() => {
    if (!open) return;

    menuRef.current
      ?.querySelector<HTMLElement>('[role="menuitem"]:not([disabled])')
      ?.focus();

    function closeOnPointer(event: PointerEvent) {
      if (!containerRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    function closeOnEscape(event: KeyboardEvent) {
      if (event.key !== "Escape") return;
      event.preventDefault();
      setOpen(false);
      triggerRef.current?.focus();
    }

    document.addEventListener("pointerdown", closeOnPointer);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("pointerdown", closeOnPointer);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [open]);

  function run(action: () => void) {
    setOpen(false);
    action();
  }

  function onMenuKeyDown(event: React.KeyboardEvent<HTMLDivElement>) {
    if (
      event.key !== "ArrowDown" &&
      event.key !== "ArrowUp" &&
      event.key !== "Home" &&
      event.key !== "End"
    ) {
      return;
    }
    event.preventDefault();
    const items = Array.from(
      menuRef.current?.querySelectorAll<HTMLElement>(
        '[role="menuitem"]:not([disabled])'
      ) ?? []
    );
    if (items.length === 0) return;
    const current = items.indexOf(document.activeElement as HTMLElement);
    let next = 0;
    if (event.key === "ArrowDown") next = (current + 1) % items.length;
    else if (event.key === "ArrowUp")
      next = (current - 1 + items.length) % items.length;
    else if (event.key === "End") next = items.length - 1;
    items[next]?.focus();
  }

  return (
    <div ref={containerRef} className={`relative shrink-0 ${className}`}>
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen((value) => !value)}
        disabled={busy}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={`More actions for ${project.title}`}
        title="More actions"
        className="grid size-8 place-items-center border border-line bg-surface text-foreground transition-colors hover:bg-admin-wash disabled:cursor-wait disabled:opacity-50"
      >
        <MoreHorizontal size={15} aria-hidden="true" />
      </button>

      {open && (
        <div
          ref={menuRef}
          role="menu"
          aria-label={`Actions for ${project.title}`}
          onKeyDown={onMenuKeyDown}
          className="absolute right-0 top-[calc(100%+4px)] z-30 w-56 border-2 border-line bg-surface py-1 shadow-[3px_3px_0_var(--foreground)]"
        >
          <Link
            href={`/admin/projects/${project.id}/edit`}
            role="menuitem"
            className={itemClass}
            onClick={() => setOpen(false)}
          >
            <Pencil size={13} aria-hidden="true" />
            Edit project
          </Link>

          <a
            href={`/projects/${project.slug}`}
            target="_blank"
            rel="noreferrer"
            role="menuitem"
            className={itemClass}
            onClick={() => setOpen(false)}
          >
            <ExternalLink size={13} aria-hidden="true" />
            Open public page
          </a>

          <button
            type="button"
            role="menuitem"
            className={itemClass}
            onClick={() => run(() => actions.onCopyPublicUrl(project))}
          >
            <Copy size={13} aria-hidden="true" />
            Copy public URL
          </button>

          <div role="separator" className="my-1 border-t border-line/25" />

          <button
            type="button"
            role="menuitem"
            className={itemClass}
            onClick={() => run(() => actions.onToggleVisibility(project))}
          >
            {project.isVisible ? (
              <EyeOff size={13} aria-hidden="true" />
            ) : (
              <Eye size={13} aria-hidden="true" />
            )}
            {project.isVisible ? "Move to draft" : "Publish project"}
          </button>

          <button
            type="button"
            role="menuitem"
            className={itemClass}
            onClick={() => run(() => actions.onToggleFeatured(project))}
          >
            {project.featured ? (
              <StarOff size={13} aria-hidden="true" />
            ) : (
              <Star size={13} aria-hidden="true" />
            )}
            {project.featured ? "Remove from featured" : "Mark as featured"}
          </button>

          <div role="separator" className="my-1 border-t border-line/25" />

          <button
            type="button"
            role="menuitem"
            className={`${itemClass} text-admin-alert`}
            onClick={() => run(() => actions.onDelete(project))}
          >
            <Trash2 size={13} aria-hidden="true" />
            Delete project
          </button>
        </div>
      )}
    </div>
  );
}
