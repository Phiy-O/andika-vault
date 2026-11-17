"use client";

import {
  Copy,
  Eye,
  EyeOff,
  ExternalLink,
  Pencil,
  Trash2,
} from "lucide-react";
import type { BlogPostListItem } from "@/src/types";
import type {
  WorkspaceActionItem,
  WorkspaceRecordActions,
} from "@/components/admin/workspace/types";
import { WorkspaceActionsMenu } from "@/components/admin/workspace/WorkspaceActionsMenu";

export type ArticleActionHandlers = WorkspaceRecordActions<BlogPostListItem>;

export function ArticleActionsMenu({
  article,
  actions,
}: {
  article: BlogPostListItem;
  actions: ArticleActionHandlers;
}) {
  const busy = actions.busyIds.has(article.id);

  const items: WorkspaceActionItem[] = [
    {
      kind: "link",
      label: "Edit article",
      icon: Pencil,
      href: `/admin/blog/${article.id}/edit`,
    },
    {
      kind: "link",
      label: "Open public page",
      icon: ExternalLink,
      href: `/blog/${article.slug}`,
      external: true,
    },
    {
      kind: "button",
      label: "Copy public URL",
      icon: Copy,
      onSelect: () => actions.onCopyPublicUrl(article),
    },
    { kind: "separator" },
    {
      kind: "button",
      label: article.isVisible ? "Move to draft" : "Publish article",
      icon: article.isVisible ? EyeOff : Eye,
      onSelect: () => actions.onToggleVisibility(article),
    },
    { kind: "separator" },
    {
      kind: "button",
      label: "Delete article",
      icon: Trash2,
      danger: true,
      onSelect: () => actions.onDelete(article),
    },
  ];

  return (
    <WorkspaceActionsMenu
      label={`More actions for ${article.title}`}
      items={items}
      disabled={busy}
    />
  );
}
