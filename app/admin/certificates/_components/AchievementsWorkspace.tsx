"use client";

import { useMemo } from "react";
import { AlertCircle, X } from "lucide-react";
import type { CertificateListItem } from "@/src/types";
import { DeleteRecordsDialog } from "@/components/admin/workspace/DeleteRecordsDialog";
import type {
  WorkspaceDetailRow,
  WorkspaceSelectOption,
  WorkspaceShortcut,
  WorkspaceSortOption,
  WorkspaceStatusTab,
} from "@/components/admin/workspace/types";
import { WorkspaceBulkBar } from "@/components/admin/workspace/WorkspaceBulkBar";
import { WorkspaceEmptyState } from "@/components/admin/workspace/WorkspaceEmptyState";
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
  filterAndSortAchievements,
  hasCredential,
  type AchievementSort,
  type AchievementStatus,
} from "./achievement-utils";
import { AchievementsGrid, AchievementsListCards } from "./AchievementsCards";
import type { AchievementActionHandlers } from "./AchievementActionsMenu";
import { AchievementsTable } from "./AchievementsTable";

const sortOptions: WorkspaceSortOption<AchievementSort>[] = [
  { value: "updated", label: "Sort: last updated" },
  { value: "title", label: "Sort: title A–Z" },
  { value: "issued", label: "Sort: issue date" },
  { value: "manual", label: "Sort: manual order" },
];

const shortcuts: WorkspaceShortcut[] = [
  { label: "Search this workspace", keys: ["⌘", "K"] },
  { label: "Create new achievement", keys: ["N"] },
  { label: "Toggle list / grid", keys: ["V"] },
  { label: "Bulk select page", keys: ["⌘", "A"] },
];

function getAchievementTitle(achievement: CertificateListItem) {
  return achievement.title;
}

function filterAchievements({
  items,
  search,
  status,
  group,
  sort,
}: {
  items: CertificateListItem[];
  search: string;
  status: AchievementStatus;
  group: string;
  sort: AchievementSort;
}) {
  return filterAndSortAchievements({
    achievements: items,
    search,
    status,
    group,
    sort,
  });
}

