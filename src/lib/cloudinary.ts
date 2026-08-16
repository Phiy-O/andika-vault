import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const CLOUDINARY_FOLDER = "andika-vault";

// Signed-upload params: client uploads directly to Cloudinary using this
// signature, so the API secret never leaves the server.
// NOTE: Cloudinary EXCLUDES api_key, resource_type, cloud_name and file from
// signature verification — so they must not be part of the signed payload.
export function getUploadSignature() {
  const timestamp = Math.round(Date.now() / 1000);
  const params = {
    timestamp,
    folder: CLOUDINARY_FOLDER,
  };
  const signature = cloudinary.utils.api_sign_request(
    params,
    cloudinary.config().api_secret!
  );
  return { timestamp, signature };
}

// Delete an asset by its public_id. Returns true if deleted.
export async function deleteCloudinaryAsset(publicId: string) {
  try {
    const result = await cloudinary.uploader.destroy(publicId, {
      resource_type: "image",
    });
    return result.result === "ok";
  } catch {
    return false;
  }
}

// Extract public_id from a Cloudinary URL (https://res.cloudinary.com/.../image/upload/v123/andika-vault/abc.png)
// Cloudinary public_ids never include the file extension.
export function publicIdFromUrl(url: string): string | null {
  const match = url.match(/\/image\/upload\/[^/]+\/(.+)$/);
  if (!match) return null;
  return match[1].replace(/\.[a-z0-9]+$/i, "");
}

export default cloudinary;
