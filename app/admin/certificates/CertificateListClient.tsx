"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Edit3, Trash2, Eye, EyeOff, ExternalLink } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { useToast } from "@/components/ui/Toast";
import { ListToolbar, type StatusFilter } from "@/components/admin/ListToolbar";
import type { CertificateListItem } from "@/src/types";

export function CertificateListClient({
  certificates,
}: {
  certificates: CertificateListItem[];
}) {
  const router = useRouter();
  const showToast = useToast();
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<StatusFilter>("all");
  const [issuer, setIssuer] = useState("all");
  const [deleting, setDeleting] = useState<{
    id: string;
    title: string;
  } | null>(null);

  const issuers = Array.from(new Set(certificates.map((c) => c.issuer))).sort();

  const filtered = certificates.filter((c) => {
    if (status === "published" && !c.isVisible) return false;
    if (status === "draft" && c.isVisible) return false;
    if (issuer !== "all" && c.issuer !== issuer) return false;
    const q = search.trim().toLowerCase();
    if (!q) return true;
    return (
      c.title.toLowerCase().includes(q) ||
      c.issuer.toLowerCase().includes(q) ||
      c.description.toLowerCase().includes(q)
    );
  });

  function handleDelete(id: string, title: string) {
    setDeleting({ id, title });
  }

  async function confirmDelete() {
    if (!deleting) return;
    const res = await fetch(`/api/admin/certificates/${deleting.id}`, {
      method: "DELETE",
    });
    setDeleting(null);
    if (res.ok) {
      showToast("Sertifikat berhasil dihapus");
      router.refresh();
    }
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
    <>
      <ListToolbar
        search={search}
        onSearch={setSearch}
        status={status}
        onStatus={setStatus}
        categories={issuers}
        category={issuer}
        onCategory={setIssuer}
        placeholder="Search certificates..."
      />
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
          {filtered.map((c) => (
            <tr key={c.id} className="transition-colors hover:bg-surface/20">
              <td className="px-4 py-3.5">
                <div className="flex items-center gap-3">
                  {c.image ? (
                    <img
                      src={c.image}
                      alt=""
                      className="h-9 w-14 shrink-0 rounded border border-line object-cover"
                    />
                  ) : (
                    <div className="h-9 w-14 shrink-0 rounded border border-line bg-surface" />
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
                          className="shrink-0 text-muted hover:text-foreground"
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
      {/* Delete confirmation */}
      <Modal
        open={!!deleting}
        onClose={() => setDeleting(null)}
        title="Delete certificate"
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
      </Modal>    </div>
    </>
  );
}
