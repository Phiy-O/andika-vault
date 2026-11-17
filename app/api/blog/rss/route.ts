import { NextResponse } from "next/server";
import { blogPostService, siteSettingService } from "@/src/services";

export const revalidate = 3600;

const FALLBACK_SITE_URL = "https://andika.dev";

const XML_ENTITIES: Record<string, string> = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&apos;",
};

function escapeXml(value: string) {
  return value.replace(/[&<>"']/g, (char) => XML_ENTITIES[char] ?? char);
}

export async function GET() {
  const [posts, settings] = await Promise.all([
    blogPostService.getVisible(),
    siteSettingService.get().catch(() => null),
  ]);

  const siteUrl = (process.env.NEXTAUTH_URL || FALLBACK_SITE_URL).replace(
    /\/+$/,
    ""
  );
  const channelTitle = settings?.siteTitle?.trim() || "Andika | Blog";
  const channelDescription =
    settings?.metaDescription?.trim() ||
    "Technical notes, engineering experiments, and practical ideas.";
  const feedUrl = `${siteUrl}/api/blog/rss`;
  const lastBuildDate = new Date().toUTCString();

  const items = [...posts]
    .sort(
      (a, b) =>
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    )
    .map((post) => {
      const link = `${siteUrl}/blog/${encodeURIComponent(post.slug)}`;
      const pubDate = new Date(post.publishedAt).toUTCString();

      return [
        "    <item>",
        `      <title>${escapeXml(post.title)}</title>`,
        `      <link>${escapeXml(link)}</link>`,
        `      <guid isPermaLink="true">${escapeXml(link)}</guid>`,
        `      <pubDate>${pubDate}</pubDate>`,
        `      <category>${escapeXml(post.category)}</category>`,
        `      <description>${escapeXml(post.excerpt)}</description>`,
        "    </item>",
      ].join("\n");
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(channelTitle)}</title>
    <link>${escapeXml(`${siteUrl}/blog`)}</link>
    <description>${escapeXml(channelDescription)}</description>
    <language>en</language>
    <lastBuildDate>${lastBuildDate}</lastBuildDate>
    <atom:link href="${escapeXml(feedUrl)}" rel="self" type="application/rss+xml" />
${items}
  </channel>
</rss>`;

  return new NextResponse(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control":
        "public, max-age=0, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
