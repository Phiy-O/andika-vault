import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/src/lib/auth";
import {
  deleteCloudinaryAsset,
  publicIdFromUrl,
} from "@/src/lib/cloudinary";

export async function DELETE(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return new NextResponse("Unauthorized", { status: 401 });

  const { url } = await req.json();
  if (!url || typeof url !== "string") {
    return NextResponse.json({ error: "url required" }, { status: 400 });
  }

  const publicId = publicIdFromUrl(url);
  if (!publicId) {
    // Not a Cloudinary URL — nothing to delete server-side.
    return NextResponse.json({ ok: true });
  }

  const deleted = await deleteCloudinaryAsset(publicId);
  return NextResponse.json({ ok: deleted });
}