import { z } from "zod";

// Allow: empty, "#", local paths (/...), http(s) URLs. Reject javascript:, data:, etc.
export const safeUrlString = z
  .string()
  .max(2048, "URL terlalu panjang (maksimal 2048 karakter)")
  .refine(
    (v) =>
      v === "" ||
      v === "#" ||
      v.startsWith("/") ||
      /^https?:\/\//i.test(v),
    "URL tidak valid"
  );

export const safeUrl = safeUrlString.nullable().optional();