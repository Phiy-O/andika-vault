"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Edit3, Trash2, ExternalLink, Eye, EyeOff } from "lucide-react";
import type { ProjectListItem } from "@/src/types";

export function ProjectListClient({
  projects,
}: {
  projects: ProjectListItem[];
}) {
  const router = useRouter();

  async function handleDelete(id: string, title: string) {
    if (!confirm(`Delete "${title}"? This cannot be undone.`)) return;
    const res = await fetch(`/api/admin/projects/${id}`, { method: "DELETE" });
    if (res.ok) router.refresh();
    else alert("Failed to delete project.");
  }

  if (projects.length === 0) {
    return (
      <div className="rounded-lg border border-line bg-surface/30 px-8 py-16 text-center">
        <p className="text-muted">No projects yet.</p>
        <Link
          href="/admin/projects/new"
          className="mt-3 inline-block text-sm text-purple hover:underline"
        >
          Create your first project →
        </Link>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-line">
      <table className="w-full text-left text-sm">
        <thead className="border-b border-line bg-surface/50 text-xs uppercase tracking-wider text-muted">
          <tr>
            <th className="px-4 py-3 font-medium">Project</th>
            <th className="px-4 py-3 font-medium">Category</th>
            <th className="px-4 py-3 font-medium">Featured</th>
            <th className="px-4 py-3 font-medium">Order</th>
            <th className="px-4 py-3 font-medium">Status</th>
            <th className="px-4 py-3 font-medium text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-line">
          {projects.map((p) => (
            <tr key={p.id} className="transition-colors hover:bg-surface/20">
              <td className="px-4 py-3.5">
                <div className="flex items-center gap-3">
                  {p.thumbnail ? (
                    <img
                      src={p.thumbnail}
                      alt=""
                      className="h-9 w-14 flex-shrink-0 rounded border border-line object-cover"
                    />
                  ) : (
                    <div className="h-9 w-14 flex-shrink-0 rounded border border-line bg-surface" />
                  )}
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-medium text-foreground">
                        {p.title}
                      </span>
                      <Link
                        href={`/projects/${p.slug}`}
                        target="_blank"
                        className="text-muted hover:text-foreground"
                      >
                        <ExternalLink size={12} />
                      </Link>
                    </div>
                    <p className="mt-0.5 line-clamp-1 text-xs text-muted">
                      {p.description}
                    </p>
                  </div>
                </div>
              </td>
              <td className="px-4 py-3.5 capitalize text-muted">{p.category}</td>
              <td className="px-4 py-3.5">
                {p.featured ? (
                  <span className="rounded bg-amber/15 px-2 py-0.5 text-xs font-medium text-amber">
                    ★ Featured
                  </span>
                ) : (
                  <span className="text-muted">—</span>
                )}
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
                    href={`/admin/projects/${p.id}/edit`}
                    className="rounded p-1.5 text-muted transition-colors hover:bg-surface hover:text-foreground"
                    title="Edit"
                  >
                    <Edit3 size={15} />
                  </Link>
                  <button
                    onClick={() => handleDelete(p.id, p.title)}
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
    </div>
  );
}
