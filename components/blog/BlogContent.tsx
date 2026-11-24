"use client";

import { ArrowUpRight, Search } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import { optimizeCloudinaryUrl } from "@/src/lib/cloudinary-url";
type BlogPost = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  category: string;
  readTime: string;
  publishedAt: Date;
  thumbnail: string | null;
  isVisible: boolean;
  sortOrder: number;
};

type Category = "all" | "perspective" | "personal" | "process";
const ITEMS_PER_PAGE = 6;
const DEFAULT_BLOG_THUMBNAIL = "/images/thumbnails/blog-default.png";
const dateFormatter = new Intl.DateTimeFormat("en", { year: "numeric", month: "2-digit", day: "2-digit" });
const categories: { value: Category; label: string }[] = [
  { value: "all", label: "ALL" }, { value: "perspective", label: "ENGINEERING" },
  { value: "personal", label: "THOUGHTS" }, { value: "process", label: "EXPERIMENTS" },
];
const shell = "mx-auto w-full px-[5.5vw] py-10";
const mono = "font-mono text-[10px] font-bold uppercase tracking-[.1em]";
const border = "border-2 border-[#1b1b1b]";

export function BlogContent({ posts }: { posts: BlogPost[] }) {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<Category>("all");
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);
  const allPosts = useMemo(() => posts.filter((post) => post.isVisible).sort((a, b) => a.sortOrder - b.sortOrder), [posts]);
  const filteredPosts = useMemo(() => allPosts.filter((post) => {
    const query = search.toLowerCase();
    return (activeCategory === "all" || post.category.toLowerCase() === activeCategory) && (!query || `${post.title} ${post.excerpt} ${post.category}`.toLowerCase().includes(query));
  }), [activeCategory, allPosts, search]);
  const latestPost = filteredPosts[0];
  const visiblePosts = filteredPosts.slice(latestPost ? 1 : 0, visibleCount + (latestPost ? 1 : 0));
  const reset = () => setVisibleCount(ITEMS_PER_PAGE);

  return (
    <main className="min-h-screen bg-background text-[#1b1b1b]"><div className={shell}>
      <section className="grid gap-8 border-b-2 border-[#1b1b1b] pb-7 lg:grid-cols-[1fr_460px]">
        <div className="flex flex-col justify-between gap-8"><div>
          <div className="mb-3 flex flex-wrap items-center gap-2"><span className={`${mono} border border-[#1b1b1b] bg-[#faf6ee] px-2 py-1`}>03 // WRITING ARCHIVE</span><span className={`${mono} text-[#58413f]`}><i className="mr-2 inline-block size-1.5 rounded-full bg-[#006c49]" />{allPosts.length} PUBLISHED DISPATCHES // EDGE RSS ACTIVE</span></div>
          <h1 className="font-sans text-5xl font-black uppercase leading-none tracking-[-.06em] sm:text-6xl">NOTES FROM<br />THE BUILD.</h1><p className="mt-5 max-w-xl text-base leading-7 text-[#58413f] sm:text-lg">Technical notes, engineering experiments, architecture retrospectives, and practical ideas worth documenting across distributed systems, frontend engineering, and hardware prototypes.</p>
        </div><a href="/api/blog/rss" className={`${mono} inline-flex w-fit items-center gap-2 border-2 border-[#1b1b1b] bg-[#faf6ee] px-4 py-2 shadow-[3px_3px_0_#1b1b1b] transition-transform hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2`}>RSS FEED // RSS.XML ↗</a></div>
        <div className={`${border} bg-[#faf6ee] p-0 shadow-[4px_4px_0_#1b1b1b]`}><div className={`${mono} flex justify-between border-b-2 border-[#1b1b1b] bg-[#e5e2e1] px-2 py-2`}><span>FIG. 03 // DISPATCH LOG</span><span>●●●</span></div><div className="flex min-h-[220px] items-center justify-center bg-[#fffdf7] p-6"><div className="w-full border-2 border-[#1b1b1b] bg-[#faf6ee] p-5"><div className="mb-5 h-3 w-2/3 border-b-2 border-[#1b1b1b]" /><div className="grid grid-cols-2 gap-3"><span className="h-8 border-2 border-[#1b1b1b] bg-[#f16b5e]" /><span className="h-8 border-2 border-[#1b1b1b] bg-[#73b8ff]" /><span className="col-span-2 h-12 border-2 border-[#1b1b1b] bg-[#faf6ee]" /></div></div></div><div className={`${mono} flex justify-between border-t border-[#1b1b1b] px-2 py-1 text-[#58413f]`}><span>DISPATCH STATUS: COMPILED</span><span>TAG: v4.8</span></div></div>
      </section>

      {latestPost && <section className="mt-8"><div className={`${mono} mb-2 flex justify-between`}><span><i className="mr-2 inline-block size-2 bg-[#f16b5e]" />FEATURED WRITING // LEAD DISPATCH</span><span>INDEX #{String(allPosts.length).padStart(3, "0")}</span></div><article className={`${border} grid gap-6 bg-[#fffdf7] p-5 shadow-[4px_4px_0_#1b1b1b] lg:grid-cols-[1fr_420px]`}><div className="flex flex-col justify-between gap-8"><div><span className={`${mono} inline-block border border-[#1b1b1b] bg-[#73b8ff] px-2 py-1 text-[#004878]`}>{latestPost.category}</span><h2 className="mt-3 text-3xl font-black leading-tight tracking-[-.04em] sm:text-4xl">{latestPost.title}</h2><p className="mt-3 text-sm leading-6 text-[#58413f]">{latestPost.excerpt}</p></div><div className="flex flex-wrap items-end justify-between gap-4 border-t border-[#e8e0d3] pt-3"><span className={mono}>DATE: {dateFormatter.format(new Date(latestPost.publishedAt))}<br />READ: {latestPost.readTime}</span><Link href={`/blog/${latestPost.slug}`} className="border-2 border-[#1b1b1b] bg-[#f16b5e] px-5 py-2 text-lg font-bold uppercase text-[#630004] shadow-[3px_3px_0_#1b1b1b] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2">READ ARTICLE ↗</Link></div></div><img src={optimizeCloudinaryUrl(latestPost.thumbnail || DEFAULT_BLOG_THUMBNAIL, 900)} alt="" className={`${border} aspect-video w-full object-cover`} /></article></section>}

      <section className={`${border} mt-8 flex flex-col gap-3 bg-[#fffdf7] p-2 shadow-[3px_3px_0_#1b1b1b] md:flex-row md:items-center md:justify-between`}><div className="flex flex-wrap gap-1">{categories.map((category) => <button key={category.value} aria-pressed={activeCategory === category.value} onClick={() => { setActiveCategory(category.value); reset(); }} className={`${mono} border-2 border-[#1b1b1b] px-2 py-1.5 ${activeCategory === category.value ? "bg-[#f16b5e] text-[#630004] shadow-[2px_2px_0_#1b1b1b]" : "bg-[#fffdf7]"}`}>{category.label} [{category.value === "all" ? allPosts.length : allPosts.filter((post) => post.category.toLowerCase() === category.value).length}]</button>)}</div><label className="relative block w-full md:max-w-xs"><Search aria-hidden="true" className="absolute left-2 top-2.5 size-4" /><input aria-label="Search articles" value={search} onChange={(event) => { setSearch(event.target.value); reset(); }} placeholder="Search articles, topics, or code..." className={`${mono} h-10 w-full border-2 border-[#1b1b1b] bg-[#faf6ee] pl-8 pr-2 outline-none focus-visible:ring-2 focus-visible:ring-[#f16b5e]`} /></label></section>

      <section className="mt-10"><div className="mb-4 flex items-end justify-between border-b-2 border-[#1b1b1b] pb-2"><div><p className={`${mono} text-[#58413f]`}>ARCHIVE LEDGER // CHRONOLOGICAL</p><h2 className="text-3xl font-black uppercase tracking-[-.04em]">ALL WRITING</h2></div><span className={`${mono} hidden sm:block`}>SORT: DESCENDING (EPOCH)</span></div>{filteredPosts.length === 0 ? <div className={`${border} bg-[#faf6ee] p-8 text-center text-[#58413f]`}>No articles match your search.</div> : <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">{visiblePosts.map((post, index) => <BlogCard key={post.id} post={post} index={index} />)}</div>}{visibleCount < Math.max(filteredPosts.length - (latestPost ? 1 : 0), 0) && <button onClick={() => setVisibleCount((count) => count + ITEMS_PER_PAGE)} className={`${mono} mx-auto mt-8 block border-2 border-[#1b1b1b] bg-[#fffdf7] px-5 py-2 shadow-[2px_2px_0_#1b1b1b]`}>LOAD MORE ARTICLES [↙]</button>}</section>
      <div className={`${border} mt-14 flex flex-col gap-4 bg-[#faf6ee] p-4 shadow-[3px_3px_0_#1b1b1b] sm:flex-row sm:items-center sm:justify-between`}><span className="font-medium">Looking for runnable code and schematics?</span><Link href="/projects" className={`${mono} border border-[#1b1b1b] bg-[#f16b5e] px-3 py-2 text-[#630004]`}>EXPLORE ALL PROJECTS ↗</Link></div>
    </div></main>
  );
}

