import type { LucideIcon } from "lucide-react";

export type WorkspaceViewMode = "list" | "grid";

export type WorkspaceSelectOption = {
  value: string;
  label: string;
};

export type WorkspaceStatusTab<Status extends string> = {
  value: Status;
  label: string;
  count: number;
};

export type WorkspaceSortOption<Sort extends string> = {
  value: Sort;
  label: string;
};

export type WorkspaceDeleteRecord = {
  id: string;
  title: string;
};

export type WorkspaceDetailRow = {
  label: string;
  value: string;
  tone?: "alert";
};

export type WorkspaceActionItem =
  | { kind: "separator" }
  | {
      kind: "link";
      label: string;
      icon: LucideIcon;
      href: string;
      external?: boolean;
      onSelect?: () => void;
    }
  | {
      kind: "button";
      label: string;
      icon: LucideIcon;
      onSelect: () => void;
      danger?: boolean;
      disabled?: boolean;
    };

export type WorkspaceShortcut = {
  label: string;
  keys: string[];
};

export type WorkspacePipelineStat = {
  label: string;
  value: string;
  tone?: "success";
};

/** Shared callbacks for table, list-card, and grid-card presentations. */
export type WorkspaceRecordActions<T> = {
  busyIds: ReadonlySet<string>;
  selectedIds: ReadonlySet<string>;
  onToggleSelected: (id: string) => void;
  onToggleVisibility: (item: T) => void;
  onCopyPublicUrl: (item: T) => void;
  onDelete: (item: T) => void;
};
