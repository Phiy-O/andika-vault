import { prisma } from "@/lib/prisma";
import {
  deleteCloudinaryAsset,
  default as cloudinary,
  publicIdFromUrl,
} from "./cloudinary";

// Delete old Cloudinary uploads that are no longer referenced by ANY entity.
export async function cleanupOrphanCloudinaryImages(minAgeHours = 24) {
  const [posts, projects, certificates] = await Promise.all([
    prisma.blogPost.findMany({ select: { thumbnail: true, body: true } }),
    prisma.project.findMany({
      select: { thumbnail: true, screenshots: true, body: true },
    }),
    prisma.certificate.findMany({ select: { image: true, description: true } }),
  ]);

  const referenced = new Set<string>();
  const addUrl = (url: string | null) => {
    const publicId = url && publicIdFromUrl(url);
    if (publicId) referenced.add(publicId);
  };
  const bodies: string[] = [];
  for (const post of posts) {
    addUrl(post.thumbnail);
    bodies.push(post.body);
  }
  for (const project of projects) {
    addUrl(project.thumbnail);
    project.screenshots.forEach(addUrl);
    bodies.push(project.body);
  }
  for (const certificate of certificates) {
    addUrl(certificate.image);
    bodies.push(certificate.description);
  }

  const resources = await cloudinary.api.resources({
    type: "upload",
    resource_type: "image",
    prefix: "andika-vault/",
    max_results: 500,
  });
  const cutoff = Date.now() - minAgeHours * 60 * 60 * 1000;
  let deleted = 0;

  for (const resource of resources.resources) {
    const publicId = resource.public_id as string;
    const createdAt = Date.parse(resource.created_at as string);
    if (referenced.has(publicId) || bodies.some((body) => body.includes(publicId))) continue;
    if (Number.isFinite(createdAt) && createdAt > cutoff) continue;
    if (await deleteCloudinaryAsset(publicId)) deleted++;
  }

  return { scanned: resources.resources.length, deleted };
}

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