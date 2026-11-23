import { revalidatePath } from "next/cache";

/**
 * Public pages that are statically generated (ISR) or cached route handlers.
 * Admin mutations must call this so content changes are visible immediately
 * instead of waiting for the 1 hour `revalidate` window or a redeploy.
 */
const PUBLIC_CONTENT_PATHS = [
  "/",
  "/about",
  "/achievements",
  "/blog",
  "/contact",
  "/projects",
  "/api/blog/rss",
  "/sitemap.xml",
] as const;

type ContentSlugs = {
  blog?: string[];
  project?: string[];
};

export function revalidatePublicContent(slugs: ContentSlugs = {}): void {
  for (const path of PUBLIC_CONTENT_PATHS) {
    revalidatePath(path);
  }

  // Detail pages are force-dynamic, but their static params and cached RSC
  // payloads still need purging when a slug is created, renamed or deleted.
  for (const slug of slugs.blog ?? []) {
    revalidatePath(`/blog/${slug}`);
  }
  for (const slug of slugs.project ?? []) {
    revalidatePath(`/projects/${slug}`);
  }
}
