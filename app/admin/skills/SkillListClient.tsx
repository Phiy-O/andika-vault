"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Image from "next/image";
import { Edit3, Trash2, Eye, EyeOff, ChevronLeft, ChevronRight } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { useToast } from "@/components/ui/Toast";
import { ListToolbar, type StatusFilter } from "@/components/admin/ListToolbar";
import type { SkillListItem } from "@/src/types";

export function SkillListClient({
  skills,
}: {
  skills: SkillListItem[];
}) {
  const router = useRouter();
  const showToast = useToast();
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<StatusFilter>("all");
  const [category, setCategory] = useState("all");
  const [deleting, setDeleting] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const [page, setPage] = useState(0);
  const PAGE_SIZE = 10;

  const categories = Array.from(new Set(skills.map((s) => s.category))).sort();

  const filtered = skills.filter((s) => {
    if (status === "published" && !s.isVisible) return false;
    if (status === "draft" && s.isVisible) return false;
    if (category !== "all" && s.category !== category) return false;
    const q = search.trim().toLowerCase();
    if (!q) return true;
    return s.name.toLowerCase().includes(q);
  });
  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const current = Math.min(page, pageCount - 1);
  const pageItems = filtered.slice(
    current * PAGE_SIZE,
    (current + 1) * PAGE_SIZE
  );

  function resetPage() {
    setPage(0);
  }

  function handleDelete(id: string, name: string) {
    setDeleting({ id, name });
  }

  async function confirmDelete() {
    if (!deleting) return;
    const res = await fetch(`/api/admin/skills/${deleting.id}`, {
      method: "DELETE",
    });
    setDeleting(null);
    if (res.ok) {
      showToast("Skill berhasil dihapus");
      router.refresh();
    }
  }

  if (skills.length === 0) {
    return (
      <div className="rounded-lg border border-line bg-surface/30 px-8 py-16 text-center">
        <p className="text-muted">No skills yet.</p>
        <Link
          href="/admin/skills/new"
          className="mt-3 inline-block text-sm text-purple hover:underline"
        >
          Add your first skill →
        </Link>
      </div>
    );
  }

  return (
    <>
      <ListToolbar
        search={search}
        onSearch={setSearch}
        status={status}
        onStatus={setStatus}
        categories={categories}
        category={category}
        onCategory={setCategory}
        placeholder="Search skills..."
        onResetPage={resetPage}
      />
      <div className="overflow-x-auto rounded-lg border border-line">
      <table className="w-full text-left text-sm">
        <thead className="border-b border-line bg-surface/50 text-xs uppercase tracking-wider text-muted">
          <tr>
            <th className="px-4 py-3 font-medium">Skill</th>
            <th className="px-4 py-3 font-medium">Category</th>
            <th className="px-4 py-3 font-medium">Order</th>
            <th className="px-4 py-3 font-medium">Status</th>
            <th className="px-4 py-3 font-medium text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-line">
          {pageItems.map((s) => (
            <tr key={s.id} className="transition-colors hover:bg-surface/20">
              <td className="px-4 py-3.5">
                <div className="flex items-center gap-3">
                  <Image
                    src={s.iconSrc}
                    alt=""
                    width={22}
                    height={22}
                    className="h-5.5 w-5.5 shrink-0"
                  />
                  <span className="font-medium text-foreground">{s.name}</span>
                </div>
              </td>
              <td className="px-4 py-3.5">
                <span className="rounded border border-line bg-surface/30 px-2 py-0.5 text-xs capitalize text-muted">
                  {s.category}
                </span>
              </td>
              <td className="px-4 py-3.5 text-muted">{s.sortOrder}</td>
              <td className="px-4 py-3.5">
                {s.isVisible ? (
                  <span className="inline-flex items-center gap-1 text-xs text-green-400">
                    <Eye size={12} /> Visible
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-xs text-muted">
                    <EyeOff size={12} /> Hidden
                  </span>
                )}
              </td>
              <td className="px-4 py-3.5 text-right">
                <div className="flex items-center justify-end gap-1">
                  <Link
                    href={`/admin/skills/${s.id}/edit`}
                    className="rounded p-1.5 text-muted transition-colors hover:bg-surface hover:text-foreground"
                    title="Edit"
                  >
                    <Edit3 size={15} />
                  </Link>
                  <button
                    onClick={() => handleDelete(s.id, s.name)}
                    className="rounded p-1.5 text-muted transition-colors hover:bg-red-500/10 hover:text-red-400"
                    title="Delete"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="flex items-center justify-between border-t border-line px-4 py-3 text-sm text-muted">
        <span>
          {filtered.length === 0
            ? "0 items"
            : `${current * PAGE_SIZE + 1}–${Math.min(
                (current + 1) * PAGE_SIZE,
                filtered.length
              )} of ${filtered.length}`}
        </span>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setPage(current - 1)}
            disabled={current === 0}
            className="rounded p-1.5 transition-colors hover:bg-surface hover:text-foreground disabled:cursor-not-allowed disabled:opacity-40"
            title="Previous page"
          >
            <ChevronLeft size={16} />
          </button>
          <span className="px-2">
            {current + 1} / {pageCount}
          </span>
          <button
            onClick={() => setPage(current + 1)}
            disabled={current >= pageCount - 1}
            className="rounded p-1.5 transition-colors hover:bg-surface hover:text-foreground disabled:cursor-not-allowed disabled:opacity-40"
            title="Next page"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* Delete confirmation */}
      <Modal
        open={!!deleting}
        onClose={() => setDeleting(null)}
        title="Delete skill"
        confirmLabel="Delete"
        cancelLabel="Cancel"
        onConfirm={confirmDelete}
      >
        <p className="m-0 text-sm leading-[1.7] text-muted">
          Are you sure you want to delete{" "}
          <span className="font-medium text-foreground">{deleting?.name}</span>
          ? This cannot be undone.
        </p>
      </Modal>
    </div>
    </>
  );
}
