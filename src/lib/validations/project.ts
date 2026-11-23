import { z } from "zod";
import { safeUrl, safeUrlString } from "./url";

const bodyFormat = z.enum(["html", "markdown"]);
const screenshots = z.array(safeUrlString).max(10, "Maksimal 10 screenshot");
const techStack = z.array(z.string());
const featured = z.boolean();
const isVisible = z.boolean();
const sortOrder = z.number().int();

// Defaults belong to creation only — a partial PATCH must not reset these.
const fields = {
  title: z.string().min(1, "Title is required"),
  slug: z.string().min(1, "Slug is required").regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Invalid slug format"),
  description: z.string().min(1, "Description is required"),
  body: z.string().min(1, "Body is required"),
  bodyFormat,
  thumbnail: safeUrl,
  screenshots,
  techStack,
  githubUrl: safeUrl,
  liveUrl: safeUrl,
  category: z.enum(["product", "tool"]),
  featured,
  isVisible,
  sortOrder,
};

export const projectSchema = z.object(fields).extend({
  bodyFormat: bodyFormat.default("html"),
  screenshots: screenshots.default([]),
  techStack: techStack.default([]),
  featured: featured.default(false),
  isVisible: isVisible.default(true),
  sortOrder: sortOrder.default(0),
});

export const projectUpdateSchema = z.object(fields).partial();
