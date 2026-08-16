import { z } from "zod";

// Allow: empty, "#", local paths (/...), http(s) URLs. Reject javascript:, data:, etc.
export const safeUrlString = z.string().refine(
  (v) =>
    v === "" ||
    v === "#" ||
    v.startsWith("/") ||
    /^https?:\/\//i.test(v),
  "URL tidak valid"
);

export const safeUrl = safeUrlString.nullable().optional();