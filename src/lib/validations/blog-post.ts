import { z } from "zod";
import { safeUrl } from "./url";

const bodyFormat = z.enum(["html", "markdown"]);
const tags = z.array(z.string());
const isVisible = z.boolean();
const sortOrder = z.number().int();

// Defaults belong to creation only. A partial update must never inject them,
// otherwise toggling isVisible silently erases tags/sortOrder/bodyFormat.
const fields = {
  title: z.string().min(1, "Title is required"),
  slug: z.string().min(1, "Slug is required").regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Invalid slug format"),
  excerpt: z.string().min(1, "Excerpt is required"),
  body: z.string().min(1, "Body is required"),
  bodyFormat,
  category: z.string().min(1, "Category is required"),
  tags,
  readTime: z.string().min(1, "Read time is required"),
  publishedAt: z.string().datetime().or(z.date()),
  thumbnail: safeUrl,
  isVisible,
  sortOrder,
};

export const blogPostSchema = z.object(fields).extend({
  bodyFormat: bodyFormat.default("html"),
  tags: tags.default([]),
  isVisible: isVisible.default(true),
  sortOrder: sortOrder.default(0),
});

export const blogPostUpdateSchema = z.object(fields).partial();
