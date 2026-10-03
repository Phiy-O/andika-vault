import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/src/lib/auth";
import { projectService } from "@/src/services";
import { updateProject } from "@/src/actions/project";
import { cleanupCloudinaryImages } from "@/src/lib/cloudinary-cleanup";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session) return new NextResponse("Unauthorized", { status: 401 });

  const { id } = await params;
  const body = await req.json();
  const old = await projectService.getById(id);
  const result = await updateProject(id, body);
  if (result.error) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }
  // After a successful save, delete Cloudinary assets that are no longer
  // referenced anywhere (old thumbnail/screenshots replaced or removed).
  const oldUrls = [
    ...(old?.thumbnail ? [old.thumbnail] : []),
    ...(old?.screenshots ?? []),
  ];
  const newUrls = [
    ...(body.thumbnail ? [body.thumbnail] : []),
    ...(body.screenshots ?? []),
  ];
  const removed = oldUrls.filter((u) => !newUrls.includes(u));
  if (removed.length) await cleanupCloudinaryImages(removed);
  return NextResponse.json(result.data);
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session) return new NextResponse("Unauthorized", { status: 401 });

  const { id } = await params;
  try {
    const old = await projectService.getById(id);
    await projectService.delete(id);
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
