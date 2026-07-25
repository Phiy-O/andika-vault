import { z } from "zod";

export const certificateSchema = z.object({
  title: z.string().min(1, "Title is required"),
  issuer: z.string().min(1, "Issuer is required"),
  issueDate: z.string().datetime().or(z.date()),
  credentialUrl: z.string().url().nullable().optional().or(z.literal("")),
  image: z.string().nullable().optional(),
  description: z.string().min(1, "Description is required"),
  isVisible: z.boolean().default(true),
  sortOrder: z.number().int().default(0),
});

export const certificateUpdateSchema = certificateSchema.partial();
