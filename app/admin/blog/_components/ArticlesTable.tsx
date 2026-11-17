"use client";

import Link from "next/link";
import { ExternalLink, Pencil } from "lucide-react";
import type { BlogPostListItem } from "@/src/types";
import { WorkspaceSelectCheckbox } from "@/components/admin/workspace/WorkspaceSelectCheckbox";
import {
  WorkspaceStatusBadge,
  WorkspaceTextBadge,
} from "@/components/admin/workspace/WorkspaceBadges";
import {
  formatCategory,
  formatDate,
  formatRelativeTime,
} from "@/components/admin/workspace/utils";
import {
  ArticleReadBadge,
  ArticleTagBadge,
  ArticleThumbnail,
} from "./ArticleBadges";
import {
  ArticleActionsMenu,
  type ArticleActionHandlers,
} from "./ArticleActionsMenu";

export function ArticlesTable({
  articles,
  actions,
  allSelected,
  someSelected,
  onSelectAll,
  selectDisabled,
}: {
  articles: BlogPostListItem[];
  actions: ArticleActionHandlers;
  allSelected: boolean;
  someSelected: boolean;
  onSelectAll: (checked: boolean) => void;
  selectDisabled: boolean;
}) {
  return (
    <table className="w-full table-fixed border-collapse text-left">
      <caption className="sr-only">
        Blog articles with category, read time, visibility, and last update
      </caption>
      <colgroup>
        <col className="w-[34px]" />
        <col />
        <col className="w-[112px]" />
        <col className="w-[128px]" />
        <col className="w-[112px]" />
        <col className="w-[104px]" />
        <col className="w-[152px]" />
      </colgroup>

      <thead>
        <tr className="border-b-2 border-line bg-admin-wash/60">
          <th scope="col" className="py-2.5 pl-3 pr-1">
            <WorkspaceSelectCheckbox
              checked={allSelected}
              indeterminate={someSelected}
              disabled={selectDisabled || articles.length === 0}
              onChange={onSelectAll}
              label="Select all articles on this page"
            />
          </th>
          <th
            scope="col"
            className="px-2.5 py-2.5 font-jet text-[8px] font-bold uppercase tracking-[.12em] text-muted"
          >
            Article
          </th>
          <th
            scope="col"
            className="px-2 py-2.5 font-jet text-[8px] font-bold uppercase tracking-[.12em] text-muted"
          >
            Category
          </th>
          <th
            scope="col"
            className="px-2 py-2.5 font-jet text-[8px] font-bold uppercase tracking-[.12em] text-muted"
          >
            Read time
          </th>
          <th
            scope="col"
            className="px-2 py-2.5 font-jet text-[8px] font-bold uppercase tracking-[.12em] text-muted"
          >
            Status
          </th>
          <th
            scope="col"
            className="px-2 py-2.5 font-jet text-[8px] font-bold uppercase tracking-[.12em] text-muted"
          >
            Updated
          </th>
          <th
            scope="col"
            className="py-2.5 pl-2 pr-2.5 text-right font-jet text-[8px] font-bold uppercase tracking-[.12em] text-muted"
          >
            Actions
          </th>
        </tr>
      </thead>

      <tbody>
        {articles.map((article) => {
          const selected = actions.selectedIds.has(article.id);

          return (
            <tr
              key={article.id}
              className={`border-b border-line/30 transition-colors last:border-b-0 ${
                selected ? "bg-admin-wash/70" : "hover:bg-admin-wash/35"
              }`}
            >
              <td className="h-[84px] py-3 pl-3 pr-1 align-middle">
                <WorkspaceSelectCheckbox
                  checked={selected}
                  disabled={selectDisabled}
                  onChange={() => actions.onToggleSelected(article.id)}
                  label={`Select ${article.title}`}
                />
              </td>

              <td className="px-2.5 py-3 align-middle">
                <div className="flex min-w-0 items-center gap-3">
                  <ArticleThumbnail article={article} />
                  <div className="min-w-0 flex-1">
                    <div className="flex min-w-0 items-center gap-1.5">
                      <span className="truncate font-space text-[12.5px] font-bold leading-4 tracking-[-.01em] text-foreground">
                        {article.title}
                      </span>
                      {!article.isVisible && (
                        <span className="shrink-0 font-jet text-[7px] font-bold uppercase tracking-[.06em] text-muted">
                          Draft
                        </span>
                      )}
                    </div>
                    <Link
                      href={`/blog/${article.slug}`}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-0.5 block truncate font-jet text-[8.5px] font-medium tracking-[.01em] text-purple underline-offset-2 hover:underline"
                    >
                      /blog/{article.slug}
                    </Link>
                    <p className="mt-1 line-clamp-1 text-[10.5px] leading-4 text-muted">
                      {article.excerpt}
                    </p>
                  </div>
                  <span className="hidden shrink-0 2xl:inline-flex">
                    <ArticleTagBadge tags={article.tags} />
                  </span>
                </div>
              </td>

              <td className="px-2 py-3 align-middle">
                <WorkspaceTextBadge
                  label={formatCategory(article.category)}
                />
              </td>

              <td className="px-2 py-3 align-middle">
                <ArticleReadBadge article={article} compact />
              </td>

              <td className="px-2 py-3 align-middle">
                <WorkspaceStatusBadge visible={article.isVisible} />
              </td>

              <td className="px-2 py-3 align-middle">
                <p className="font-jet text-[9px] font-bold leading-4 text-foreground">
                  {formatDate(article.updatedAt)}
                </p>
                <p className="truncate font-jet text-[7.5px] font-medium uppercase leading-4 tracking-[.02em] text-muted">
                  {formatRelativeTime(article.updatedAt)}
                </p>
              </td>

              <td className="py-3 pl-2 pr-2.5 align-middle">
                <div className="flex items-center justify-end gap-1">
                  <Link
                    href={`/admin/blog/${article.id}/edit`}
                    className="inline-flex h-8 items-center gap-1 border border-line bg-surface px-2 font-jet text-[8px] font-bold uppercase tracking-[.04em] transition-colors hover:bg-admin-wash"
                    aria-label={`Edit ${article.title}`}
                    title="Edit article"
                  >
                    <Pencil size={10} aria-hidden="true" />
                    Edit
                  </Link>
                  <a
                    href={`/blog/${article.slug}`}
                    target="_blank"
                    rel="noreferrer"
                    className="grid size-8 place-items-center border border-line bg-surface transition-colors hover:bg-admin-wash"
                    aria-label={`Open ${article.title} public page`}
                    title="Open public page"
                  >
                    <ExternalLink size={12} aria-hidden="true" />
                  </a>
                  <ArticleActionsMenu article={article} actions={actions} />
                </div>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
