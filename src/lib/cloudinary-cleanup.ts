import { prisma } from "@/lib/prisma";
import { deleteCloudinaryAsset, publicIdFromUrl } from "./cloudinary";

// Delete Cloudinary assets that are no longer referenced by ANY entity.
// Call AFTER a successful save: URLs still in use (including inside body
// HTML) are kept, so shared assets are never removed.
export async function cleanupCloudinaryImages(urls: string[]) {
  const candidates = [...new Set(urls)].filter(
    (u) => typeof u === "string" && publicIdFromUrl(u)
  );
  if (!candidates.length) return;

  const [posts, projects, certificates] = await Promise.all([
    prisma.blogPost.findMany({ select: { thumbnail: true, body: true } }),
    prisma.project.findMany({
      select: { thumbnail: true, screenshots: true, body: true },
    }),
    prisma.certificate.findMany({ select: { image: true, description: true } }),
  ]);

  const inUse = new Set<string>();
  const bodies: string[] = [];
  for (const p of posts) {
    if (p.thumbnail) inUse.add(p.thumbnail);
    if (p.body) bodies.push(p.body);
  }
  for (const p of projects) {
    if (p.thumbnail) inUse.add(p.thumbnail);
    for (const s of p.screenshots) inUse.add(s);
    if (p.body) bodies.push(p.body);
  }
  for (const c of certificates) {
    if (c.image) inUse.add(c.image);
    if (c.description) bodies.push(c.description);
  }

  for (const url of candidates) {
    if (inUse.has(url)) continue;
    if (bodies.some((b) => b.includes(url))) continue;
    const publicId = publicIdFromUrl(url);
    if (publicId) await deleteCloudinaryAsset(publicId);
  }
}