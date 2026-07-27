import { BlogForm } from "@/components/admin/BlogForm";

export default function NewBlogPage() {
  return (
    <section>
      <div className="mb-8">
        <h1 className="text-3xl font-medium tracking-[-.06em] text-foreground">
          New Post
        </h1>
        <p className="mt-1 text-sm text-muted">
          Write a new blog post.
        </p>
      </div>
      <div className="max-w-3xl">
        <BlogForm />
      </div>
    </section>
  );
}
