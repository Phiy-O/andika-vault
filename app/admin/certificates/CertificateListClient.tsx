"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Edit3, Trash2, Eye, EyeOff, ExternalLink } from "lucide-react";
import type { CertificateListItem } from "@/src/types";

export function CertificateListClient({
  certificates,
}: {
  certificates: CertificateListItem[];
}) {
  const router = useRouter();

  async function handleDelete(id: string, title: string) {
    if (!confirm(`Delete "${title}"? This cannot be undone.`)) return;
    const res = await fetch(`/api/admin/certificates/${id}`, {
      method: "DELETE",
    });
    if (res.ok) router.refresh();
    else alert("Failed to delete certificate.");
  }

  if (certificates.length === 0) {
    return (
      <div className="rounded-lg border border-line bg-surface/30 px-8 py-16 text-center">
        <p className="text-muted">No certificates yet.</p>
        <Link
          href="/admin/certificates/new"
          className="mt-3 inline-block text-sm text-purple hover:underline"
        >
          Add your first certificate →
        </Link>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-line">
      <table className="w-full text-left text-sm">
        <thead className="border-b border-line bg-surface/50 text-xs uppercase tracking-wider text-muted">
          <tr>
            <th className="px-4 py-3 font-medium">Certificate</th>
            <th className="px-4 py-3 font-medium">Issuer</th>
            <th className="px-4 py-3 font-medium">Issued</th>
            <th className="px-4 py-3 font-medium">Order</th>
            <th className="px-4 py-3 font-medium">Status</th>
            <th className="px-4 py-3 font-medium text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-line">
          {certificates.map((c) => (
            <tr key={c.id} className="transition-colors hover:bg-surface/20">
              <td className="px-4 py-3.5">
                <div className="flex items-center gap-3">
                  {c.image ? (
                    <img
                      src={c.image}
                      alt=""
                      className="h-9 w-14 flex-shrink-0 rounded border border-line object-cover"
                    />
                  ) : (
                    <div className="h-9 w-14 flex-shrink-0 rounded border border-line bg-surface" />
                  )}
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="truncate font-medium text-foreground">
                        {c.title}
                      </span>
                      {c.credentialUrl && (
                        <a
                          href={c.credentialUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-shrink-0 text-muted hover:text-foreground"
                        >
                          <ExternalLink size={12} />
                        </a>
                      )}
                    </div>
                    <p className="mt-0.5 line-clamp-1 text-xs text-muted">
                      {c.description}
                    </p>
                  </div>
                </div>
              </td>
              <td className="px-4 py-3.5 text-muted">{c.issuer}</td>
              <td className="px-4 py-3.5 text-muted">
                {new Date(c.issueDate).toLocaleDateString("en", {
                  month: "short",
                  day: "2-digit",
                  year: "numeric",
                })}
              </td>
              <td className="px-4 py-3.5 text-muted">{c.sortOrder}</td>
              <td className="px-4 py-3.5">
                {c.isVisible ? (
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
                    href={`/admin/certificates/${c.id}/edit`}
                    className="rounded p-1.5 text-muted transition-colors hover:bg-surface hover:text-foreground"
                    title="Edit"
                  >
                    <Edit3 size={15} />
                  </Link>
                  <button
                    onClick={() => handleDelete(c.id, c.title)}
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
