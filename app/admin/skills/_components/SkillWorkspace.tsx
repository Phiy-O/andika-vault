"use client";

import { useMemo } from "react";
import { AlertCircle, X } from "lucide-react";
import type { SkillListItem } from "@/src/types";
import { DeleteRecordsDialog } from "@/components/admin/workspace/DeleteRecordsDialog";
import type {
  WorkspaceDetailRow,
  WorkspaceSelectOption,
  WorkspaceStatusTab,
} from "@/components/admin/workspace/types";
import { WorkspaceBulkBar } from "@/components/admin/workspace/WorkspaceBulkBar";
import { WorkspaceHeader } from "@/components/admin/workspace/WorkspaceHeader";
import { WorkspacePagination } from "@/components/admin/workspace/WorkspacePagination";
import { WorkspaceToolbar } from "@/components/admin/workspace/WorkspaceToolbar";
import { WorkspaceUtilityDock } from "@/components/admin/workspace/WorkspaceUtilityDock";
import { WorkspaceView } from "@/components/admin/workspace/WorkspaceView";
import { useAdminCollection } from "@/components/admin/workspace/useAdminCollection";
import {
  formatCount,
  pluralize,
  shortRecordId,
} from "@/components/admin/workspace/utils";
import {
  filterAndSortSkills,
  formatCategory,
  shortcuts,
  sortOptions,
  type SkillSort,
  type SkillStatus,
} from "./skill-utils";
import { SkillsGrid, SkillsListCards } from "./SkillsCards";
import { SkillsTable } from "./SkillsTable";
import type { SkillActionHandlers } from "./SkillActionsMenu";

const PAGE_SIZE = 6;

function getSkillTitle(skill: SkillListItem) {
  return skill.name;
}

function filterSkills({
  items,
  search,
  status,
  group,
  sort,
}: {
  items: SkillListItem[];
  search: string;
  status: SkillStatus;
  group: string;
  sort: SkillSort;
}) {
  return filterAndSortSkills({ skills: items, search, status, category: group, sort });
}

