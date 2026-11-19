"use client";

import { useEffect, useRef, useState } from "react";
import { Eye, RotateCcw, X } from "lucide-react";
import { ArticleHeader } from "@/components/blog/detail/ArticleHeader";
import { ArticleFigure } from "@/components/blog/detail/ArticleFigure";
import { ArticleSidebar } from "@/components/blog/detail/ArticleSidebar";
import {
  formatArticleDate,
  formatReadTime,
} from "@/components/blog/detail/article-content";
import { FullscreenDialog } from "@/components/admin/editor/FullscreenDialog";
import { previewBlogArticle } from "@/src/actions/blog-post";
import type { TocHeading } from "@/src/lib/article-content";

export type PreviewAuthor = {
  name: string;
  role: string;
};

interface PreviewArticleProps {
  open: boolean;
  onClose: () => void;
  title: string;
  slug: string;
  excerpt: string;
  category: string;
  tags: string[];
  thumbnail: string | null;
  body: string;
  readTime: string;
  publishedAt: string;
  isVisible: boolean;
  bodyFormat: "html" | "markdown";
  publicHref?: string | null;
  author: PreviewAuthor;
}

type PreviewContent = {
  html: string;
  headings: TocHeading[];
};

export function PreviewArticle({
  open,
  onClose,
  title,
  slug,
  excerpt,
  category,
  tags,
  thumbnail,
  body,
  readTime,
  publishedAt,
  isVisible,
  bodyFormat,
  publicHref,
  author,
}: PreviewArticleProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [content, setContent] = useState<PreviewContent | null>(null);
  const [error, setError] = useState("");
  const [reload, setReload] = useState(0);

  useEffect(() => {
    if (!open) return;

    let cancelled = false;

    previewBlogArticle({ body })
      .then((result) => {
        if (cancelled) return;
        if (!result.data) {
          setError(result.error ?? "Failed to render preview");
          return;
        }
        setContent(result.data);
      })
      .catch(() => {
        if (!cancelled) setError("Failed to render preview");
      });

    return () => {
      cancelled = true;
    };
  }, [open, body, reload]);

  function handleClose() {
    setContent(null);
    setError("");
    onClose();
  }

  function handleRetry() {
    setContent(null);
    setError("");
    setReload((value) => value + 1);
  }

  const date = formatArticleDate(publishedAt) || "UNSET";
  const readTimeLabel = formatReadTime(readTime);
  const displayCategory = category || "Article";
  const tocHeadings: TocHeading[] =
    content && content.headings.length > 0
      ? content.headings
      : [{ id: "article-body", label: "Article Overview" }];

  return (
    <FullscreenDialog open={open} onClose={handleClose} label="Article preview">
      <header className="flex flex-wrap items-center justify-between gap-3 border-b-2 border-line bg-surface px-4 py-3">
        <div className="flex min-w-0 flex-wrap items-center gap-2">
          <span className="inline-flex h-6 items-center gap-1.5 bg-purple px-2 font-jet text-[8px] font-bold uppercase tracking-[.08em] text-foreground">
            <Eye size={11} aria-hidden="true" />
            Preview
          </span>
          <span
            className={`inline-flex h-6 items-center border border-line px-2 font-jet text-[8px] font-bold uppercase tracking-[.06em] ${
              isVisible
                ? "bg-background text-foreground"
                : "bg-admin-wash text-muted"
            }`}
          >
            {isVisible ? "Published" : "Draft"}
          </span>
          <span className="min-w-0 truncate font-jet text-[9px] uppercase tracking-[.08em] text-muted">
            /blog/{slug || "your-slug"}
          </span>
        </div>

        <div className="flex shrink-0 items-center gap-3">
          {publicHref && (
            <a
              href={publicHref}
              target="_blank"
              rel="noreferrer"
              className="inline-flex h-8 items-center gap-1.5 border border-line bg-background px-2.5 font-jet text-[8px] font-bold uppercase tracking-[.08em] transition-colors hover:bg-admin-wash"
            >
              Open saved page
              <span aria-hidden="true">↗</span>
            </a>
          )}
          <button
            type="button"
            onClick={handleClose}
            aria-label="Close preview"
            className="grid size-9 place-items-center border-2 border-line bg-background text-foreground transition-colors hover:bg-admin-wash"
          >
            <X size={14} aria-hidden="true" />
          </button>
        </div>
      </header>

      <div ref={scrollRef} className="min-h-0 flex-1 overflow-y-auto">
        <main className="bg-[#faf6ee] text-[#1b1b1b]">
          <ArticleHeader
            title={title || "Untitled post"}
            slug={slug || "your-slug"}
            excerpt={excerpt}
            category={displayCategory}
            date={date}
            readTime={readTimeLabel}
            author={author.name}
            format={bodyFormat.toUpperCase()}
            breadcrumbLinks={false}
          />

          <ArticleFigure
            title={title || "Untitled post"}
            slug={slug || "your-slug"}
            category={displayCategory}
            tags={tags}
            date={date}
            readTime={readTimeLabel}
            author={author.name}
            authorRole={author.role}
            thumbnail={thumbnail}
          />

          <section className="bg-[#faf6ee] px-[5.5vw] py-16 max-md:py-10">
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
              <article className="min-w-0 lg:col-span-8">
                {error ? (
                  <div
                    role="alert"
                    className="border-2 border-[#a9362e] bg-[#fffdf7] p-5 shadow-[4px_4px_0_#1b1b1b]"
                  >
                    <p className="font-mono text-[11px] font-bold uppercase tracking-[.06em] text-[#a9362e]">
                      Preview failed
                    </p>
                    <p className="mt-2 text-[14px] leading-6 text-[#58413f]">
                      {error}
                    </p>
                    <button
                      type="button"
                      onClick={handleRetry}
                      className="mt-4 inline-flex h-9 items-center gap-2 border-2 border-[#1b1b1b] bg-[#faf6ee] px-3 font-mono text-[10px] font-bold uppercase tracking-[.06em] shadow-[2px_2px_0_#1b1b1b] transition-transform hover:-translate-y-0.5 motion-reduce:transform-none"
                    >
                      <RotateCcw size={12} aria-hidden="true" />
                      Retry
                    </button>
                  </div>
                ) : content ? (
                  <div
                    id="article-body"
                    className="article-prose prose-content scroll-mt-24"
                    dangerouslySetInnerHTML={{ __html: content.html }}
                  />
                ) : (
                  <div
                    role="status"
                    aria-label="Rendering article preview"
                    className="space-y-3"
                  >
                    <span className="sr-only">
                      Rendering article preview
                    </span>
                    {[92, 78, 85, 64, 88, 72].map((width, index) => (
                      <span
                        key={index}
                        aria-hidden="true"
                        className="block h-4 border border-[#e8e0d3] bg-[#fffdf7]"
                        style={{ width: `${width}%` }}
                      />
                    ))}
                  </div>
                )}
              </article>

              <ArticleSidebar
                headings={tocHeadings}
                readTime={readTimeLabel}
                context={[
                  { label: "Category", value: displayCategory },
                  { label: "Published", value: date },
                  { label: "Encoding", value: bodyFormat.toUpperCase() },
                ]}
                scrollRootRef={scrollRef}
              />
            </div>
          </section>
        </main>
      </div>
    </FullscreenDialog>
  );
}
