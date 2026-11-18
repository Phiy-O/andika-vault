"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Image from "next/image";
import { Check } from "lucide-react";
import type { Skill } from "@prisma/client";
import { useToast } from "@/components/ui/Toast";
import { skillCategories } from "@/src/types";
import { EditorShell } from "@/components/admin/editor/EditorShell";
import { EditorHeader } from "@/components/admin/editor/EditorHeader";
import { EditorHeaderActions, EditorMetaChip } from "@/components/admin/editor/EditorHeader";
import { EditorSection } from "@/components/admin/editor/EditorSection";
import { EditorRail, EditorPanel } from "@/components/admin/editor/EditorRail";
import { EditorPreview } from "@/components/admin/editor/EditorPreview";
import { EditorField, EditorSelect, editorInputClass } from "@/components/admin/editor/EditorField";
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
  formatCategory,
} from "@/components/admin/workspace/utils";

const ICON_OPTIONS = [
  "javascript",
  "typescript",
  "react",
  "nextjs",
  "tailwindcss",
  "sass",
  "nodejs",
  "express",
  "postgresql",
  "mongodb",
  "figma",
  "cypress",
  "storybook",
  "git",
];

interface Props {
  skill?: Skill | null;
}

export function SkillForm({ skill }: Props) {
  const router = useRouter();
  const isEdit = !!skill;
  const showToast = useToast();

  const [name, setName] = useState(skill?.name ?? "");
  const [iconKey, setIconKey] = useState(
    skill?.iconSrc?.replace("/icons/skills/", "").replace(".svg", "") ?? ""
  );
  const [iconSrc, setIconSrc] = useState(skill?.iconSrc ?? "");
  const [category, setCategory] = useState(skill?.category ?? "frontend");
  const [sortOrder, setSortOrder] = useState(skill?.sortOrder ?? 0);
  const [isVisible, setIsVisible] = useState(skill?.isVisible ?? true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  function selectIcon(key: string) {
    setIconKey(key);
    setIconSrc(`/icons/skills/${key}.svg`);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");

    const body = {
      name,
      iconSrc,
      category,
      sortOrder,
      isVisible,
    };

    try {
      const url = isEdit
        ? `/api/admin/skills/${skill!.id}`
        : "/api/admin/skills";
      const method = isEdit ? "PATCH" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        throw new Error(await responseError(res, "Failed to save skill"));
      }
      showToast(isEdit ? "Skill berhasil diupdate" : "Skill berhasil dibuat");
      router.push("/admin/skills");
      router.refresh();
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to save skill");
    } finally {
      setSaving(false);
    }
  }

  function handleCancel() {
    if (confirmDiscard(dirty)) router.back();
  }

  function handleBack() {
    if (confirmDiscard(dirty)) router.push("/admin/skills");
  }

  const dirty = useEditorDirty({
    name,
    iconSrc,
    category,
    sortOrder,
    isVisible,
  });
  useUnsavedGuard({ dirty, saving });

  const metaChips = (
    <>
      <EditorMetaChip>{formatCategory(category)}</EditorMetaChip>
      {isEdit && <EditorMetaChip>{formatRelativeTime(skill!.updatedAt)}</EditorMetaChip>}
    </>
  );

  const header = (
    <EditorHeader
      eyebrow="Editor // Skills"
      eyebrowNote={isEdit ? `Record ${shortRecordId(skill!.id)}` : "New record"}
      title={isEdit ? "Edit Skill" : "New Skill"}
      description={
        isEdit ? `Update "${skill!.name}".` : "Add a tool to the studio stack."
      }
      meta={metaChips}
      actions={
        <EditorHeaderActions
          backLabel="Back to Skills"
          onBack={handleBack}
          publicHref={isEdit ? "/about" : null}
          publicLabel="View About Page"
          publicDisabledReason="Save the skill before viewing the About page."
          submitLabel={isEdit ? "Update Skill" : "Create Skill"}
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
            id="skill-published"
            label="Published"
            badge={isVisible ? "Published" : "Draft"}
            checked={isVisible}
            onChange={setIsVisible}
            description="Visible on the public site. Turn off to keep this record as a draft."
          />
          <EditorField
            id="skill-sort-order"
            label="Sort Order"
            hint="Lower numbers appear first."
          >
            <input
              id="skill-sort-order"
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
          title={name || "Unnamed skill"}
          image={null}
          iconSrc={iconSrc || null}
          imageAlt={name}
          eyebrow={formatCategory(category)}
          badges={[]}
          path="/about"
          href={isEdit && isVisible ? "/about" : undefined}
          draft={!isVisible}
          emptyLabel="Select an icon to preview this skill."
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
              {isEdit ? shortRecordId(skill!.id) : "-"}
            </dd>
          </div>
          <div className="flex justify-between gap-3">
            <dt className="font-jet text-[9px] font-bold uppercase tracking-[.08em] text-muted">Created</dt>
            <dd className="text-foreground">
              {isEdit ? formatDate(skill!.createdAt) : "Created when saved"}
            </dd>
          </div>
          <div className="flex justify-between gap-3">
            <dt className="font-jet text-[9px] font-bold uppercase tracking-[.08em] text-muted">Updated</dt>
            <dd className="text-foreground">
              {isEdit ? formatRelativeTime(skill!.updatedAt) : "-"}
            </dd>
          </div>
        </dl>
      </EditorPanel>
    </EditorRail>
  );

  return (
    <EditorShell
      section="Skills"
      mode={isEdit ? "edit" : "new"}
      recordId={skill?.id}
      onSubmit={handleSubmit}
      error={error}
      dirty={dirty}
      saving={saving}
      submitLabel={isEdit ? "Update Skill" : "Create Skill"}
      onCancel={handleCancel}
      header={header}
      rail={rail}
    >
      <EditorSection index="01" title="Identity" meta="Required fields">
        <div className="grid gap-5 md:grid-cols-2">
          <EditorField id="skill-name" label="Name" required>
            <input
              id="skill-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. JavaScript"
              className={editorInputClass}
              required
            />
          </EditorField>
          <EditorField label="Category" required>
            <EditorSelect
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              {skillCategories.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.label}
                </option>
              ))}
            </EditorSelect>
          </EditorField>
        </div>
      </EditorSection>

      <EditorSection index="02" title="Icon" meta="Select an icon">
        <EditorField label="Icon" required>
          <div className="grid grid-cols-4 gap-2 sm:grid-cols-7">
            {ICON_OPTIONS.map((key) => (
              <button
                key={key}
                type="button"
                onClick={() => selectIcon(key)}
                aria-pressed={iconKey === key}
                aria-label={`Use ${key} icon`}
                className={`flex h-14 items-center justify-center border-2 transition-colors ${
                  iconKey === key
                    ? "border-line bg-purple shadow-[2px_2px_0_var(--foreground)]"
                    : "border-line bg-background hover:bg-admin-wash"
                }`}
                title={key}
              >
                <Image
                  src={`/icons/skills/${key}.svg`}
                  alt=""
                  width={26}
                  height={26}
                  className="h-6.5 w-6.5"
                  unoptimized
                />
                {iconKey === key && (
                  <span className="absolute top-1 right-1 grid size-5 place-items-center bg-foreground text-background rounded-full">
                    <Check size={10} aria-hidden="true" />
                  </span>
                )}
              </button>
            ))}
          </div>
          {iconSrc ? (
            <div className="mt-3 flex items-center gap-2 font-jet text-[10px] text-muted">
              <Image
                src={iconSrc}
                alt=""
                width={18}
                height={18}
                className="h-4.5 w-4.5"
                unoptimized
              />
              <code className="break-all">{iconSrc}</code>
            </div>
          ) : (
            <p className="mt-2 font-jet text-[9px] uppercase tracking-[.08em] text-muted">
              Select an icon for this skill.
            </p>
          )}
        </EditorField>
      </EditorSection>
    </EditorShell>
  );
}