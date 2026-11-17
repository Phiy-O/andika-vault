import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { optimizeCloudinaryUrl } from "@/src/lib/cloudinary-url";
import type { BlogPostListItem } from "@/src/types";
import {
  DEFAULT_BLOG_THUMBNAIL,
  formatArticleDate,
  formatReadTime,
  getCategoryTheme,
} from "./article-content";

type RelatedDispatchesProps = {
  posts: BlogPostListItem[];
};

function RelatedCard({ post }: { post: BlogPostListItem }) {
  const theme = getCategoryTheme(post.category);
  const href = `/blog/${post.slug}`;

  return (
    <article className="flex flex-col justify-between border-2 border-[#1b1b1b] bg-[#fffdf7] p-[2px] shadow-[3px_3px_0_#1b1b1b]">
      <Link href={href} className="group flex h-full flex-col">
        <div className="relative aspect-[16/10] overflow-hidden border-b-2 border-[#1b1b1b] bg-[#faf6ee]">
          <Image
            src={optimizeCloudinaryUrl(
              post.thumbnail || DEFAULT_BLOG_THUMBNAIL,
              900
            )}
            alt={`${post.title} cover`}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
            unoptimized
            className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
          />
          <span
            className="absolute left-3 top-3 border px-2 py-1 font-mono text-[10px] font-bold uppercase tracking-[.06em]"
            style={{
              backgroundColor: theme.background,
              color: theme.text,
              borderColor: theme.border,
            }}
          >
            {post.category}
          </span>
        </div>

        <div className="flex flex-1 flex-col gap-3 p-5">
          <p className="font-mono text-[10px] uppercase tracking-[.08em] text-[#7b625f]">
            {formatArticleDate(post.publishedAt)}
            <span aria-hidden="true" className="mx-1.5">
              •
            </span>
            {formatReadTime(post.readTime)}
          </p>
          <h3 className="text-xl font-black uppercase leading-[1.2] tracking-[-.02em] text-[#1b1b1b]">
            {post.title}
          </h3>
          <p className="line-clamp-3 text-[13px] leading-[1.5] text-[#58413f]">
            {post.excerpt}
          </p>
        </div>
      </Link>

      <div className="px-5 pb-5">
        <Link
          href={href}
          className="inline-flex items-center gap-1 font-mono text-[11px] font-bold uppercase tracking-[.05em] text-[#1b1b1b] transition-colors hover:text-[#a9362e]"
        >
          READ DISPATCH
          <ArrowUpRight size={12} aria-hidden="true" />
        </Link>
      </div>
    </article>
  );
}

export function RelatedDispatches({ posts }: RelatedDispatchesProps) {
  return (
    <section className="border-t-2 border-[#1b1b1b] bg-[#fcf9f8] px-[5.5vw] pb-16 pt-14 max-md:pb-12 max-md:pt-10">
      <div className="flex flex-col gap-5 border-b-2 border-[#1b1b1b] pb-6 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="font-mono text-[11px] font-bold uppercase tracking-[.06em] text-[#a9362e]">
            ARCHIVE RECOMMENDATIONS
          </p>
          <h2 className="mt-1 text-[clamp(30px,3vw,36px)] font-black uppercase leading-[1.1] tracking-[-.03em] text-[#1b1b1b]">
            KEEP READING.
          </h2>
          <p className="mt-2 max-w-xl text-[15px] leading-6 text-[#58413f]">
            More engineering dispatches and system architecture retrospectives.
          </p>
        </div>

        <Link
          href="/blog"
          className="inline-flex w-fit items-center gap-1 font-mono text-[11px] font-bold uppercase tracking-[.06em] text-[#1b1b1b] transition-colors hover:text-[#a9362e]"
        >
          VIEW ALL DISPATCHES
          <ArrowRight size={12} aria-hidden="true" />
        </Link>
      </div>

      {posts.length > 0 ? (
        <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <RelatedCard key={post.id} post={post} />
          ))}
        </div>
      ) : (
        <div className="mt-8 border-2 border-[#1b1b1b] bg-[#fffdf7] p-8 text-center text-sm text-[#58413f] shadow-[3px_3px_0_#1b1b1b]">
          No other dispatches are filed yet.{" "}
          <Link href="/blog" className="font-semibold text-[#a9362e] underline">
            Browse the archive
          </Link>
          .
        </div>
      )}
    </section>
  );
}
