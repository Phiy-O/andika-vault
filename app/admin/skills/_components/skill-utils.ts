import type { SkillListItem } from "@/src/types";
import type { WorkspaceSortOption, WorkspaceStatusTab, WorkspaceShortcut } from "@/components/admin/workspace/types";

export type SkillSort = "name" | "category" | "sortOrder" | "updated";
export type SkillStatus = "all" | "published" | "draft";

export function filterAndSortSkills({
  skills,
  search,
  status,
  category,
  sort,
}: {
  skills: SkillListItem[];
  search: string;
  status: SkillStatus;
  category: string;
  sort: SkillSort;
}) {
  let filtered = skills.filter((s) => {
    if (status === "published" && !s.isVisible) return false;
    if (status === "draft" && s.isVisible) return false;
    if (category !== "all" && s.category !== category) return false;
    const q = search.trim().toLowerCase();
    if (!q) return true;
    return s.name.toLowerCase().includes(q);
  });

  switch (sort) {
    case "name":
      filtered = [...filtered].sort((a, b) => a.name.localeCompare(b.name));
      break;
    case "category":
      filtered = [...filtered].sort((a, b) => a.category.localeCompare(b.category) || a.name.localeCompare(b.name));
      break;
    case "sortOrder":
      filtered = [...filtered].sort((a, b) => a.sortOrder - b.sortOrder || a.name.localeCompare(b.name));
      break;
    case "updated":
    default:
      filtered = [...filtered].sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
      break;
  }

  return filtered;
}

export function formatCategory(category: string): string {
  return category.charAt(0).toUpperCase() + category.slice(1);
}

export function formatCount(count: number): string {
  if (count >= 1_000_000) return `${(count / 1_000_000).toFixed(1)}M`;
  if (count >= 1_000) return `${(count / 1_000).toFixed(1)}K`;
  return String(count);
}

export const sortOptions: WorkspaceSortOption<SkillSort>[] = [
  { value: "updated", label: "Sort: last updated" },
  { value: "name", label: "Sort: name A–Z" },
  { value: "category", label: "Sort: category" },
  { value: "sortOrder", label: "Sort: manual order" },
];

export const shortcuts: WorkspaceShortcut[] = [
  { label: "Search skills", keys: ["⌘", "K"] },
  { label: "Create new skill", keys: ["N"] },
  { label: "Toggle list / grid", keys: ["V"] },
  { label: "Bulk select page", keys: ["⌘", "A"] },
];

export function getSkillStatusTabs(skills: SkillListItem[]): WorkspaceStatusTab<SkillStatus>[] {
  const published = skills.filter((s) => s.isVisible).length;
  return [
    { value: "all", label: "All", count: skills.length },
    { value: "published", label: "Published", count: published },
    { value: "draft", label: "Drafts", count: skills.length - published },
  ];
}

export function getSkillCategoryOptions(skills: SkillListItem[]): { value: string; label: string }[] {
  const categories = Array.from(new Set(skills.map((s) => s.category))).sort();
  return [
    { value: "all", label: "All categories" },
    ...categories.map((c) => ({ value: c, label: formatCategory(c) })),
  ];
}