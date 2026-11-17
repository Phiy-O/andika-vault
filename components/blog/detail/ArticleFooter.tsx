import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { CopyArticleLink } from "./CopyArticleLink";
import { formatTag } from "./article-content";

type ArticleFooterProps = {
  tags: string[];
  authorName: string;
  authorRole: string;
  authorBio: string;
  githubUrl?: string;
};

const linkClass =
  "font-mono text-[11px] font-semibold uppercase tracking-[.06em] text-[#a9362e] transition-colors hover:text-[#630004] hover:underline";

export function ArticleFooter({
  tags,
  authorName,
  authorRole,
  authorBio,
  githubUrl,
}: ArticleFooterProps) {
  return (
    <footer className="mt-12 border-t-2 border-[#1b1b1b] pt-8">
      {tags.length > 0 && (
        <div
          className="flex flex-wrap items-center gap-2"
          aria-label="Article tags"
        >
          {tags.map((tag) => (
            <span
              key={tag}
              className="border border-[#1b1b1b] bg-[#fffdf7] px-[11px] py-[5px] font-mono text-[10px] font-semibold uppercase tracking-[.08em] text-[#1b1b1b]"
            >
              #{formatTag(tag)}
            </span>
          ))}
        </div>
      )}

      <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-[#e8e0d3] pt-5">
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 border-2 border-[#1b1b1b] bg-[#fffdf7] px-[18px] py-2.5 font-mono text-[11px] font-bold uppercase tracking-[.05em] text-[#1b1b1b] shadow-[2px_2px_0_#1b1b1b] transition-all hover:-translate-y-0.5 hover:shadow-[3px_3px_0_#1b1b1b] active:translate-y-0 active:shadow-[1px_1px_0_#1b1b1b]"
        >
          <ArrowLeft size={13} aria-hidden="true" />
          BACK TO BLOG
        </Link>
        <CopyArticleLink />
      </div>

      <div className="mt-6 border-2 border-[#1b1b1b] bg-[#fffdf7] p-5 shadow-[3px_3px_0_#1b1b1b] sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:gap-5">
          <div className="relative size-16 shrink-0 overflow-hidden rounded-[12px] border-2 border-[#1b1b1b] shadow-[2px_2px_0_#1b1b1b]">
            <Image
              src="/images/andika-profile.png"
              alt={`${authorName} portrait`}
              fill
              sizes="64px"
              className="object-cover"
            />
          </div>

          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <p className="text-xl font-black uppercase leading-[1.15] tracking-[-.02em] text-[#1b1b1b]">
                {authorName}
              </p>
              <span className="border border-[#1b1b1b] bg-[#faf6ee] px-2 py-1 font-mono text-[10px] font-semibold uppercase tracking-[.08em] text-[#58413f]">
                {authorRole}
              </span>
            </div>

            <p className="mt-2 max-w-[640px] text-[15px] leading-[1.5] text-[#58413f]">
              {authorBio}
            </p>

            <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2">
              <Link href="/about" className={linkClass}>
                ENGINEER PROFILE ↗
              </Link>
              {githubUrl && (
                <a
                  href={githubUrl}
                  target="_blank"
                  rel="noreferrer"
                  className={linkClass}
                >
                  GITHUB REPOS ↗
                </a>
              )}
              <Link href="/contact" className={linkClass}>
                ENGAGE / CONTACT ↗
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
