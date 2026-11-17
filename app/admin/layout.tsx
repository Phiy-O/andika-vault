import { AdminMain } from "@/components/admin/AdminMain";
import { AdminNavbar } from "@/components/admin/AdminNavbar";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { getSiteSettings } from "@/src/actions/site-setting";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: settings } = await getSiteSettings();
  const profile = {
    name: settings?.aboutName?.trim() || "Studio Admin",
    role: settings?.aboutRole?.trim() || "Content Manager",
  };

  return (
    <div className="admin-shell flex min-h-screen bg-background text-foreground">
      <AdminSidebar profile={profile} />
      <div className="flex min-w-0 flex-1 flex-col">
        <AdminNavbar profile={profile} />
        <AdminMain>{children}</AdminMain>
      </div>
    </div>
  );
}
