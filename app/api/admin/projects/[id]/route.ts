import { NextResponse } from "next/server";
import { readJsonObject } from "@/src/lib/api-request";
import { requireAdmin } from "@/src/lib/auth";
import { projectService } from "@/src/services";
import { updateProject } from "@/src/actions/project";
import { cleanupCloudinaryImages } from "@/src/lib/cloudinary-cleanup";
import { revalidatePublicContent } from "@/src/lib/revalidate-public";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await requireAdmin())) return new NextResponse("Unauthorized", { status: 401 });

  const { id } = await params;
  const body = await readJsonObject(req);
  if (!body) return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  const old = await projectService.getById(id);
  const result = await updateProject(id, body);
  if (result.error) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }
  // After a successful save, delete Cloudinary assets that are no longer
  // referenced anywhere. Only reconcile media fields that were actually
  // submitted so partial updates (e.g. visibility toggles) never treat an
  // omitted thumbnail or screenshot list as a removal.
  const thumbnailProvided =
    typeof body === "object" && body !== null && "thumbnail" in body;
  const screenshotsProvided =
    typeof body === "object" && body !== null && Array.isArray(body.screenshots);

  const oldUrls = [
    ...(thumbnailProvided && old?.thumbnail ? [old.thumbnail] : []),
    ...(screenshotsProvided ? (old?.screenshots ?? []) : []),
  ];
  const newUrls = [
    ...(thumbnailProvided && body.thumbnail ? [body.thumbnail] : []),
    ...(screenshotsProvided ? (body.screenshots as string[]) : []),
  ];
  const removed = oldUrls.filter((u) => !newUrls.includes(u));
  if (removed.length) await cleanupCloudinaryImages(removed);
  return NextResponse.json(result.data);
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await requireAdmin())) return new NextResponse("Unauthorized", { status: 401 });

  const { id } = await params;
  try {
    const old = await projectService.getById(id);
    await projectService.delete(id);
    revalidatePublicContent({ project: old?.slug ? [old.slug] : [] });
    const oldUrls = [
      ...(old?.thumbnail ? [old.thumbnail] : []),
      ...(old?.screenshots ?? []),
    ];
    if (oldUrls.length) await cleanupCloudinaryImages(oldUrls);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { error: "Failed to delete project" },
      { status: 500 }
    );
  }
}
