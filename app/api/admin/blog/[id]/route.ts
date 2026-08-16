import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/src/lib/auth";
import { blogPostService } from "@/src/services";
import { updateBlogPost } from "@/src/actions/blog-post";
import { cleanupCloudinaryImages } from "@/src/lib/cloudinary-cleanup";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session) return new NextResponse("Unauthorized", { status: 401 });

  const { id } = await params;
  const body = await req.json();
  const old = await blogPostService.getById(id);
  const result = await updateBlogPost(id, body);
  if (result.error) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }
  // After a successful save, delete Cloudinary assets that are no longer
  // referenced anywhere (old thumbnail replaced/removed).
  if (old?.thumbnail && old.thumbnail !== body.thumbnail) {
    await cleanupCloudinaryImages([old.thumbnail]);
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
    const old = await blogPostService.getById(id);
    await blogPostService.delete(id);
    if (old?.thumbnail) await cleanupCloudinaryImages([old.thumbnail]);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { error: "Failed to delete post" },
      { status: 500 }
    );
  }
}
