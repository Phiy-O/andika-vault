import { NextResponse } from "next/server";
import { requireAdmin } from "@/src/lib/auth";
import {
  getUploadSignature,
  CLOUDINARY_FOLDER,
} from "@/src/lib/cloudinary";

export async function GET() {
  if (!(await requireAdmin())) return new NextResponse("Unauthorized", { status: 401 });

  const { timestamp, signature } = getUploadSignature();

  return NextResponse.json({
    cloudName: process.env.CLOUDINARY_CLOUD_NAME,
    apiKey: process.env.CLOUDINARY_API_KEY,
    folder: CLOUDINARY_FOLDER,
    resourceType: "image",
    timestamp,
    signature,
  });
}
