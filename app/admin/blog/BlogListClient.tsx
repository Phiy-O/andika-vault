"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Edit3, Trash2, ExternalLink, Eye, EyeOff } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { useToast } from "@/components/ui/Toast";
import { ListToolbar, type StatusFilter } from "@/components/admin/ListToolbar";
import type { BlogPostListItem } from "@/src/types";

export function BlogListClient({
  posts,
}: {
  posts: BlogPostListItem[];
}) {
  const router = useRouter();
  const showToast = useToast();
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<StatusFilter>("all");
  const [category, setCategory] = useState("all");
  const [deleting, setDeleting] = useState<{
    id: string;
    title: string;
  } | null>(null);

  const categories = Array.from(new Set(posts.map((p) => p.category))).sort();

  const filtered = posts.filter((p) => {
    if (status === "published" && !p.isVisible) return false;
    if (status === "draft" && p.isVisible) return false;
    if (category !== "all" && p.category !== category) return false;
    const q = search.trim().toLowerCase();
    if (!q) return true;
    return (
      p.title.toLowerCase().includes(q) ||
      p.excerpt.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      p.tags?.some((t) => t.toLowerCase().includes(q))
    );
  });

  async function handleDelete(id: string, title: string) {
    setDeleting({ id, title });
  }

  async function confirmDelete() {
    if (!deleting) return;
    const res = await fetch(`/api/admin/blog/${deleting.id}`, {
      method: "DELETE",
    });
    setDeleting(null);
    if (res.ok) {
      showToast("Blog berhasil dihapus");
      router.refresh();
    }
  }

  if (posts.length === 0) {
    return (
      <div className="rounded-lg border border-line bg-surface/30 px-8 py-16 text-center">
        <p className="text-muted">No blog posts yet.</p>
        <Link
          href="/admin/blog/new"
          className="mt-3 inline-block text-sm text-purple hover:underline"
        >
          Create your first post →
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
        placeholder="Search posts..."
      />
      <div className="overflow-x-auto rounded-lg border border-line">
      <table className="w-full text-left text-sm">
        <thead className="border-b border-line bg-surface/50 text-xs uppercase tracking-wider text-muted">
          <tr>
            <th className="px-4 py-3 font-medium">Post</th>
            <th className="px-4 py-3 font-medium">Category</th>
            <th className="px-4 py-3 font-medium">Tags</th>
            <th className="px-4 py-3 font-medium">Order</th>
            <th className="px-4 py-3 font-medium">Status</th>
            <th className="px-4 py-3 font-medium text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-line">
          {filtered.map((p) => (
            <tr key={p.id} className="transition-colors hover:bg-surface/20">
              <td className="px-4 py-3.5">
                <div className="flex items-center gap-3">
                  {p.thumbnail ? (
                    <img
                      src={p.thumbnail}
                      alt=""
                      className="h-9 w-14 shrink-0 rounded border border-line object-cover"
                    />
                  ) : (
                    <div className="h-9 w-14 shrink-0 rounded border border-line bg-surface" />
                  )}
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-medium text-foreground">
                        {p.title}
                      </span>
                      <Link
                        href={`/blog/${p.slug}`}
                        target="_blank"
                        className="text-muted hover:text-foreground"
                      >
                        <ExternalLink size={12} />
                      </Link>
                    </div>
                    <p className="mt-0.5 line-clamp-1 text-xs text-muted">
                      {p.excerpt}
                    </p>
                  </div>
                </div>
              </td>
              <td className="px-4 py-3.5 capitalize text-muted">{p.category}</td>
              <td className="px-4 py-3.5">
                <div className="flex flex-wrap gap-1">
                  {p.tags?.map((t, i) => (
                    <span
                      key={i}
                      className="rounded border border-line bg-surface/30 px-1.5 py-0.5 text-xs text-muted"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </td>
              <td className="px-4 py-3.5 text-muted">{p.sortOrder}</td>
              <td className="px-4 py-3.5">
                {p.isVisible ? (
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
                    href={`/admin/blog/${p.id}/edit`}
                    className="rounded p-1.5 text-muted transition-colors hover:bg-surface hover:text-foreground"
                    title="Edit"
                  >
                    <Edit3 size={14} />
                  </Link>
                  <button
                    onClick={() => handleDelete(p.id, p.title)}
                    className="rounded p-1.5 text-muted transition-colors hover:bg-surface hover:text-red-400"
                    title="Delete"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Delete confirmation */}
      <Modal
        open={!!deleting}
        onClose={() => setDeleting(null)}
        title="Delete post"
        confirmLabel="Delete"
        cancelLabel="Cancel"
        onConfirm={confirmDelete}
      >
        <p className="m-0 text-sm leading-[1.7] text-muted">
          Are you sure you want to delete{" "}
          <span className="font-medium text-foreground">
            {deleting?.title}
          </span>
          ? This cannot be undone.
        </p>
      </Modal>
    </div>
    </>
  );
}
