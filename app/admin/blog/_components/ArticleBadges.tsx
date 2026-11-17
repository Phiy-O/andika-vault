import { FileText } from "lucide-react";
import type { BlogPostListItem } from "@/src/types";
import { WorkspaceThumbnail } from "@/components/admin/workspace/WorkspaceThumbnail";
import { isLongRead } from "./article-utils";

export function ArticleThumbnail({
  article,
  size = "row",
}: {
  article: Pick<BlogPostListItem, "thumbnail">;
  size?: "row" | "card";
}) {
  return (
    <WorkspaceThumbnail
      src={article.thumbnail}
      size={size}
      fallback={
        <FileText
          size={size === "row" ? 18 : 30}
          strokeWidth={1.5}
          className="text-muted"
          aria-hidden="true"
        />
      }
    />
  );
}

export function ArticleReadBadge({
  article,
  compact = false,
}: {
  article: Pick<BlogPostListItem, "readTime">;
  compact?: boolean;
}) {
  const longRead = isLongRead(article);

  return (
    <span
      title={longRead ? "Long read" : undefined}
      className={`inline-flex h-5 items-center gap-1.5 whitespace-nowrap border border-line px-2 font-jet text-[9px] font-bold uppercase leading-none tracking-[.08em] ${
        longRead
          ? "bg-admin-mint text-foreground"
          : "bg-surface text-foreground"
      }`}
    >
      {longRead && (
        <span
          className="size-1.5 shrink-0 rounded-full bg-admin-success"
          aria-hidden="true"
        />
      )}
      {!compact && longRead ? `Long read // ${article.readTime}` : article.readTime}
    </span>
  );
}

export function ArticleTagBadge({ tags }: { tags: string[] }) {
  if (tags.length === 0) return null;
  const visible = tags.slice(0, 2);
  const remaining = tags.length - visible.length;

  return (
    <span className="inline-flex max-w-[112px] flex-col border border-line bg-surface px-1.5 py-0.5 font-jet text-[8px] font-bold uppercase leading-[1.4] tracking-[.04em] text-foreground">
      <span className="truncate">{`#${visible[0]} //`}</span>
      {visible[1] && <span className="truncate text-muted">#{visible[1]}</span>}
      {remaining > 0 && <span className="text-muted">+{remaining} more</span>}
    </span>
  );
}
