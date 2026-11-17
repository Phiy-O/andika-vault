import { sanitizeContent } from "@/src/lib/sanitize";

export type TocHeading = {
  id: string;
  label: string;
};

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

const namedEntities: Record<string, string> = {
  amp: "&",
  lt: "<",
  gt: ">",
  quot: '"',
  apos: "'",
  nbsp: " ",
};

function decodeEntities(value: string) {
  return value.replace(/&(#x?[0-9a-f]+|[a-z]+);/gi, (match, entity: string) => {
    if (entity.startsWith("#x") || entity.startsWith("#X")) {
      const code = Number.parseInt(entity.slice(2), 16);
      return Number.isFinite(code) && code > 0 && code <= 0x10ffff
        ? String.fromCodePoint(code)
        : match;
    }

    if (entity.startsWith("#")) {
      const code = Number.parseInt(entity.slice(1), 10);
      return Number.isFinite(code) && code > 0 && code <= 0x10ffff
        ? String.fromCodePoint(code)
        : match;
    }

    return namedEntities[entity.toLowerCase()] ?? match;
  });
}

function textFromHtml(value: string) {
  return decodeEntities(value.replace(/<[^>]*>/g, " "))
    .replace(/\s+/g, " ")
    .trim();
}

function addHeadingIds(html: string) {
  const headings: TocHeading[] = [];
  const output = html.replace(
    /<h2(\s[^>]*)?>([\s\S]*?)<\/h2>/gi,
    (match, rawAttributes: string | undefined, inner: string) => {
      const index = headings.length + 1;
      const id = `article-section-${index}`;
      const label = textFromHtml(inner) || `Section ${index}`;
      const attributes = (rawAttributes ?? "").replace(
        /\sid\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+)/i,
        ""
      );

      headings.push({ id, label });
      return `<h2 id="${id}"${attributes}>${inner}</h2>`;
    }
  );

  return { html: output, headings };
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function formatInline(value: string) {
  return escapeHtml(value)
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
    .replace(/`([^`]+)`/g, "<code>$1</code>");
}

function plainTextToHtml(body: string) {
  const blocks = body.replace(/\r\n/g, "\n").split(/\n{2,}/);

  return blocks
    .map((block) => {
      const trimmed = block.trim();
      if (!trimmed) return "";

      const lines = block.split("\n").map((line) => line.trimEnd());

      if (trimmed.startsWith("```")) {
        const withoutFence = trimmed
          .replace(/^```[^\n]*\n?/, "")
          .replace(/\n?```$/, "");
        return `<pre><code>${escapeHtml(withoutFence)}</code></pre>`;
      }

      if (trimmed.startsWith("### ")) {
        return `<h3>${formatInline(trimmed.slice(4))}</h3>`;
      }

      if (trimmed.startsWith("## ")) {
        return `<h2>${formatInline(trimmed.slice(3))}</h2>`;
      }

      if (trimmed.startsWith("# ")) {
        return `<h2>${formatInline(trimmed.slice(2))}</h2>`;
      }

      if (
        lines.every(
          (line) => !line.trim() || line.trim().startsWith("> ")
        )
      ) {
        const quote = lines
          .map((line) => line.trim().replace(/^>\s?/, ""))
          .join(" ");
        return `<blockquote><p>${formatInline(quote)}</p></blockquote>`;
      }

      if (
        lines.every(
          (line) => !line.trim() || /^[-*]\s+/.test(line.trim())
        )
      ) {
        const items = lines
          .filter((line) => line.trim())
          .map(
            (line) =>
              `<li>${formatInline(line.trim().replace(/^[-*]\s+/, ""))}</li>`
          )
          .join("");
        return `<ul>${items}</ul>`;
      }

      if (
        lines.every(
          (line) => !line.trim() || /^\d+\.\s+/.test(line.trim())
        )
      ) {
        const items = lines
          .filter((line) => line.trim())
          .map(
            (line) =>
              `<li>${formatInline(line.trim().replace(/^\d+\.\s+/, ""))}</li>`
          )
          .join("");
        return `<ol>${items}</ol>`;
      }

      if (/^\*\*[^*]+\*\*$/.test(trimmed)) {
        return `<p><strong>${formatInline(trimmed.slice(2, -2))}</strong></p>`;
      }

      return `<p>${lines.map((line) => formatInline(line)).join("<br />")}</p>`;
    })
    .join("\n");
}

export function buildArticleContent(body: string) {
  const trimmed = body.trim();
  const raw = trimmed.startsWith("<")
    ? sanitizeContent(trimmed)
    : sanitizeContent(plainTextToHtml(trimmed));

  return addHeadingIds(raw);
}
