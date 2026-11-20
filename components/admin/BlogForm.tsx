"use client";

import { useRouter } from "next/navigation";
import { useState, useMemo } from "react";
import type { BlogPost } from "@prisma/client";
import { Maximize2 } from "lucide-react";
import slugify from "@/src/lib/slugify";
import { BodyEditor, type BodyMode } from "@/components/admin/blog/BodyEditor";
import { FocusEditor } from "@/components/admin/blog/FocusEditor";
import {
  PreviewArticle,
  type PreviewAuthor,
} from "@/components/admin/blog/PreviewArticle";
import { useToast } from "@/components/ui/Toast";
import { ImageUploader } from "./ImageUploader";
import { EditorShell } from "@/components/admin/editor/EditorShell";
import { EditorHeader } from "@/components/admin/editor/EditorHeader";
import { EditorHeaderActions, EditorMetaChip } from "@/components/admin/editor/EditorHeader";
import { EditorSection } from "@/components/admin/editor/EditorSection";
import { EditorRail, EditorPanel } from "@/components/admin/editor/EditorRail";
import { EditorPreview } from "@/components/admin/editor/EditorPreview";
import { EditorField, EditorSelect, editorInputClass, editorMonoInputClass, editorTextareaClass } from "@/components/admin/editor/EditorField";
import { EditorToggle } from "@/components/admin/editor/EditorToggle";
import {
  useEditorDirty,
  useUnsavedGuard,
  confirmDiscard,
} from "@/components/admin/editor/useEditorState";
import {
  responseError,
  formatDate,
  formatRelativeTime,
  shortRecordId,
} from "@/components/admin/workspace/utils";

const CATEGORIES = [
  "Sharing Information",
  "Personal",
  "Tutorial",
  "Web Development",
  "Artificial Intelligence",
];

const DEFAULT_PREVIEW_AUTHOR: PreviewAuthor = {
  name: "Andika",
  role: "Software Engineer",
};

interface Props {
  post?: BlogPost | null;
  previewAuthor?: PreviewAuthor;
}

