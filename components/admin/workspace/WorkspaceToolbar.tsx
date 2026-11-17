import type { RefObject } from "react";
import {
  ChevronDown,
  LayoutGrid,
  List,
  Search,
  SlidersHorizontal,
} from "lucide-react";
import type {
  WorkspaceSelectOption,
  WorkspaceSortOption,
  WorkspaceStatusTab,
  WorkspaceViewMode,
} from "./types";
import { formatCount } from "./utils";

export function WorkspaceToolbar<Status extends string, Sort extends string>({
  tabs,
  status,
  onStatus,
  statusAriaLabel,
  search,
  onSearch,
  searchRef,
  searchPlaceholder,
  searchAriaLabel,
  clearSearchLabel,
  group,
  onGroup,
  groupOptions,
  groupAriaLabel,
  sort,
  onSort,
  sortOptions,
  sortAriaLabel,
  view,
  onView,
  viewAriaLabel,
}: {
  tabs: WorkspaceStatusTab<Status>[];
  status: Status;
  onStatus: (value: Status) => void;
  statusAriaLabel: string;
  search: string;
  onSearch: (value: string) => void;
  searchRef: RefObject<HTMLInputElement | null>;
  searchPlaceholder: string;
  searchAriaLabel: string;
  clearSearchLabel: string;
  group: string;
  onGroup: (value: string) => void;
  groupOptions: WorkspaceSelectOption[];
  groupAriaLabel: string;
  sort: Sort;
  onSort: (value: Sort) => void;
  sortOptions: WorkspaceSortOption<Sort>[];
  sortAriaLabel: string;
  view: WorkspaceViewMode;
  onView: (value: WorkspaceViewMode) => void;
  viewAriaLabel: string;
}) {
  return (
    <div className="mb-4 border-2 border-line bg-surface py-2.5 pl-2.5 pr-2.5 shadow-[3px_3px_0_var(--foreground)]">
      <div className="flex flex-wrap items-center gap-2">
        <div
          className="flex flex-wrap items-center gap-1.5"
          role="group"
          aria-label={statusAriaLabel}
        >
          {tabs.map((tab) => {
            const active = status === tab.value;
            return (
              <button
                key={tab.value}
                type="button"
                aria-pressed={active}
                onClick={() => onStatus(tab.value)}
                className={`inline-flex h-[30px] items-center gap-2 border px-2 font-jet text-[9px] font-bold uppercase leading-none tracking-[.06em] transition-colors ${
                  active
                    ? "border-line bg-foreground text-background"
                    : "border-line bg-surface text-muted hover:bg-admin-wash hover:text-foreground"
                }`}
              >
                {tab.label}
                <span
                  className={`inline-flex min-w-[20px] justify-center border px-1 py-0.5 font-jet text-[8px] leading-none ${
                    active
                      ? "border-background/30 text-background"
                      : "border-line/25 text-foreground"
                  }`}
                >
                  {formatCount(tab.count)}
                </span>
              </button>
            );
          })}
        </div>

        <div className="ml-auto flex flex-wrap items-center gap-2">
          <label className="flex h-9 w-[158px] items-center border border-line bg-background pl-2.5">
            <Search size={13} className="shrink-0 text-muted" aria-hidden="true" />
            <span className="sr-only">{searchAriaLabel}</span>
            <input
              ref={searchRef}
              value={search}
              onChange={(event) => onSearch(event.target.value)}
              placeholder={searchPlaceholder}
              className="h-full min-w-0 flex-1 border-0 bg-transparent px-2 font-sans text-[11px] text-foreground outline-none placeholder:text-muted/80"
            />
            {search && (
              <button
                type="button"
                onClick={() => onSearch("")}
                className="mr-1 grid size-5 shrink-0 place-items-center text-muted hover:text-foreground"
                aria-label={clearSearchLabel}
              >
                ×
              </button>
            )}
          </label>

          <label className="relative flex h-9 w-[158px] items-center border border-line bg-background">
            <SlidersHorizontal
              size={12}
              className="pointer-events-none absolute left-2.5 text-muted"
              aria-hidden="true"
            />
            <span className="sr-only">{groupAriaLabel}</span>
            <select
              value={group}
              onChange={(event) => onGroup(event.target.value)}
              className="h-full w-full appearance-none border-0 bg-transparent pl-8 pr-7 font-jet text-[9px] font-bold uppercase tracking-[.04em] text-foreground outline-none"
            >
              {groupOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <ChevronDown
              size={12}
              className="pointer-events-none absolute right-2.5 text-muted"
              aria-hidden="true"
            />
          </label>

          <label className="relative flex h-9 w-[176px] items-center border border-line bg-background">
            <span className="sr-only">{sortAriaLabel}</span>
            <select
              value={sort}
              onChange={(event) => onSort(event.target.value as Sort)}
              className="h-full w-full appearance-none border-0 bg-transparent pl-2.5 pr-7 font-jet text-[9px] font-bold uppercase tracking-[.04em] text-foreground outline-none"
            >
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <ChevronDown
              size={12}
              className="pointer-events-none absolute right-2.5 text-muted"
              aria-hidden="true"
            />
          </label>

          <div
            className="flex h-9 w-[68px] items-center border border-line bg-background p-0.5"
            role="group"
            aria-label={viewAriaLabel}
          >
            <button
              type="button"
              onClick={() => onView("list")}
              aria-pressed={view === "list"}
              title="List view"
              className={`grid size-8 place-items-center transition-colors ${
                view === "list"
                  ? "bg-foreground text-background"
                  : "text-muted hover:bg-admin-wash hover:text-foreground"
              }`}
            >
              <List size={14} aria-hidden="true" />
              <span className="sr-only">List view</span>
            </button>
            <button
              type="button"
              onClick={() => onView("grid")}
              aria-pressed={view === "grid"}
              title="Grid view"
              className={`grid size-8 place-items-center transition-colors ${
                view === "grid"
                  ? "bg-foreground text-background"
                  : "text-muted hover:bg-admin-wash hover:text-foreground"
              }`}
            >
              <LayoutGrid size={14} aria-hidden="true" />
              <span className="sr-only">Grid view</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
