import type { ReactNode } from "react";
import type { WorkspaceViewMode } from "./types";

export function WorkspaceView({
  isEmpty,
  view,
  emptyState,
  table,
  cards,
  grid,
  pagination,
}: {
  isEmpty: boolean;
  view: WorkspaceViewMode;
  emptyState: ReactNode;
  table: ReactNode;
  cards: ReactNode;
  grid: ReactNode;
  pagination: ReactNode;
}) {
  return (
    <div className="border-2 border-line bg-surface shadow-[3px_3px_0_var(--foreground)]">
      {isEmpty ? (
        emptyState
      ) : view === "grid" ? (
        grid
      ) : (
        <>
          <div className="hidden xl:block">{table}</div>
          <div className="xl:hidden">{cards}</div>
        </>
      )}

      {pagination}
    </div>
  );
}
