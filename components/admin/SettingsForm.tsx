"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { updateSiteSettings } from "@/src/actions/site-setting";
import type { SiteSettings } from "@/src/lib/validations/site-settings";
import { useToast } from "@/components/ui/Toast";

interface Props {
  settings: SiteSettings;
}

const inputClass =
  "w-full rounded-lg border border-line bg-transparent px-4 py-2.5 text-sm text-foreground outline-none transition-all duration-200 placeholder:text-muted/50 focus:border-purple focus:shadow-[0_0_8px_rgba(169,139,255,.15)] cursor-text";

export function SettingsForm({ settings }: Props) {
  const router = useRouter();
  const showToast = useToast();
  const [form, setForm] = useState<SiteSettings>(settings);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  function set<K extends keyof SiteSettings>(key: K, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");

    const res = await updateSiteSettings(form);
    if (res.error) {
      setError(res.error);
      setSaving(false);
      return;
    }

    showToast("Pengaturan berhasil disimpan");
    router.refresh();
    setSaving(false);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {error && (
        <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
          {error}
        </div>
      )}

      {/* Sosial & Kontak */}
      <SectionCard
        title="Sosial & Kontak"
        description="Email dan link sosial yang tampil di footer serta halaman kontak."
      >
        <Field label="Email">
          <input
            type="email"
            className={inputClass}
            value={form.email}
            onChange={(e) => set("email", e.target.value)}
          />
        </Field>
        <Field label="LinkedIn URL">
          <input
            type="url"
            className={inputClass}
            value={form.linkedinUrl}
            onChange={(e) => set("linkedinUrl", e.target.value)}
          />
        </Field>
        <Field label="GitHub URL">
          <input
            type="url"
            className={inputClass}
            value={form.githubUrl}
            onChange={(e) => set("githubUrl", e.target.value)}
          />
        </Field>
        <Field label="Instagram URL">
          <input
            type="url"
            className={inputClass}
            value={form.instagramUrl}
            onChange={(e) => set("instagramUrl", e.target.value)}
          />
        </Field>
      </SectionCard>

      {/* SEO */}
      <SectionCard
        title="SEO"
        description="Judul situs dan deskripsi meta yang dipakai di browser serta hasil pencarian."
      >
        <Field label="Site Title">
          <input
            type="text"
            className={inputClass}
            value={form.siteTitle}
            onChange={(e) => set("siteTitle", e.target.value)}
          />
        </Field>
        <Field label="Meta Description">
          <textarea
            rows={3}
            className={`${inputClass} resize-y`}
            value={form.metaDescription}
            onChange={(e) => set("metaDescription", e.target.value)}
          />
        </Field>
      </SectionCard>

      {/* Resume */}
      <SectionCard
        title="Resume / CV"
        description="Path file PDF resume (ditaruh di folder public)."
      >
        <Field label="Resume URL">
          <input
            type="text"
            className={inputClass}
            value={form.resumeUrl}
            onChange={(e) => set("resumeUrl", e.target.value)}
          />
        </Field>
      </SectionCard>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={saving}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-purple px-5 py-2.5 text-sm font-medium text-[#17151c] transition-opacity hover:opacity-90 disabled:opacity-50"
        >
          {saving ? "Menyimpan..." : "Simpan Pengaturan"}
        </button>
      </div>
    </form>
  );
}

function SectionCard({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-xl border border-line bg-surface/40 p-6">
      <h2 className="text-lg font-medium tracking-[-.02em] text-foreground">
        {title}
      </h2>
      <p className="mt-1 mb-6 text-sm text-muted">{description}</p>
      <div className="grid gap-5 md:grid-cols-2">{children}</div>
    </section>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[13px] uppercase tracking-[.06em] text-foreground">
        {label}
      </label>
      {children}
    </div>
  );
}
