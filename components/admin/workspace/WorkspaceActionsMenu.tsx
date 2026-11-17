"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { MoreHorizontal } from "lucide-react";
import type { WorkspaceActionItem } from "./types";

const itemClass =
  "flex w-full items-center gap-2 px-3 py-2 text-left font-space text-[11px] font-medium leading-4 text-foreground outline-none transition-colors hover:bg-admin-wash focus-visible:bg-admin-wash disabled:cursor-wait disabled:opacity-50";

export function WorkspaceActionsMenu({
  label,
  items,
  disabled = false,
  className = "",
}: {
  label: string;
  items: WorkspaceActionItem[];
  disabled?: boolean;
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

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
    const menuItems = Array.from(
      menuRef.current?.querySelectorAll<HTMLElement>(
        '[role="menuitem"]:not([disabled])'
      ) ?? []
    );
    if (menuItems.length === 0) return;
    const current = menuItems.indexOf(document.activeElement as HTMLElement);
    let next = 0;
    if (event.key === "ArrowDown") next = (current + 1) % menuItems.length;
    else if (event.key === "ArrowUp")
      next = (current - 1 + menuItems.length) % menuItems.length;
    else if (event.key === "End") next = menuItems.length - 1;
    menuItems[next]?.focus();
  }

  return (
    <div ref={containerRef} className={`relative shrink-0 ${className}`}>
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen((value) => !value)}
        disabled={disabled}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={label}
        title="More actions"
        className="grid size-8 place-items-center border border-line bg-surface text-foreground transition-colors hover:bg-admin-wash disabled:cursor-wait disabled:opacity-50"
      >
        <MoreHorizontal size={15} aria-hidden="true" />
      </button>

      {open && (
        <div
          ref={menuRef}
          role="menu"
          aria-label={label}
          onKeyDown={onMenuKeyDown}
          className="absolute right-0 top-[calc(100%+4px)] z-30 w-56 border-2 border-line bg-surface py-1 shadow-[3px_3px_0_var(--foreground)]"
        >
          {items.map((item, index) => {
            if (item.kind === "separator") {
              return (
                <div
                  key={`separator-${index}`}
                  role="separator"
                  className="my-1 border-t border-line/25"
                />
              );
            }

            const Icon = item.icon;

            if (item.kind === "link") {
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  role="menuitem"
                  className={itemClass}
                  onClick={() => {
                    setOpen(false);
                    item.onSelect?.();
                  }}
                  {...(item.external
                    ? { target: "_blank", rel: "noreferrer" }
                    : {})}
                >
                  <Icon size={13} aria-hidden="true" />
                  {item.label}
                </Link>
              );
            }

            return (
              <button
                key={item.label}
                type="button"
                role="menuitem"
                className={`${itemClass} ${item.danger ? "text-admin-alert" : ""}`}
                disabled={item.disabled}
                onClick={() => run(item.onSelect)}
              >
                <Icon size={13} aria-hidden="true" />
                {item.label}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