export function BlogForm({
  post,
  previewAuthor = DEFAULT_PREVIEW_AUTHOR,
}: Props) {
  const router = useRouter();
  const isEdit = !!post;
  const showToast = useToast();

  const [title, setTitle] = useState(post?.title ?? "");
  const [slug, setSlug] = useState(post?.slug ?? "");
  const [excerpt, setExcerpt] = useState(post?.excerpt ?? "");
  const [body, setBody] = useState(post?.body ?? "");
  const [bodyFormat, setBodyFormat] = useState<"html" | "markdown">(
    post?.bodyFormat === "markdown" ? "markdown" : "html"
  );
  const [bodyMode, setBodyMode] = useState<BodyMode>("visual");
  const [focusOpen, setFocusOpen] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [editorEpoch, setEditorEpoch] = useState(0);
  const [category, setCategory] = useState(post?.category ?? "");
  const [tags, setTags] = useState<string[]>(post?.tags ?? []);
  const [tagInput, setTagInput] = useState("");
  const [publishedAt, setPublishedAt] = useState(
    post ? new Date(post.publishedAt).toISOString().slice(0, 10) : ""
  );
  const [thumbnail, setThumbnail] = useState(post?.thumbnail ?? "");
  const [isVisible, setIsVisible] = useState(post?.isVisible ?? true);
  const [sortOrder, setSortOrder] = useState(post?.sortOrder ?? 0);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const computedReadTime = useMemo(() => {
    const text = body.replace(/<[^>]*>/g, "");
    const words = text.split(/\s+/).filter(Boolean).length;
    return Math.max(1, Math.round(words / 200)) + " min read";
  }, [body]);

  function handleTitleChange(val: string) {
    setTitle(val);
    if (!isEdit) setSlug(slugify(val));
  }

  function handleBodyChange(value: string) {
    setBody(value);
    setBodyFormat("html");
  }

  function handleFocusClose() {
    setFocusOpen(false);
    setEditorEpoch((n) => n + 1);
  }

  function addTag() {
    const val = tagInput.trim();
    if (val && !tags.includes(val)) {
      setTags([...tags, val]);
      setTagInput("");
    }
  }

  function removeTag(i: number) {
    setTags(tags.filter((_, idx) => idx !== i));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");

    const payload = {
      title,
      slug,
      excerpt,
      body,
      bodyFormat,
      category,
      tags,
      readTime: computedReadTime,
      publishedAt: new Date(publishedAt).toISOString(),
      thumbnail: thumbnail || null,
      isVisible,
      sortOrder,
    };

    try {
      const url = isEdit
        ? `/api/admin/blog/${post!.id}`
        : "/api/admin/blog";
      const method = isEdit ? "PATCH" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        throw new Error(await responseError(res, "Failed to save post"));
      }
      showToast(isEdit ? "Blog berhasil diupdate" : "Blog berhasil dibuat");
      router.push("/admin/blog");
      router.refresh();
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to save post");
    } finally {
      setSaving(false);
    }
  }

  function handleCancel() {
    if (confirmDiscard(dirty)) router.back();
  }

  function handleBack() {
    if (confirmDiscard(dirty)) router.push("/admin/blog");
  }

  const dirty = useEditorDirty({
    title,
    slug,
    excerpt,
    body,
    bodyFormat,
    category,
    tags,
    publishedAt,
    thumbnail,
    isVisible,
    sortOrder,
  });
  useUnsavedGuard({ dirty, saving });

  const words = body.replace(/<[^>]*>/g, "").trim().split(/\s+/).filter(Boolean).length;

  const requiredFieldsComplete =
    title.trim().length > 0 &&
    slug.trim().length > 0 &&
    excerpt.trim().length > 0 &&
    category.trim().length > 0 &&
    publishedAt.trim().length > 0;

  const metaChips = (
    <>
      <EditorMetaChip>{category || "Article"}</EditorMetaChip>
      <EditorMetaChip>{computedReadTime}</EditorMetaChip>
      {isEdit && <EditorMetaChip>{formatRelativeTime(post!.updatedAt)}</EditorMetaChip>}
    </>
  );

  const header = (
    <EditorHeader
      eyebrow="Editor // Articles"
      eyebrowNote={isEdit ? `Record ${shortRecordId(post!.id)}` : "New record"}
      title={isEdit ? "Edit Post" : "New Post"}
      description={
        isEdit ? `Update "${post!.title}".` : "Write a new dispatch for your blog."
      }
      meta={metaChips}
      actions={
        <EditorHeaderActions
          backLabel="Back to Articles"
          onBack={handleBack}
          publicHref={isEdit && slug ? `/blog/${slug}` : null}
          publicLabel={isVisible ? "View Article" : "Preview Draft"}
          publicDisabledReason="Save the article before previewing it."
          onPreview={() => setPreviewOpen(true)}
          submitLabel={isEdit ? "Update Post" : "Create Post"}
          saving={saving}
        />
      }
    />
  );

  const rail = (
    <EditorRail>
      <EditorPanel index="01" title="Publishing">
        <div className="space-y-4">
          <EditorToggle
            id="blog-published"
            label="Published"
            badge={isVisible ? "Published" : "Draft"}
            checked={isVisible}
            onChange={setIsVisible}
            description="Visible on the public site. Turn off to keep this record as a draft."
          />
          <EditorField
            id="blog-sort-order"
            label="Sort Order"
            hint="Lower numbers appear first."
          >
            <input
              id="blog-sort-order"
              type="number"
              value={sortOrder}
              onChange={(e) => setSortOrder(Number(e.target.value))}
              className={editorInputClass}
            />
          </EditorField>
        </div>
      </EditorPanel>

      <EditorPanel index="02" title="Public Preview">
        <EditorPreview
          title={title || "Untitled post"}
          description={excerpt}
          image={thumbnail}
          imageAlt={title}
          eyebrow={`${category || "Article"} / ${computedReadTime}`}
          badges={tags.slice(0, 3)}
          path={`/blog/${slug || "your-slug"}`}
          href={isEdit && slug ? `/blog/${slug}` : undefined}
          draft={!isVisible}
          emptyLabel="Add a thumbnail to preview this record."
        />
      </EditorPanel>

      <EditorPanel index="03" title="Record">
        <dl className="space-y-2 font-sans text-[12px]">
          <div className="flex justify-between gap-3">
            <dt className="font-jet text-[9px] font-bold uppercase tracking-[.08em] text-muted">Mode</dt>
            <dd className="text-foreground">{isEdit ? "Edit" : "New"}</dd>
          </div>
          <div className="flex justify-between gap-3">
            <dt className="font-jet text-[9px] font-bold uppercase tracking-[.08em] text-muted">ID</dt>
            <dd className="font-jet text-[11px] text-foreground">
              {isEdit ? shortRecordId(post!.id) : "-"}
            </dd>
          </div>
          <div className="flex justify-between gap-3">
            <dt className="font-jet text-[9px] font-bold uppercase tracking-[.08em] text-muted">Created</dt>
            <dd className="text-foreground">
              {isEdit ? formatDate(post!.createdAt) : "Created when saved"}
            </dd>
          </div>
          <div className="flex justify-between gap-3">
            <dt className="font-jet text-[9px] font-bold uppercase tracking-[.08em] text-muted">Updated</dt>
            <dd className="text-foreground">
              {isEdit ? formatRelativeTime(post!.updatedAt) : "-"}
            </dd>
          </div>
          <div className="flex justify-between gap-3">
            <dt className="font-jet text-[9px] font-bold uppercase tracking-[.08em] text-muted">Read time</dt>
            <dd className="text-foreground">{computedReadTime}</dd>
          </div>
          <div className="flex justify-between gap-3">
            <dt className="font-jet text-[9px] font-bold uppercase tracking-[.08em] text-muted">Words</dt>
            <dd className="text-foreground">{words}</dd>
          </div>
        </dl>
      </EditorPanel>
    </EditorRail>
  );

  return (
    <EditorShell
      section="Articles"
      mode={isEdit ? "edit" : "new"}
      recordId={post?.id}
      onSubmit={handleSubmit}
      error={error}
      dirty={dirty}
      saving={saving}
      submitLabel={isEdit ? "Update Post" : "Create Post"}
      onCancel={handleCancel}
      header={header}
      rail={rail}
    >
      <EditorSection index="01" title="Identity" meta="Required fields">
        <div className="grid gap-5 md:grid-cols-2">
          <EditorField id="blog-title" label="Title" required>
            <input
              id="blog-title"
              value={title}
              onChange={(e) => handleTitleChange(e.target.value)}
              className={editorInputClass}
              required
            />
          </EditorField>
          <EditorField
            id="blog-slug"
            label="Slug"
            required
            hint={`Public path: /blog/${slug || "your-slug"}`}
          >
            <input
              id="blog-slug"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              className={editorMonoInputClass}
              required
            />
          </EditorField>
        </div>
        <EditorField
          id="blog-excerpt"
          label="Excerpt"
          required
          counter={`${excerpt.length} characters`}
        >
          <textarea
            id="blog-excerpt"
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            rows={3}
            className={editorTextareaClass}
            required
          />
        </EditorField>
      </EditorSection>

      <EditorSection index="02" title="Classification & Schedule" meta="Metadata">
        <div className="grid gap-5 md:grid-cols-3">
          <EditorField label="Category" required>
            <EditorSelect
              value={CATEGORIES.includes(category) ? category : "custom"}
              onChange={(e) => {
                const val = e.target.value;
                setCategory(val === "custom" ? "" : val);
              }}
            >
              <option value="" disabled>Select category</option>
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
              <option value="custom">Custom…</option>
            </EditorSelect>
            {!CATEGORIES.includes(category) && (
              <EditorField
                label=""
                required
                className="mt-2"
              >
                <input
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  placeholder="Type custom category"
                  className={editorInputClass}
                  required
                />
              </EditorField>
            )}
          </EditorField>
          <EditorField label="Read Time">
            <div className="h-10 border-2 border-line bg-surface px-3 font-sans text-sm text-foreground/70 flex items-center">
              {computedReadTime}
            </div>
          </EditorField>
          <EditorField label="Published Date" required>
            <input
              type="date"
              value={publishedAt}
              onChange={(e) => setPublishedAt(e.target.value)}
              className={editorInputClass}
              required
            />
          </EditorField>
        </div>

        <EditorField label="Tags">
          <div className="flex gap-2">
            <input
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addTag(); } }}
              placeholder="Type and press Enter"
              className={editorInputClass}
            />
            <button
              type="button"
              onClick={addTag}
              className="inline-flex h-10 shrink-0 items-center border-2 border-line bg-surface px-4 font-jet text-[9px] font-bold uppercase tracking-[.08em] shadow-[2px_2px_0_var(--foreground)] transition-transform hover:-translate-y-0.5 hover:bg-admin-wash"
            >
              Add
            </button>
          </div>
          {tags.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-2">
              {tags.map((tag, i) => (
                <span
                  key={`${tag}-${i}`}
                  className="inline-flex items-center gap-1.5 border border-line bg-surface px-2.5 py-1 font-jet text-[9px] font-bold uppercase tracking-[.06em] text-foreground"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => removeTag(i)}
                    className="text-muted hover:text-admin-alert"
                    aria-label={`Remove ${tag}`}
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          )}
        </EditorField>
      </EditorSection>

      <EditorSection index="03" title="Media" meta="Thumbnail">
        <EditorField label="Thumbnail">
          <ImageUploader
            value={thumbnail}
            onChange={setThumbnail}
            aspect="video"
          />
        </EditorField>
      </EditorSection>

      <EditorSection
        index="04"
        title="Body"
        meta={bodyFormat === "markdown" ? "Markdown (legacy)" : "HTML"}
        actions={
          <button
            type="button"
            onClick={() => setFocusOpen(true)}
            className="inline-flex h-7 items-center gap-1.5 border border-line bg-surface px-2 font-jet text-[8px] font-bold uppercase tracking-[.08em] transition-colors hover:bg-background"
          >
            <Maximize2 size={11} aria-hidden="true" />
            Focus
          </button>
        }
      >
        <EditorField
          label="Body"
          required
          hint={
            bodyMode === "visual"
              ? `Visual editor. Saved as ${bodyFormat.toUpperCase()}. Read time and word count update automatically.`
              : `Raw HTML source. Saved as ${bodyFormat.toUpperCase()}. Public output is sanitized on render.`
          }
        >
          {bodyFormat === "markdown" && (
            <p className="mb-2 border-2 border-line bg-admin-wash px-3 py-2 font-jet text-[8px] font-bold uppercase leading-4 tracking-[.08em] text-muted">
              This record is stored as Markdown. Editing the body will save it
              as HTML.
            </p>
          )}
          <BodyEditor
            content={body}
            onChange={handleBodyChange}
            mode={bodyMode}
            onModeChange={setBodyMode}
            editorKey={editorEpoch}
          />
        </EditorField>
      </EditorSection>

      <FocusEditor
        open={focusOpen}
        onClose={handleFocusClose}
        title={title}
        onTitleChange={handleTitleChange}
        body={body}
        onBodyChange={handleBodyChange}
        mode={bodyMode}
        onModeChange={setBodyMode}
        editorKey={editorEpoch}
        readTime={computedReadTime}
        wordCount={words}
        bodyFormat={bodyFormat}
        isVisible={isVisible}
        saving={saving}
        canSave={requiredFieldsComplete}
        onPreview={() => setPreviewOpen(true)}
        error={error}
      />

      <PreviewArticle
        open={previewOpen}
        onClose={() => setPreviewOpen(false)}
        title={title}
        slug={slug}
        excerpt={excerpt}
        category={category}
        tags={tags}
        thumbnail={thumbnail || null}
        body={body}
        readTime={computedReadTime}
        publishedAt={publishedAt}
        isVisible={isVisible}
        bodyFormat={bodyFormat}
        publicHref={isEdit && slug ? `/blog/${slug}` : null}
        author={previewAuthor}
      />
    </EditorShell>
  );
}