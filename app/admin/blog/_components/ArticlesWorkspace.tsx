"use client";

import { useMemo } from "react";
import { AlertCircle, X } from "lucide-react";
import type { BlogPostListItem } from "@/src/types";
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
  formatCategory,
  formatCount,
  pluralize,
  shortRecordId,
} from "@/components/admin/workspace/utils";
import {
  articleBodyLabel,
  filterAndSortArticles,
  isLongRead,
  type ArticleSort,
  type ArticleStatus,
} from "./article-utils";
import { ArticlesGrid, ArticlesListCards } from "./ArticlesCards";
import {
  type ArticleActionHandlers,
} from "./ArticleActionsMenu";
import { ArticlesTable } from "./ArticlesTable";

const sortOptions: WorkspaceSortOption<ArticleSort>[] = [
  { value: "updated", label: "Sort: last updated" },
  { value: "title", label: "Sort: title A–Z" },
  { value: "manual", label: "Sort: manual order" },
];

const shortcuts: WorkspaceShortcut[] = [
  { label: "Search this workspace", keys: ["⌘", "K"] },
  { label: "Create new article", keys: ["N"] },
  { label: "Toggle list / grid", keys: ["V"] },
  { label: "Bulk select page", keys: ["⌘", "A"] },
];

function getArticleTitle(article: BlogPostListItem) {
  return article.title;
}

function filterArticles({
  items,
  search,
  status,
  group,
  sort,
}: {
  items: BlogPostListItem[];
  search: string;
  status: ArticleStatus;
  group: string;
  sort: ArticleSort;
}) {
  return filterAndSortArticles({
    articles: items,
    search,
    status,
    group,
    sort,
  });
}