export function SkillWorkspace({
  skills,
  initialSearch = "",
  loadError,
}: {
  skills: SkillListItem[];
  initialSearch?: string;
  loadError?: string;
}) {
  const {
    search,
    setSearch,
    status,
    setStatus,
    group,
    setGroup,
    sort,
    setSort,
    view,
    setView,
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
  } = useAdminCollection<SkillListItem, SkillStatus, SkillSort>({
    items: skills,
    endpoint: "/api/admin/skills",
    pageSize: PAGE_SIZE,
    initialSearch,
    initialStatus: "all",
    initialSort: "updated",
    getTitle: getSkillTitle,
    filter: filterSkills,
    newHref: "/admin/skills/new",
    entity: { singular: "skill", plural: "skills" },
  });

  const counts = useMemo(() => {
    const published = skills.filter((item) => item.isVisible).length;
    return {
      all: skills.length,
      published,
      draft: skills.length - published,
    } satisfies Record<SkillStatus, number>;
  }, [skills]);

  const filteredCounts = useMemo(
    () => ({
      published: filtered.filter((item) => item.isVisible).length,
      draft: filtered.filter((item) => !item.isVisible).length,
    }),
    [filtered]
  );

  const categories = useMemo(
    () => Array.from(new Set(skills.map((item) => item.category))).sort(),
    [skills]
  );

  const groupOptions: WorkspaceSelectOption[] = [
    { value: "all", label: "All categories" },
    ...categories.map((category) => ({ value: category, label: formatCategory(category) })),
  ];

  const tabs: WorkspaceStatusTab<SkillStatus>[] = [
    { value: "all", label: "All", count: counts.all },
    { value: "published", label: "Published", count: counts.published },
    { value: "draft", label: "Drafts", count: counts.draft },
  ];

  const media = skills.reduce((total, item) => total + (item.iconSrc ? 1 : 0), 0);

  const primary = dialogItems[0];
  const deleteCount = dialogItems.length;
  const deleteBatch = deleteCount > 1;
  const deleteMedia = dialogItems.reduce((total, item) => total + (item.iconSrc ? 1 : 0), 0);
  const detailRows: WorkspaceDetailRow[] = primary
    ? [
        {
          label: "Category",
          value: deleteBatch
            ? `${deleteCount} skill records`
            : formatCategory(primary.category),
        },
        {
          label: "Status",
          value: deleteBatch
            ? `Multi-select // ${deleteCount} records`
            : `${primary.isVisible ? "Published" : "Draft"} // ID ${shortRecordId(primary.id)}`,
          tone: "alert",
        },
        {
          label: "Icon bindings",
          value: pluralize(deleteMedia, "icon"),
        },
      ]
    : [];

  const actions: SkillActionHandlers = {
    busyIds,
    selectedIds,
    onToggleSelected: toggleSelected,
    onToggleVisibility: toggleVisibility,
    onCopyPublicUrl: () =>
      void copyToClipboard(`${window.location.origin}/about`, "About page URL copied."),
    onDelete: requestDelete,
  };

  return (
    <section aria-labelledby="skills-heading">
      {loadError && (
        <div
          role="alert"
          className="mb-4 border-2 border-admin-alert bg-admin-alert/10 px-3 py-2.5 text-[11.5px] leading-5 text-admin-alert"
        >
          Skills could not be loaded: {loadError}
        </div>
      )}

      <WorkspaceHeader
        section="Skills"
        eyebrowSection="Content"
        eyebrowLabel="Skill index"
        title="Skills"
        titleId="skills-heading"
        description="Manage the tools and technologies that represent your practice. Control visibility, sort order, and keep every skill record in sync."
        publicHref="/about"
        newHref="/admin/skills/new"
        newLabel="New Skill"
        records={skills}
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
        tabs={tabs}
        status={status}
        onStatus={setStatus}
        statusAriaLabel="Filter skills by status"
        search={search}
        onSearch={setSearch}
        searchRef={searchRef}
        searchPlaceholder="Search skills..."
        searchAriaLabel="Search skills"
        clearSearchLabel="Clear skill search"
        group={group}
        onGroup={setGroup}
        groupOptions={groupOptions}
        groupAriaLabel="Filter skills by category"
        sort={sort}
        onSort={setSort}
        sortOptions={sortOptions}
        sortAriaLabel="Sort skills"
        view={view}
        onView={setView}
        viewAriaLabel="Skill layout"
      />

      {selectedIds.size > 0 && (
        <WorkspaceBulkBar
          count={selectedIds.size}
          busy={bulkBusy}
          noun="skill"
          archiveLabel="about page skills section"
          onPublish={() => void runBulkVisibility(true)}
          onMoveToDraft={() => void runBulkVisibility(false)}
          onDelete={requestBulkDelete}
          onClear={clearSelection}
        />
      )}

      <WorkspaceView
        isEmpty={pageItems.length === 0}
        view={view}
        emptyState={
          <div className="p-4">
            <div
              role="status"
              className="flex flex-col items-center justify-center gap-2 border-2 border-dashed border-line/45 bg-admin-wash/30 px-6 py-12 text-center"
            >
              <span className="mb-1 grid size-10 place-items-center border-2 border-line bg-surface shadow-[2px_2px_0_var(--foreground)]">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="text-muted" aria-hidden="true"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
              </span>
              <p className="m-0 font-space text-[14px] font-bold leading-5 tracking-[-.02em]">
                {skills.length === 0
                  ? "No skills in the studio yet."
                  : search.trim()
                  ? `No skills found matching “${search.trim()}”`
                  : filtersActive
                  ? "No skills match these filters."
                  : "No skills to show."}
              </p>
              <p className="m-0 max-w-sm text-[11.5px] leading-5 text-muted">
                {skills.length > 0
                  ? "Try relaxing the filters or clearing the search term."
                  : "Create the first skill record to populate the About page."}
              </p>

              <div className="mt-2 flex flex-wrap items-center justify-center gap-2">
                {skills.length > 0 && filtersActive && (
                  <button
                    type="button"
                    onClick={resetFilters}
                    className="inline-flex h-8 items-center gap-1.5 border-2 border-line bg-surface px-3 font-jet text-[8px] font-bold uppercase tracking-[.06em] shadow-[2px_2px_0_var(--foreground)] transition-transform hover:-translate-y-0.5 motion-reduce:transform-none"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>
                    Reset filters
                  </button>
                )}
                {skills.length === 0 && (
                  <a
                    href="/admin/skills/new"
                    className="inline-flex h-8 items-center gap-1.5 border-2 border-line bg-purple px-3 font-jet text-[8px] font-bold uppercase tracking-[.06em] shadow-[2px_2px_0_var(--foreground)] transition-transform hover:-translate-y-0.5 motion-reduce:transform-none"
                  >
                    New skill
                  </a>
                )}
              </div>
            </div>
          </div>
        }
        table={
          <SkillsTable
            skills={pageItems}
            actions={actions}
            allSelected={allSelected}
            someSelected={someSelected}
            onSelectAll={selectAllOnPage}
            selectDisabled={bulkBusy}
          />
        }
        cards={
          <SkillsListCards
            skills={pageItems}
            actions={actions}
            selectDisabled={bulkBusy}
          />
        }
        grid={
          <SkillsGrid
            skills={pageItems}
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
            noun="skills"
            stats={[
              `${formatCount(filteredCounts.published)} Published`,
              `${formatCount(filteredCounts.draft)} Draft`,
            ]}
            ariaLabel="Skill pagination"
            onPage={setPage}
          />
        }
      />

      <WorkspaceUtilityDock
        pipelineTitle="Publishing & revalidation"
        pipelineDescription="PostgreSQL records drive the skills section on the About page. Saving a skill refreshes this workspace. The About page reads the latest records on request."
        pipelineStats={[
          {
            label: "Public visibility",
            value: `${formatCount(counts.published)} Published / ${formatCount(counts.draft)} Draft`,
          },
          {
            label: "Icon bindings",
            value: pluralize(media, "asset"),
            tone: "success",
          },
        ]}
        query={search}
        nounPlural="skills"
        shortcuts={shortcuts}
        onResetFilters={resetFilters}
      />

      {(() => {
        const deleteRecords = dialogItems.map((item) => ({
          id: item.id,
          title: item.name,
        }));

        return (
          <DeleteRecordsDialog
            open={dialogOpen && dialogItems.length > 0}
            records={deleteRecords}
            entity={{ singular: "skill", plural: "skills" }}
            archiveLabel="About page skills section"
            mediaLabel="icon"
            detailRows={detailRows}
            onClose={closeDialog}
            onConfirm={confirmDelete}
          />
        );
      })()}
    </section>
  );
}