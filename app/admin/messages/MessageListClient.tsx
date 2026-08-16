"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Trash2, Mail, MailOpen } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { useToast } from "@/components/ui/Toast";
import { ListToolbar, type StatusFilter } from "@/components/admin/ListToolbar";
import type { Message } from "@/src/types";

export function MessageListClient({ messages }: { messages: Message[] }) {
  const router = useRouter();
  const showToast = useToast();
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<StatusFilter>("all");
  const [deleting, setDeleting] = useState<{ id: string; name: string } | null>(
    null
  );

  const filtered = messages.filter((m) => {
    if (status === "published" && m.isRead) return false;
    if (status === "draft" && !m.isRead) return false;
    const q = search.trim().toLowerCase();
    if (!q) return true;
    return (
      m.name.toLowerCase().includes(q) ||
      m.email.toLowerCase().includes(q) ||
      m.message.toLowerCase().includes(q)
    );
  });

  async function toggleRead(m: Message) {
    if (m.isRead) return;
    const res = await fetch(`/api/admin/messages/${m.id}`, {
      method: "PATCH",
    });
    if (res.ok) {
      showToast("Pesan ditandai sudah dibaca");
      router.refresh();
    }
  }

  async function confirmDelete() {
    if (!deleting) return;
    const res = await fetch(`/api/admin/messages/${deleting.id}`, {
      method: "DELETE",
    });
    setDeleting(null);
    if (res.ok) {
      showToast("Pesan berhasil dihapus");
      router.refresh();
    }
  }

  if (messages.length === 0) {
    return (
      <div className="rounded-lg border border-line bg-surface/30 px-8 py-16 text-center">
        <p className="text-muted">No messages yet.</p>
        <p className="mt-1 text-xs text-muted/60">
          Messages from the contact form will appear here.
        </p>
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
        placeholder="Search messages..."
        statusLabels={{ published: "Unread", draft: "Read" }}
      />
      <div className="overflow-x-auto rounded-lg border border-line">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-line bg-surface/50 text-xs uppercase tracking-wider text-muted">
            <tr>
              <th className="px-4 py-3 font-medium">From</th>
              <th className="px-4 py-3 font-medium">Message</th>
              <th className="px-4 py-3 font-medium">Received</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {filtered.map((m) => (
              <tr
                key={m.id}
                className={`transition-colors hover:bg-surface/20 ${
                  m.isRead ? "opacity-60" : ""
                }`}
              >
                <td className="px-4 py-3.5">
                  <div className="font-medium text-foreground">{m.name}</div>
                  <a
                    href={`mailto:${m.email}`}
                    className="mt-0.5 block text-xs text-muted hover:text-purple"
                  >
                    {m.email}
                  </a>
                </td>
                <td className="max-w-[320px] px-4 py-3.5">
                  <p className="line-clamp-2 text-muted">{m.message}</p>
                </td>
                <td className="px-4 py-3.5 text-muted">
                  {new Date(m.createdAt).toLocaleString("en", {
                    month: "short",
                    day: "2-digit",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </td>
                <td className="px-4 py-3.5">
                  {m.isRead ? (
                    <span className="inline-flex items-center gap-1 text-xs text-muted">
                      <MailOpen size={12} /> Read
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-xs text-purple">
                      <Mail size={12} /> Unread
                    </span>
                  )}
                </td>
                <td className="px-4 py-3.5 text-right">
                  <div className="flex items-center justify-end gap-1">
                    <button
                      onClick={() => toggleRead(m)}
                      disabled={m.isRead}
                      className="rounded p-1.5 text-muted transition-colors hover:bg-surface hover:text-foreground disabled:cursor-not-allowed disabled:opacity-40"
                      title={m.isRead ? "Already read" : "Mark as read"}
                    >
                      <MailOpen size={15} />
                    </button>
                    <button
                      onClick={() => setDeleting({ id: m.id, name: m.name })}
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
      {/* Delete confirmation */}
      <Modal
        open={!!deleting}
        onClose={() => setDeleting(null)}
        title="Delete message"
        confirmLabel="Delete"
        cancelLabel="Cancel"
        onConfirm={confirmDelete}
      >
        <p className="m-0 text-sm leading-[1.7] text-muted">
          Are you sure you want to delete the message from{" "}
          <span className="font-medium text-foreground">{deleting?.name}</span>?
          This cannot be undone.
        </p>
      </Modal>
    </>
  );
}