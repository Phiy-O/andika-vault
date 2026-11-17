import { BlogContent } from "../../components/blog/BlogContent";
import { PublicShell } from "../../components/layout/PublicShell";
import { blogPostService } from "@/src/services";

export const revalidate = 3600;

export const metadata = {
  title: "Blog | Andika",
  description: "Technical notes, engineering experiments, and practical ideas.",
};

export default async function BlogPage() {
  const posts = await blogPostService.getVisible();

  return (
    <PublicShell>
      <BlogContent posts={posts} />
    </PublicShell>
  );
}
