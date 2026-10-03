// Pure URL helpers — no cloudinary SDK import, safe for client components.

// Rewrite a Cloudinary URL to add automatic format/quality optimization
// (f_auto, q_auto) and an optional max width. Non-Cloudinary URLs pass through.
export function optimizeCloudinaryUrl(url: string, width?: number): string {
  const match = url.match(/^(https?:\/\/res\.cloudinary\.com\/[^/]+\/image\/upload\/)(.+)$/);
  if (!match) return url;
  const [, base, rest] = match;
  const transforms = ["f_auto", "q_auto", ...(width ? [`w_${width}`] : [])];
  return `${base}${transforms.join(",")}/${rest}`;
}