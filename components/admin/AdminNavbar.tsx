"use client";

import { Menu, X } from "lucide-react";
import { useState } from "react";
import { AdminSidebar } from "./AdminSidebar";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";

export function AdminNavbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { data: session } = useSession();

  return (
    <>
      {/* top bar */}
      <header className="flex h-16 items-center justify-between border-b border-line bg-[#1a1821] px-6">
        {/* mobile menu toggle */}
        <button
          onClick={() => setMobileOpen(true)}
          className="hidden max-md:flex items-center gap-2 text-muted hover:text-foreground transition-colors"
          aria-label="Open sidebar"
        >
          <Menu size={20} />
        </button>

        {/* left spacer on desktop */}
        <div className="max-md:hidden" />

        {/* right */}
        <div className="flex items-center gap-4">
          <Link
            href="/"
            className="text-[10px] tracking-[.12em] uppercase text-muted transition-colors hover:text-foreground"
          >
            View Site
          </Link>
          <span className="h-4 w-px bg-line" />
          <span className="text-sm text-muted">
            {session?.user?.email ?? "Admin"}
          </span>
        </div>
      </header>

      {/* mobile overlay + sidebar */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 flex">
          {/* backdrop */}
          <div
            className="flex-1 bg-black/60"
            onClick={() => setMobileOpen(false)}
          />
          {/* mobile sidebar */}
          <div className="relative w-64">
            <button
              onClick={() => setMobileOpen(false)}
              className="absolute right-4 top-4 z-10 text-muted hover:text-foreground transition-colors"
              aria-label="Close sidebar"
            >
              <X size={20} />
            </button>
            <AdminSidebar />
          </div>
        </div>
      )}
    </>
  );
}
