"use client";

import Image from "next/image";

interface EditorPreviewProps {
  title: string;
  description?: string;
  image?: string | null;
  imageAlt?: string;
  iconSrc?: string | null;
  eyebrow?: string;
  badges?: string[];
  path?: string;
  href?: string;
  draft?: boolean;
  emptyLabel?: string;
}

export function EditorPreview({
  title,
  description,
  image,
  imageAlt,
  iconSrc,
  eyebrow,
  badges,
  path,
  href,
  draft,
  emptyLabel,
}: EditorPreviewProps) {
  return (
    <div className="relative border-2 border-line bg-background">
      {draft && (
        <span className="absolute top-2 left-2 z-10 border border-line bg-purple px-2 py-1 font-jet text-[8px] font-bold uppercase tracking-[.08em]">
          Draft
        </span>
      )}
      {image ? (
        <div className="relative aspect-video overflow-hidden border-b-2 border-line">
          <Image
            src={image}
            alt={imageAlt ?? title}
            fill
            sizes="330px"
            unoptimized
            className="object-cover"
          />
        </div>
      ) : iconSrc ? (
        <div className="grid place-items-center border-b-2 border-line bg-admin-wash p-6">
          <Image src={iconSrc} alt="" width={56} height={56} unoptimized />
        </div>
      ) : (
        <div className="grid min-h-28 place-items-center border-b-2 border-dashed border-line bg-admin-wash p-4 text-center font-jet text-[8px] uppercase tracking-[.08em] text-muted">
          {emptyLabel ?? "No preview asset yet."}
        </div>
      )}
      <div className="space-y-2 p-3">
        {eyebrow && (
          <p className="font-jet text-[8px] font-bold uppercase tracking-[.1em] text-amber">
            {eyebrow}
          </p>
        )}
        <h4 className="m-0 font-space text-[15px] font-bold leading-tight">
          {title}
        </h4>
        {description && (
          <p className="line-clamp-3 text-[11px] leading-5 text-muted">
            {description}
          </p>
        )}
        {badges && badges.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {badges.map((badge, index) => (
              <span
                key={`${badge}-${index}`}
                className="border border-line bg-surface px-1.5 py-0.5 font-jet text-[8px] font-bold uppercase tracking-[.06em] text-muted"
              >
                {badge}
              </span>
            ))}
          </div>
        )}
        {path &&
          (href ? (
            <a
              href={href}
              target="_blank"
              rel="noreferrer"
              className="block break-all font-jet text-[9px] text-muted underline-offset-2 hover:underline"
            >
              {path}
            </a>
          ) : (
            <span className="block break-all font-jet text-[9px] text-muted">
              {path}
            </span>
          ))}
      </div>
    </div>
  );
}
