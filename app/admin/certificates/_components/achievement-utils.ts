import type { CertificateListItem } from "@/src/types";
import { isHttpUrl } from "@/components/admin/workspace/utils";

export type AchievementStatus =
  | "all"
  | "published"
  | "draft"
  | "credentials";

export type AchievementSort = "updated" | "title" | "issued" | "manual";

export function hasCredential(
  achievement: Pick<CertificateListItem, "credentialUrl">
) {
  return isHttpUrl(achievement.credentialUrl);
}

export function achievementMatchesStatus(
  achievement: CertificateListItem,
  status: AchievementStatus
) {
  if (status === "all") return true;
  if (status === "published") return achievement.isVisible;
  if (status === "draft") return !achievement.isVisible;
  return hasCredential(achievement);
}

export function matchesAchievementSearch(
  achievement: CertificateListItem,
  search: string
) {
  const query = search.trim().toLowerCase();
  if (!query) return true;
  return [
    achievement.title,
    achievement.issuer,
    achievement.description,
    achievement.credentialUrl,
  ].some((value) => (value ?? "").toLowerCase().includes(query));
}

export function filterAndSortAchievements({
  achievements,
  search,
  status,
  group,
  sort,
}: {
  achievements: CertificateListItem[];
  search: string;
  status: AchievementStatus;
  group: string;
  sort: AchievementSort;
}) {
  const filtered = achievements.filter((achievement) => {
    if (!achievementMatchesStatus(achievement, status)) return false;
    if (group !== "all" && achievement.issuer !== group) return false;
    return matchesAchievementSearch(achievement, search);
  });

  return filtered.sort((left, right) => {
    if (sort === "title") return left.title.localeCompare(right.title);
    if (sort === "issued") {
      return (
        new Date(right.issueDate).getTime() -
        new Date(left.issueDate).getTime()
      );
    }
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
