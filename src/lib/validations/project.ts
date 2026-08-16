import { z } from "zod";
import { safeUrl, safeUrlString } from "./url";

export const projectSchema = z.object({
  title: z.string().min(1, "Title is required"),
  slug: z.string().min(1, "Slug is required").regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Invalid slug format"),
  description: z.string().min(1, "Description is required"),
  body: z.string().min(1, "Body is required"),
  bodyFormat: z.enum(["html", "markdown"]).default("html"),
  thumbnail: safeUrl,
  screenshots: z.array(safeUrlString).default([]),
  techStack: z.array(z.string()).default([]),
  githubUrl: safeUrl,
  liveUrl: safeUrl,
  category: z.enum(["product", "tool"]),
  featured: z.boolean().default(false),
  isVisible: z.boolean().default(true),
  sortOrder: z.number().int().default(0),
});

export const projectUpdateSchema = projectSchema.partial();
