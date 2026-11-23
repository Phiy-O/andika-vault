import { z } from "zod";

/** Validate record IDs before they reach Prisma. */
export const idSchema = z
  .string()
  .min(1, "Invalid id")
  .max(64, "Invalid id")
  .regex(/^[a-zA-Z0-9_-]+$/, "Invalid id");
