import { getAllBlogPosts } from "@/src/actions/blog-post";
import dynamic from "next/dynamic";

const BlogListClient = dynamic(
  () => import("./BlogListClient").then((m) => m.BlogListClient)
);

export default async function AdminBlogPage() {
  const { data: posts, error } = await getAllBlogPosts();

  return (
    <section>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-medium tracking-[-.06em] text-foreground">
            Blog
          </h1>
          <p className="mt-1 text-sm text-muted">
            Manage your blog posts.
          </p>
        </div>
        <a
          href="/admin/blog/new"
          className="rounded-lg bg-purple px-4 py-2 text-sm font-medium text-[#17151c] transition-opacity hover:opacity-90"
        >
          + New Post
        </a>
      </div>

      {error && (
        <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
          {error}
        </div>
      )}

      <BlogListClient posts={posts ?? []} />
    </section>
  );
}
