import { timingSafeEqual } from "node:crypto";
import { NextResponse } from "next/server";
import { cleanupOrphanCloudinaryImages } from "@/src/lib/cloudinary-cleanup";

export async function GET(req: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret) return new NextResponse("Unauthorized", { status: 401 });

  const expected = Buffer.from(`Bearer ${secret}`);
  const provided = Buffer.from(req.headers.get("authorization") ?? "");
  if (
    expected.length !== provided.length ||
    !timingSafeEqual(expected, provided)
  ) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const result = await cleanupOrphanCloudinaryImages(24);
  return NextResponse.json(result);
}
