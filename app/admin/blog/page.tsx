import { getAllBlogPosts } from "@/src/actions/blog-post";
import { ArticlesWorkspace } from "./_components/ArticlesWorkspace";

export default async function AdminBlogPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string | string[] }>;
}) {
  const params = await searchParams;
  const rawQuery = params.q;
  const initialSearch = Array.isArray(rawQuery)
    ? (rawQuery[0] ?? "")
    : (rawQuery ?? "");
  const { data: posts, error } = await getAllBlogPosts();

  return (
    <ArticlesWorkspace
      key={initialSearch || "articles"}
      posts={posts ?? []}
      initialSearch={initialSearch}
      loadError={error}
    />
  );
}
