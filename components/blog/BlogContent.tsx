"use client";

import { ArrowUpRight, Search } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import {
  homeBlogPosts,
  type HomeBlogPost,
} from "../../data/home-blog-posts";
import { SectionEyebrow } from "../content/SectionEyebrow";
import { Card } from "../content/Card";
import { FilterButton } from "../content/FilterButton";

type Category = "all" | "perspective" | "personal" | "process";

const ITEMS_PER_PAGE = 6;

const DEFAULT_BLOG_THUMBNAIL = "/images/thumbnails/blog-default.png";

const dateFormatter = new Intl.DateTimeFormat("en", {
  month: "short",
  day: "2-digit",
  year: "numeric",
});

const categories: { value: Category; label: string }[] = [
  { value: "all", label: "All" },
  { value: "perspective", label: "Perspective" },
  { value: "personal", label: "Personal" },
  { value: "process", label: "Process" },
];

export function BlogContent() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<Category>("all");
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);

  const allPosts = useMemo(() => {
    return homeBlogPosts
      .filter((p) => p.isVisible)
      .sort((a, b) => a.sortOrder - b.sortOrder);
  }, []);

  const latestPost = allPosts[0];

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    allPosts.forEach((post) => {
      const cat = post.category.toLowerCase();
      counts[cat] = (counts[cat] || 0) + 1;
    });
    return counts;
  }, [allPosts]);

  const filteredPosts = useMemo(() => {
    return allPosts.filter((post) => {
      const matchesCategory =
        activeCategory === "all" ||
        post.category.toLowerCase() === activeCategory;

      const matchesSearch =
        search === "" ||
        post.title.toLowerCase().includes(search.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(search.toLowerCase()) ||
        post.category.toLowerCase().includes(search.toLowerCase());

      return matchesCategory && matchesSearch;
    });
  }, [allPosts, activeCategory, search]);

  const visiblePosts = filteredPosts.slice(0, visibleCount);
  const hasMore = visibleCount < filteredPosts.length;

  return (
    <div className="mx-auto w-full px-[10vw] max-md:px-[6vw]">
      {/* Toolbar: Search + Filter */}
      <section className="py-[60px] border-b border-line">
        <div className="flex flex-col gap-6 max-md:gap-5">
          {/* Search */}
          <div className="relative w-full max-w-[480px]">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-muted"
              size={16}
            />
            <input
              type="text"
              placeholder="Search articles..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setVisibleCount(ITEMS_PER_PAGE);
              }}
              className="w-full bg-transparent border border-line rounded-lg text-foreground text-sm pl-11 pr-4 py-3 outline-none transition-all duration-200 placeholder:text-muted focus:border-purple"
            />
          </div>

          {/* Category filter pills */}
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat.value}
                onClick={() => {
                  setActiveCategory(cat.value);
                  setVisibleCount(ITEMS_PER_PAGE);
                }}
                className={`border rounded-lg text-xs px-4 py-2 transition-all duration-200 cursor-pointer ${
                  activeCategory === cat.value
                    ? "border-purple text-purple bg-[rgba(169,139,255,.08)]"
                    : "border-line text-muted hover:border-foreground hover:text-foreground"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Main + Aside layout */}
      <div className="flex gap-[60px] py-[60px] max-lg:flex-col max-lg:gap-[50px]">
        {/* Main content */}
        <main className="flex-1 min-w-0">
          {/* Results count */}
          <div className="pb-6">
            <p className="text-muted text-sm">
              {filteredPosts.length}{" "}
              {filteredPosts.length === 1 ? "article" : "articles"} found
            </p>
          </div>

          {/* Card grid */}
          {filteredPosts.length === 0 ? (
            <div className="border border-dashed border-line text-muted p-[35px] text-center">
              <p className="m-0">No articles match your search.</p>
            </div>
          ) : (
            <div className="grid gap-[18px] grid-cols-2 max-md:grid-cols-1">
              {visiblePosts.map((post, index) => (
                <BlogCard key={post.id} post={post} index={index} />
              ))}
            </div>
          )}

          {/* Load more */}
          {hasMore && (
            <div className="flex justify-center pt-10">
              <button
                onClick={() =>
                  setVisibleCount((prev) => prev + ITEMS_PER_PAGE)
                }
                className="border border-line rounded-lg text-foreground text-xs px-6 py-3 transition-all duration-200 cursor-pointer hover:shadow-[0_0_2px_var(--foreground)] hover:-translate-y-0.5"
              >
                Load more
              </button>
            </div>
          )}
        </main>

        {/* Aside */}
        <aside className="w-[300px] shrink-0 max-lg:w-full max-lg:w-auto">
          <div className="flex flex-col gap-[50px]">
            {/* Featured post */}
            {latestPost && (
              <div>
                <SectionEyebrow>
                  Featured
                </SectionEyebrow>
                <Card href={`/blog/${latestPost.slug}`}>
                  <div className="h-[160px] overflow-hidden relative">
                    <Image
                      src={latestPost.thumbnail || DEFAULT_BLOG_THUMBNAIL}
                      alt=""
                      fill
                      className="object-cover"
                      sizes="300px"
                    />
                  </div>
                  <div className="px-5 pt-4 pb-5">
                    <p className="text-muted text-[10px] tracking-[.12em] mb-3 uppercase">
                      {latestPost.category} /{" "}
                      {dateFormatter.format(new Date(latestPost.publishedAt))}
                    </p>
                    <h3 className="text-lg font-medium tracking-[-.03em] leading-[1.15] mb-2.5 line-clamp-2">
                      {latestPost.title}
                    </h3>
                    <p className="text-muted text-sm leading-[1.6] mb-0 line-clamp-2">
                      {latestPost.excerpt}
                    </p>
                  </div>
                  </Card>
                  </div>
            )}

            {/* Categories */}
            <div>
              <SectionEyebrow>
                Categories
              </SectionEyebrow>
              <div className="flex flex-col gap-3">
                {categories
                  .filter((cat) => cat.value !== "all")
                  .map((cat) => (
                    <FilterButton
                      key={cat.value}
                      isActive={activeCategory === cat.value}
                      count={categoryCounts[cat.value] || 0}
                      onClick={() => {
                        setActiveCategory(cat.value);
                        setVisibleCount(ITEMS_PER_PAGE);
                      }}
                    >
                      {cat.label}
                    </FilterButton>
                  ))}
              </div>
            </div>

            {/* About */}
            <div>
              <SectionEyebrow>
                About
              </SectionEyebrow>
              <p className="text-muted text-sm leading-[1.7] m-0">
                Thoughts on product, engineering, design, and the lessons
                hiding inside the work.
              </p>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

function BlogCard({
  post,
  index,
}: {
  post: HomeBlogPost;
  index: number;
}) {
  return (
    <Card href={`/blog/${post.slug}`} className="min-h-[360px] max-md:min-h-0">
      <div className="h-[200px] mb-5 overflow-hidden relative max-md:h-[180px]">
        <Image
          src={post.thumbnail || DEFAULT_BLOG_THUMBNAIL}
          alt=""
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 50vw"
        />
      </div>
      <span className="text-purple text-xs tracking-[.14em] px-6 py-0 relative z-10">
        {String(index + 1).padStart(2, "0")}
      </span>
      <div className="mt-0 pt-3 pb-4 px-6 relative z-10 flex-1 flex flex-col">
        <p className="text-muted text-[10px] tracking-[.12em] mb-[14px] uppercase">
          {post.category} /{" "}
          {dateFormatter.format(new Date(post.publishedAt))}
        </p>
        <h3 className="text-[clamp(20px,2vw,26px)] font-medium tracking-[-.04em] leading-[1.1] mb-3 line-clamp-2">
          {post.title}
        </h3>
        <p className="text-muted text-sm leading-[1.7] mb-0 line-clamp-2 flex-1">
          {post.excerpt}
        </p>
      </div>
      <div className="items-center border-t border-line text-muted flex text-xs justify-between mt-auto py-4 px-5 relative z-10">
        <span>{post.readTime}</span>
        <ArrowUpRight className="text-purple" size={18} aria-hidden="true" />
      </div>
</Card>
  );
}
