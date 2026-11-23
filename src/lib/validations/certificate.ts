import { z } from "zod";
import { safeUrl } from "./url";

const isVisible = z.boolean();
const sortOrder = z.number().int();

const fields = {
  title: z.string().min(1, "Title is required"),
  issuer: z.string().min(1, "Issuer is required"),
  issueDate: z.string().datetime().or(z.date()),
  credentialUrl: safeUrl,
  image: safeUrl,
  description: z.string().min(1, "Description is required"),
  isVisible,
  sortOrder,
};

export const certificateSchema = z.object(fields).extend({
  isVisible: isVisible.default(true),
  sortOrder: sortOrder.default(0),
});

export const certificateUpdateSchema = z.object(fields).partial();
