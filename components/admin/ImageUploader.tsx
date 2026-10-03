"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { Upload, X, Loader2 } from "lucide-react";

const MAX_SIZE_MB = 5;
const ACCEPTED = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/svg+xml",
];

export function ImageUploader({
  value,
  onChange,
  label = "Upload image",
}: {
  value: string;
  onChange: (url: string) => void;
  label?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  async function handleFile(file: File) {
    setError("");
    if (!ACCEPTED.includes(file.type)) {
      setError(`Tipe file tidak didukung (${file.type}). Gunakan JPG/PNG/WebP/GIF/SVG.`);
      return;
    }
    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      setError(`File terlalu besar. Maksimal ${MAX_SIZE_MB}MB.`);
      return;
    }
    setUploading(true);
    try {
      const sigRes = await fetch("/api/cloudinary/signature");
      if (!sigRes.ok) throw new Error("Sesi berakhir, login ulang");
      const sig = await sigRes.json();
      const form = new FormData();
      form.append("file", file);
      form.append("api_key", sig.apiKey);
      form.append("timestamp", String(sig.timestamp));
      form.append("signature", sig.signature);
      form.append("folder", sig.folder);
      form.append("resource_type", sig.resourceType ?? "image");
      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${sig.cloudName}/image/upload`,
        { method: "POST", body: form }
      );
      if (!res.ok) throw new Error("Upload gagal, coba lagi");
      const data = await res.json();
      onChange(data.secure_url);
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
        <div className="flex items-center gap-3">
          <div className="relative h-16 w-24 overflow-hidden rounded-lg border border-line">
            <Image
              src={value}
              alt="preview"
              fill
              sizes="96px"
              unoptimized
              className="object-cover"
            />
          </div>
          <button
            type="button"
            onClick={handleRemove}
            className="rounded p-1.5 text-muted transition-colors hover:bg-surface hover:text-red-400"
            title="Remove image"
          >
            <X size={16} />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="flex w-full items-center justify-center gap-2 rounded-lg border border-dashed border-line px-3 py-6 text-sm text-muted transition-colors hover:border-purple hover:text-foreground disabled:cursor-not-allowed disabled:opacity-50"
        >
          {uploading ? (
            <>
              <Loader2 size={16} className="animate-spin" /> Uploading...
            </>
          ) : (
            <>
              <Upload size={16} /> {label} (maks {MAX_SIZE_MB}MB)
            </>
          )}
        </button>
      )}
      <input
        ref={inputRef}
        type="file"
        accept={ACCEPTED.join(",")}
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
          e.target.value = "";
        }}
      />
      {error && <p className="mt-2 text-xs text-red-400">{error}</p>}
    </div>
  );
}