export function ArticlesWorkspace({
  posts,
  initialSearch = "",
  loadError,
}: {
  posts: BlogPostListItem[];
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
  } = useAdminCollection<BlogPostListItem, ArticleStatus, ArticleSort>({
    items: posts,
    endpoint: "/api/admin/blog",
    pageSize: 6,
    initialSearch,
    initialStatus: "all",
    initialSort: "updated",
    getTitle: getArticleTitle,
    filter: filterArticles,
    newHref: "/admin/blog/new",
    entity: { singular: "article", plural: "articles" },
  });

  const counts = useMemo(() => {
    const published = posts.filter((post) => post.isVisible).length;
    return {
      all: posts.length,
      published,
      draft: posts.length - published,
      "long-reads": posts.filter(isLongRead).length,
    } satisfies Record<ArticleStatus, number>;
  }, [posts]);

  const filteredCounts = useMemo(
    () => ({
      published: filtered.filter((post) => post.isVisible).length,
      draft: filtered.filter((post) => !post.isVisible).length,
      longReads: filtered.filter(isLongRead).length,
    }),
    [filtered]
  );

  const categories = useMemo(
    () => Array.from(new Set(posts.map((post) => post.category))).sort(),
    [posts]
  );

  const groupOptions: WorkspaceSelectOption[] = [
    { value: "all", label: "All categories" },
    ...categories.map((category) => ({
      value: category,
      label: formatCategory(category),
    })),
  ];

  const tabs: WorkspaceStatusTab<ArticleStatus>[] = [
    { value: "all", label: "All", count: counts.all },
    { value: "published", label: "Published", count: counts.published },
    { value: "draft", label: "Drafts", count: counts.draft },
    {
      value: "long-reads",
      label: "Long reads",
      count: counts["long-reads"],
    },
  ];

  const media = posts.reduce(
    (total, post) => total + (post.thumbnail ? 1 : 0),
    0
  );

  const primary = dialogItems[0];
  const deleteCount = dialogItems.length;
  const deleteBatch = deleteCount > 1;
  const deleteMedia = dialogItems.reduce(
    (total, post) => total + (post.thumbnail ? 1 : 0),
    0
  );
  const allMarkdown =
    deleteCount > 0 &&
    dialogItems.every((post) => post.bodyFormat === "markdown");
  const detailRows: WorkspaceDetailRow[] = primary
    ? [
        {
          label: "Target slug",
          value: deleteBatch
            ? `${deleteCount} article records`
            : `/blog/${primary.slug}`,
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
          value: `${pluralize(deleteMedia, "Media Asset")}, ${
            deleteBatch
              ? pluralize(
                  deleteCount,
                  allMarkdown ? "Markdown Article" : "Article"
                )
              : articleBodyLabel(primary)
          }`,
        },
      ]
    : [];

  const actions: ArticleActionHandlers = {
    busyIds,
    selectedIds,
    onToggleSelected: toggleSelected,
    onToggleVisibility: toggleVisibility,
    onCopyPublicUrl: (article) =>
      void copyToClipboard(
        `${window.location.origin}/blog/${article.slug}`,
        "Public URL copied."
      ),
    onDelete: requestDelete,
  };

  return (
    <section aria-labelledby="articles-heading">
      {loadError && (
        <div
          role="alert"
          className="mb-4 border-2 border-admin-alert bg-admin-alert/10 px-3 py-2.5 text-[11.5px] leading-5 text-admin-alert"
        >
          Articles could not be loaded: {loadError}
        </div>
      )}

      <WorkspaceHeader
        section="Articles"
        eyebrowSection="Content"
        eyebrowLabel="Article index"
        title="Articles"
        titleId="articles-heading"
        description="Manage the writing that represents your thinking. Shape the archive, control public visibility, and keep every article record in sync."
        publicHref="/blog"
        newHref="/admin/blog/new"
        newLabel="New Article"
        records={posts}
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
        statusAriaLabel="Filter articles by status"
        search={search}
        onSearch={setSearch}
        searchRef={searchRef}
        searchPlaceholder="Search articles..."
        searchAriaLabel="Search articles"
        clearSearchLabel="Clear article search"
        group={group}
        onGroup={setGroup}
        groupOptions={groupOptions}
        groupAriaLabel="Filter articles by category"
        sort={sort}
        onSort={setSort}
        sortOptions={sortOptions}
        sortAriaLabel="Sort articles"
        view={view}
        onView={setView}
        viewAriaLabel="Article layout"
      />

      {selectedIds.size > 0 && (
        <WorkspaceBulkBar
          count={selectedIds.size}
          busy={bulkBusy}
          noun="article"
          archiveLabel="public blog archive"
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
            nounPlural="articles"
            query={search}
            filtersActive={filtersActive}
            hasAnyItems={posts.length > 0}
            emptyDescription="Create the first article record to populate the public blog."
            newHref="/admin/blog/new"
            newLabel="New article"
            onReset={resetFilters}
          />
        }
        table={
          <ArticlesTable
            articles={pageItems}
            actions={actions}
            allSelected={allSelected}
            someSelected={someSelected}
            onSelectAll={selectAllOnPage}
            selectDisabled={bulkBusy}
          />
        }
        cards={
          <ArticlesListCards
            articles={pageItems}
            actions={actions}
            selectDisabled={bulkBusy}
          />
        }
        grid={
          <ArticlesGrid
            articles={pageItems}
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
            noun="articles"
            stats={[
              `${formatCount(filteredCounts.published)} Published`,
              `${formatCount(filteredCounts.draft)} Draft`,
              `${formatCount(filteredCounts.longReads)} Long reads`,
            ]}
            ariaLabel="Article pagination"
            onPage={setPage}
          />
        }
      />

      <WorkspaceUtilityDock
        pipelineTitle="Publishing & revalidation"
        pipelineDescription="PostgreSQL records drive the public blog archive. Saving an article refreshes this workspace and deletes replaced Cloudinary thumbnails. Article pages read the latest record on request."
        pipelineStats={[
          {
            label: "Public visibility",
            value: `${formatCount(counts.published)} Published / ${formatCount(counts.draft)} Draft`,
          },
          {
            label: "Long reads",
            value: `${formatCount(counts["long-reads"])} of ${formatCount(posts.length)}`,
          },
          {
            label: "Media bindings",
            value: pluralize(media, "asset"),
            tone: "success",
          },
        ]}
        query={search}
        nounPlural="articles"
        shortcuts={shortcuts}
        onResetFilters={resetFilters}
      />

      <DeleteRecordsDialog
        open={dialogOpen && dialogItems.length > 0}
        records={dialogItems}
        entity={{ singular: "article", plural: "articles" }}
        archiveLabel="public blog archive"
        mediaLabel="thumbnail"
        detailRows={detailRows}
        onClose={closeDialog}
        onConfirm={confirmDelete}
      />
    </section>
  );
}
