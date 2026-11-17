import type { ProjectListItem } from "@/src/types";

/** Shared callbacks for the table, list-card, and grid-card presentations. */
export type ProjectActionHandlers = {
  busyIds: ReadonlySet<string>;
  selectedIds: ReadonlySet<string>;
  onToggleSelected: (id: string) => void;
  onToggleFeatured: (project: ProjectListItem) => void;
  onToggleVisibility: (project: ProjectListItem) => void;
  onCopyPublicUrl: (project: ProjectListItem) => void;
  onDelete: (project: ProjectListItem) => void;
};

export type ProjectsViewMode = "list" | "grid";
