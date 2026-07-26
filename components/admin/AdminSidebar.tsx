"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  FolderKanban,
  Award,
  MessageSquare,
  Settings,
  LogOut,
} from "lucide-react";
import { signOut } from "next-auth/react";

const sidebarLinks = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Blog Posts", href: "/admin/blog", icon: FileText },
  { label: "Projects", href: "/admin/projects", icon: FolderKanban },
  { label: "Certificates", href: "/admin/certificates", icon: Award },
  { label: "Messages", href: "/admin/messages", icon: MessageSquare },
  { label: "Settings", href: "/admin/settings", icon: Settings },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex w-64 flex-col border-r border-line bg-[#1a1821] max-md:hidden">
      {/* logo */}
      <div className="flex h-16 items-center border-b border-line px-6">
        <Link href="/admin" className="text-xl font-bold tracking-[-.06em] text-foreground">
          Andika<span className="text-purple">.</span>
        </Link>
      </div>

      {/* nav */}
      <nav className="flex-1 space-y-1 px-3 py-6" aria-label="Admin navigation">
        {sidebarLinks.map((item) => {
          const Icon = item.icon;
          const isActive =
            item.href === "/admin"
              ? pathname === "/admin"
              : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-all duration-200 ${
                isActive
                  ? "bg-purple/10 text-purple"
                  : "text-muted hover:bg-surface hover:text-foreground"
              }`}
            >
              <Icon size={18} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* footer */}
      <div className="border-t border-line px-3 py-4">
        <button
          onClick={() => signOut({ callbackUrl: "/auth/login" })}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-muted transition-all duration-200 hover:bg-surface hover:text-foreground"
        >
          <LogOut size={18} />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
