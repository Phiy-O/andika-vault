import { notFound } from "next/navigation";
import { blogPostService } from "@/src/services";
import { getSiteSettings } from "@/src/actions/site-setting";
import { BlogForm } from "@/components/admin/BlogForm";

export default async function EditBlogPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [post, { data: settings }] = await Promise.all([
    blogPostService.getById(id),
    getSiteSettings(),
  ]);
  if (!post) notFound();

  return (
    <BlogForm
      post={post}
      previewAuthor={{
        name: settings?.aboutName?.trim() || "Andika",
        role: settings?.aboutRole?.trim() || "Software Engineer",
      }}
    />
  );
}
