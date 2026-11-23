"use server";

import { blogPostService } from "@/src/services";
import { blogPostSchema, blogPostUpdateSchema } from "@/src/lib/validations";
import type {
  BlogPostCreateInput,
  BlogPostListItem,
  BlogPostUpdateInput,
} from "@/src/types";
import type { BlogPost } from "@prisma/client";
import { requireAdmin } from "@/src/lib/auth";
import { buildArticleContent, type TocHeading } from "@/src/lib/article-content";
import { z } from "zod";
import { actionError } from "./action-error";
import { idSchema } from "@/src/lib/validations/id";
import { revalidatePublicContent } from "@/src/lib/revalidate-public";

type ActionResult<T> = { data?: T; error?: string };

const previewBodySchema = z.object({
  body: z.string().max(1_000_000, "Body is too large to preview"),
});

export async function getAllBlogPosts(): Promise<
  ActionResult<BlogPostListItem[]>
> {
  if (!(await requireAdmin())) return { error: "Unauthorized" };
  try {
    const posts = await blogPostService.getAll();
    return { data: posts };
  } catch (e) {
    return { error: actionError(e, "Failed to fetch posts") };
  }
}

export async function getBlogPosts(): Promise<
  ActionResult<BlogPostListItem[]>
> {
  try {
    const posts = await blogPostService.getVisible();
    return { data: posts };
  } catch (e) {
    return { error: actionError(e, "Failed to fetch posts") };
  }
}

export async function getBlogPost(
  slug: string
): Promise<ActionResult<BlogPost | null>> {
  if (!(await requireAdmin())) return { error: "Unauthorized" };
  try {
    const post = await blogPostService.getBySlug(slug);
    return { data: post ?? null };
  } catch (e) {
    return { error: actionError(e, "Failed to fetch post") };
  }
}

export async function previewBlogArticle(input: {
  body: string;
}): Promise<ActionResult<{ html: string; headings: TocHeading[] }>> {
  if (!(await requireAdmin())) return { error: "Unauthorized" };
  try {
    const parsed = previewBodySchema.parse(input);
    return { data: buildArticleContent(parsed.body) };
  } catch (e) {
    return { error: actionError(e, "Failed to render preview") };
  }
}

export async function createBlogPost(
  input: BlogPostCreateInput
): Promise<ActionResult<BlogPost>> {
  if (!(await requireAdmin())) return { error: "Unauthorized" };
  try {
    const parsed = blogPostSchema.parse(input);
    const post = await blogPostService.create(parsed);
    revalidatePublicContent({ blog: [post.slug] });
    return { data: post };
  } catch (e) {
    return { error: actionError(e, "Failed to create post") };
  }
}

export async function updateBlogPost(
  id: string,
  input: BlogPostUpdateInput
): Promise<ActionResult<BlogPost>> {
  if (!(await requireAdmin())) return { error: "Unauthorized" };
  try {
    idSchema.parse(id);
    const parsed = blogPostUpdateSchema.parse(input);
    const existing = await blogPostService.getById(id);
    const post = await blogPostService.update(id, parsed);
    revalidatePublicContent({
      blog: [existing?.slug, post.slug].filter(
        (slug): slug is string => Boolean(slug)
      ),
    });
    return { data: post };
  } catch (e) {
    return { error: actionError(e, "Failed to update post") };
  }
}

export async function deleteBlogPost(
  id: string
): Promise<ActionResult<void>> {
  if (!(await requireAdmin())) return { error: "Unauthorized" };
  try {
    idSchema.parse(id);
    const existing = await blogPostService.getById(id);
    await blogPostService.delete(id);
    revalidatePublicContent({ blog: existing?.slug ? [existing.slug] : [] });
    return {};
  } catch (e) {
    return { error: actionError(e, "Failed to delete post") };
  }
}
