import { z } from "zod";
import { safeUrl } from "./url";

export const certificateSchema = z.object({
  title: z.string().min(1, "Title is required"),
  issuer: z.string().min(1, "Issuer is required"),
  issueDate: z.string().datetime().or(z.date()),
  credentialUrl: safeUrl,
  image: safeUrl,
  description: z.string().min(1, "Description is required"),
  isVisible: z.boolean().default(true),
  sortOrder: z.number().int().default(0),
});

export const certificateUpdateSchema = certificateSchema.partial();
