import { NextResponse } from "next/server";
import { requireAdmin } from "@/src/lib/auth";
import { certificateService } from "@/src/services";
import { updateCertificate } from "@/src/actions/certificate";
import { cleanupCloudinaryImages } from "@/src/lib/cloudinary-cleanup";
import { revalidatePublicContent } from "@/src/lib/revalidate-public";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await requireAdmin())) return new NextResponse("Unauthorized", { status: 401 });

  const { id } = await params;
  const body = await req.json();
  const old = await certificateService.getById(id);
  const result = await updateCertificate(id, body);
  if (result.error) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }
  // After a successful save, delete Cloudinary assets that are no longer
  // referenced anywhere. Only reconcile when the image was part of the
  // submitted payload so partial updates (e.g. visibility toggles) never
  // treat an omitted field as a removal.
  const imageProvided =
    typeof body === "object" && body !== null && "image" in body;
  if (imageProvided && old?.image && old.image !== body.image) {
    await cleanupCloudinaryImages([old.image]);
  }
  return NextResponse.json(result.data);
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await requireAdmin())) return new NextResponse("Unauthorized", { status: 401 });

  const { id } = await params;
  try {
    const old = await certificateService.getById(id);
    await certificateService.delete(id);
    revalidatePublicContent();
    if (old?.image) await cleanupCloudinaryImages([old.image]);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { error: "Failed to delete certificate" },
      { status: 500 }
    );
  }
}
