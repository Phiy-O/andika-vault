"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  Award,
  ExternalLink,
  FileText,
  FolderKanban,
  LayoutDashboard,
  LogOut,
  MessageSquare,
  Settings,
  Wrench,
} from "lucide-react";

export type AdminProfile = {
  name: string;
  role: string;
};

const groups = [
  {
    label: "Overview",
    links: [{ label: "Overview", href: "/admin", icon: LayoutDashboard }],
  },
  {
    label: "Content",
    links: [
      { label: "Projects", href: "/admin/projects", icon: FolderKanban },
      { label: "Articles", href: "/admin/blog", icon: FileText },
      { label: "Achievements", href: "/admin/certificates", icon: Award },
      { label: "Skills", href: "/admin/skills", icon: Wrench },
    ],
  },
  {
    label: "Resources",
    links: [{ label: "Messages", href: "/admin/messages", icon: MessageSquare }],
  },
  {
    label: "System",
    links: [{ label: "Settings", href: "/admin/settings", icon: Settings }],
  },
];

function initials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "ST";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
}

export function AdminSidebar({
  profile,
  className = "",
  onNavigate,
}: {
  profile: AdminProfile;
  className?: string;
  onNavigate?: () => void;
}) {
  const pathname = usePathname();
  const mono = initials(profile.name);

  return (
    <aside
      className={`hidden w-64 shrink-0 flex-col border-r-2 border-line bg-background md:sticky md:top-0 md:flex md:h-dvh ${className}`}
    >
      <div className="shrink-0 border-b-2 border-line p-2">
        <Link
          href="/admin"
          onClick={onNavigate}
          className="flex items-center gap-3 p-1"
          aria-label="Portfolio studio dashboard"
        >
          <span className="grid size-10 shrink-0 place-items-center border-2 border-line bg-foreground font-space text-[13px] font-bold tracking-[-.04em] text-background">
            {mono}
          </span>
          <span className="min-w-0">
            <span className="block truncate font-space text-[17px] font-bold uppercase leading-5 tracking-[-.035em]">
              Portfolio
            </span>
            <span className="mt-0.5 block font-jet text-[9px] font-medium uppercase leading-3 tracking-[.1em] text-muted">
              Studio // CMS
            </span>
          </span>
        </Link>
      </div>

      <div className="shrink-0 px-2 pt-2">
        <div className="flex items-center gap-2 border border-line bg-surface px-2 py-1.5">
          <span className="size-1.5 shrink-0 rounded-full bg-admin-success" />
          <span className="font-jet text-[8px] font-bold uppercase leading-3 tracking-[.1em]">
            Content management
          </span>
        </div>
      </div>

      <nav
        className="min-h-0 flex-1 overflow-y-auto px-2 py-4"
        aria-label="Admin navigation"
      >
        {groups.map((group) => (
          <div key={group.label} className="mb-4 last:mb-0">
            <p className="mb-1.5 px-2 font-jet text-[9px] font-medium uppercase leading-3 tracking-[.14em] text-muted">
              {group.label}
            </p>
            <div className="space-y-1">
              {group.links.map((item) => {
                const Icon = item.icon;
                const active =
                  item.href === "/admin"
                    ? pathname === "/admin"
                    : pathname.startsWith(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={onNavigate}
                    aria-current={active ? "page" : undefined}
                    className={`flex h-[34px] items-center gap-2.5 border-2 px-2 font-space text-[12px] font-medium leading-4 transition-colors ${
                      active
                        ? "border-line bg-purple text-foreground shadow-[2px_2px_0_var(--foreground)]"
                        : "border-transparent text-muted hover:border-line hover:bg-surface hover:text-foreground"
                    }`}
                  >
                    <Icon size={14} strokeWidth={1.8} aria-hidden="true" />
                    <span className="truncate">{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      <div className="mt-auto shrink-0 border-t-2 border-line p-2">
        <Link
          href="/"
          target="_blank"
          rel="noreferrer"
          onClick={onNavigate}
          className="flex h-8 items-center justify-between border border-line bg-surface px-2 font-jet text-[9px] font-bold uppercase tracking-[.08em] transition-colors hover:bg-admin-wash"
        >
          View website
          <ExternalLink size={12} aria-hidden="true" />
        </Link>

        <div className="mt-2 flex items-center gap-2 border-t-2 border-line pt-2">
          <Image
            src="/images/andika-profile.png"
            alt=""
            width={32}
            height={32}
            className="size-8 shrink-0 rounded-full border-2 border-line object-cover"
          />
          <div className="min-w-0 flex-1">
            <p className="truncate font-space text-[12px] font-bold leading-4">
              {profile.name}
            </p>
            <p className="truncate font-jet text-[8px] uppercase leading-3 tracking-[.06em] text-muted">
              {profile.role}
            </p>
          </div>
          <button
            type="button"
            onClick={() => signOut({ callbackUrl: "/auth/login" })}
            className="grid size-8 shrink-0 place-items-center border border-transparent text-muted transition-colors hover:border-line hover:bg-surface hover:text-foreground"
            aria-label="Sign out"
            title="Sign out"
          >
            <LogOut size={14} aria-hidden="true" />
          </button>
        </div>
      </div>
    </aside>
  );
}
