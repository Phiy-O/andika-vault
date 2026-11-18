"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { MoreHorizontal, Edit, Eye, EyeOff, Trash2 } from "lucide-react";
import type { SkillListItem } from "@/src/types";

export type SkillActionHandlers = {
  busyIds: Set<string>;
  selectedIds: Set<string>;
  onToggleSelected: (id: string) => void;
  onToggleVisibility: (skill: SkillListItem) => void;
  onCopyPublicUrl: (skill: SkillListItem) => void;
  onDelete: (skill: SkillListItem) => void;
};

export function SkillActionsMenu({
  skill,
  actions,
}: {
  skill: SkillListItem;
  actions: SkillActionHandlers;
}) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const busy = actions.busyIds.has(skill.id);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  useEffect(() => {
    if (open) {
      const handleKeyDown = (event: KeyboardEvent) => {
        if (event.key === "Escape") {
          setOpen(false);
          buttonRef.current?.focus();
        }
      };
      document.addEventListener("keydown", handleKeyDown);
      return () => document.removeEventListener("keydown", handleKeyDown);
    }
  }, [open]);

  return (
    <div className="relative" ref={menuRef}>
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        aria-haspopup="menu"
        aria-label={`Actions for ${skill.name}`}
        className="grid size-8 place-items-center border border-line bg-surface transition-colors hover:bg-admin-wash disabled:cursor-not-allowed disabled:opacity-50"
        disabled={busy}
      >
        <MoreHorizontal size={14} aria-hidden="true" />
      </button>

      {open && (
        <div
          className="absolute right-0 top-full z-10 mt-1.5 min-w-[160px] rounded border border-line bg-background shadow-[4px_4px_0_var(--foreground)]"
          role="menu"
        >
          <Link
            href={`/admin/skills/${skill.id}/edit`}
            className="flex w-full items-center gap-2 px-3 py-2 text-left font-sans text-[11px] text-foreground hover:bg-admin-wash"
            role="menuitem"
            onClick={() => setOpen(false)}
          >
            <Edit size={13} aria-hidden="true" />
            Edit
          </Link>
          <button
            type="button"
            onClick={() => {
              actions.onToggleVisibility(skill);
              setOpen(false);
            }}
            disabled={busy}
            className="flex w-full items-center gap-2 px-3 py-2 text-left font-sans text-[11px] text-foreground hover:bg-admin-wash disabled:cursor-not-allowed disabled:opacity-50"
            role="menuitem"
          >
            {skill.isVisible ? (
              <>
                <EyeOff size={13} aria-hidden="true" />
                Move to draft
              </>
            ) : (
              <>
                <Eye size={13} aria-hidden="true" />
                Publish
              </>
            )}
          </button>
          <button
            type="button"
            onClick={() => {
              actions.onDelete(skill);
              setOpen(false);
            }}
            disabled={busy}
            className="flex w-full items-center gap-2 px-3 py-2 text-left font-sans text-[11px] text-red-400 hover:bg-admin-alert/10 disabled:cursor-not-allowed disabled:opacity-50"
            role="menuitem"
          >
            <Trash2 size={13} aria-hidden="true" />
            Delete
          </button>
        </div>
      )}
    </div>
  );
}