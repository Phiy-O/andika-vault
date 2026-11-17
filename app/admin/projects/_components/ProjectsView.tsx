"use client";

import Link from "next/link";
import { RotateCcw, Search } from "lucide-react";
import { ProjectsGrid, ProjectsListCards } from "./ProjectsCards";
import { ProjectsPagination } from "./ProjectsPagination";
import { ProjectsTable } from "./ProjectsTable";
import type { ProjectActionHandlers, ProjectsViewMode } from "./types";
import type { ProjectListItem } from "@/src/types";

function ProjectEmptyState({
  query,
  filtersActive,
  hasAnyProjects,
  onReset,
}: {
  query: string;
  filtersActive: boolean;
  hasAnyProjects: boolean;
  onReset: () => void;
}) {
  const title = !hasAnyProjects
    ? "No projects in the studio yet."
    : query.trim()
      ? `No projects found matching “${query.trim()}”`
      : filtersActive
        ? "No projects match these filters."
        : "No projects to show.";

  return (
    <div className="p-4">
      <div
        role="status"
        className="flex flex-col items-center justify-center gap-2 border-2 border-dashed border-line/45 bg-admin-wash/30 px-6 py-12 text-center"
      >
        <span className="mb-1 grid size-10 place-items-center border-2 border-line bg-surface shadow-[2px_2px_0_var(--foreground)]">
          <Search size={18} strokeWidth={1.8} aria-hidden="true" />
        </span>
        <p className="m-0 font-space text-[14px] font-bold leading-5 tracking-[-.02em]">
          {title}
        </p>
        <p className="m-0 max-w-sm text-[11.5px] leading-5 text-muted">
          {hasAnyProjects
            ? "Try relaxing the filters or clearing the search term."
            : "Create the first project record to populate the public archive."}
        </p>

        <div className="mt-2 flex flex-wrap items-center justify-center gap-2">
          {hasAnyProjects && filtersActive && (
            <button
              type="button"
              onClick={onReset}
              className="inline-flex h-8 items-center gap-1.5 border-2 border-line bg-surface px-3 font-jet text-[8px] font-bold uppercase tracking-[.06em] shadow-[2px_2px_0_var(--foreground)] transition-transform hover:-translate-y-0.5 motion-reduce:transform-none"
            >
              <RotateCcw size={11} aria-hidden="true" />
              Reset filters
            </button>
          )}
          {!hasAnyProjects && (
            <Link
              href="/admin/projects/new"
              className="inline-flex h-8 items-center gap-1.5 border-2 border-line bg-purple px-3 font-jet text-[8px] font-bold uppercase tracking-[.06em] shadow-[2px_2px_0_var(--foreground)] transition-transform hover:-translate-y-0.5 motion-reduce:transform-none"
            >
              New project
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

export function ProjectsView({
  view,
  projects,
  hasAnyProjects,
  filtersActive,
  query,
  actions,
  allSelected,
  someSelected,
  onSelectAll,
  selectDisabled,
  page,
  pageCount,
  total,
  pageStart,
  pageEnd,
  counts,
  onPage,
  onResetFilters,
}: {
  view: ProjectsViewMode;
  projects: ProjectListItem[];
  hasAnyProjects: boolean;
  filtersActive: boolean;
  query: string;
  actions: ProjectActionHandlers;
  allSelected: boolean;
  someSelected: boolean;
  onSelectAll: (checked: boolean) => void;
  selectDisabled: boolean;
  page: number;
  pageCount: number;
  total: number;
  pageStart: number;
  pageEnd: number;
  counts: { published: number; draft: number; featured: number };
  onPage: (page: number) => void;
  onResetFilters: () => void;
}) {
  return (
    <div className="border-2 border-line bg-surface shadow-[3px_3px_0_var(--foreground)]">
      {projects.length === 0 ? (
        <ProjectEmptyState
          query={query}
          filtersActive={filtersActive}
          hasAnyProjects={hasAnyProjects}
          onReset={onResetFilters}
        />
      ) : view === "grid" ? (
        <ProjectsGrid
          projects={projects}
          actions={actions}
          selectDisabled={selectDisabled}
        />
      ) : (
        <>
          <div className="hidden xl:block">
            <ProjectsTable
              projects={projects}
              actions={actions}
              allSelected={allSelected}
              someSelected={someSelected}
              onSelectAll={onSelectAll}
              selectDisabled={selectDisabled}
            />
          </div>
          <div className="xl:hidden">
            <ProjectsListCards
              projects={projects}
              actions={actions}
              selectDisabled={selectDisabled}
            />
          </div>
        </>
      )}

      <ProjectsPagination
        page={page}
        pageCount={pageCount}
        total={total}
        pageStart={pageStart}
        pageEnd={pageEnd}
        published={counts.published}
        draft={counts.draft}
        featured={counts.featured}
        onPage={onPage}
      />
    </div>
  );
}
