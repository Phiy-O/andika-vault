import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, ChevronLeft } from "lucide-react";
import { PublicShell } from "../../../components/layout/PublicShell";
import { blogPostService } from "@/src/services";
import { getServerSession } from "next-auth";
import { authOptions } from "@/src/lib/auth";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const session = await getServerSession(authOptions);
  const post = session
    ? await blogPostService.getBySlug(slug)
    : await blogPostService.getVisibleBySlug(slug);
  if (!post) return { title: "Blog | Andika" };
  return {
    title: `${post.title} | Andika`,
    description: post.excerpt,
  };
}

export async function generateStaticParams() {
  const posts = await blogPostService.getVisible();
  return posts
    .filter((p) => p.isVisible)
    .map((post: any) => ({ slug: post.slug }));
}

const dateFormatter = new Intl.DateTimeFormat("en", {
  month: "short",
  day: "2-digit",
  year: "numeric",
});

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const session = await getServerSession(authOptions);
  const post = session
    ? await blogPostService.getBySlug(slug)
    : await blogPostService.getVisibleBySlug(slug);
  if (!post) notFound();

  const paragraphs = post.body.split("\n\n");

  return (
    <PublicShell>
      <article className="mx-auto w-full px-[10vw] py-[100px] max-md:px-[6vw] max-md:py-[60px]">
        {/* Back link */}
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-muted text-sm hover:text-foreground transition-colors mb-12"
        >
          <ChevronLeft size={16} />
          Back to blog
        </Link>

        {/* Thumbnail */}
        {post.thumbnail && (
          <div className="relative w-full h-[360px] max-md:h-[200px] rounded-[18px] overflow-hidden border border-line/50 mb-12">
            <img
              src={post.thumbnail}
              alt=""
              className="absolute inset-0 w-full h-full object-cover"
            />
          </div>
        )}

        {/* Header */}
        <header className="w-full mx-auto mb-14">
          <div className="flex items-center gap-3 text-muted text-[11px] tracking-[.18em] uppercase mb-6">
            <span>{post.category}</span>
            <span className="w-1 h-1 rounded-full bg-line" />
            <span>{post.readTime}</span>
            <span className="w-1 h-1 rounded-full bg-line" />
            <span>{dateFormatter.format(new Date(post.publishedAt))}</span>
          </div>

          <h1 className="text-[clamp(36px,4.5vw,64px)] font-medium tracking-[-.04em] leading-[1.05] mb-6">
            {post.title}
          </h1>

          <p className="text-muted text-lg leading-[1.7] max-w-[600px]">
            {post.excerpt}
          </p>
        </header>

        {/* Body — handles both plain text and HTML (Tiptap-ready) */}
        <div className="w-full mx-auto space-y-5 text-[15px] leading-[1.8] text-foreground/90">
          {post.body.startsWith("<") ? (
            <div
              className="prose-content"
              dangerouslySetInnerHTML={{ __html: post.body }}
            />
          ) : (
            paragraphs.map((para, i) => {
              if (para.startsWith("## ")) {
                return (
                  <h2
                    key={i}
                    className="text-[clamp(22px,2.5vw,32px)] font-medium tracking-[-.03em] leading-[1.15] pt-8 -mb-1 text-foreground"
                  >
                    {para.replace("## ", "")}
                  </h2>
                );
              }
              if (para.startsWith("**") && para.endsWith("**")) {
                return (
                  <p key={i} className="font-medium text-foreground">
                    {para.replace(/\*\*/g, "")}
                  </p>
                );
              }
              if (para.startsWith("- ")) {
                return (
                  <ul key={i} className="list-disc pl-5 space-y-1.5 text-muted">
                    {para.split("\n").map((line, j) => (
                      <li key={j}>{line.replace("- ", "")}</li>
                    ))}
                  </ul>
                );
              }
              return (
                <p key={i} className="text-muted">
                  {para}
                </p>
              );
            })
          )}
        </div>
      </article>
    </PublicShell>
  );
}
