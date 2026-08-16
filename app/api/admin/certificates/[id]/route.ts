import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/src/lib/auth";
import { certificateService } from "@/src/services";
import { updateCertificate } from "@/src/actions/certificate";
import { cleanupCloudinaryImages } from "@/src/lib/cloudinary-cleanup";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session) return new NextResponse("Unauthorized", { status: 401 });

  const { id } = await params;
  const body = await req.json();
  const old = await certificateService.getById(id);
  const result = await updateCertificate(id, body);
  if (result.error) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }
  // After a successful save, delete Cloudinary assets that are no longer
  // referenced anywhere (old image replaced/removed).
  if (old?.image && old.image !== body.image) {
    await cleanupCloudinaryImages([old.image]);
  }
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
    const old = await certificateService.getById(id);
    await certificateService.delete(id);
    if (old?.image) await cleanupCloudinaryImages([old.image]);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { error: "Failed to delete certificate" },
      { status: 500 }
    );
  }
}
