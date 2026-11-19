import { sanitizeContent } from "./sanitize";

export type TocHeading = {
  id: string;
  label: string;
};

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
