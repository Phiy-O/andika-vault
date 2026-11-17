import Image from "next/image";
import { FolderKanban, Loader2, Star } from "lucide-react";
import type { ProjectListItem } from "@/src/types";
import { formatCategory, getProjectStatus } from "./project-utils";

export function ProjectStatusBadge({
  project,
}: {
  project: Pick<ProjectListItem, "isVisible">;
}) {
  const status = getProjectStatus(project);
  const published = status === "published";

  return (
    <span
      className={`inline-flex h-5 items-center gap-1.5 border border-line px-2 font-jet text-[9px] font-bold uppercase leading-none tracking-[.08em] ${
        published
          ? "bg-admin-mint text-foreground"
          : "bg-admin-wash text-muted"
      }`}
    >
      <span
        className={`size-1.5 rounded-full ${
          published ? "bg-admin-success" : "bg-muted"
        }`}
        aria-hidden="true"
      />
      {published ? "Published" : "Draft"}
    </span>
  );
}

export function ProjectCategoryBadge({ category }: { category: string }) {
  return (
    <span className="inline-flex max-w-[104px] items-center border border-line bg-surface px-2 py-1 font-jet text-[8px] font-bold uppercase leading-[1.35] tracking-[.05em] text-foreground">
      <span className="break-words">{formatCategory(category)}</span>
    </span>
  );
}

export function ProjectTechBadge({ techStack }: { techStack: string[] }) {
  if (techStack.length === 0) return null;
  const visible = techStack.slice(0, 2);
  const remaining = techStack.length - visible.length;

  return (
    <span className="inline-flex max-w-[112px] flex-col border border-line bg-surface px-1.5 py-0.5 font-jet text-[8px] font-bold uppercase leading-[1.4] tracking-[.04em] text-foreground">
      <span className="truncate">{`${visible[0]} //`}</span>
      {visible[1] && <span className="truncate text-muted">{visible[1]}</span>}
      {remaining > 0 && (
        <span className="text-muted">+{remaining} more</span>
      )}
    </span>
  );
}

export function ProjectThumbnail({
  project,
  size = "row",
}: {
  project: Pick<ProjectListItem, "title" | "thumbnail">;
  size?: "row" | "card";
}) {
  const className =
    size === "row"
      ? "h-10 w-12 border-2 border-line shadow-[2px_2px_0_var(--foreground)]"
      : "aspect-[16/9] w-full border-b-2 border-line";

  return (
    <div
      className={`relative shrink-0 overflow-hidden bg-admin-wash ${className}`}
    >
      {project.thumbnail ? (
        <Image
          src={project.thumbnail}
          alt=""
          width={size === "row" ? 48 : 640}
          height={size === "row" ? 40 : 360}
          unoptimized
          className="h-full w-full object-cover"
        />
      ) : (
        <span className="grid h-full w-full place-items-center bg-surface">
          <FolderKanban
            size={size === "row" ? 18 : 30}
            strokeWidth={1.5}
            className="text-muted"
            aria-hidden="true"
          />
        </span>
      )}
    </div>
  );
}

export function FeaturedButton({
  project,
  busy,
  onToggle,
  className = "",
}: {
  project: Pick<ProjectListItem, "title" | "featured">;
  busy?: boolean;
  onToggle: () => void;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      disabled={busy}
      className={`grid size-8 place-items-center text-muted transition-colors hover:bg-admin-wash disabled:cursor-wait disabled:opacity-50 ${className}`}
      aria-label={
        project.featured
          ? `Remove ${project.title} from featured projects`
          : `Feature ${project.title}`
      }
      aria-pressed={project.featured}
      title={project.featured ? "Remove from featured" : "Mark as featured"}
    >
      {busy ? (
        <Loader2 size={15} className="animate-spin" aria-hidden="true" />
      ) : (
        <Star
          size={16}
          strokeWidth={1.8}
          className="fill-purple text-purple"
          aria-hidden="true"
        />
      )}
    </button>
  );
}
