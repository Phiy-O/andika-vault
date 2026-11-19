import Link from "next/link";
import type { ReactNode } from "react";
import { getCategoryTheme, slugFileName } from "./article-content";

type ArticleHeaderProps = {
  title: string;
  slug: string;
  excerpt: string;
  category: string;
  date: string;
  readTime: string;
  author: string;
  format: string;
  breadcrumbLinks?: boolean;
};

function BreadcrumbLink({
  href,
  enabled,
  children,
}: {
  href: string;
  enabled: boolean;
  children: ReactNode;
}) {
  if (!enabled) {
    return <span className="text-[#58413f]">{children}</span>;
  }

  return (
    <Link
      href={href}
      className="text-[#58413f] transition-colors hover:text-[#a9362e]"
    >
      {children}
    </Link>
  );
}

function MetaItem({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent?: string;
}) {
  return (
    <div className="flex items-center gap-2">
      <span className="font-mono text-[11px] uppercase tracking-[.08em] text-[#7b625f]">
        {label}:
      </span>
      <span
        className={`border border-[#1b1b1b] bg-[#fffdf7] px-2 py-[3px] font-mono text-[11px] font-medium tracking-[.06em] ${
          accent ?? "text-[#1b1b1b]"
        }`}
      >
        {value}
      </span>
    </div>
  );
}

export function ArticleHeader({
  title,
  slug,
  excerpt,
  category,
  date,
  readTime,
  author,
  format,
  breadcrumbLinks = true,
}: ArticleHeaderProps) {
  const theme = getCategoryTheme(category);
  const fileName = `${slugFileName(slug)}.MD`;

  return (
    <header className="border-b-2 border-[#1b1b1b] bg-[#faf6ee] px-[5.5vw]">
      <div className="w-full py-8 sm:py-9">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <nav aria-label="Breadcrumb">
            <ol className="flex flex-wrap items-center gap-2 font-mono text-[12px] uppercase tracking-[.08em]">
              <li>
                <BreadcrumbLink href="/" enabled={breadcrumbLinks}>
                  ROOT
                </BreadcrumbLink>
              </li>
              <li aria-hidden="true" className="text-[#8b716e]">
                /
              </li>
              <li>
                <BreadcrumbLink href="/blog" enabled={breadcrumbLinks}>
                  BLOG
                </BreadcrumbLink>
              </li>
              <li aria-hidden="true" className="text-[#8b716e]">
                /
              </li>
              <li
                aria-current="page"
                className="max-w-[min(70vw,520px)] truncate font-semibold text-[#1b1b1b]"
              >
                {fileName}
              </li>
            </ol>
          </nav>

          <span
            className="inline-flex shrink-0 items-center gap-2 border-2 px-3 py-1.5 font-mono text-[10px] font-bold uppercase tracking-[.06em]"
            style={{
              backgroundColor: theme.background,
              color: theme.text,
              borderColor: theme.border,
            }}
          >
            <span
              aria-hidden="true"
              className="size-1.5 shrink-0"
              style={{ backgroundColor: theme.dot }}
            />
            {category}
          </span>
        </div>

        <div className="mt-6 max-w-[896px]">
          <h1 className="break-words text-[clamp(34px,4.6vw,56px)] font-black uppercase leading-[1.05] tracking-[-.045em] text-[#1b1b1b]">
            {title}
          </h1>
          <p className="mt-4 max-w-[768px] text-[17px] leading-[1.62] tracking-[-.005em] text-[#58413f] sm:text-[18px]">
            {excerpt}
          </p>
        </div>

        <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 border-t border-[#e8e0d3] pt-6">
          <MetaItem label="PUBLISHED" value={date} />
          <MetaItem label="READ TIME" value={readTime} />
          <MetaItem
            label="AUTHOR"
            value={author.toUpperCase()}
            accent="font-bold text-[#a9362e]"
          />
          <MetaItem label="FORMAT" value={format.toUpperCase()} />

          <div className="ml-auto flex items-center gap-2 font-mono text-[10px] font-bold uppercase tracking-[.1em] text-[#006c49]">
            <span
              aria-hidden="true"
              className="size-2 rounded-full bg-[#006c49]"
            />
            VERIFIED {category.toUpperCase()} DISPATCH
          </div>
        </div>
      </div>
    </header>
  );
}
