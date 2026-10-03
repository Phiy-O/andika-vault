"use client";

import { Search } from "lucide-react";

export type StatusFilter = "all" | "published" | "draft";

export function ListToolbar({
  search,
  onSearch,
  status,
  onStatus,
  categories,
  category,
  onCategory,
  placeholder = "Search...",
  statusLabels,
  onResetPage,
}: {
  search: string;
  onSearch: (v: string) => void;
  status: StatusFilter;
  onStatus: (v: StatusFilter) => void;
  categories?: string[];
  category?: string;
  onCategory?: (v: string) => void;
  placeholder?: string;
  statusLabels?: { published: string; draft: string };
  onResetPage?: () => void;
}) {
  function handleSearch(v: string) {
    onSearch(v);
    onResetPage?.();
  }
  function handleStatus(v: StatusFilter) {
    onStatus(v);
    onResetPage?.();
  }
  function handleCategory(v: string) {
    onCategory?.(v);
    onResetPage?.();
  }
  return (
    <div className="mb-4 flex flex-wrap items-center gap-3">
      <div className="relative">
        <Search
          size={14}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-muted"
        />
        <input
          value={search}
          onChange={(e) => handleSearch(e.target.value)}
          placeholder={placeholder}
          className="w-56 rounded-lg border border-line bg-transparent py-2 pl-8 pr-3 text-sm text-foreground outline-none transition-colors focus:border-purple"
        />
      </div>

      {categories && category !== undefined && onCategory && (
        <select
          value={category}
          onChange={(e) => handleCategory(e.target.value)}
          className="rounded-lg border border-line bg-[#17151c] px-3 py-2 text-sm text-foreground outline-none transition-colors focus:border-purple"
        >
          <option value="all">All Categories</option>
          {categories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      )}

      <div className="flex items-center gap-1 rounded-lg border border-line p-1">
        {(
          [
            { value: "all", label: "All" },
            {
              value: "published",
              label: statusLabels?.published ?? "Published",
            },
            { value: "draft", label: statusLabels?.draft ?? "Draft" },
          ] as const
        ).map((opt) => (
          <button
            key={opt.value}
            type="button"
            onClick={() => handleStatus(opt.value)}
            className={`rounded-md px-3 py-1 text-xs font-medium transition-colors ${
              status === opt.value
                ? "bg-purple/20 text-purple"
                : "text-muted hover:text-foreground"
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}