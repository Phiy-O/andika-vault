import Image from "next/image";
import { optimizeCloudinaryUrl } from "@/src/lib/cloudinary-url";
import {
  DEFAULT_BLOG_THUMBNAIL,
  formatTag,
  getCategoryTheme,
  slugFileName,
} from "./article-content";

type ArticleFigureProps = {
  title: string;
  slug: string;
  category: string;
  tags: string[];
  date: string;
  readTime: string;
  author: string;
  authorRole: string;
  thumbnail: string | null;
};

const labelClass =
  "font-mono text-[10px] font-semibold uppercase tracking-[.08em] text-[#7b625f]";

export function ArticleFigure({
  title,
  slug,
  category,
  tags,
  date,
  readTime,
  author,
  authorRole,
  thumbnail,
}: ArticleFigureProps) {
  const theme = getCategoryTheme(category);
  const cover = thumbnail
    ? optimizeCloudinaryUrl(thumbnail, 1600)
    : DEFAULT_BLOG_THUMBNAIL;
  const tagItems = tags.length > 0 ? tags.slice(0, 4) : [category];

  return (
    <section
      className="border-b-2 border-[#1b1b1b] bg-[#fcf9f8] px-[5.5vw] py-12 max-md:py-8"
      aria-label="Article cover figure"
    >
      <figure className="border-2 border-[#1b1b1b] bg-[#faf6ee] p-5 shadow-[4px_4px_0_#1b1b1b] sm:p-6 lg:p-8">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b-2 border-[#1b1b1b] pb-4">
          <div className="flex items-center gap-2">
            <span aria-hidden="true" className="flex items-center gap-1.5">
              <span className="size-3 rounded-full border border-[#1b1b1b] bg-[#a9362e]" />
              <span className="size-3 rounded-full border border-[#1b1b1b] bg-[#faf6ee]" />
              <span className="size-3 rounded-full border border-[#1b1b1b] bg-[#006c49]" />
            </span>
            <span className="ml-2 font-mono text-[11px] font-bold uppercase tracking-[.08em]">
              FIG. 01 // COVER ARTIFACT
            </span>
          </div>

          <span className="bg-[#1b1b1b] px-2 py-1 font-mono text-[10px] font-semibold uppercase tracking-[.05em] text-[#fffdf7]">
            {category} SPECIFICATION
          </span>
        </div>

        <div className="mt-6 grid gap-5 lg:grid-cols-[minmax(0,1fr)_300px] lg:gap-6">
          <div className="relative aspect-[16/10] w-full min-w-0 overflow-hidden border-2 border-[#1b1b1b] bg-[#fffdf7] lg:aspect-auto lg:h-full lg:min-h-[380px]">
            <Image
              src={cover}
              alt={`${title} cover`}
              fill
              sizes="(max-width: 1024px) 100vw, 60vw"
              unoptimized
              className="object-cover"
            />
            <span className="absolute left-3 top-3 border border-[#1b1b1b] bg-[#faf6ee] px-2 py-1 font-mono text-[10px] font-bold uppercase tracking-[.06em]">
              ARCHIVE // {date}
            </span>
          </div>

          <div className="flex min-w-0 flex-col gap-4">
            <div className="border-2 border-[#1b1b1b] bg-[#fffdf7] p-4 shadow-[2px_2px_0_#1b1b1b]">
              <p className={labelClass}>DISPATCH AUTHOR</p>
              <p className="mt-1 break-words font-mono text-[13px] font-bold uppercase leading-[1.3] text-[#1b1b1b]">
                {author}
              </p>
              <p className="mt-1 font-mono text-[10px] uppercase tracking-[.05em] text-[#7b625f]">
                {authorRole}
              </p>
            </div>

            <div className="border-2 border-[#1b1b1b] bg-[#fffdf7] p-4 shadow-[2px_2px_0_#1b1b1b]">
              <p className={labelClass}>FILE UNDER</p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {tagItems.map((tag) => (
                  <span
                    key={tag}
                    className="border border-[#1b1b1b] bg-[#faf6ee] px-1.5 py-1 font-mono text-[9px] font-semibold uppercase tracking-[.05em]"
                  >
                    #{formatTag(tag)}
                  </span>
                ))}
              </div>
            </div>

            <div className="border-2 border-[#1b1b1b] bg-[#fffdf7] p-4 shadow-[2px_2px_0_#1b1b1b]">
              <p className={labelClass}>READOUT</p>
              <dl className="mt-2 space-y-1 font-mono text-[10px] uppercase tracking-[.05em]">
                <div className="flex items-center justify-between gap-3">
                  <dt className="text-[#7b625f]">PUBLISHED:</dt>
                  <dd className="font-bold text-[#1b1b1b]">{date}</dd>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <dt className="text-[#7b625f]">READ TIME:</dt>
                  <dd className="font-bold text-[#1b1b1b]">{readTime}</dd>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <dt className="text-[#7b625f]">STATUS:</dt>
                  <dd className="flex items-center gap-1.5 font-bold text-[#006c49]">
                    <span
                      aria-hidden="true"
                      className="size-1.5 rounded-full bg-[#006c49]"
                    />
                    PUBLIC
                  </dd>
                </div>
              </dl>
            </div>

            <span
              className="inline-flex w-fit items-center gap-1.5 border border-[#1b1b1b] px-2 py-1 font-mono text-[9px] font-bold uppercase tracking-[.06em]"
              style={{
                backgroundColor: theme.background,
                color: theme.text,
                borderColor: theme.border,
              }}
            >
              <span
                aria-hidden="true"
                className="size-1.5"
                style={{ backgroundColor: theme.dot }}
              />
              {category}
            </span>
          </div>
        </div>

        <figcaption className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-[#e8e0d3] pt-4 font-mono text-[11px] leading-[1.5] text-[#58413f]">
          <p className="max-w-[720px]">
            <span className="font-bold text-[#1b1b1b]">Fig. 01 —</span> Cover
            artifact filed under {category.toLowerCase()} engineering, {date}.
          </p>
          <span className="border border-[#1b1b1b] bg-[#faf6ee] px-2 py-1 font-mono text-[10px] tracking-[.05em]">
            {slugFileName(slug)}.COVER
          </span>
        </figcaption>
      </figure>
    </section>
  );
}
