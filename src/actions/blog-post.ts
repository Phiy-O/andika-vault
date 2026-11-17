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
import { actionError } from "./action-error";

type ActionResult<T> = { data?: T; error?: string };

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
  try {
    const post = await blogPostService.getBySlug(slug);
    return { data: post ?? null };
  } catch (e) {
    return { error: actionError(e, "Failed to fetch post") };
  }
}

export async function createBlogPost(
  input: BlogPostCreateInput
): Promise<ActionResult<BlogPost>> {
  if (!(await requireAdmin())) return { error: "Unauthorized" };
  try {
    const parsed = blogPostSchema.parse(input);
    const post = await blogPostService.create(parsed);
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
    const parsed = blogPostUpdateSchema.parse(input);
    const post = await blogPostService.update(id, parsed);
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
    await blogPostService.delete(id);
    return {};
  } catch (e) {
    return { error: actionError(e, "Failed to delete post") };
  }
}
