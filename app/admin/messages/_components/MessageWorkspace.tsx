"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { AlertCircle, Loader2, Mail, MailOpen, Trash2, X } from "lucide-react";
import { useToast } from "@/components/ui/Toast";
import type { Message } from "@prisma/client";
import { DeleteRecordsDialog } from "@/components/admin/workspace/DeleteRecordsDialog";
import type {
  WorkspaceDetailRow,
  WorkspaceStatusTab,
} from "@/components/admin/workspace/types";
import { WorkspaceHeader } from "@/components/admin/workspace/WorkspaceHeader";
import { WorkspacePagination } from "@/components/admin/workspace/WorkspacePagination";
import { WorkspaceToolbar } from "@/components/admin/workspace/WorkspaceToolbar";
import { WorkspaceView } from "@/components/admin/workspace/WorkspaceView";
import {
  formatCount,
  shortRecordId,
} from "@/components/admin/workspace/utils";
import {
  filterAndSortMessages,
  getMessageStatusTabs,
  sortOptions,
  type MessageSort,
  type MessageStatus,
} from "./message-utils";
import { MessagesGrid, MessagesListCards } from "./MessagesCards";
import { MessagesTable } from "./MessagesTable";
import type { MessageActionHandlers } from "./MessageActionsMenu";
import { WorkspaceSelectCheckbox } from "@/components/admin/workspace/WorkspaceSelectCheckbox";

const PAGE_SIZE = 6;

function getMessageTitle(message: Message) {
  return message.name + " - " + message.email;
}

function MessageBulkBar({
  selectedIds,
  bulkBusy,
  runBulkRead,
  clearSelection,
}: {
  selectedIds: ReadonlySet<string>;
  bulkBusy: boolean;
  runBulkRead: (read: boolean) => void;
  clearSelection: () => void;
}) {
  if (selectedIds.size === 0) return null;
  return (
    <div
      role="region"
      aria-label="Bulk message actions"
      className="mb-4 flex min-h-11 flex-wrap items-center gap-x-3 gap-y-2 border-2 border-line bg-surface px-2.5 py-2 shadow-[3px_3px_0_var(--foreground)]"
    >
      <span className="inline-flex h-6 shrink-0 items-center bg-foreground px-2 font-jet text-[9px] font-bold uppercase leading-none tracking-[.08em] text-background">
        {formatCount(selectedIds.size)} selected
      </span>

      <p className="hidden min-w-0 flex-1 truncate font-jet text-[9px] font-medium uppercase leading-4 tracking-[.06em] text-muted md:block">
        Changes apply immediately to the contact form inbox.
      </p>

      <button
        type="button"
        onClick={clearSelection}
        disabled={bulkBusy}
        className="order-last inline-flex h-6 shrink-0 items-center gap-1 border-b border-line font-jet text-[8px] font-bold uppercase tracking-[.06em] text-muted transition-colors hover:text-foreground disabled:cursor-wait disabled:opacity-50 md:order-none"
      >
        Clear selection
        <X size={10} aria-hidden="true" />
      </button>

      <div className="ml-auto flex shrink-0 flex-wrap items-center gap-1.5">
        <button
          type="button"
          onClick={() => void runBulkRead(true)}
          disabled={bulkBusy}
          className="inline-flex h-7 items-center gap-1.5 border border-line bg-admin-mint px-2.5 font-jet text-[8px] font-bold uppercase tracking-[.06em] transition-colors hover:bg-[#5fd9aa] disabled:cursor-wait disabled:opacity-60"
        >
          <MailOpen size={11} aria-hidden="true" />
          Mark as read
        </button>
        <button
          type="button"
          onClick={() => void runBulkRead(false)}
          disabled={bulkBusy}
          className="inline-flex h-7 items-center gap-1.5 border border-line bg-background px-2.5 font-jet text-[8px] font-bold uppercase tracking-[.06em] transition-colors hover:bg-admin-wash disabled:cursor-wait disabled:opacity-60"
        >
          <Mail size={11} aria-hidden="true" />
          Mark as unread
        </button>
        <button
          type="button"
          disabled={true}
          className="inline-flex h-7 items-center gap-1.5 border border-line bg-admin-alert px-2.5 font-jet text-[8px] font-bold uppercase tracking-[.06em] text-white transition-colors disabled:cursor-wait disabled:opacity-60"
        >
          <Trash2 size={11} aria-hidden="true" />
          Delete
        </button>
        <button
          type="button"
          onClick={clearSelection}
          disabled={false}
          className="inline-flex h-7 items-center gap-1.5 border border-line bg-background px-2.5 font-jet text-[8px] font-bold uppercase tracking-[.06em] transition-colors hover:bg-admin-wash"
        >
          <X size={11} aria-hidden="true" />
          Clear selection
        </button>
      </div>
    </div>
  );
}

