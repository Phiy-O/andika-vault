import { NextResponse } from "next/server";
import { requireAdmin } from "@/src/lib/auth";
import { blogPostService } from "@/src/services";
import { updateBlogPost } from "@/src/actions/blog-post";
import { cleanupCloudinaryImages } from "@/src/lib/cloudinary-cleanup";
import { revalidatePublicContent } from "@/src/lib/revalidate-public";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await requireAdmin())) return new NextResponse("Unauthorized", { status: 401 });

  const { id } = await params;
  const body = await req.json();
  const old = await blogPostService.getById(id);
  const result = await updateBlogPost(id, body);
  if (result.error) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }
  // After a successful save, delete Cloudinary assets that are no longer
  // referenced anywhere. Only reconcile when the thumbnail was part of the
  // submitted payload so partial updates (e.g. visibility toggles) never
  // treat an omitted field as a removal.
  const thumbnailProvided =
    typeof body === "object" && body !== null && "thumbnail" in body;
  if (
    thumbnailProvided &&
    old?.thumbnail &&
    old.thumbnail !== body.thumbnail
  ) {
    await cleanupCloudinaryImages([old.thumbnail]);
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
    const old = await blogPostService.getById(id);
    await blogPostService.delete(id);
    revalidatePublicContent({ blog: old?.slug ? [old.slug] : [] });
    if (old?.thumbnail) await cleanupCloudinaryImages([old.thumbnail]);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { error: "Failed to delete post" },
      { status: 500 }
    );
  }
}
