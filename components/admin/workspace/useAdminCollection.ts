"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/Toast";
import type { WorkspaceViewMode } from "./types";
import { copyText, responseError } from "./utils";

type AdminCollectionEntity = {
  singular: string;
  plural: string;
};

export function useAdminCollection<
  T extends { id: string; isVisible: boolean },
  Status extends string,
  Sort extends string,
>({
  items,
  endpoint,
  pageSize = 6,
  initialSearch = "",
  initialStatus,
  initialSort,
  getTitle,
  filter,
  newHref,
  entity,
}: {
  items: T[];
  endpoint: string;
  pageSize?: number;
  initialSearch?: string;
  initialStatus: Status;
  initialSort: Sort;
  getTitle: (item: T) => string;
  filter: (args: {
    items: T[];
    search: string;
    status: Status;
    group: string;
    sort: Sort;
  }) => T[];
  newHref: string;
  entity: AdminCollectionEntity;
}) {
  const router = useRouter();
  const showToast = useToast();
  const searchRef = useRef<HTMLInputElement>(null);
  const { singular, plural } = entity;

  const [search, setSearch] = useState(initialSearch);
  const [status, setStatus] = useState<Status>(initialStatus);
  const [group, setGroup] = useState("all");
  const [sort, setSort] = useState<Sort>(initialSort);
  const [view, setView] = useState<WorkspaceViewMode>("list");
  const [page, setPage] = useState(0);

  const [selectedState, setSelectedState] = useState<Set<string>>(new Set());
  const [busyIds, setBusyIds] = useState<Set<string>>(new Set());
  const [bulkBusy, setBulkBusy] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);
  const refreshTimer = useRef<number | null>(null);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogItems, setDialogItems] = useState<T[]>([]);

  // Selection ids are derived from the latest server data so deleted or
  // filtered-out records never linger in the bulk action count.
  const selectedIds = useMemo(() => {
    const existing = new Set(items.map((item) => item.id));
    return new Set(Array.from(selectedState).filter((id) => existing.has(id)));
  }, [selectedState, items]);

  const filtered = useMemo(
    () => filter({ items, search, status, group, sort }),
    [filter, items, search, status, group, sort]
  );

  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize));
  const currentPage = Math.min(page, pageCount - 1);
  const pageItems = filtered.slice(
    currentPage * pageSize,
    (currentPage + 1) * pageSize
  );
  const pageStart = filtered.length === 0 ? 0 : currentPage * pageSize + 1;
  const pageEnd = Math.min((currentPage + 1) * pageSize, filtered.length);

  const filtersActive =
    search.trim() !== "" || status !== "all" || group !== "all";

  const allSelected =
    pageItems.length > 0 &&
    pageItems.every((item) => selectedIds.has(item.id));
  const someSelected =
    !allSelected && pageItems.some((item) => selectedIds.has(item.id));

  useEffect(() => {
    return () => {
      if (refreshTimer.current !== null) {
        window.clearTimeout(refreshTimer.current);
      }
    };
  }, []);

  const patchItem = useCallback(
    async (item: T, body: { isVisible: boolean }, message: string) => {
      setBusyIds((previous) => new Set(previous).add(item.id));
      setActionError(null);
      try {
        const response = await fetch(`${endpoint}/${item.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
        if (!response.ok) {
          throw new Error(
            await responseError(response, `The ${singular} could not be updated.`)
          );
        }
        showToast(message);
        router.refresh();
      } catch (cause) {
        setActionError(
          cause instanceof Error
            ? cause.message
            : `The ${singular} could not be updated.`
        );
      } finally {
        setBusyIds((previous) => {
          const next = new Set(previous);
          next.delete(item.id);
          return next;
        });
      }
    },
    [endpoint, router, showToast, singular]
  );

  const toggleVisibility = useCallback(
    (item: T) => {
      const title = getTitle(item);
      void patchItem(
        item,
        { isVisible: !item.isVisible },
        item.isVisible ? `“${title}” moved to draft.` : `“${title}” published.`
      );
    },
    [getTitle, patchItem]
  );

  const runBulkVisibility = useCallback(
    async (visible: boolean) => {
      if (selectedIds.size === 0) return;
      const ids = Array.from(selectedIds);
      setBulkBusy(true);
      setActionError(null);
      try {
        const results = await Promise.allSettled(
          ids.map(async (id) => {
            const response = await fetch(`${endpoint}/${id}`, {
              method: "PATCH",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ isVisible: visible }),
            });
            if (!response.ok) {
              throw new Error(
                await responseError(
                  response,
                  `The ${singular} could not be updated.`
                )
              );
            }
          })
        );
        const failed = results.filter(
          (result) => result.status === "rejected"
        ).length;
        const succeeded = ids.length - failed;
        const action = visible ? "published" : "moved to draft";

        if (succeeded > 0) {
          showToast(
            `${succeeded} ${succeeded === 1 ? singular : plural} ${action}.`
          );
          if (failed === 0) setSelectedState(new Set());
        }
        if (failed > 0) {
          setActionError(
            `${failed} of ${ids.length} ${plural} could not be ${action}. ${
              succeeded > 0
                ? "The remaining records were updated."
                : "Please try again."
            }`
          );
        }
        router.refresh();
      } finally {
        setBulkBusy(false);
      }
    },
    [endpoint, plural, router, selectedIds, showToast, singular]
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
    setStatus(initialStatus);
    setGroup("all");
    setPage(0);
    setActionError(null);
  }, [initialStatus]);

  function changeSearch(value: string) {
    setSearch(value);
    setPage(0);
  }

  function changeStatus(value: Status) {
    setStatus(value);
    setPage(0);
  }

  function changeGroup(value: string) {
    setGroup(value);
    setPage(0);
  }

  function changeSort(value: Sort) {
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
        await copyText(value);
        showToast(message);
      } catch {
        setActionError(
          "Could not copy to the clipboard. Your browser blocked clipboard access."
        );
      }
    },
    [showToast]
  );

  function requestDelete(item: T) {
    setDialogItems([item]);
    setDialogOpen(true);
  }

  function requestBulkDelete() {
    const targets = items.filter((item) => selectedIds.has(item.id));
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
      targets.map(async (item) => {
        try {
          const response = await fetch(`${endpoint}/${item.id}`, {
            method: "DELETE",
          });
          if (!response.ok) {
            return {
              item,
              ok: false,
              error: await responseError(
                response,
                "The delete request failed."
              ),
            };
          }
          return { item, ok: true, error: null };
        } catch (cause) {
          return {
            item,
            ok: false,
            error:
              cause instanceof Error
                ? cause.message
                : "The delete request failed.",
          };
        }
      })
    );

    const deleted = results.filter((result) => result.ok).map((r) => r.item);
    const failed = results.filter((result) => !result.ok);

    if (deleted.length > 0) {
      setSelectedState((previous) => {
        const next = new Set(previous);
        for (const item of deleted) next.delete(item.id);
        return next;
      });
      showToast(
        `${deleted.length} ${deleted.length === 1 ? singular : plural} deleted.`
      );
      router.refresh();
    }

    if (failed.length > 0) {
      setDialogItems(failed.map((result) => result.item));
      const firstError = failed[0]?.error;
      throw new Error(
        `${failed.length} ${
          failed.length === 1 ? singular : plural
        } could not be deleted.${firstError ? ` ${firstError}` : ""} Please try again.`
      );
    }

    setDialogOpen(false);
    setDialogItems([]);
  }, [dialogItems, endpoint, plural, router, showToast, singular]);

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
        router.push(newHref);
        return;
      }

      if (key === "v") {
        event.preventDefault();
        setView((previous) => (previous === "list" ? "grid" : "list"));
      }
    }

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [dialogOpen, newHref, pageItems, router]);

  return {
    search,
    setSearch: changeSearch,
    status,
    setStatus: changeStatus,
    group,
    setGroup: changeGroup,
    sort,
    setSort: changeSort,
    view,
    setView,
    page,
    setPage,
    currentPage,
    pageCount,
    pageItems,
    filtered,
    pageStart,
    pageEnd,
    filtersActive,
    selectedIds,
    busyIds,
    bulkBusy,
    refreshing,
    actionError,
    setActionError,
    allSelected,
    someSelected,
    toggleSelected,
    selectAllOnPage,
    clearSelection,
    resetFilters,
    refresh,
    toggleVisibility,
    runBulkVisibility,
    copyToClipboard,
    requestDelete,
    requestBulkDelete,
    dialogOpen,
    dialogItems,
    closeDialog,
    confirmDelete,
    searchRef,
  };
}
