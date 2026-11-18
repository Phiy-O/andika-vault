"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Image from "next/image";
import { GripVertical, X, ArrowUp, ArrowDown } from "lucide-react";
import type { Project } from "@prisma/client";
import slugify from "@/src/lib/slugify";
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
  formatCategory,
  shortRecordId,
} from "@/components/admin/workspace/utils";

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
  const [draggedScreenshotIndex, setDraggedScreenshotIndex] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const dirty = useEditorDirty({
    title,
    slug,
    description,
    body,
    bodyFormat,
    thumbnail,
    screenshots,
    techStack,
    githubUrl,
    liveUrl,
    category,
    featured,
    isVisible,
    sortOrder,
  });
  useUnsavedGuard({ dirty, saving });

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

  function moveScreenshot(from: number, to: number) {
    if (to < 0 || to >= screenshots.length) return;
    const next = [...screenshots];
    const [moved] = next.splice(from, 1);
    next.splice(to, 0, moved);
    setScreenshots(next);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!thumbnail) {
      setError("Thumbnail wajib diisi untuk cover project");
      return;
    }

    if (screenshots.length > 10) {
      setError("Maksimal 10 screenshot yang diperbolehkan");
      return;
    }

    setSaving(true);

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
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bodyData),
      });
      if (!res.ok) {
        throw new Error(await responseError(res, "Failed to save project"));
      }
      showToast(isEdit ? "Project berhasil diupdate" : "Project berhasil dibuat");
      router.push("/admin/projects");
      router.refresh();
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to save project");
    } finally {
      setSaving(false);
    }
  }

  function handleCancel() {
    if (confirmDiscard(dirty)) router.back();
  }

  function handleBack() {
    if (confirmDiscard(dirty)) router.push("/admin/projects");
  }

  const words = body.trim().split(/\s+/).filter(Boolean).length;

  const metaChips = (
    <>
      <EditorMetaChip>{`/projects/${slug || "your-slug"}`}</EditorMetaChip>
      {isEdit && (
        <EditorMetaChip>{formatRelativeTime(project!.updatedAt)}</EditorMetaChip>
      )}
      <EditorMetaChip>{formatCategory(category)}</EditorMetaChip>
    </>
  );

  const header = (
    <EditorHeader
      eyebrow="Editor // Projects"
      eyebrowNote={isEdit ? `Record ${shortRecordId(project!.id)}` : "New record"}
      title={isEdit ? "Edit Project" : "New Project"}
      description={
        isEdit ? `Update "${project!.title}".` : "Create a case study for your portfolio."
      }
      meta={metaChips}
      actions={
        <EditorHeaderActions
          backLabel="Back to Projects"
          onBack={handleBack}
          publicHref={isEdit && slug ? `/projects/${slug}` : null}
          publicLabel={isVisible ? "View Project" : "Preview Draft"}
          publicDisabledReason="Save the project before previewing it."
          submitLabel={isEdit ? "Update Project" : "Create Project"}
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
            id="project-published"
            label="Published"
            badge={isVisible ? "Published" : "Draft"}
            checked={isVisible}
            onChange={setIsVisible}
            description="Visible on the public site. Turn off to keep this record as a draft."
          />
          <EditorToggle
            id="project-featured"
            label="Featured"
            checked={featured}
            onChange={setFeatured}
          />
          <EditorField
            id="project-sort-order"
            label="Sort Order"
            hint="Lower numbers appear first."
          >
            <input
              id="project-sort-order"
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
          title={title || "Untitled project"}
          description={description}
          image={thumbnail || screenshots[0] || null}
          imageAlt={title}
          eyebrow={featured ? "Featured project" : "Project"}
          badges={[formatCategory(category), ...techStack.slice(0, 3)]}
          path={`/projects/${slug || "your-slug"}`}
          href={isEdit && slug ? `/projects/${slug}` : undefined}
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
              {isEdit ? shortRecordId(project!.id) : "-"}
            </dd>
          </div>
          <div className="flex justify-between gap-3">
            <dt className="font-jet text-[9px] font-bold uppercase tracking-[.08em] text-muted">Created</dt>
            <dd className="text-foreground">
              {isEdit ? formatDate(project!.createdAt) : "Created when saved"}
            </dd>
          </div>
          <div className="flex justify-between gap-3">
            <dt className="font-jet text-[9px] font-bold uppercase tracking-[.08em] text-muted">Updated</dt>
            <dd className="text-foreground">
              {isEdit ? formatRelativeTime(project!.updatedAt) : "-"}
            </dd>
          </div>
          <div className="flex justify-between gap-3">
            <dt className="font-jet text-[9px] font-bold uppercase tracking-[.08em] text-muted">Screenshots</dt>
            <dd className="text-foreground">{screenshots.length}/10</dd>
          </div>
        </dl>
      </EditorPanel>
    </EditorRail>
  );

  return (
    <EditorShell
      section="Projects"
      mode={isEdit ? "edit" : "new"}
      recordId={project?.id}
      onSubmit={handleSubmit}
      error={error}
      dirty={dirty}
      saving={saving}
      submitLabel={isEdit ? "Update Project" : "Create Project"}
      onCancel={handleCancel}
      header={header}
      rail={rail}
    >
      <EditorSection index="01" title="Identity" meta="Required fields">
        <div className="grid gap-5 md:grid-cols-2">
          <EditorField id="project-title" label="Title" required>
            <input
              id="project-title"
              value={title}
              onChange={(e) => handleTitleChange(e.target.value)}
              className={editorInputClass}
              required
            />
          </EditorField>
          <EditorField
            id="project-slug"
            label="Slug"
            required
            hint={`Public path: /projects/${slug || "your-slug"}`}
          >
            <input
              id="project-slug"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              className={editorMonoInputClass}
              required
            />
          </EditorField>
        </div>
        <EditorField
          id="project-description"
          label="Description"
          required
          counter={`${description.length} characters`}
        >
          <textarea
            id="project-description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            className={editorTextareaClass}
            required
          />
        </EditorField>
      </EditorSection>

      <EditorSection index="02" title="Classification" meta="Metadata">
        <div className="grid gap-5 md:grid-cols-2">
          <EditorField label="Category" required>
            <EditorSelect
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="product">Product</option>
              <option value="tool">Tool</option>
            </EditorSelect>
          </EditorField>
          <EditorField label="Body Format">
            <EditorSelect
              value={bodyFormat}
              onChange={(e) =>
                setBodyFormat(e.target.value as "html" | "markdown")
              }
            >
              <option value="html">HTML</option>
              <option value="markdown">Markdown</option>
            </EditorSelect>
          </EditorField>
        </div>

        <EditorField label="Tech Stack">
          <div className="flex gap-2">
            <input
              value={techInput}
              onChange={(e) => setTechInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addTag(techStack, setTechStack, techInput, setTechInput);
                }
              }}
              placeholder="Type and press Enter"
              className={editorInputClass}
            />
            <button
              type="button"
              onClick={() =>
                addTag(techStack, setTechStack, techInput, setTechInput)
              }
              className="inline-flex h-10 shrink-0 items-center border-2 border-line bg-surface px-4 font-jet text-[9px] font-bold uppercase tracking-[.08em] shadow-[2px_2px_0_var(--foreground)] transition-transform hover:-translate-y-0.5 hover:bg-admin-wash"
            >
              Add
            </button>
          </div>
          {techStack.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-2">
              {techStack.map((item, i) => (
                <span
                  key={`${item}-${i}`}
                  className="inline-flex items-center gap-1.5 border border-line bg-surface px-2.5 py-1 font-jet text-[9px] font-bold uppercase tracking-[.06em] text-foreground"
                >
                  {item}
                  <button
                    type="button"
                    onClick={() => removeTag(techStack, setTechStack, i)}
                    className="text-muted hover:text-admin-alert"
                    aria-label={`Remove ${item}`}
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          )}
        </EditorField>
      </EditorSection>

      <EditorSection index="03" title="Media & Assets" meta={`${screenshots.length}/10 screenshots`}>
        <EditorField
          label="Thumbnail"
          required
          hint="Required for the project cover."
        >
          <ImageUploader
            value={thumbnail}
            onChange={setThumbnail}
            aspect="video"
          />
        </EditorField>

        <EditorField label={`Screenshots (${screenshots.length}/10)`}>
          <div className="space-y-2">
            {screenshots.map((url, i) => (
              <div
                key={`${url}-${i}`}
                draggable
                onDragStart={() => setDraggedScreenshotIndex(i)}
                onDragOver={(e) => e.preventDefault()}
                onDrop={() => {
                  if (draggedScreenshotIndex !== null && draggedScreenshotIndex !== i) {
                    moveScreenshot(draggedScreenshotIndex, i);
                  }
                  setDraggedScreenshotIndex(null);
                }}
                onDragEnd={() => setDraggedScreenshotIndex(null)}
                className="flex items-center gap-3 border-2 border-line bg-background p-2"
              >
                <span className="grid size-6 shrink-0 place-items-center bg-foreground font-jet text-[9px] font-bold text-background">
                  {i + 1}
                </span>
                <span
                  className="flex shrink-0 cursor-grab items-center text-muted"
                  aria-hidden="true"
                >
                  <GripVertical size={14} />
                </span>
                <div className="relative h-16 w-24 shrink-0 overflow-hidden border border-line">
                  <Image
                    src={url}
                    alt={`screenshot ${i + 1}`}
                    fill
                    sizes="96px"
                    unoptimized
                    className="object-cover"
                  />
                </div>
                <div className="ml-auto flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => moveScreenshot(i, i - 1)}
                    disabled={i === 0}
                    aria-label={`Move screenshot ${i + 1} up`}
                    title="Move up"
                    className="grid size-11 place-items-center border-2 border-line bg-surface text-foreground transition-colors hover:bg-admin-wash disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <ArrowUp size={14} aria-hidden="true" />
                  </button>
                  <button
                    type="button"
                    onClick={() => moveScreenshot(i, i + 1)}
                    disabled={i === screenshots.length - 1}
                    aria-label={`Move screenshot ${i + 1} down`}
                    title="Move down"
                    className="grid size-11 place-items-center border-2 border-line bg-surface text-foreground transition-colors hover:bg-admin-wash disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <ArrowDown size={14} aria-hidden="true" />
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (window.confirm(`Hapus screenshot ${i + 1}?`)) {
                        removeTag(screenshots, setScreenshots, i);
                      }
                    }}
                    aria-label={`Remove screenshot ${i + 1}`}
                    title="Remove screenshot"
                    className="grid size-11 place-items-center border-2 border-admin-alert bg-surface text-admin-alert transition-colors hover:bg-[#f9e8e6]"
                  >
                    <X size={14} aria-hidden="true" />
                  </button>
                </div>
              </div>
            ))}
            {screenshots.length < 10 && (
              <ImageUploader
                value=""
                onChange={(url) => setScreenshots([...screenshots, url])}
                label="Add screenshot"
              />
            )}
            <p className="font-jet text-[8px] uppercase tracking-[.08em] text-muted">
              Maksimal 10 screenshot, URL maksimal 2048 karakter.
            </p>
          </div>
        </EditorField>
      </EditorSection>

      <EditorSection index="04" title="External Links" meta="Optional">
        <div className="grid gap-5 md:grid-cols-2">
          <EditorField label="GitHub URL">
            <input
              value={githubUrl}
              onChange={(e) => setGithubUrl(e.target.value)}
              placeholder="https://github.com/..."
              className={editorMonoInputClass}
            />
          </EditorField>
          <EditorField label="Live URL">
            <input
              value={liveUrl}
              onChange={(e) => setLiveUrl(e.target.value)}
              placeholder="https://..."
              className={editorMonoInputClass}
            />
          </EditorField>
        </div>
      </EditorSection>

      <EditorSection index="05" title="Body" meta={`${words} words`}>
        <EditorField
          id="project-body"
          label="Body"
          required
          hint={`Format: ${bodyFormat.toUpperCase()}`}
        >
          <textarea
            id="project-body"
            value={body}
            onChange={(e) => setBody(e.target.value)}
            rows={16}
            className={`${editorTextareaClass} font-jet text-[12px] tracking-[.02em]`}
            required
          />
        </EditorField>
      </EditorSection>
    </EditorShell>
  );
}
