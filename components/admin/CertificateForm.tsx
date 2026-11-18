"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { Certificate } from "@prisma/client";
import { useToast } from "@/components/ui/Toast";
import { ImageUploader } from "./ImageUploader";
import { EditorShell } from "@/components/admin/editor/EditorShell";
import { EditorHeader } from "@/components/admin/editor/EditorHeader";
import { EditorHeaderActions, EditorMetaChip } from "@/components/admin/editor/EditorHeader";
import { EditorSection } from "@/components/admin/editor/EditorSection";
import { EditorRail, EditorPanel } from "@/components/admin/editor/EditorRail";
import { EditorPreview } from "@/components/admin/editor/EditorPreview";
import { EditorField, editorInputClass, editorMonoInputClass, editorTextareaClass } from "@/components/admin/editor/EditorField";
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
        throw new Error(await responseError(res, "Failed to save certificate"));
      }
      showToast(isEdit ? "Sertifikat berhasil diupdate" : "Sertifikat berhasil dibuat");
      router.push("/admin/certificates");
      router.refresh();
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to save certificate");
    } finally {
      setSaving(false);
    }
  }

  function handleCancel() {
    if (confirmDiscard(dirty)) router.back();
  }

  function handleBack() {
    if (confirmDiscard(dirty)) router.push("/admin/certificates");
  }

  const dirty = useEditorDirty({
    title,
    issuer,
    issueDate,
    credentialUrl,
    image,
    description,
    isVisible,
    sortOrder,
  });
  useUnsavedGuard({ dirty, saving });

  const metaChips = (
    <>
      <EditorMetaChip>{issuer || "Achievement"}</EditorMetaChip>
      {isEdit && <EditorMetaChip>{formatRelativeTime(certificate!.updatedAt)}</EditorMetaChip>}
    </>
  );

  const header = (
    <EditorHeader
      eyebrow="Editor // Achievements"
      eyebrowNote={isEdit ? `Record ${shortRecordId(certificate!.id)}` : "New record"}
      title={isEdit ? "Edit Certificate" : "New Certificate"}
      description={
        isEdit ? `Update "${certificate!.title}".` : "Log a verified milestone."
      }
      meta={metaChips}
      actions={
        <EditorHeaderActions
          backLabel="Back to Achievements"
          onBack={handleBack}
          publicHref={isEdit ? "/achievements" : null}
          publicLabel="View Achievements"
          publicDisabledReason="Save the certificate before viewing the archive."
          submitLabel={isEdit ? "Update Certificate" : "Create Certificate"}
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
            id="cert-published"
            label="Published"
            badge={isVisible ? "Published" : "Draft"}
            checked={isVisible}
            onChange={setIsVisible}
            description="Visible on the public site. Turn off to keep this record as a draft."
          />
          <EditorField
            id="cert-sort-order"
            label="Sort Order"
            hint="Lower numbers appear first."
          >
            <input
              id="cert-sort-order"
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
          title={title || "Untitled certificate"}
          description={description}
          image={image}
          imageAlt={title}
          eyebrow={issuer || "Achievement"}
          badges={issueDate ? [formatDate(issueDate)] : []}
          path="/achievements"
          href={isEdit && isVisible ? "/achievements" : undefined}
          draft={!isVisible}
          emptyLabel="Add a certificate image to preview this record."
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
              {isEdit ? shortRecordId(certificate!.id) : "-"}
            </dd>
          </div>
          <div className="flex justify-between gap-3">
            <dt className="font-jet text-[9px] font-bold uppercase tracking-[.08em] text-muted">Created</dt>
            <dd className="text-foreground">
              {isEdit ? formatDate(certificate!.createdAt) : "Created when saved"}
            </dd>
          </div>
          <div className="flex justify-between gap-3">
            <dt className="font-jet text-[9px] font-bold uppercase tracking-[.08em] text-muted">Updated</dt>
            <dd className="text-foreground">
              {isEdit ? formatRelativeTime(certificate!.updatedAt) : "-"}
            </dd>
          </div>
          <div className="flex justify-between gap-3">
            <dt className="font-jet text-[9px] font-bold uppercase tracking-[.08em] text-muted">Credential</dt>
            <dd className="text-foreground">{credentialUrl ? "Added" : "Not added"}</dd>
          </div>
        </dl>
      </EditorPanel>
    </EditorRail>
  );

  return (
    <EditorShell
      section="Achievements"
      mode={isEdit ? "edit" : "new"}
      recordId={certificate?.id}
      onSubmit={handleSubmit}
      error={error}
      dirty={dirty}
      saving={saving}
      submitLabel={isEdit ? "Update Certificate" : "Create Certificate"}
      onCancel={handleCancel}
      header={header}
      rail={rail}
    >
      <EditorSection index="01" title="Identity" meta="Required fields">
        <div className="grid gap-5 md:grid-cols-2">
          <EditorField id="cert-title" label="Title" required>
            <input
              id="cert-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className={editorInputClass}
              required
            />
          </EditorField>
          <EditorField id="cert-issuer" label="Issuer" required>
            <input
              id="cert-issuer"
              value={issuer}
              onChange={(e) => setIssuer(e.target.value)}
              className={editorInputClass}
              required
            />
          </EditorField>
        </div>
        <EditorField
          id="cert-description"
          label="Description"
          required
          counter={`${description.length} characters`}
        >
          <textarea
            id="cert-description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            className={editorTextareaClass}
            required
          />
        </EditorField>
      </EditorSection>

      <EditorSection index="02" title="Credential" meta="Verification details">
        <div className="grid gap-5 md:grid-cols-2">
          <EditorField label="Issue Date" required>
            <input
              type="date"
              value={issueDate}
              onChange={(e) => setIssueDate(e.target.value)}
              className={editorInputClass}
              required
            />
          </EditorField>
        </div>
        <EditorField
          label="Credential URL"
          hint="Optional. Must start with http(s):// or /."
        >
          <input
            value={credentialUrl}
            onChange={(e) => setCredentialUrl(e.target.value)}
            placeholder="https://..."
            className={editorMonoInputClass}
          />
        </EditorField>
      </EditorSection>

      <EditorSection index="03" title="Media" meta="Certificate image">
        <EditorField label="Certificate Image">
          <ImageUploader
            value={image}
            onChange={setImage}
            aspect="certificate"
            label="Upload certificate image"
          />
        </EditorField>
      </EditorSection>
    </EditorShell>
  );
}