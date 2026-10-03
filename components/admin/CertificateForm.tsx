"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { Certificate } from "@prisma/client";
import { useToast } from "@/components/ui/Toast";
import { ImageUploader } from "./ImageUploader";

interface Props {
  certificate?: Certificate | null;
}

export function CertificateForm({ certificate }: Props) {
  const router = useRouter();
  const isEdit = !!certificate;
  const showToast = useToast();

  const [title, setTitle] = useState(certificate?.title ?? "");
  const [issuer, setIssuer] = useState(certificate?.issuer ?? "");
  const [issueDate, setIssueDate] = useState(
    certificate
      ? new Date(certificate.issueDate).toISOString().slice(0, 10)
      : ""
  );
  const [credentialUrl, setCredentialUrl] = useState(
    certificate?.credentialUrl ?? ""
  );
  const [image, setImage] = useState(certificate?.image ?? "");
  const [description, setDescription] = useState(
    certificate?.description ?? ""
  );
  const [isVisible, setIsVisible] = useState(certificate?.isVisible ?? true);
  const [sortOrder, setSortOrder] = useState(certificate?.sortOrder ?? 0);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");

    const body = {
      title,
      issuer,
      issueDate: new Date(issueDate).toISOString(),
      credentialUrl: credentialUrl || null,
      image: image || null,
      description,
      isVisible,
      sortOrder,
    };

    try {
      const url = isEdit
        ? `/api/admin/certificates/${certificate!.id}`
        : "/api/admin/certificates";
      const method = isEdit ? "PATCH" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error ?? "Failed to save certificate");
      }
      showToast(isEdit ? "Sertifikat berhasil diupdate" : "Sertifikat berhasil dibuat");
      router.push("/admin/certificates");
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
        <Field label="Title" required>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full rounded-lg border border-line bg-transparent px-3 py-2 text-sm text-foreground outline-none transition-colors focus:border-purple"
            required
          />
        </Field>
        <Field label="Issuer" required>
          <input
            value={issuer}
            onChange={(e) => setIssuer(e.target.value)}
            className="w-full rounded-lg border border-line bg-transparent px-3 py-2 text-sm text-foreground outline-none transition-colors focus:border-purple"
            required
          />
        </Field>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Field label="Issue Date" required>
          <input
            type="date"
            value={issueDate}
            onChange={(e) => setIssueDate(e.target.value)}
            className="w-full rounded-lg border border-line bg-transparent px-3 py-2 text-sm text-foreground outline-none transition-colors focus:border-purple"
            required
          />
        </Field>
        <Field label="Sort Order">
          <input
            type="number"
            value={sortOrder}
            onChange={(e) => setSortOrder(Number(e.target.value))}
            className="w-full rounded-lg border border-line bg-transparent px-3 py-2 text-sm text-foreground outline-none transition-colors focus:border-purple"
          />
        </Field>
      </div>

      <Field label="Image">
        <ImageUploader value={image} onChange={setImage} />
      </Field>

      <Field label="Credential URL">
        <input
          value={credentialUrl}
          onChange={(e) => setCredentialUrl(e.target.value)}
          placeholder="https://..."
          className="w-full rounded-lg border border-line bg-transparent px-3 py-2 text-sm text-foreground outline-none transition-colors focus:border-purple"
        />
      </Field>

      <Field label="Description" required>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={4}
          className="w-full rounded-lg border border-line bg-transparent px-3 py-2 text-sm text-foreground outline-none transition-colors focus:border-purple resize-none"
          required
        />
      </Field>

      <div className="flex flex-wrap gap-8">
        <Toggle label="Visible" checked={isVisible} onChange={setIsVisible} />
      </div>

      <div className="flex items-center gap-4 border-t border-line pt-6">
        <button
          type="submit"
          disabled={saving}
          className="rounded-lg bg-purple px-6 py-2.5 text-sm font-medium text-[#17151c] transition-opacity hover:opacity-90 disabled:opacity-50"
        >
          {saving ? "Saving…" : isEdit ? "Update Certificate" : "Create Certificate"}
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
