import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { homeBlogPosts, type HomeBlogPost } from "../../data/home-blog-posts";

type HomeBlogSectionProps = {
  posts?: HomeBlogPost[];
};

const DEFAULT_BLOG_THUMBNAIL = "/images/thumbnails/blog-default.png";

const dateFormatter = new Intl.DateTimeFormat("en", {
  month: "short",
  day: "2-digit",
  year: "numeric",
});

export function HomeBlogSection({ posts = homeBlogPosts }: HomeBlogSectionProps) {
  const visiblePosts = posts
    .filter((post) => post.isVisible)
    .sort((firstPost, secondPost) => firstPost.sortOrder - secondPost.sortOrder)
    .slice(0, 3);

  return (
    <section
      className="border-b border-line mx-auto py-[100px] px-[10vw] relative max-md:py-[90px] max-md:px-[6vw]"
      id="blog"
      aria-labelledby="home-blog-title"
    >
      <div className="items-end grid gap-[60px] grid-cols-[1.1fr_.9fr] mx-auto mb-[64px] max-w-[1280px] max-md:items-start max-md:gap-[34px] max-md:grid-cols-1 max-md:mb-[44px]">
        <div>
          <p className="text-muted border border-line w-fit px-3 py-1.5 rounded-full text-[10px] tracking-[.18em] mb-6 uppercase">Blog</p>
          <h2
            className="text-[clamp(48px,6vw,78px)] mb-0 max-md:text-[clamp(36px,8vw,56px)]"
            id="home-blog-title"
          >
            Notes on making <em>better things.</em>
          </h2>
        </div>
        <div className="items-start flex flex-col gap-7">
          <p className="text-muted text-base leading-[1.75] m-0 max-w-[430px]">
            Thoughts on product, engineering, design, and the lessons hiding inside the work.
          </p>
          <Link
            className="border border-line rounded-lg text-foreground inline-flex items-center w-fit text-xs px-5 py-3 transition-all duration-200 hover:shadow-[0_0_2px_var(--foreground)] hover:-translate-y-0.5"
            href="/blog"
          >
            View all posts{" "}
            <span className="text-foreground text-[17px] ml-2" aria-hidden="true">
              <ArrowUpRight size={18} />
            </span>
          </Link>
        </div>
      </div>

      <div className="grid gap-8 grid-cols-3 mx-auto max-w-[1280px] max-md:grid-cols-1">
        {visiblePosts.map((post, index) => (
          <Link
            className="bg-[rgba(16,14,23,.48)] border border-line rounded-[18px] flex flex-col min-h-[360px] overflow-hidden relative transition-all duration-200 hover:border-[rgba(169,139,255,.42)] hover:shadow-[0_22px_50px_rgba(0,0,0,.24)] hover:-translate-y-[5px] max-md:min-h-0"
            href="/blog"
            key={post.id}
          >
            <div className="rounded-tl-[14px] h-[240px] mb-6 bg-cover overflow-hidden relative max-md:h-auto">
              <Image
                src={post.thumbnail || DEFAULT_BLOG_THUMBNAIL}
                alt=""
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
              />
            </div>
            <span className="text-purple text-xs tracking-[.14em] px-6 py-0 relative z-10">
              {String(index + 1).padStart(2, "0")}
            </span>
            <div className="mt-0 pt-3 pb-4 px-6 relative z-10">
              <p className="text-muted text-[10px] tracking-[.12em] mb-[18px] uppercase">
                {post.category} / {dateFormatter.format(new Date(post.publishedAt))}
              </p>
              <h3 className="text-[clamp(22px,2vw,30px)] font-medium tracking-[-.04em] leading-[1.05] mb-[18px] line-clamp-2">
                {post.title}
              </h3>
              <p className="text-muted text-sm leading-[1.7] mb-0 line-clamp-2">{post.excerpt}</p>
            </div>
            <div className="items-center border-t border-line text-muted flex text-xs justify-between mt-auto py-4 px-5 relative z-10">
              <span>{post.readTime}</span>
              <ArrowUpRight className="text-purple" size={18} aria-hidden="true" />
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
