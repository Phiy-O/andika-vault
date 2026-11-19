export type CategoryTheme = {
  background: string;
  text: string;
  border: string;
  dot: string;
};

export const DEFAULT_BLOG_THUMBNAIL = "/images/thumbnails/blog-default.png";

export function getCategoryTheme(category: string): CategoryTheme {
  const value = category.toLowerCase();

  if (/(frontend|front-end|web|react|ui|next)/.test(value)) {
    return {
      background: "#6ffbbe",
      text: "#002113",
      border: "#006c49",
      dot: "#006c49",
    };
  }

  if (/(experiment|personal|thought|process|hardware|iot)/.test(value)) {
    return {
      background: "#ffdad6",
      text: "#630004",
      border: "#ba1a1a",
      dot: "#ba1a1a",
    };
  }

  if (/(backend|back-end|engineer|system|api|infra|distributed|perspective)/.test(value)) {
    return {
      background: "#d0e4ff",
      text: "#001d35",
      border: "#1b1b1b",
      dot: "#0062a1",
    };
  }

  return {
    background: "#faf6ee",
    text: "#1b1b1b",
    border: "#1b1b1b",
    dot: "#a9362e",
  };
}

const articleDateFormatter = new Intl.DateTimeFormat("en-CA", {
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  timeZone: "UTC",
});

export function formatArticleDate(value: Date | string) {
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return "";

  const parts = articleDateFormatter.formatToParts(date);
  const pick = (type: "year" | "month" | "day") =>
    parts.find((part) => part.type === type)?.value ?? "";

  return `${pick("year")}.${pick("month")}.${pick("day")}`;
}

export function formatReadTime(value: string) {
  const trimmed = value.trim();
  if (!trimmed) return "05 MIN READ";

  if (/^\d+$/.test(trimmed)) {
    return `${trimmed.padStart(2, "0")} MIN READ`;
  }

  const normalized = /(min|read)/i.test(trimmed) ? trimmed : `${trimmed} MIN READ`;
  const match = normalized.match(/^(\d+)(.*)$/);

  if (match) {
    return `${match[1].padStart(2, "0")}${match[2]}`.toUpperCase();
  }

  return normalized.toUpperCase();
}

export function formatTag(tag: string) {
  return tag.trim().replace(/\s+/g, "_").toUpperCase();
}

export function slugFileName(slug: string) {
  return slug.replace(/-/g, "_").toUpperCase();
}
