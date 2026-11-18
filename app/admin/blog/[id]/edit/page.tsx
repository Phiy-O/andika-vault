import { notFound } from "next/navigation";
import { blogPostService } from "@/src/services";
import { BlogForm } from "@/components/admin/BlogForm";

export default async function EditBlogPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const post = await blogPostService.getById(id);
  if (!post) notFound();

  return <BlogForm post={post} />;
}