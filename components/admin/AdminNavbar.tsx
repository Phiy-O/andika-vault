"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Menu, Search, X } from "lucide-react";
import { AdminSidebar, type AdminProfile } from "./AdminSidebar";

const labels: Array<[string, string]> = [
  ["/admin/projects", "Projects"],
  ["/admin/blog", "Articles"],
  ["/admin/certificates", "Achievements"],
  ["/admin/skills", "Skills"],
  ["/admin/messages", "Messages"],
  ["/admin/settings", "Settings"],
];

const searchSections: Array<[string, string, string]> = [
  ["/admin/projects", "/admin/projects", "Search projects"],
  ["/admin/blog", "/admin/blog", "Search articles"],
  ["/admin/certificates", "/admin/certificates", "Search achievements"],
];

function searchTarget(pathname: string) {
  const match = searchSections.find(([prefix]) => pathname.startsWith(prefix));
  return match
    ? { href: match[1], label: match[2] }
    : { href: "/admin/projects", label: "Search projects" };
}

function currentLabel(pathname: string) {
  if (pathname === "/admin") return "Overview";
  const match = labels.find(([href]) => pathname.startsWith(href));
  return match?.[1] ?? "Workspace";
}

export function AdminNavbar({ profile }: { profile: AdminProfile }) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const closeRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const label = currentLabel(pathname);
  const search = searchTarget(pathname);

  useEffect(() => {
    if (!mobileOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setMobileOpen(false);
        return;
      }
      if (event.key !== "Tab" || !panelRef.current) return;
      const focusable = panelRef.current.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
      );
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previous;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [mobileOpen]);

  function submitSearch(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const value = query.trim();
    router.push(
      value ? `${search.href}?q=${encodeURIComponent(value)}` : search.href
    );
    setMobileSearchOpen(false);
    setMobileOpen(false);
  }

  return (
    <>
      <header className="sticky top-0 z-40 border-b-2 border-line bg-background/95 backdrop-blur-sm">
        <div className="flex h-16 items-center gap-3 px-4 sm:px-6">
          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            className="grid size-9 shrink-0 place-items-center border-2 border-line bg-surface transition-colors hover:bg-admin-wash md:hidden"
            aria-label="Open admin navigation"
            aria-expanded={mobileOpen}
          >
            <Menu size={17} aria-hidden="true" />
          </button>

          <div className="flex min-w-0 items-center gap-2">
            <span className="hidden font-jet text-[10px] font-medium uppercase leading-4 tracking-[.1em] text-muted sm:inline">
              Workspace
            </span>
            <span aria-hidden="true" className="hidden text-muted/60 sm:inline">
              /
            </span>
            <span className="truncate font-jet text-[10px] font-bold uppercase leading-4 tracking-[.1em] text-foreground">
              {label}
            </span>
          </div>

          <div className="ml-auto flex items-center gap-2">
            <form
              onSubmit={submitSearch}
              role="search"
              className="hidden h-9 w-[256px] items-center border-2 border-line bg-surface pl-2.5 lg:flex"
            >
              <Search size={14} className="shrink-0 text-muted" aria-hidden="true" />
              <label htmlFor="admin-global-search" className="sr-only">
                {search.label}
              </label>
              <input
                id="admin-global-search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search content, tags..."
                className="h-full min-w-0 flex-1 border-0 bg-transparent px-2 font-sans text-[11px] text-foreground outline-none placeholder:text-muted/80"
              />
            </form>

            <button
              type="button"
              onClick={() => setMobileSearchOpen((open) => !open)}
              className="grid size-9 place-items-center border-2 border-line bg-surface transition-colors hover:bg-admin-wash lg:hidden"
              aria-label={search.label}
              aria-expanded={mobileSearchOpen}
            >
              <Search size={15} aria-hidden="true" />
            </button>

            <span className="hidden h-9 items-center gap-2 border-2 border-line bg-surface px-2.5 sm:inline-flex">
              <span className="size-1.5 rounded-full bg-admin-success" />
              <span className="font-jet text-[9px] font-medium leading-3 text-foreground">
                Studio Access // Admin
              </span>
            </span>

            <Link
              href="/admin/settings"
              className="shrink-0 rounded-full border-2 border-line transition-transform hover:-translate-y-0.5"
              aria-label={`Open ${profile.name}'s settings`}
              title={profile.name}
            >
              <Image
                src="/images/andika-profile.png"
                alt=""
                width={32}
                height={32}
                className="size-8 rounded-full object-cover"
              />
            </Link>
          </div>
        </div>

        {mobileSearchOpen && (
          <div className="border-t border-line/25 px-4 pb-3 pt-2 lg:hidden">
            <form
              onSubmit={submitSearch}
              role="search"
              className="flex h-9 items-center border-2 border-line bg-surface pl-2.5"
            >
              <Search size={14} className="shrink-0 text-muted" aria-hidden="true" />
              <label htmlFor="admin-global-search-mobile" className="sr-only">
                {search.label}
              </label>
              <input
                id="admin-global-search-mobile"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search content, tags..."
                autoFocus
                className="h-full min-w-0 flex-1 border-0 bg-transparent px-2 font-sans text-[11px] text-foreground outline-none placeholder:text-muted/80"
              />
              <button
                type="submit"
                className="h-full border-l-2 border-line bg-purple px-3 font-jet text-[9px] font-bold uppercase tracking-[.06em]"
              >
                Go
              </button>
            </form>
          </div>
        )}
      </header>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <button
            type="button"
            className="absolute inset-0 cursor-default border-0 bg-foreground/50 backdrop-blur-[1px]"
            onClick={() => setMobileOpen(false)}
            aria-label="Close admin navigation"
          />
          <div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-label="Admin navigation"
            className="relative z-10 flex h-dvh w-72 max-w-[86vw] flex-col border-r-2 border-line bg-background"
          >
            <div className="flex h-12 shrink-0 items-center justify-between border-b-2 border-line px-4">
              <span className="font-jet text-[9px] font-bold uppercase tracking-[.14em] text-muted">
                Navigation
              </span>
              <button
                ref={closeRef}
                type="button"
                onClick={() => setMobileOpen(false)}
                className="grid size-8 place-items-center border border-line bg-surface"
                aria-label="Close admin navigation"
              >
                <X size={16} aria-hidden="true" />
              </button>
            </div>
            <div className="min-h-0 flex-1">
              <AdminSidebar
                profile={profile}
                onNavigate={() => setMobileOpen(false)}
                className="!flex h-full w-full border-r-0"
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
