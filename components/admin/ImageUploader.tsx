"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { Upload, Loader2, RefreshCw } from "lucide-react";
import {
  ACCEPTED_IMAGE_TYPES,
  MAX_IMAGE_SIZE_MB,
  isAcceptedImage,
  uploadImageFile,
} from "@/src/lib/upload-image";

const MAX_SIZE_MB = MAX_IMAGE_SIZE_MB;

const secondaryBtn =
  "inline-flex h-10 items-center gap-2 border-2 border-line bg-surface px-4 font-jet text-[9px] font-bold uppercase tracking-[.08em] shadow-[2px_2px_0_var(--foreground)] transition-transform hover:-translate-y-0.5 hover:bg-admin-wash disabled:cursor-not-allowed disabled:opacity-50 motion-reduce:transform-none";

const alertBtn =
  "inline-flex h-10 items-center gap-2 border-2 border-admin-alert bg-surface px-4 font-jet text-[9px] font-bold uppercase tracking-[.08em] text-admin-alert shadow-[2px_2px_0_var(--foreground)] transition-transform hover:-translate-y-0.5 hover:bg-[#f9e8e6] disabled:cursor-not-allowed disabled:opacity-50 motion-reduce:transform-none";

export function ImageUploader({
  value,
  onChange,
  label = "Upload image",
  aspect = "video",
}: {
  value: string;
  onChange: (url: string) => void;
  label?: string;
  aspect?: "video" | "certificate";
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState("");

  async function handleFile(file: File) {
    setError("");
    if (!isAcceptedImage(file)) {
      setError(`Tipe file tidak didukung (${file.type}). Gunakan JPG/PNG/WebP/GIF/SVG.`);
      return;
    }
    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      setError(`File terlalu besar. Maksimal ${MAX_SIZE_MB}MB.`);
      return;
    }
    setUploading(true);
    try {
      const url = await uploadImageFile(file);
      onChange(url);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload gagal");
    } finally {
      setUploading(false);
    }
  }

  function handleRemove() {
    // State-only: the old asset is deleted server-side after a successful
    // save (and only if no other entity references it).
    onChange("");
  }

  return (
    <div>
      {value ? (
        <div>
          <div
            className={`relative border-2 border-line bg-admin-wash ${
              aspect === "certificate" ? "aspect-[4/3]" : "aspect-video"
            }`}
          >
            <Image
              src={value}
              alt="preview"
              fill
              sizes="320px"
              unoptimized
              className="object-cover"
            />
            {uploading && (
              <div className="absolute inset-0 grid place-items-center bg-background/80">
                <span className="flex items-center gap-2 font-sans text-sm text-muted">
                  <Loader2 size={16} className="animate-spin" /> Uploading...
                </span>
              </div>
            )}
          </div>
          <div className="mt-3 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              disabled={uploading}
              className={secondaryBtn}
            >
              <RefreshCw size={14} /> Replace
            </button>
            <button
              type="button"
              onClick={handleRemove}
              disabled={uploading}
              className={alertBtn}
            >
              Remove
            </button>
          </div>
        </div>
      ) : (
        <div
          onDragOver={(event) => {
            event.preventDefault();
            setDragging(true);
          }}
          onDragLeave={(event) => {
            if (!event.currentTarget.contains(event.relatedTarget as Node | null))
              setDragging(false);
          }}
          onDrop={(event) => {
            event.preventDefault();
            setDragging(false);
            const file = event.dataTransfer.files?.[0];
            if (file) void handleFile(file);
          }}
          className={`border-2 border-dashed p-6 text-center transition-colors ${
            dragging || uploading
              ? "border-purple bg-admin-wash"
              : "border-line bg-surface"
          }`}
        >
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
            className="mx-auto flex flex-col items-center gap-2 font-sans text-sm text-muted transition-colors hover:text-foreground disabled:cursor-not-allowed disabled:opacity-50"
          >
            {uploading ? (
              <>
                <Loader2 size={20} className="animate-spin" />
                <span>Uploading...</span>
              </>
            ) : (
              <>
                <Upload size={20} />
                <span>{label}</span>
              </>
            )}
          </button>
          <p className="mt-2 font-sans text-xs text-muted/80">
            PNG, JPG, WebP, GIF or SVG. Max 5 MB.
          </p>
        </div>
      )}
      <input
        ref={inputRef}
        type="file"
        accept={ACCEPTED_IMAGE_TYPES.join(",")}
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
          e.target.value = "";
        }}
      />
      {error && (
        <p
          role="alert"
          className="mt-2 font-jet text-[9px] uppercase tracking-[.06em] text-admin-alert"
        >
          {error}
        </p>
      )}
    </div>
  );
}
