import { blogPostService } from "@/src/services";
import { BlogForm } from "@/components/admin/BlogForm";
import { notFound } from "next/navigation";

export default async function EditBlogPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const post = await blogPostService.getById(id);
  if (!post) notFound();

  return (
    <section>
      <div className="mb-8">
        <h1 className="text-3xl font-medium tracking-[-.06em] text-foreground">
          Edit Post
        </h1>
        <p className="mt-1 text-sm text-muted">
          Update your blog post.
        </p>
      </div>
      <div className="max-w-3xl">
        <BlogForm post={post} />
      </div>
    </section>
  );
}
