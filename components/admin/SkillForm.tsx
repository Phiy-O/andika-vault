"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Image from "next/image";
import type { Skill } from "@prisma/client";
import { useToast } from "@/components/ui/Toast";
import { skillCategories } from "@/src/types";

interface Props {
  skill?: Skill | null;
}

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
        const err = await res.json();
        throw new Error(err.error ?? "Failed to save skill");
      }
      showToast(isEdit ? "Skill berhasil diupdate" : "Skill berhasil dibuat");
      router.push("/admin/skills");
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

      <div className="grid gap-6 md:grid-cols-2">
        <Field label="Name" required>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. JavaScript"
            className="w-full rounded-lg border border-line bg-transparent px-3 py-2 text-sm text-foreground outline-none transition-colors focus:border-purple"
            required
          />
        </Field>
        <Field label="Category" required>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full rounded-lg border border-line bg-transparent px-3 py-2 text-sm text-foreground outline-none transition-colors focus:border-purple"
          >
            {skillCategories.map((c) => (
              <option key={c.value} value={c.value} className="bg-[#1a1821]">
                {c.label}
              </option>
            ))}
          </select>
        </Field>
      </div>

      <Field label="Icon" required>
        <div className="grid grid-cols-4 gap-2 sm:grid-cols-7">
          {ICON_OPTIONS.map((key) => (
            <button
              key={key}
              type="button"
              onClick={() => selectIcon(key)}
              className={`flex h-14 items-center justify-center rounded-lg border transition-all duration-200 ${
                iconKey === key
                  ? "border-purple bg-purple/10"
                  : "border-line hover:border-foreground hover:bg-surface"
              }`}
              title={key}
            >
              <Image
                src={`/icons/skills/${key}.svg`}
                alt=""
                width={26}
                height={26}
                className="h-6.5 w-6.5"
              />
            </button>
          ))}
        </div>
        {iconSrc && (
          <div className="mt-3 flex items-center gap-2 text-xs text-muted">
            <Image
              src={iconSrc}
              alt=""
              width={18}
              height={18}
              className="h-4.5 w-4.5"
            />
            <code className="text-muted">{iconSrc}</code>
          </div>
        )}
      </Field>

      <div className="grid gap-6 md:grid-cols-2">
        <Field label="Sort Order">
          <input
            type="number"
            value={sortOrder}
            onChange={(e) => setSortOrder(Number(e.target.value))}
            className="w-full rounded-lg border border-line bg-transparent px-3 py-2 text-sm text-foreground outline-none transition-colors focus:border-purple"
          />
        </Field>
      </div>

      <div className="flex flex-wrap gap-8">
        <Toggle label="Visible" checked={isVisible} onChange={setIsVisible} />
      </div>

      <div className="flex items-center gap-4 border-t border-line pt-6">
        <button
          type="submit"
          disabled={saving}
          className="rounded-lg bg-purple px-6 py-2.5 text-sm font-medium text-[#17151c] transition-opacity hover:opacity-90 disabled:opacity-50"
        >
          {saving ? "Saving…" : isEdit ? "Update Skill" : "Create Skill"}
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
