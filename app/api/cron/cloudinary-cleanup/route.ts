import { NextResponse } from "next/server";
import { cleanupOrphanCloudinaryImages } from "@/src/lib/cloudinary-cleanup";

export async function GET(req: Request) {
  const authorization = req.headers.get("authorization");
  if (authorization !== `Bearer ${process.env.CRON_SECRET}`) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const result = await cleanupOrphanCloudinaryImages(24);
  return NextResponse.json(result);
}