export function AchievementsWorkspace({
  certificates,
  initialSearch = "",
  loadError,
}: {
  certificates: CertificateListItem[];
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
  } = useAdminCollection<CertificateListItem, AchievementStatus, AchievementSort>(
    {
      items: certificates,
      endpoint: "/api/admin/certificates",
      pageSize: 6,
      initialSearch,
      initialStatus: "all",
      initialSort: "updated",
      getTitle: getAchievementTitle,
      filter: filterAchievements,
      newHref: "/admin/certificates/new",
      entity: { singular: "achievement", plural: "achievements" },
    }
  );

  const counts = useMemo(() => {
    const published = certificates.filter((item) => item.isVisible).length;
    return {
      all: certificates.length,
      published,
      draft: certificates.length - published,
      credentials: certificates.filter(hasCredential).length,
    } satisfies Record<AchievementStatus, number>;
  }, [certificates]);

  const filteredCounts = useMemo(
    () => ({
      published: filtered.filter((item) => item.isVisible).length,
      draft: filtered.filter((item) => !item.isVisible).length,
      credentials: filtered.filter(hasCredential).length,
    }),
    [filtered]
  );

  const issuers = useMemo(
    () =>
      Array.from(new Set(certificates.map((item) => item.issuer))).sort(),
    [certificates]
  );

  const groupOptions: WorkspaceSelectOption[] = [
    { value: "all", label: "All issuers" },
    ...issuers.map((issuer) => ({ value: issuer, label: issuer })),
  ];

  const tabs: WorkspaceStatusTab<AchievementStatus>[] = [
    { value: "all", label: "All", count: counts.all },
    { value: "published", label: "Published", count: counts.published },
    { value: "draft", label: "Drafts", count: counts.draft },
    {
      value: "credentials",
      label: "Credentials",
      count: counts.credentials,
    },
  ];

  const media = certificates.reduce(
    (total, item) => total + (item.image ? 1 : 0),
    0
  );

  const primary = dialogItems[0];
  const deleteCount = dialogItems.length;
  const deleteBatch = deleteCount > 1;
  const deleteMedia = dialogItems.reduce(
    (total, item) => total + (item.image ? 1 : 0),
    0
  );
  const linkedCredentials = dialogItems.filter(hasCredential).length;
  const credentialLabel =
    linkedCredentials > 0
      ? pluralize(linkedCredentials, "Credential linked", "Credentials linked")
      : "No credentials linked";
  const detailRows: WorkspaceDetailRow[] = primary
    ? [
        {
          label: "Issuer",
          value: deleteBatch
            ? `${deleteCount} achievement records`
            : primary.issuer,
        },
        {
          label: "Status",
          value: deleteBatch
            ? `Multi-select // ${deleteCount} records`
            : `${primary.isVisible ? "Published" : "Draft"} // ID ${shortRecordId(primary.id)}`,
          tone: "alert",
        },
        {
          label: "Bindings",
          value: `${pluralize(deleteMedia, "Media Asset")}, ${credentialLabel}`,
        },
      ]
    : [];

  const actions: AchievementActionHandlers = {
    busyIds,
    selectedIds,
    onToggleSelected: toggleSelected,
    onToggleVisibility: toggleVisibility,
    onCopyPublicUrl: () =>
      void copyToClipboard(
        `${window.location.origin}/achievements`,
        "Archive URL copied."
      ),
    onCopyCredentialUrl: (achievement) => {
      const url = achievement.credentialUrl;
      if (!url || !hasCredential(achievement)) return;
      void copyToClipboard(url, "Credential URL copied.");
    },
    onDelete: requestDelete,
  };

  return (
    <section aria-labelledby="achievements-heading">
      {loadError && (
        <div
          role="alert"
          className="mb-4 border-2 border-admin-alert bg-admin-alert/10 px-3 py-2.5 text-[11.5px] leading-5 text-admin-alert"
        >
          Achievements could not be loaded: {loadError}
        </div>
      )}

      <WorkspaceHeader
        section="Achievements"
        eyebrowSection="Content"
        eyebrowLabel="Achievement index"
        title="Achievements"
        titleId="achievements-heading"
        description="Manage the credentials and milestones that document your practice. Keep issuers, verification links, and public visibility in sync."
        publicHref="/achievements"
        newHref="/admin/certificates/new"
        newLabel="New Achievement"
        records={certificates}
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

      <WorkspaceToolbar
        tabs={tabs}
        status={status}
        onStatus={setStatus}
        statusAriaLabel="Filter achievements by status"
        search={search}
        onSearch={setSearch}
        searchRef={searchRef}
        searchPlaceholder="Search achievements..."
        searchAriaLabel="Search achievements"
        clearSearchLabel="Clear achievement search"
        group={group}
        onGroup={setGroup}
        groupOptions={groupOptions}
        groupAriaLabel="Filter achievements by issuer"
        sort={sort}
        onSort={setSort}
        sortOptions={sortOptions}
        sortAriaLabel="Sort achievements"
        view={view}
        onView={setView}
        viewAriaLabel="Achievement layout"
      />

      {selectedIds.size > 0 && (
        <WorkspaceBulkBar
          count={selectedIds.size}
          busy={bulkBusy}
          noun="achievement"
          archiveLabel="public achievements archive"
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
          <WorkspaceEmptyState
            nounPlural="achievements"
            query={search}
            filtersActive={filtersActive}
            hasAnyItems={certificates.length > 0}
            emptyDescription="Create the first achievement record to populate the public archive."
            newHref="/admin/certificates/new"
            newLabel="New achievement"
            onReset={resetFilters}
          />
        }
        table={
          <AchievementsTable
            achievements={pageItems}
            actions={actions}
            allSelected={allSelected}
            someSelected={someSelected}
            onSelectAll={selectAllOnPage}
            selectDisabled={bulkBusy}
          />
        }
        cards={
          <AchievementsListCards
            achievements={pageItems}
            actions={actions}
            selectDisabled={bulkBusy}
          />
        }
        grid={
          <AchievementsGrid
            achievements={pageItems}
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
            noun="achievements"
            stats={[
              `${formatCount(filteredCounts.published)} Published`,
              `${formatCount(filteredCounts.draft)} Draft`,
              `${formatCount(filteredCounts.credentials)} Credentials`,
            ]}
            ariaLabel="Achievement pagination"
            onPage={setPage}
          />
        }
      />

      <WorkspaceUtilityDock
        pipelineTitle="Publishing & revalidation"
        pipelineDescription="PostgreSQL records drive the public achievements archive. Saving an achievement refreshes this workspace and deletes replaced Cloudinary images. The archive reads the latest record on request."
        pipelineStats={[
          {
            label: "Public visibility",
            value: `${formatCount(counts.published)} Published / ${formatCount(counts.draft)} Draft`,
          },
          {
            label: "Credential links",
            value: `${formatCount(counts.credentials)} of ${formatCount(certificates.length)}`,
          },
          {
            label: "Media bindings",
            value: pluralize(media, "asset"),
            tone: "success",
          },
        ]}
        query={search}
        nounPlural="achievements"
        shortcuts={shortcuts}
        onResetFilters={resetFilters}
      />

      <DeleteRecordsDialog
        open={dialogOpen && dialogItems.length > 0}
        records={dialogItems}
        entity={{ singular: "achievement", plural: "achievements" }}
        archiveLabel="public achievements archive"
        mediaLabel="image"
        detailRows={detailRows}
        onClose={closeDialog}
        onConfirm={confirmDelete}
      />
    </section>
  );
}
