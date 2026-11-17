import type { ProjectListItem } from "@/src/types";

export type ProjectStatusFilter =
  | "all"
  | "published"
  | "draft"
  | "featured";

export type ProjectSort = "updated" | "title" | "manual";

export function getProjectStatus(project: Pick<ProjectListItem, "isVisible">) {
  return project.isVisible ? "published" : "draft";
}

export function statusLabel(project: Pick<ProjectListItem, "isVisible">) {
  return project.isVisible ? "Published" : "Draft";
}

export function formatCategory(category: string) {
  return category
    .replace(/[-_]+/g, " ")
    .replace(/\b\w/g, (character) => character.toUpperCase());
}

export function formatCount(value: number) {
  return String(value).padStart(2, "0");
}

export function formatDate(value: string | Date) {
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  const day = String(date.getUTCDate()).padStart(2, "0");
  return `${year}.${month}.${day}`;
}

function formatTime(date: Date) {
  const hours = String(date.getUTCHours()).padStart(2, "0");
  const minutes = String(date.getUTCMinutes()).padStart(2, "0");
  return `${hours}:${minutes}`;
}

export function formatRelativeTime(value: string | Date | null | undefined) {
  if (!value) return "Never";
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return "Unknown";

  const now = new Date();
  const dayMs = 86_400_000;
  const startNow = Date.UTC(
    now.getUTCFullYear(),
    now.getUTCMonth(),
    now.getUTCDate()
  );
  const startThen = Date.UTC(
    date.getUTCFullYear(),
    date.getUTCMonth(),
    date.getUTCDate()
  );
  const days = Math.round((startNow - startThen) / dayMs);

  if (days <= 0) return `Today ${formatTime(date)}`;
  if (days === 1) return `Yesterday ${formatTime(date)}`;
  if (days < 7) return `${days} days ago`;
  if (days < 30) {
    const weeks = Math.max(1, Math.floor(days / 7));
    return `${weeks} ${weeks === 1 ? "week" : "weeks"} ago`;
  }
  if (days < 365) {
    const months = Math.max(1, Math.floor(days / 30));
    return `${months} ${months === 1 ? "month" : "months"} ago`;
  }
  const years = Math.max(1, Math.floor(days / 365));
  return `${years} ${years === 1 ? "year" : "years"} ago`;
}

export function latestUpdatedAt(projects: ProjectListItem[]) {
  return projects.reduce<Date | null>((latest, project) => {
    const date = new Date(project.updatedAt);
    if (Number.isNaN(date.getTime())) return latest;
    return !latest || date > latest ? date : latest;
  }, null);
}

export function mediaCount(project: ProjectListItem) {
  return (project.thumbnail ? 1 : 0) + project.screenshots.length;
}

export function articleLabel(project: Pick<ProjectListItem, "bodyFormat">) {
  return project.bodyFormat === "markdown" ? "Markdown Article" : "HTML Article";
}

export function pluralize(
  count: number,
  singular: string,
  plural = `${singular}s`
) {
  return `${count} ${count === 1 ? singular : plural}`;
}

export function projectMatchesStatus(
  project: ProjectListItem,
  status: ProjectStatusFilter
) {
  if (status === "all") return true;
  if (status === "published") return project.isVisible;
  if (status === "draft") return !project.isVisible;
  return project.featured;
}

export function matchesProjectSearch(project: ProjectListItem, search: string) {
  const query = search.trim().toLowerCase();
  if (!query) return true;
  return [
    project.title,
    project.slug,
    project.description,
    project.category,
    ...project.techStack,
  ].some((value) => value.toLowerCase().includes(query));
}

export function filterAndSortProjects({
  projects,
  search,
  status,
  category,
  sort,
}: {
  projects: ProjectListItem[];
  search: string;
  status: ProjectStatusFilter;
  category: string;
  sort: ProjectSort;
}) {
  const filtered = projects.filter((project) => {
    if (!projectMatchesStatus(project, status)) return false;
    if (category !== "all" && project.category !== category) return false;
    return matchesProjectSearch(project, search);
  });

  return filtered.sort((left, right) => {
    if (sort === "title") return left.title.localeCompare(right.title);
    if (sort === "manual") {
      if (left.sortOrder !== right.sortOrder) {
        return left.sortOrder - right.sortOrder;
      }
      return left.title.localeCompare(right.title);
    }
    return (
      new Date(right.updatedAt).getTime() - new Date(left.updatedAt).getTime()
    );
  });
}

export function shortProjectId(id: string) {
  return id.slice(-4).toUpperCase();
}

export async function copyText(value: string) {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(value);
    return;
  }

  const textarea = document.createElement("textarea");
  textarea.value = value;
  textarea.setAttribute("readonly", "");
  textarea.style.position = "fixed";
  textarea.style.opacity = "0";
  document.body.appendChild(textarea);
  textarea.select();
  const copied = document.execCommand("copy");
  textarea.remove();
  if (!copied) throw new Error("Clipboard access is unavailable.");
}

export async function responseError(
  response: Response,
  fallback = "Something went wrong."
) {
  try {
    const body = (await response.json()) as { error?: unknown };
    if (typeof body.error === "string" && body.error.trim()) return body.error;
  } catch {
    // The response may be empty or plain text.
  }
  return fallback;
}
