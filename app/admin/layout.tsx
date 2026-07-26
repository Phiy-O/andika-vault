import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminNavbar } from "@/components/admin/AdminNavbar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-[#17151c]">
      <AdminSidebar />
      <div className="flex flex-1 flex-col">
        <AdminNavbar />
        <main className="flex-1 px-[10vw] py-10 max-md:px-[6vw]">
          {children}
        </main>
      </div>
    </div>
  );
}
