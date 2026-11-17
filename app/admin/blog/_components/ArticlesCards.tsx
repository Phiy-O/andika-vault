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
import { ArticleReadBadge, ArticleThumbnail } from "./ArticleBadges";
import {
  ArticleActionsMenu,
  type ArticleActionHandlers,
} from "./ArticleActionsMenu";

export function ArticlesListCards({
  articles,
  actions,
  selectDisabled,
}: {
  articles: BlogPostListItem[];
  actions: ArticleActionHandlers;
  selectDisabled: boolean;
}) {
  return (
    <div>
      {articles.map((article) => {
        const selected = actions.selectedIds.has(article.id);

        return (
          <article
            key={article.id}
            aria-label={article.title}
            className={`border-b border-line/30 p-3.5 transition-colors last:border-b-0 sm:p-4 ${
              selected ? "bg-admin-wash/70" : ""
            }`}
          >
            <div className="flex items-start gap-2.5 sm:gap-3">
              <WorkspaceSelectCheckbox
                checked={selected}
                disabled={selectDisabled}
                onChange={() => actions.onToggleSelected(article.id)}
                label={`Select ${article.title}`}
                className="mt-1.5"
              />

              <ArticleThumbnail article={article} />

              <div className="min-w-0 flex-1">
                <div className="min-w-0">
                  <p className="line-clamp-2 break-words font-space text-[13px] font-bold leading-4 tracking-[-.01em] text-foreground">
                    {article.title}
                  </p>
                  <Link
                    href={`/blog/${article.slug}`}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-0.5 block truncate font-jet text-[8.5px] font-medium tracking-[.01em] text-purple underline-offset-2 hover:underline"
                  >
                    /blog/{article.slug}
                  </Link>
                </div>

                <p className="mt-1.5 line-clamp-2 text-[11px] leading-4 text-muted">
                  {article.excerpt}
                </p>

                <div className="mt-2 flex flex-wrap items-center gap-1.5">
                  <WorkspaceStatusBadge visible={article.isVisible} />
                  <ArticleReadBadge article={article} />
                  <WorkspaceTextBadge
                    label={formatCategory(article.category)}
                  />
                </div>
              </div>
            </div>

            <div className="mt-3 flex flex-wrap items-center justify-between gap-x-3 gap-y-2 border-t border-line/25 pt-2.5 sm:pl-7">
              <p className="font-jet text-[8px] font-medium uppercase leading-4 tracking-[.03em] text-muted">
                Updated{" "}
                <span className="font-bold text-foreground">
                  {formatDate(article.updatedAt)}
                </span>
                <span aria-hidden="true" className="mx-1.5 text-muted/50">
                  /
                </span>
                {formatRelativeTime(article.updatedAt)}
              </p>

              <div className="flex items-center gap-1">
                <Link
                  href={`/admin/blog/${article.id}/edit`}
                  className="inline-flex h-7 items-center gap-1 border border-line bg-surface px-2 font-jet text-[8px] font-bold uppercase tracking-[.04em] transition-colors hover:bg-admin-wash"
                  aria-label={`Edit ${article.title}`}
                >
                  <Pencil size={10} aria-hidden="true" />
                  Edit
                </Link>
                <a
                  href={`/blog/${article.slug}`}
                  target="_blank"
                  rel="noreferrer"
                  className="grid size-7 place-items-center border border-line bg-surface transition-colors hover:bg-admin-wash"
                  aria-label={`Open ${article.title} public page`}
                  title="Open public page"
                >
                  <ExternalLink size={11} aria-hidden="true" />
                </a>
                <ArticleActionsMenu article={article} actions={actions} />
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
}

export function ArticlesGrid({
  articles,
  actions,
  selectDisabled,
}: {
  articles: BlogPostListItem[];
  actions: ArticleActionHandlers;
  selectDisabled: boolean;
}) {
  return (
    <div className="grid gap-4 p-4 sm:grid-cols-2 2xl:grid-cols-3">
      {articles.map((article) => {
        const selected = actions.selectedIds.has(article.id);

        return (
          <article
            key={article.id}
            aria-label={article.title}
            className={`flex flex-col border-2 border-line bg-surface transition-colors ${
              selected
                ? "shadow-[3px_3px_0_var(--purple)]"
                : "shadow-[3px_3px_0_var(--foreground)]"
            }`}
          >
            <div className="relative">
              <ArticleThumbnail article={article} size="card" />
              <span className="absolute left-2 top-2 grid size-6 place-items-center border border-line bg-surface/95">
                <WorkspaceSelectCheckbox
                  checked={selected}
                  disabled={selectDisabled}
                  onChange={() => actions.onToggleSelected(article.id)}
                  label={`Select ${article.title}`}
                />
              </span>
            </div>

            <div className="flex min-h-0 flex-1 flex-col p-3.5">
              <div className="min-w-0">
                <p className="line-clamp-2 break-words font-space text-[14px] font-bold leading-5 tracking-[-.02em]">
                  {article.title}
                </p>
                <Link
                  href={`/blog/${article.slug}`}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-0.5 block truncate font-jet text-[8.5px] font-medium tracking-[.01em] text-purple underline-offset-2 hover:underline"
                >
                  /blog/{article.slug}
                </Link>
              </div>

              <p className="mt-2 line-clamp-2 text-[11px] leading-[1.6] text-muted">
                {article.excerpt}
              </p>

              <div className="mt-3 flex flex-wrap items-center gap-1.5">
                <WorkspaceStatusBadge visible={article.isVisible} />
                <ArticleReadBadge article={article} />
                <WorkspaceTextBadge
                  label={formatCategory(article.category)}
                />
              </div>

              <div className="mt-auto flex items-center justify-between gap-2 border-t border-line/25 pt-3">
                <p className="min-w-0 truncate font-jet text-[7.5px] font-medium uppercase leading-4 tracking-[.03em] text-muted">
                  Updated{" "}
                  <span className="font-bold text-foreground">
                    {formatDate(article.updatedAt)}
                  </span>
                </p>
                <div className="flex shrink-0 items-center gap-1">
                  <Link
                    href={`/admin/blog/${article.id}/edit`}
                    className="inline-flex h-7 items-center gap-1 border border-line bg-surface px-2 font-jet text-[8px] font-bold uppercase tracking-[.04em] transition-colors hover:bg-admin-wash"
                    aria-label={`Edit ${article.title}`}
                  >
                    <Pencil size={10} aria-hidden="true" />
                    Edit
                  </Link>
                  <ArticleActionsMenu article={article} actions={actions} />
                </div>
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
}
