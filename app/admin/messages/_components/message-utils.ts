import type { Message } from "@prisma/client";
import type { WorkspaceSortOption, WorkspaceStatusTab, WorkspaceShortcut } from "@/components/admin/workspace/types";

export type MessageSort = "name" | "email" | "createdAt";
export type MessageStatus = "all" | "unread" | "read";

export function filterAndSortMessages({
  messages,
  search,
  status,
  sort,
}: {
  messages: Message[];
  search: string;
  status: MessageStatus;
  sort: MessageSort;
}) {
  let filtered = messages.filter((m) => {
    if (status === "unread" && m.isRead) return false;
    if (status === "read" && !m.isRead) return false;
    const q = search.trim().toLowerCase();
    if (!q) return true;
    return (
      m.name.toLowerCase().includes(q) ||
      m.email.toLowerCase().includes(q) ||
      m.message.toLowerCase().includes(q)
    );
  });

  switch (sort) {
    case "name":
      filtered = [...filtered].sort((a, b) => a.name.localeCompare(b.name));
      break;
    case "email":
      filtered = [...filtered].sort((a, b) => a.email.localeCompare(b.email));
      break;
    case "createdAt":
    default:
      filtered = [...filtered].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      break;
  }

  return filtered;
}

export function formatCount(count: number): string {
  if (count >= 1_000_000) return `${(count / 1_000_000).toFixed(1)}M`;
  if (count >= 1_000) return `${(count / 1_000).toFixed(1)}K`;
  return String(count);
}

export const sortOptions: WorkspaceSortOption<MessageSort>[] = [
  { value: "createdAt", label: "Sort: last received" },
  { value: "name", label: "Sort: name A–Z" },
  { value: "email", label: "Sort: email A–Z" },
];

export const shortcuts: WorkspaceShortcut[] = [
  { label: "Search messages", keys: ["⌘", "K"] },
  { label: "Toggle list / grid", keys: ["V"] },
  { label: "Bulk select page", keys: ["⌘", "A"] },
];

export function getMessageStatusTabs(messages: Message[]): WorkspaceStatusTab<MessageStatus>[] {
  const unread = messages.filter((m) => !m.isRead).length;
  return [
    { value: "all", label: "All", count: messages.length },
    { value: "unread", label: "Unread", count: unread },
    { value: "read", label: "Read", count: messages.length - unread },
  ];
}