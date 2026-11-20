"use client";

export const MAX_IMAGE_SIZE_MB = 5;
export const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/svg+xml",
] as const;

type AcceptedImageType = (typeof ACCEPTED_IMAGE_TYPES)[number];

export function isAcceptedImage(file: File): boolean {
  return ACCEPTED_IMAGE_TYPES.includes(file.type as AcceptedImageType);
}

/**
 * Client-side signed upload to Cloudinary. The signature comes from the
 * admin-guarded API route, so the API secret never reaches the browser.
 */
export async function uploadImageFile(file: File): Promise<string> {
  if (!isAcceptedImage(file)) {
    throw new Error("Unsupported image type");
  }
  if (file.size > MAX_IMAGE_SIZE_MB * 1024 * 1024) {
    throw new Error(`Image must be ${MAX_IMAGE_SIZE_MB}MB or smaller`);
  }

  const signatureResponse = await fetch("/api/cloudinary/signature");
  if (!signatureResponse.ok) {
    throw new Error("Sesi berakhir, login ulang");
  }
  const signature = await signatureResponse.json();

  const form = new FormData();
  form.append("file", file);
  form.append("api_key", signature.apiKey);
  form.append("timestamp", String(signature.timestamp));
  form.append("signature", signature.signature);
  form.append("folder", signature.folder);
  form.append("resource_type", signature.resourceType ?? "image");

  const uploadResponse = await fetch(
    `https://api.cloudinary.com/v1_1/${signature.cloudName}/image/upload`,
    { method: "POST", body: form }
  );
  if (!uploadResponse.ok) {
    throw new Error("Upload gagal, coba lagi");
  }

  const data = await uploadResponse.json();
  return data.secure_url as string;
}
