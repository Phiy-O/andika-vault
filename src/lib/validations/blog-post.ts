import { z } from "zod";
import { safeUrl } from "./url";

export const blogPostSchema = z.object({
  title: z.string().min(1, "Title is required"),
  slug: z.string().min(1, "Slug is required").regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Invalid slug format"),
  excerpt: z.string().min(1, "Excerpt is required"),
  body: z.string().min(1, "Body is required"),
  bodyFormat: z.enum(["html", "markdown"]).default("html"),
  category: z.string().min(1, "Category is required"),
  tags: z.array(z.string()).default([]),
  readTime: z.string().min(1, "Read time is required"),
  publishedAt: z.string().datetime().or(z.date()),
  thumbnail: safeUrl,
  isVisible: z.boolean().default(true),
  sortOrder: z.number().int().default(0),
});

export const blogPostUpdateSchema = blogPostSchema.partial();
