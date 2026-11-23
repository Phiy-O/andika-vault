import { z } from "zod";
import { safeUrlString } from "./url";

export const skillCategorySchema = z.enum(["frontend", "backend", "tools"]);

const sortOrder = z.number().int();
const isVisible = z.boolean();

const fields = {
  name: z.string().min(1, "Name is required"),
  iconSrc: safeUrlString,
  category: skillCategorySchema,
  sortOrder,
  isVisible,
};

export const skillSchema = z.object(fields).extend({
  sortOrder: sortOrder.default(0),
  isVisible: isVisible.default(true),
});

export const skillUpdateSchema = z.object(fields).partial();
