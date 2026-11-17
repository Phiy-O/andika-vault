import type { BlogPostListItem } from "@/src/types";

export type ArticleStatus = "all" | "published" | "draft" | "long-reads";

export type ArticleSort = "updated" | "title" | "manual";

export const LONG_READ_MINUTES = 5;

export function articleMinutes(readTime: string) {
  const match = readTime.match(/\d+/);
  return match ? Number(match[0]) : 0;
}

export function isLongRead(
  article: Pick<BlogPostListItem, "readTime">
) {
  return articleMinutes(article.readTime) >= LONG_READ_MINUTES;
}

export function articleStatus(
  article: Pick<BlogPostListItem, "isVisible">
) {
  return article.isVisible ? "published" : "draft";
}

export function articleMatchesStatus(
  article: BlogPostListItem,
  status: ArticleStatus
) {
  if (status === "all") return true;
  if (status === "published") return article.isVisible;
  if (status === "draft") return !article.isVisible;
  return isLongRead(article);
}

export function matchesArticleSearch(
  article: BlogPostListItem,
  search: string
) {
  const query = search.trim().toLowerCase();
  if (!query) return true;
  return [
    article.title,
    article.slug,
    article.excerpt,
    article.category,
    article.readTime,
    ...article.tags,
  ].some((value) => value.toLowerCase().includes(query));
}

export function filterAndSortArticles({
  articles,
  search,
  status,
  group,
  sort,
}: {
  articles: BlogPostListItem[];
  search: string;
  status: ArticleStatus;
  group: string;
  sort: ArticleSort;
}) {
  const filtered = articles.filter((article) => {
    if (!articleMatchesStatus(article, status)) return false;
    if (group !== "all" && article.category !== group) return false;
    return matchesArticleSearch(article, search);
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

export function articleBodyLabel(
  article: Pick<BlogPostListItem, "bodyFormat">
) {
  return article.bodyFormat === "markdown" ? "Markdown Article" : "HTML Article";
}