function BlogCard({ post, index }: { post: BlogPost; index: number }) { return <article className={`${border} flex flex-col overflow-hidden rounded-sm bg-[#faf6ee]`}><Link href={`/blog/${post.slug}`} className="group"><div className="relative aspect-[16/10] border-b-2 border-[#1b1b1b] bg-[#f4ebdc] p-3"><img src={optimizeCloudinaryUrl(post.thumbnail || DEFAULT_BLOG_THUMBNAIL, 800)} alt="" className="size-full object-cover transition-transform group-hover:scale-[1.02]" /><span className={`${mono} absolute right-2 top-2 border border-[#1b1b1b] bg-[#faf6ee] px-1.5 py-1`}>FIG.{String(index + 1).padStart(2, "0")}</span></div><div className="p-5"><span className={`${mono} inline-block border border-[#1b1b1b] bg-[#73b8ff] px-2 py-1 text-[#004878]`}>{post.category}</span><h3 className="mt-3 text-xl font-bold leading-tight">{post.title}</h3><p className="mt-2 line-clamp-2 text-sm leading-5 text-[#58413f]">{post.excerpt}</p></div></Link><div className={`${mono} mt-auto flex justify-between border-t-2 border-[#1b1b1b] px-5 py-3`}><span>{dateFormatter.format(new Date(post.publishedAt))} • {post.readTime}</span><ArrowUpRight aria-hidden="true" className="size-4" /></div></article>; }
