"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { AlertCircle, X } from "lucide-react";
import { useToast } from "@/components/ui/Toast";
import type { ProjectListItem } from "@/src/types";
import { DeleteProjectDialog } from "./DeleteProjectDialog";
import { ProjectsBulkBar } from "./ProjectsBulkBar";
import { ProjectsHeader } from "./ProjectsHeader";
import { ProjectsToolbar } from "./ProjectsToolbar";
import { ProjectsUtilityDock } from "./ProjectsUtilityDock";
import { ProjectsView } from "./ProjectsView";
import type { ProjectActionHandlers, ProjectsViewMode } from "./types";
import {
  copyText,
  filterAndSortProjects,
  responseError,
  type ProjectSort,
  type ProjectStatusFilter,
} from "./project-utils";

const PAGE_SIZE = 6;

export function ProjectsWorkspace({
  projects,
  initialSearch = "",
  loadError,
}: {
  projects: ProjectListItem[];
  initialSearch?: string;
  loadError?: string;
}) {
  const router = useRouter();
  const showToast = useToast();
  const searchRef = useRef<HTMLInputElement>(null);

  const [search, setSearch] = useState(initialSearch);
  const [status, setStatus] = useState<ProjectStatusFilter>("all");
  const [category, setCategory] = useState("all");
  const [sort, setSort] = useState<ProjectSort>("updated");
  const [view, setView] = useState<ProjectsViewMode>("list");
  const [page, setPage] = useState(0);

  const [selectedState, setSelectedState] = useState<Set<string>>(new Set());
  const [busyIds, setBusyIds] = useState<Set<string>>(new Set());
  const [bulkBusy, setBulkBusy] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);
  const refreshTimer = useRef<number | null>(null);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogProjects, setDialogProjects] = useState<ProjectListItem[]>([]);

  // Selection ids are derived from the latest server data so deleted or
  // filtered-out records never linger in the bulk action count.
  const selectedIds = useMemo(() => {
    const existing = new Set(projects.map((project) => project.id));
    return new Set(Array.from(selectedState).filter((id) => existing.has(id)));
  }, [selectedState, projects]);

  const categories = useMemo(
    () => Array.from(new Set(projects.map((project) => project.category))).sort(),
    [projects]
  );

  const counts = useMemo(() => {
    const published = projects.filter((project) => project.isVisible).length;
    return {
      all: projects.length,
      published,
      draft: projects.length - published,
      featured: projects.filter((project) => project.featured).length,
    } satisfies Record<ProjectStatusFilter, number>;
  }, [projects]);

  const filtered = useMemo(
    () =>
      filterAndSortProjects({ projects, search, status, category, sort }),
    [projects, search, status, category, sort]
  );

  const filteredCounts = useMemo(
    () => ({
      published: filtered.filter((project) => project.isVisible).length,
      draft: filtered.filter((project) => !project.isVisible).length,
      featured: filtered.filter((project) => project.featured).length,
    }),
    [filtered]
  );

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, pageCount - 1);
  const pageItems = filtered.slice(
    currentPage * PAGE_SIZE,
    (currentPage + 1) * PAGE_SIZE
  );
  const pageStart = filtered.length === 0 ? 0 : currentPage * PAGE_SIZE + 1;
  const pageEnd = Math.min((currentPage + 1) * PAGE_SIZE, filtered.length);

  const filtersActive =
    search.trim() !== "" || status !== "all" || category !== "all";

  const allSelected =
    pageItems.length > 0 && pageItems.every((project) => selectedIds.has(project.id));
  const someSelected =
    !allSelected && pageItems.some((project) => selectedIds.has(project.id));

  useEffect(() => {
    return () => {
      if (refreshTimer.current !== null) {
        window.clearTimeout(refreshTimer.current);
      }
    };
  }, []);

  const patchProject = useCallback(
    async (
      project: ProjectListItem,
      body: { featured?: boolean; isVisible?: boolean },
      message: string
    ) => {
      setBusyIds((previous) => new Set(previous).add(project.id));
      setActionError(null);
      try {
        const response = await fetch(`/api/admin/projects/${project.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
        if (!response.ok) {
          throw new Error(
            await responseError(response, "The project could not be updated.")
          );
        }
        showToast(message);
        router.refresh();
      } catch (cause) {
        setActionError(
          cause instanceof Error
            ? cause.message
            : "The project could not be updated."
        );
      } finally {
        setBusyIds((previous) => {
          const next = new Set(previous);
          next.delete(project.id);
          return next;
        });
      }
    },
    [router, showToast]
  );

  const runBulkUpdate = useCallback(
    async (
      body: { featured?: boolean; isVisible?: boolean },
      successMessage: (count: number) => string,
      failureVerb: string
    ) => {
      if (selectedIds.size === 0) return;
      const ids = Array.from(selectedIds);
      setBulkBusy(true);
      setActionError(null);
      try {
        const results = await Promise.allSettled(
          ids.map(async (id) => {
            const response = await fetch(`/api/admin/projects/${id}`, {
              method: "PATCH",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(body),
            });
            if (!response.ok) {
              throw new Error(
                await responseError(response, "The project could not be updated.")
              );
            }
          })
        );
        const failed = results.filter(
          (result) => result.status === "rejected"
        ).length;
        const succeeded = ids.length - failed;

        if (succeeded > 0) {
          showToast(successMessage(succeeded));
          if (failed === 0) setSelectedState(new Set());
        }
        if (failed > 0) {
          setActionError(
            `${failed} of ${ids.length} projects could not be ${failureVerb}. ${
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
      for (const project of pageItems) {
        if (checked) next.add(project.id);
        else next.delete(project.id);
      }
      return next;
    });
  }

  function resetFilters() {
    setSearch("");
    setStatus("all");
    setCategory("all");
    setPage(0);
    setActionError(null);
  }

  function changeSearch(value: string) {
    setSearch(value);
    setPage(0);
  }

  function changeStatus(value: ProjectStatusFilter) {
    setStatus(value);
    setPage(0);
  }

  function changeCategory(value: string) {
    setCategory(value);
    setPage(0);
  }

  function changeSort(value: ProjectSort) {
    setSort(value);
    setPage(0);
  }

  function refresh() {
    setRefreshing(true);
    router.refresh();
    if (refreshTimer.current !== null) {
      window.clearTimeout(refreshTimer.current);
    }
    refreshTimer.current = window.setTimeout(() => {
      setRefreshing(false);
      refreshTimer.current = null;
    }, 1500);
  }

  async function copyPublicUrl(project: ProjectListItem) {
    try {
      await copyText(`${window.location.origin}/projects/${project.slug}`);
      showToast("Public URL copied.");
    } catch {
      setActionError(
        "Could not copy the public URL. Your browser blocked clipboard access."
      );
    }
  }

  function requestDelete(project: ProjectListItem) {
    setDialogProjects([project]);
    setDialogOpen(true);
  }

  function requestBulkDelete() {
    const targets = projects.filter((project) => selectedIds.has(project.id));
    if (targets.length === 0) return;
    setDialogProjects(targets);
    setDialogOpen(true);
  }

  const confirmDelete = useCallback(async () => {
    const targets = dialogProjects;
    if (targets.length === 0) return;

    setActionError(null);
    const results = await Promise.all(
      targets.map(async (project) => {
        try {
          const response = await fetch(`/api/admin/projects/${project.id}`, {
            method: "DELETE",
          });
          if (!response.ok) {
            return {
              project,
              ok: false,
              error: await responseError(response, "The delete request failed."),
            };
          }
          return { project, ok: true, error: null };
        } catch (cause) {
          return {
            project,
            ok: false,
            error:
              cause instanceof Error
                ? cause.message
                : "The delete request failed.",
          };
        }
      })
    );

    const deleted = results
      .filter((result) => result.ok)
      .map((result) => result.project);
    const failed = results.filter((result) => !result.ok);

    if (deleted.length > 0) {
      setSelectedState((previous) => {
        const next = new Set(previous);
        for (const project of deleted) next.delete(project.id);
        return next;
      });
      showToast(
        `${deleted.length} project${deleted.length === 1 ? "" : "s"} deleted.`
      );
      router.refresh();
    }

    if (failed.length > 0) {
      setDialogProjects(failed.map((result) => result.project));
      const firstError = failed[0]?.error;
      throw new Error(
        `${failed.length} project${
          failed.length === 1 ? "" : "s"
        } could not be deleted.${firstError ? ` ${firstError}` : ""} Please try again.`
      );
    }

    setDialogOpen(false);
    setDialogProjects([]);
  }, [dialogProjects, router, showToast]);

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
      if (
        active instanceof HTMLElement &&
        active.closest('[role="menu"]')
      ) {
        return;
      }

      if (modifier && key === "a") {
        event.preventDefault();
        setSelectedState((previous) => {
          const next = new Set(previous);
          for (const project of pageItems) next.add(project.id);
          return next;
        });
        return;
      }

      if (modifier || event.altKey) return;

      if (key === "n") {
        event.preventDefault();
        router.push("/admin/projects/new");
        return;
      }

      if (key === "f") {
        event.preventDefault();
        const selected = projects.filter((project) =>
          selectedIds.has(project.id)
        );
        if (selected.length === 0) {
          setActionError(
            "Select at least one project before toggling featured status."
          );
          return;
        }
        const next = !selected.every((project) => project.featured);
        void runBulkUpdate(
          { featured: next },
          (count) =>
            next
              ? `${count} project${count === 1 ? "" : "s"} marked as featured.`
              : `${count} project${count === 1 ? "" : "s"} removed from featured.`,
          "updated"
        );
      }
    }

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [
    dialogOpen,
    pageItems,
    projects,
    router,
    runBulkUpdate,
    selectedIds,
  ]);

  const actions: ProjectActionHandlers = {
    busyIds,
    selectedIds,
    onToggleSelected: toggleSelected,
    onToggleFeatured: (project) =>
      void patchProject(
        project,
        { featured: !project.featured },
        project.featured
          ? `“${project.title}” removed from featured.`
          : `“${project.title}” marked as featured.`
      ),
    onToggleVisibility: (project) =>
      void patchProject(
        project,
        { isVisible: !project.isVisible },
        project.isVisible
          ? `“${project.title}” moved to draft.`
          : `“${project.title}” published.`
      ),
    onCopyPublicUrl: (project) => void copyPublicUrl(project),
    onDelete: requestDelete,
  };

  return (
    <section aria-labelledby="projects-heading">
      {loadError && (
        <div
          role="alert"
          className="mb-4 border-2 border-admin-alert bg-admin-alert/10 px-3 py-2.5 text-[11.5px] leading-5 text-admin-alert"
        >
          Projects could not be loaded: {loadError}
        </div>
      )}

      <ProjectsHeader
        projects={projects}
        refreshing={refreshing}
        onRefresh={refresh}
      />

      {actionError && (
        <div
          role="alert"
          className="mb-4 flex items-start justify-between gap-3 border-2 border-admin-alert bg-admin-alert/10 px-3 py-2.5 text-[11.5px] leading-5 text-admin-alert"
        >
          <span className="flex min-w-0 items-start gap-2">
            <AlertCircle
              size={14}
              className="mt-0.5 shrink-0"
              aria-hidden="true"
            />
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

      <ProjectsToolbar
        search={search}
        onSearch={changeSearch}
        status={status}
        onStatus={changeStatus}
        category={category}
        onCategory={changeCategory}
        categories={categories}
        sort={sort}
        onSort={changeSort}
        view={view}
        onView={setView}
        counts={counts}
        searchRef={searchRef}
      />

      {selectedIds.size > 0 && (
        <ProjectsBulkBar
          count={selectedIds.size}
          busy={bulkBusy}
          onPublish={() =>
            void runBulkUpdate(
              { isVisible: true },
              (count) =>
                `${count} project${count === 1 ? "" : "s"} published.`,
              "published"
            )
          }
          onMoveToDraft={() =>
            void runBulkUpdate(
              { isVisible: false },
              (count) =>
                `${count} project${count === 1 ? "" : "s"} moved to draft.`,
              "moved to draft"
            )
          }
          onDelete={requestBulkDelete}
          onClear={() => setSelectedState(new Set())}
        />
      )}

      <ProjectsView
        view={view}
        projects={pageItems}
        hasAnyProjects={projects.length > 0}
        filtersActive={filtersActive}
        query={search}
        actions={actions}
        allSelected={allSelected}
        someSelected={someSelected}
        onSelectAll={selectAllOnPage}
        selectDisabled={bulkBusy}
        page={currentPage}
        pageCount={pageCount}
        total={filtered.length}
        pageStart={pageStart}
        pageEnd={pageEnd}
        counts={filteredCounts}
        onPage={setPage}
        onResetFilters={resetFilters}
      />

      <ProjectsUtilityDock
        projects={projects}
        query={search}
        onResetFilters={resetFilters}
      />

      <DeleteProjectDialog
        open={dialogOpen && dialogProjects.length > 0}
        projects={dialogProjects}
        onClose={() => setDialogOpen(false)}
        onConfirm={confirmDelete}
      />
    </section>
  );
}
