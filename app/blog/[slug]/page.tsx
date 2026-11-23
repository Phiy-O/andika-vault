import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { PublicShell } from "../../../components/layout/PublicShell";
import { ArticleHeader } from "@/components/blog/detail/ArticleHeader";
import { ArticleFigure } from "@/components/blog/detail/ArticleFigure";
import { ArticleSidebar } from "@/components/blog/detail/ArticleSidebar";
import { ArticleFooter } from "@/components/blog/detail/ArticleFooter";
import { RelatedDispatches } from "@/components/blog/detail/RelatedDispatches";
import {
  formatArticleDate,
  formatReadTime,
} from "@/components/blog/detail/article-content";
import {
  buildArticleContent,
  type TocHeading,
} from "@/src/lib/article-content";
import { blogPostService } from "@/src/services";
import { getSiteSettings } from "@/src/actions/site-setting";
import { requireAdmin } from "@/src/lib/auth";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const canPreview = await requireAdmin();
  const post = canPreview
    ? await blogPostService.getBySlug(slug)
    : await blogPostService.getVisibleBySlug(slug);
  if (!post) return { title: "Blog | Andika" };
  const siteUrl = process.env.NEXTAUTH_URL || "https://andika.dev";
  const image = post.thumbnail || `${siteUrl}/images/andika-profile.png`;
  return {
    title: `${post.title} | Andika`,
    description: post.excerpt,
    openGraph: {
      title: `${post.title} | Andika`,
      description: post.excerpt,
      type: "article",
      images: [{ url: image, alt: post.title }],
    },
    twitter: { card: "summary_large_image", images: [image] },
    alternates: {
      types: {
        "application/rss+xml": `${siteUrl}/api/blog/rss`,
      },
    },
  };
}

export async function generateStaticParams() {
  const posts = await blogPostService.getVisible();
  return posts
    .filter((p) => p.isVisible)
    .map((post) => ({ slug: post.slug }));
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const canPreview = await requireAdmin();
  const post = canPreview
    ? await blogPostService.getBySlug(slug)
    : await blogPostService.getVisibleBySlug(slug);
  if (!post) notFound();

  const [{ data: settings }, visiblePosts] = await Promise.all([
    getSiteSettings(),
    blogPostService.getVisible(),
  ]);

  const date = formatArticleDate(post.publishedAt);
  const readTime = formatReadTime(post.readTime);
  const authorName = settings?.aboutName?.trim() || "Andika";
  const authorRole = settings?.aboutRole?.trim() || "Software Engineer";
  const authorBio =
    settings?.aboutIntro?.trim() ||
    "Building useful software with a focus on resilient systems and thoughtful interfaces.";

  const { html, headings } = buildArticleContent(post.body);
  const tocHeadings: TocHeading[] =
    headings.length > 0
      ? headings
      : [{ id: "article-body", label: "Article Overview" }];

  const normalizedCategory = post.category.toLowerCase();
  const relatedPosts = visiblePosts
    .filter((item) => item.slug !== post.slug)
    .sort((a, b) => {
      const aScore =
        a.category.toLowerCase() === normalizedCategory ? 1 : 0;
      const bScore =
        b.category.toLowerCase() === normalizedCategory ? 1 : 0;

      if (aScore !== bScore) return bScore - aScore;

      return (
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
      );
    })
    .slice(0, 3);

  return (
    <PublicShell>
      <main className="bg-[#faf6ee] text-[#1b1b1b]">
        <ArticleHeader
          title={post.title}
          slug={post.slug}
          excerpt={post.excerpt}
          category={post.category}
          date={date}
          readTime={readTime}
          author={authorName}
          format={post.bodyFormat}
        />

        <ArticleFigure
          title={post.title}
          slug={post.slug}
          category={post.category}
          tags={post.tags}
          date={date}
          readTime={readTime}
          author={authorName}
          authorRole={authorRole}
          thumbnail={post.thumbnail}
        />

        <section className="bg-[#faf6ee] px-[5.5vw] py-16 max-md:py-10">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
            <article className="min-w-0 lg:col-span-8">
              <div
                id="article-body"
                className="article-prose prose-content scroll-mt-24"
                dangerouslySetInnerHTML={{ __html: html }}
              />

              <ArticleFooter
                tags={post.tags}
                authorName={authorName}
                authorRole={authorRole}
                authorBio={authorBio}
                githubUrl={settings?.githubUrl}
              />
            </article>

            <ArticleSidebar
              headings={tocHeadings}
              readTime={readTime}
              context={[
                { label: "Category", value: post.category },
                { label: "Published", value: date },
                { label: "Encoding", value: post.bodyFormat.toUpperCase() },
              ]}
            />
          </div>
        </section>

        <RelatedDispatches posts={relatedPosts} />
      </main>
    </PublicShell>
  );
}
