"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Image from "next/image";
import { X } from "lucide-react";
import type { Project } from "@prisma/client";
import slugify from "@/src/lib/slugify";
import { useToast } from "@/components/ui/Toast";
import { ImageUploader } from "./ImageUploader";

interface Props {
  project?: Project | null;
}

export function ProjectForm({ project }: Props) {
  const router = useRouter();
  const isEdit = !!project;
  const showToast = useToast();

  const [title, setTitle] = useState(project?.title ?? "");
  const [slug, setSlug] = useState(project?.slug ?? "");
  const [description, setDescription] = useState(project?.description ?? "");
  const [body, setBody] = useState(project?.body ?? "");
  const [bodyFormat, setBodyFormat] = useState<"html" | "markdown">(
    (project?.bodyFormat as "html" | "markdown") ?? "html"
  );
  const [thumbnail, setThumbnail] = useState(project?.thumbnail ?? "");
  const [screenshots, setScreenshots] = useState<string[]>(
    project?.screenshots ?? []
  );
  const [techStack, setTechStack] = useState<string[]>(
    project?.techStack ?? []
  );
  const [techInput, setTechInput] = useState("");
  const [githubUrl, setGithubUrl] = useState(project?.githubUrl ?? "");
  const [liveUrl, setLiveUrl] = useState(project?.liveUrl ?? "");
  const [category, setCategory] = useState(project?.category ?? "product");
  const [featured, setFeatured] = useState(project?.featured ?? false);
  const [isVisible, setIsVisible] = useState(project?.isVisible ?? true);
  const [sortOrder, setSortOrder] = useState(project?.sortOrder ?? 0);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  function handleTitleChange(val: string) {
    setTitle(val);
    if (!isEdit) setSlug(slugify(val));
  }

  function addTag(list: string[], setter: (v: string[]) => void, input: string, setInput: (v: string) => void) {
    const val = input.trim();
    if (val && !list.includes(val)) {
      setter([...list, val]);
      setInput("");
    }
  }

  function removeTag(list: string[], setter: (v: string[]) => void, index: number) {
    setter(list.filter((_, i) => i !== index));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");

    const bodyData = {
      title,
      slug,
      description,
      body,
      bodyFormat,
      thumbnail: thumbnail || null,
      screenshots,
      techStack,
      githubUrl: githubUrl || null,
      liveUrl: liveUrl || null,
      category,
      featured,
      isVisible,
      sortOrder,
    };

    try {
      const url = isEdit
        ? `/api/admin/projects/${project!.id}`
        : "/api/admin/projects";
      const method = isEdit ? "PATCH" : "POST";
      const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(bodyData) });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error ?? "Failed to save project");
      }
      showToast(isEdit ? "Project berhasil diupdate" : "Project berhasil dibuat");
      router.push("/admin/projects");
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

      {/* Description */}
      <Field label="Description" required>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          className="w-full rounded-lg border border-line bg-transparent px-3 py-2 text-sm text-foreground outline-none transition-colors focus:border-purple resize-none"
          required
        />
      </Field>

      {/* Category & Body Format */}
      <div className="grid gap-6 md:grid-cols-2">
        <Field label="Category" required>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full rounded-lg border border-line bg-[#17151c] px-3 py-2 text-sm text-foreground outline-none transition-colors focus:border-purple"
          >
            <option value="product">Product</option>
            <option value="tool">Tool</option>
          </select>
        </Field>
        <Field label="Body Format">
          <select
            value={bodyFormat}
            onChange={(e) => setBodyFormat(e.target.value as "html" | "markdown")}
            className="w-full rounded-lg border border-line bg-[#17151c] px-3 py-2 text-sm text-foreground outline-none transition-colors focus:border-purple"
          >
            <option value="html">HTML</option>
            <option value="markdown">Markdown</option>
          </select>
        </Field>
      </div>

      {/* Thumbnail */}
      <Field label="Thumbnail">
        <ImageUploader value={thumbnail} onChange={setThumbnail} />
      </Field>

      {/* Body */}
      <Field label="Body" required>
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          rows={14}
          className="w-full rounded-lg border border-line bg-transparent px-3 py-2 text-sm text-foreground outline-none transition-colors focus:border-purple font-mono resize-y"
          required
        />
      </Field>

      {/* Tech Stack */}
      <TagField
        label="Tech Stack"
        items={techStack}
        input={techInput}
        onInputChange={setTechInput}
        onAdd={() => addTag(techStack, setTechStack, techInput, setTechInput)}
        onRemove={(i) => removeTag(techStack, setTechStack, i)}
      />

      {/* Screenshots */}
      <Field label="Screenshots">
        <div className="space-y-3">
          {screenshots.map((url, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="relative h-16 w-24 overflow-hidden rounded-lg border border-line">
                <Image
                  src={url}
                  alt={`screenshot ${i + 1}`}
                  fill
                  sizes="96px"
                  unoptimized
                  className="object-cover"
                />
              </div>
              <button
                type="button"
                onClick={() => removeTag(screenshots, setScreenshots, i)}
                className="rounded p-1.5 text-muted transition-colors hover:bg-surface hover:text-red-400"
                title="Remove screenshot"
              >
                <X size={16} />
              </button>
            </div>
          ))}
          <ImageUploader
            value=""
            onChange={(url) => setScreenshots([...screenshots, url])}
            label="Add screenshot"
          />
        </div>
      </Field>

      {/* GitHub & Live URLs */}
      <div className="grid gap-6 md:grid-cols-2">
        <Field label="GitHub URL">
          <input
            value={githubUrl}
            onChange={(e) => setGithubUrl(e.target.value)}
            placeholder="https://github.com/..."
            className="w-full rounded-lg border border-line bg-transparent px-3 py-2 text-sm text-foreground outline-none transition-colors focus:border-purple"
          />
        </Field>
        <Field label="Live URL">
          <input
            value={liveUrl}
            onChange={(e) => setLiveUrl(e.target.value)}
            placeholder="https://..."
            className="w-full rounded-lg border border-line bg-transparent px-3 py-2 text-sm text-foreground outline-none transition-colors focus:border-purple"
          />
        </Field>
      </div>

      {/* Toggles */}
      <div className="flex flex-wrap gap-8">
        <Toggle label="Featured" checked={featured} onChange={setFeatured} />
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
          {saving ? "Saving…" : isEdit ? "Update Project" : "Create Project"}
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

function TagField({
  label,
  items,
  input,
  onInputChange,
  onAdd,
  onRemove,
  url,
}: {
  label: string;
  items: string[];
  input: string;
  onInputChange: (v: string) => void;
  onAdd: () => void;
  onRemove: (i: number) => void;
  url?: boolean;
}) {
  return (
    <Field label={label}>
      <div className="flex gap-2">
        <input
          value={input}
          onChange={(e) => onInputChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              onAdd();
            }
          }}
          placeholder={url ? "https://..." : "Type and press Enter"}
          className="flex-1 rounded-lg border border-line bg-transparent px-3 py-2 text-sm text-foreground outline-none transition-colors focus:border-purple"
        />
        <button
          type="button"
          onClick={onAdd}
          className="rounded-lg border border-line px-3 text-sm text-muted transition-colors hover:bg-surface hover:text-foreground"
        >
          Add
        </button>
      </div>
      {items.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-2">
          {items.map((item, i) => (
            <span
              key={i}
              className="inline-flex items-center gap-1.5 rounded-md border border-line bg-surface/50 px-2.5 py-1 text-xs text-muted"
            >
              {url ? (
                <span className="max-w-[200px] truncate">{item}</span>
              ) : (
                item
              )}
              <button
                type="button"
                onClick={() => onRemove(i)}
                className="text-muted hover:text-red-400"
              >
                ×
              </button>
            </span>
          ))}
        </div>
      )}
    </Field>
  );
}
