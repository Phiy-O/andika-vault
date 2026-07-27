"use server";

import { blogPostService } from "@/src/services";
import { blogPostSchema, blogPostUpdateSchema } from "@/src/lib/validations";
import type { BlogPostCreateInput, BlogPostUpdateInput } from "@/src/types";
import type { BlogPost } from "@prisma/client";

type ActionResult<T> = { data?: T; error?: string };

export async function getAllBlogPosts(): Promise<ActionResult<BlogPost[]>> {
  try {
    const posts = await blogPostService.getAll();
    return { data: posts as any };
  } catch (e: any) {
    return { error: e.message ?? "Failed to fetch posts" };
  }
}

export async function getBlogPosts(): Promise<ActionResult<BlogPost[]>> {
  try {
    const posts = await blogPostService.getVisible();
    return { data: posts as any };
  } catch (e: any) {
    return { error: e.message ?? "Failed to fetch posts" };
  }
}

export async function getBlogPost(
  slug: string
): Promise<ActionResult<BlogPost | null>> {
  try {
    const post = await blogPostService.getBySlug(slug);
    return { data: post as any ?? null };
  } catch (e: any) {
    return { error: e.message ?? "Failed to fetch post" };
  }
}

export async function createBlogPost(
  input: BlogPostCreateInput
): Promise<ActionResult<BlogPost>> {
  try {
    const parsed = blogPostSchema.parse(input);
    const post = await blogPostService.create(parsed as any);
    return { data: post as any };
  } catch (e: any) {
    if (e.issues) return { error: e.issues.map((i: any) => i.message).join(", ") };
    return { error: e.message ?? "Failed to create post" };
  }
}

export async function updateBlogPost(
  id: string,
  input: BlogPostUpdateInput
): Promise<ActionResult<BlogPost>> {
  try {
    const parsed = blogPostUpdateSchema.parse(input);
    const post = await blogPostService.update(id, parsed as any);
    return { data: post as any };
  } catch (e: any) {
    if (e.issues) return { error: e.issues.map((i: any) => i.message).join(", ") };
    return { error: e.message ?? "Failed to update post" };
  }
}

export async function deleteBlogPost(
  id: string
): Promise<ActionResult<void>> {
  try {
    await blogPostService.delete(id);
    return {};
  } catch (e: any) {
    return { error: e.message ?? "Failed to delete post" };
  }
}
