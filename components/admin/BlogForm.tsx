"use client";

import { useRouter } from "next/navigation";
import { useState, useMemo } from "react";
import type { BlogPost } from "@prisma/client";
import slugify from "@/src/lib/slugify";
import dynamic from "next/dynamic";

const LexKitEditor = dynamic(
  () => import("./LexKitEditor").then((m) => m.LexKitEditor),
  { ssr: false }
);

const CATEGORIES = [
  "Sharing Information",
  "Personal",
  "Tutorial",
  "Web Development",
  "Artificial Intelligence",
];

interface Props {
  post?: BlogPost | null;
}

export function BlogForm({ post }: Props) {
  const router = useRouter();
  const isEdit = !!post;

  const [title, setTitle] = useState(post?.title ?? "");
  const [slug, setSlug] = useState(post?.slug ?? "");
  const [excerpt, setExcerpt] = useState(post?.excerpt ?? "");
  const [body, setBody] = useState(post?.body ?? "");
  const [bodyFormat, setBodyFormat] = useState<"html" | "markdown">(
    (post?.bodyFormat as "html" | "markdown") ?? "html"
  );
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

  /* Auto-compute read time from body: ~200 WPM */
  const computedReadTime = useMemo(() => {
    const text = body.replace(/<[^>]*>/g, "");
    const words = text.split(/\s+/).filter(Boolean).length;
    return Math.max(1, Math.round(words / 200)) + " min read";
  }, [body]);

  function handleTitleChange(val: string) {
    setTitle(val);
    if (!isEdit) setSlug(slugify(val));
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
        const err = await res.json();
        throw new Error(err.error ?? "Failed to save post");
      }
      router.push("/admin/blog");
      router.refresh();
    } catch (e: any) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {error && (
        <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
          {error}
        </div>
      )}

      {/* Title & Slug */}
      <div className="grid gap-6 md:grid-cols-2">
        <Field label="Title" required>
          <input
            value={title}
            onChange={(e) => handleTitleChange(e.target.value)}
            className="w-full rounded-lg border border-line bg-transparent px-3 py-2 text-sm text-foreground outline-none transition-colors focus:border-purple"
            required
          />
        </Field>
        <Field label="Slug" required>
          <input
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            className="w-full rounded-lg border border-line bg-transparent px-3 py-2 text-sm text-foreground outline-none transition-colors focus:border-purple font-mono"
            required
          />
        </Field>
      </div>

      {/* Excerpt */}
      <Field label="Excerpt" required>
        <textarea
          value={excerpt}
          onChange={(e) => setExcerpt(e.target.value)}
          rows={3}
          className="w-full rounded-lg border border-line bg-transparent px-3 py-2 text-sm text-foreground outline-none transition-colors focus:border-purple resize-none"
          required
        />
      </Field>

      {/* Category: dropdown + free-text */}
      <div className="grid gap-6 md:grid-cols-3">
        <Field label="Category" required>
          <select
            value={CATEGORIES.includes(category) ? category : "custom"}
            onChange={(e) => {
              const val = e.target.value;
              setCategory(val === "custom" ? "" : val);
            }}
            className="w-full rounded-lg border border-line bg-[#17151c] px-3 py-2 text-sm text-foreground outline-none transition-colors focus:border-purple"
          >
            <option value="" disabled>Select category</option>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
            <option value="custom">Custom…</option>
          </select>
          {!CATEGORIES.includes(category) && (
            <input
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="Type custom category"
              className="mt-2 w-full rounded-lg border border-line bg-transparent px-3 py-2 text-sm text-foreground outline-none transition-colors focus:border-purple"
              required
            />
          )}
        </Field>
        <Field label="Read Time">
          <div className="rounded-lg border border-line bg-surface/30 px-3 py-2 text-sm text-foreground/70">
            {computedReadTime}
          </div>
        </Field>
        <Field label="Published Date" required>
          <input
            type="date"
            value={publishedAt}
            onChange={(e) => setPublishedAt(e.target.value)}
            className="w-full rounded-lg border border-line bg-transparent px-3 py-2 text-sm text-foreground outline-none transition-colors focus:border-purple"
            required
          />
        </Field>
      </div>

      {/* Tags */}
      <Field label="Tags">
        <div className="flex gap-2">
          <input
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addTag(); } }}
            placeholder="Type and press Enter"
            className="flex-1 rounded-lg border border-line bg-transparent px-3 py-2 text-sm text-foreground outline-none transition-colors focus:border-purple"
          />
          <button
            type="button"
            onClick={addTag}
            className="rounded-lg border border-line px-3 text-sm text-muted transition-colors hover:bg-surface hover:text-foreground"
          >
            Add
          </button>
        </div>
        {tags.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-2">
            {tags.map((tag, i) => (
              <span
                key={i}
                className="inline-flex items-center gap-1.5 rounded-md border border-line bg-surface/50 px-2.5 py-1 text-xs text-muted"
              >
                {tag}
                <button
                  type="button"
                  onClick={() => removeTag(i)}
                  className="text-muted hover:text-red-400"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        )}
      </Field>

      {/* Thumbnail */}
      <Field label="Thumbnail URL">
        <div className="flex gap-3">
          <input
            value={thumbnail}
            onChange={(e) => setThumbnail(e.target.value)}
            placeholder="https://..."
            className="flex-1 rounded-lg border border-line bg-transparent px-3 py-2 text-sm text-foreground outline-none transition-colors focus:border-purple"
          />
          {thumbnail && (
            <img
              src={thumbnail}
              alt="preview"
              className="h-10 w-16 flex-shrink-0 rounded border border-line object-cover"
            />
          )}
        </div>
      </Field>

      {/* Body with Rich Editor */}
      <Field label="Body" required>
        <LexKitEditor key={post?.id ?? "new"} content={body} onChange={setBody} />
      </Field>

      {/* Toggles */}
      <div className="flex flex-wrap gap-8">
        <Toggle label="Visible" checked={isVisible} onChange={setIsVisible} />
        <Field label="Sort Order">
          <input
            type="number"
            value={sortOrder}
            onChange={(e) => setSortOrder(Number(e.target.value))}
            className="w-24 rounded-lg border border-line bg-transparent px-3 py-2 text-sm text-foreground outline-none transition-colors focus:border-purple"
          />
        </Field>
      </div>

      {/* Submit */}
      <div className="flex items-center gap-4 border-t border-line pt-6">
        <button
          type="submit"
          disabled={saving}
          className="rounded-lg bg-purple px-6 py-2.5 text-sm font-medium text-[#17151c] transition-opacity hover:opacity-90 disabled:opacity-50"
        >
          {saving ? "Saving…" : isEdit ? "Update Post" : "Create Post"}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="rounded-lg border border-line px-6 py-2.5 text-sm text-muted transition-colors hover:bg-surface hover:text-foreground"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

// ── Helpers ──

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="block space-y-1.5">
      <span className="text-xs font-medium tracking-wider text-muted uppercase">
        {label}
        {required && <span className="ml-1 text-purple">*</span>}
      </span>
      {children}
    </label>
  );
}

function Toggle({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <label className="flex cursor-pointer items-center gap-3">
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative h-5 w-9 rounded-full transition-colors ${
          checked ? "bg-purple" : "bg-line"
        }`}
      >
        <span
          className={`absolute left-0.5 top-0.5 h-4 w-4 rounded-full bg-white transition-transform ${
            checked ? "translate-x-4" : ""
          }`}
        />
      </button>
      <span className="text-sm text-foreground">{label}</span>
    </label>
  );
}
