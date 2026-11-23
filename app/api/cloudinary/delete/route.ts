import { NextResponse } from "next/server";
import { requireAdmin } from "@/src/lib/auth";
import { publicIdFromUrl } from "@/src/lib/cloudinary";
import { cleanupCloudinaryImages } from "@/src/lib/cloudinary-cleanup";

export async function DELETE(req: Request) {
  if (!(await requireAdmin())) return new NextResponse("Unauthorized", { status: 401 });

  const body: unknown = await req.json().catch(() => null);
  const url = body && typeof body === "object" && "url" in body
    ? (body as { url?: unknown }).url
    : null;
  if (typeof url !== "string" || !url) {
    return NextResponse.json({ error: "url required" }, { status: 400 });
  }
  if (!publicIdFromUrl(url)) {
    return NextResponse.json({ ok: true });
  }

  // Reuse the shared reference check so an in-use asset cannot be deleted.
  await cleanupCloudinaryImages([url]);
  return NextResponse.json({ ok: true });
}