function EmptyState({
  messages,
  search,
  filtersActive,
  resetFilters,
}: {
  messages: Message[];
  search: string;
  filtersActive: boolean;
  resetFilters: () => void;
}) {
  return (
    <div className="p-4">
      <div
        role="status"
        className="flex flex-col items-center justify-center gap-2 border-2 border-dashed border-line/45 bg-admin-wash/30 px-6 py-12 text-center"
      >
        <span className="mb-1 grid size-10 place-items-center border-2 border-line bg-surface shadow-[2px_2px_0_var(--foreground)]">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="text-muted" aria-hidden="true"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
        </span>
        <p className="m-0 font-space text-[14px] font-bold leading-5 tracking-[-.02em]">
          {messages.length === 0
            ? "No messages in the inbox yet."
            : search.trim()
            ? "No messages found matching \u201c" + search.trim() + "\u201d"
            : filtersActive
            ? "No messages match these filters."
            : "No messages to show."}
        </p>
        <p className="m-0 max-w-sm text-[11.5px] leading-5 text-muted">
          {messages.length > 0
            ? "Try relaxing the filters or clearing the search term."
            : "Messages from the contact form will appear here."}
        </p>

        <div className="mt-2 flex flex-wrap items-center justify-center gap-2">
          {messages.length > 0 && filtersActive && (
            <button
              type="button"
              onClick={resetFilters}
              className="inline-flex h-8 items-center gap-1.5 border-2 border-line bg-surface px-3 font-jet text-[8px] font-bold uppercase tracking-[.06em] shadow-[2px_2px_0_var(--foreground)] transition-transform hover:-translate-y-0.5 motion-reduce:transform-none"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>
              Reset filters
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function MessageWorkspaceInner({
  messages,
  initialSearch = "",
  loadError,
}: {
  messages: Message[];
  initialSearch?: string;
  loadError?: string;
}) {
  const router = useRouter();
  const showToast = useToast();
  const searchRef = useRef<HTMLInputElement>(null);

  const [search, setSearch] = useState(initialSearch);
  const [status, setStatus] = useState<MessageStatus>("all");
  const [sort, setSort] = useState<MessageSort>("createdAt");
  const [view, setView] = useState<"list" | "grid">("list");
  const [page, setPage] = useState(0);

  const [selectedState, setSelectedState] = useState<Set<string>>(new Set());
  const [busyIds, setBusyIds] = useState<Set<string>>(new Set());
  const [bulkBusy, setBulkBusy] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);
  const refreshTimer = useRef<number | null>(null);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogItems, setDialogItems] = useState<Message[]>([]);

  const selectedIds = useMemo(() => {
    const existing = new Set(messages.map((item) => item.id));
    return new Set(Array.from(selectedState).filter((id) => existing.has(id)));
  }, [selectedState, messages]);

  const filtered = useMemo(
    () => filterAndSortMessages({ messages, search, status, sort }),
    [messages, search, status, sort]
  );

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, pageCount - 1);
  const pageItems = filtered.slice(
    currentPage * PAGE_SIZE,
    (currentPage + 1) * PAGE_SIZE
  );
  const pageStart = filtered.length === 0 ? 0 : currentPage * PAGE_SIZE + 1;
  const pageEnd = Math.min((currentPage + 1) * PAGE_SIZE, filtered.length);

  const filtersActive = search.trim() !== "" || status !== "all";

  const allSelected =
    pageItems.length > 0 && pageItems.every((item) => selectedIds.has(item.id));
  const someSelected =
    !allSelected && pageItems.some((item) => selectedIds.has(item.id));

  useEffect(() => {
    return () => {
      if (refreshTimer.current !== null) {
        window.clearTimeout(refreshTimer.current);
      }
    };
  }, []);

  const toggleRead = useCallback(
    async (message: Message) => {
      setBusyIds((previous) => new Set(previous).add(message.id));
      setActionError(null);
      try {
        const response = await fetch("/api/admin/messages/" + message.id, {
          method: "PATCH",
        });
        if (!response.ok) {
          throw new Error("The message could not be updated.");
        }
        showToast(message.isRead ? "Message marked as unread" : "Message marked as read");
        router.refresh();
      } catch {
        setActionError("The message could not be updated.");
      } finally {
        setBusyIds((previous) => {
          const next = new Set(previous);
          next.delete(message.id);
          return next;
        });
      }
    },
    [router, showToast]
  );

  const runBulkRead = useCallback(
    async (read: boolean) => {
      if (selectedIds.size === 0) return;
      const ids = Array.from(selectedIds);
      setBulkBusy(true);
      setActionError(null);
      try {
        const results = await Promise.allSettled(
          ids.map(async (id) => {
            const response = await fetch("/api/admin/messages/" + id, {
              method: "PATCH",
            });
            if (!response.ok) {
              throw new Error("The message could not be updated.");
            }
          })
        );
        const failed = results.filter((result) => result.status === "rejected").length;
        const succeeded = ids.length - failed;
        const action = read ? "marked as read" : "marked as unread";

        if (succeeded > 0) {
          showToast("" + succeeded + " " + (succeeded === 1 ? "message" : "messages") + " " + action + ".");
          if (failed === 0) setSelectedState(new Set());
        }
        if (failed > 0) {
          setActionError(
            "" + failed + " of " + ids.length + " messages could not be " + action + ". " +
            (succeeded > 0 ? "The remaining records were updated." : "Please try again.")
          );
        }
        router.refresh();
      } finally {
        setBulkBusy(false);
      }
    },
    [selectedIds, router, showToast]
  );

  function toggleSelected(id: string) {
    setSelectedState((previous) => {
      const next = new Set(previous);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function selectAllOnPage(checked: boolean) {
    setSelectedState((previous) => {
      const next = new Set(previous);
      for (const item of pageItems) {
        if (checked) next.add(item.id);
        else next.delete(item.id);
      }
      return next;
    });
  }

  const clearSelection = useCallback(() => {
    setSelectedState(new Set());
  }, []);

  const resetFilters = useCallback(() => {
    setSearch("");
    setStatus("all");
    setPage(0);
    setActionError(null);
  }, []);

  function changeSearch(value: string) {
    setSearch(value);
    setPage(0);
  }

  function changeStatus(value: MessageStatus) {
    setStatus(value);
    setPage(0);
  }

  function changeSort(value: MessageSort) {
    setSort(value);
    setPage(0);
  }

  const refresh = useCallback(() => {
    setRefreshing(true);
    router.refresh();
    if (refreshTimer.current !== null) {
      window.clearTimeout(refreshTimer.current);
    }
    refreshTimer.current = window.setTimeout(() => {
      setRefreshing(false);
      refreshTimer.current = null;
    }, 1500);
  }, [router]);

  const copyToClipboard = useCallback(
    async (value: string, message: string) => {
      try {
        await navigator.clipboard.writeText(value);
        showToast(message);
      } catch {
        setActionError("Could not copy to the clipboard. Your browser blocked clipboard access.");
      }
    },
    [showToast]
  );

  function requestDelete(message: Message) {
    setDialogItems([message]);
    setDialogOpen(true);
  }

  function requestBulkDelete() {
    const targets = messages.filter((item) => selectedIds.has(item.id));
    if (targets.length === 0) return;
    setDialogItems(targets);
    setDialogOpen(true);
  }

  const closeDialog = useCallback(() => {
    setDialogOpen(false);
  }, []);

  const confirmDelete = useCallback(async () => {
    const targets = dialogItems;
    if (targets.length === 0) return;

    setActionError(null);
    const results = await Promise.all(
      targets.map(async (message) => {
        try {
          const response = await fetch("/api/admin/messages/" + message.id, {
            method: "DELETE",
          });
          if (!response.ok) {
            return { message, ok: false, error: "The delete request failed." };
          }
          return { message, ok: true, error: null };
        } catch {
          return { message, ok: false, error: "The delete request failed." };
        }
      })
    );

    const deleted = results.filter((result) => result.ok).map((r) => r.message);
    const failed = results.filter((result) => !result.ok);

    if (deleted.length > 0) {
      setSelectedState((previous) => {
        const next = new Set(previous);
        for (const message of deleted) next.delete(message.id);
        return next;
      });
      showToast("" + deleted.length + " " + (deleted.length === 1 ? "message" : "messages") + " deleted.");
      router.refresh();
    }

    if (failed.length > 0) {
      setDialogItems(failed.map((result) => result.message));
      const firstError = failed[0]?.error;
      throw new Error(
        "" + failed.length + " " + (failed.length === 1 ? "message" : "messages") + " could not be deleted." + (firstError ? " " + firstError : "") + " Please try again."
      );
    }

    setDialogOpen(false);
    setDialogItems([]);
  }, [dialogItems, router, showToast]);

  useEffect(() => {
    function isTypingTarget(target: EventTarget | null) {
      return (
        target instanceof HTMLElement &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.tagName === "SELECT" ||
          target.isContentEditable)
      );
    }

    function onKeyDown(event: KeyboardEvent) {
      if (dialogOpen) return;
      const key = event.key.toLowerCase();
      const modifier = event.metaKey || event.ctrlKey;

      if (modifier && key === "k") {
        event.preventDefault();
        searchRef.current?.focus();
        searchRef.current?.select();
        return;
      }

      if (isTypingTarget(event.target)) return;

      const active = document.activeElement;
      if (active instanceof HTMLElement && active.closest('[role="menu"]')) {
        return;
      }

      if (modifier && key === "a") {
        event.preventDefault();
        setSelectedState((previous) => {
          const next = new Set(previous);
          for (const item of pageItems) next.add(item.id);
          return next;
        });
        return;
      }

      if (modifier || event.altKey) return;

      if (key === "n") {
        event.preventDefault();
        router.push("/admin/messages");
        return;
      }

      if (key === "v") {
        event.preventDefault();
        setView((previous) => (previous === "list" ? "grid" : "list"));
      }
    }

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [dialogOpen, pageItems, router]);

  const counts = useMemo(() => {
    const unread = messages.filter((item) => !item.isRead).length;
    return {
      all: messages.length,
      unread,
      read: messages.length - unread,
    } satisfies Record<MessageStatus, number>;
  }, [messages]);

  const filteredCounts = useMemo(
    () => ({
      unread: filtered.filter((item) => !item.isRead).length,
      read: filtered.filter((item) => item.isRead).length,
    }),
    [filtered]
  );

  const primary = dialogItems[0];
  const deleteCount = dialogItems.length;
  const deleteBatch = deleteCount > 1;
  const detailRows: WorkspaceDetailRow[] = primary
    ? [
        {
          label: "From",
          value: deleteBatch
            ? "" + deleteCount + " messages"
            : "" + primary.name + " <" + primary.email + ">",
        },
        {
          label: "Status",
          value: deleteBatch
            ? "Multi-select // " + deleteCount + " records"
            : "" + (primary.isRead ? "Read" : "Unread") + " // ID " + shortRecordId(primary.id),
          tone: "alert",
        },
        {
          label: "Received",
          value: deleteBatch
            ? "Multiple dates"
            : new Date(primary.createdAt).toLocaleString("en", {
                month: "short",
                day: "2-digit",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              }),
        },
      ]
    : [];

  const actions: MessageActionHandlers = {
    busyIds,
    selectedIds,
    onToggleSelected: toggleSelected,
    onToggleRead: toggleRead,
    onDelete: requestDelete,
  };

  return (
    <section aria-labelledby="messages-heading">
      {loadError && (
        <div
          role="alert"
          className="mb-4 border-2 border-admin-alert bg-admin-alert/10 px-3 py-2.5 text-[11.5px] leading-5 text-admin-alert"
        >
          Messages could not be loaded: {loadError}
        </div>
      )}

      <WorkspaceHeader
        section="Messages"
        eyebrowSection="Access"
        eyebrowLabel="Message inbox"
        title="Messages"
        titleId="messages-heading"
        description="Manage messages sent from the contact form. Mark as read, reply via email, and keep the inbox organized."
        publicHref="/contact"
        publicLabel="Contact form"
        records={messages.map((m) => ({ ...m, updatedAt: m.createdAt }))}
        refreshing={refreshing}
        onRefresh={refresh}
      />

      {actionError && (
        <div
          role="alert"
          className="mb-4 flex items-start justify-between gap-3 border-2 border-admin-alert bg-admin-alert/10 px-3 py-2.5 text-[11.5px] leading-5 text-admin-alert"
        >
          <span className="flex min-w-0 items-start gap-2">
            <AlertCircle size={14} className="mt-0.5 shrink-0" aria-hidden="true" />
            <span>{actionError}</span>
          </span>
          <button
            type="button"
            onClick={() => setActionError(null)}
            className="grid size-5 shrink-0 place-items-center border border-admin-alert/50 transition-colors hover:bg-admin-alert/10"
            aria-label="Dismiss error"
          >
            <X size={11} aria-hidden="true" />
          </button>
        </div>
      )}

      <WorkspaceToolbar
        tabs={getMessageStatusTabs(messages)}
        status={status}
        onStatus={setStatus}
        statusAriaLabel="Filter messages by status"
        search={search}
        onSearch={setSearch}
        searchRef={searchRef}
        searchPlaceholder="Search messages..."
        searchAriaLabel="Search messages"
        clearSearchLabel="Clear message search"
        group="all"
        onGroup={() => {}}
        groupOptions={[{ value: "all", label: "All" }]}
        groupAriaLabel="Filter messages"
        sort={sort}
        onSort={setSort}
        sortOptions={sortOptions}
        sortAriaLabel="Sort messages"
        view={view}
        onView={setView}
        viewAriaLabel="Message layout"
      />

      <MessageBulkBar
        selectedIds={selectedIds}
        bulkBusy={bulkBusy}
        runBulkRead={runBulkRead}
        clearSelection={clearSelection}
      />

      <WorkspaceView
        isEmpty={pageItems.length === 0}
        view={view}
        emptyState={<EmptyState messages={messages} search={search} filtersActive={filtersActive} resetFilters={resetFilters} />}
        table={
          <MessagesTable
            messages={pageItems}
            actions={actions}
            allSelected={allSelected}
            someSelected={someSelected}
            onSelectAll={selectAllOnPage}
            selectDisabled={bulkBusy}
          />
        }
        cards={
          <MessagesListCards
            messages={pageItems}
            actions={actions}
            selectDisabled={bulkBusy}
          />
        }
        grid={
          <MessagesGrid
            messages={pageItems}
            actions={actions}
            selectDisabled={bulkBusy}
          />
        }
        pagination={
          <WorkspacePagination
            page={currentPage}
            pageCount={pageCount}
            total={filtered.length}
            pageStart={pageStart}
            pageEnd={pageEnd}
            noun="messages"
            stats={[
              formatCount(filteredCounts.unread) + " Unread",
              formatCount(filteredCounts.read) + " Read",
            ]}
            ariaLabel="Message pagination"
            onPage={setPage}
          />
        }
      />

      <DeleteRecordsDialog
        open={dialogOpen && dialogItems.length > 0}
        records={dialogItems.map((item) => ({ id: item.id, title: item.name + " - " + item.email }))}
        entity={{ singular: "message", plural: "messages" }}
        archiveLabel="contact form inbox"
        mediaLabel="message"
        detailRows={detailRows}
        onClose={closeDialog}
        onConfirm={confirmDelete}
      />
    </section>
  );
}

export default MessageWorkspaceInner;