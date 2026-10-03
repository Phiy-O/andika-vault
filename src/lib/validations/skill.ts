import { z } from "zod";
import { safeUrlString } from "./url";

export const skillCategorySchema = z.enum(["frontend", "backend", "tools"]);

export const skillSchema = z.object({
  name: z.string().min(1, "Name is required"),
  iconSrc: safeUrlString,
  category: skillCategorySchema,
  sortOrder: z.number().int().default(0),
  isVisible: z.boolean().default(true),
});

export const skillUpdateSchema = skillSchema.partial();
