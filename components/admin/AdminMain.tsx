"use client";

import { usePathname } from "next/navigation";

export function AdminMain({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const flush = pathname === "/admin/projects";

  return (
    <main
      className={`mx-auto w-full max-w-[1500px] flex-1 px-4 sm:px-6 ${
        flush ? "pb-2 pt-0" : "py-6"
      }`}
    >
      {children}
    </main>
  );
}
