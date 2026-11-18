"use client";

import { X, ExternalLink, Calendar, Award } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";
import type { Certificate } from "@prisma/client";

const dateFormatter = new Intl.DateTimeFormat("en", {
  month: "long",
  day: "2-digit",
  year: "numeric",
});

type CertificateModalProps = {
  cert: Certificate;
  onClose: () => void;
};

export function CertificateModal({ cert, onClose }: CertificateModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    dialog.showModal();
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  function handleBackdropClick(e: React.MouseEvent) {
    if (e.target === dialogRef.current) onClose();
  }

  return (
    <dialog
      ref={dialogRef}
      onClose={onClose}
      onClick={handleBackdropClick}
      className="fixed inset-0 z-50 m-auto w-full max-w-[640px] bg-transparent backdrop:bg-black/60 open:flex open:items-center open:justify-center p-4 border-0"
    >
      <div className="w-full max-h-[90vh] overflow-y-auto border-2 border-foreground bg-surface shadow-[4px_4px_0_var(--foreground)]">
        {/* Close button */}
        <div className="flex justify-end p-4">
          <button
            onClick={onClose}
            className="border-2 border-foreground bg-surface p-2 font-bold shadow-[3px_3px_0_var(--foreground)] transition-transform hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[4px_4px_0_var(--foreground)] cursor-pointer"
            aria-label="Close modal"
          >
            <X size={16} />
          </button>
        </div>

        {/* Image */}
        {cert.image && (
          <div className="relative h-[240px] max-md:h-[180px] mx-4 border-2 border-foreground bg-background overflow-hidden">
            <img
              src={cert.image}
              alt={cert.title}
              className="absolute inset-0 w-full h-full object-contain p-3"
            />
          </div>
        )}

        {/* Content */}
        <div className="px-6 pb-6 pt-4 space-y-5">
          {/* Issuer + Date */}
          <div className="flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center gap-2 border-2 border-foreground bg-foreground px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-wide text-background">
              <Award size={12} aria-hidden="true" />
              {cert.issuer}
            </span>
            <span className="inline-flex items-center gap-2 border-2 border-foreground bg-surface px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-wide">
              <Calendar size={12} aria-hidden="true" />
              {dateFormatter.format(new Date(cert.issueDate))}
            </span>
          </div>

          {/* Title */}
          <h3 className="text-[clamp(28px,4vw,36px)] font-bold tracking-[-.04em] leading-[1.1]">
            {cert.title}
          </h3>

          {/* Description */}
          <p className="text-foreground text-base leading-[1.7] border-l-4 border-foreground pl-4 bg-surface/60 py-2">
            {cert.description}
          </p>

          {/* Credential link */}
          {cert.credentialUrl && cert.credentialUrl !== "#" && (
            <Link
              href={cert.credentialUrl}
              target="_blank"
              className="inline-flex items-center gap-2 border-2 border-foreground bg-foreground px-5 py-3 font-bold shadow-[4px_4px_0_var(--line)] transition-transform hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0_var(--line)] w-fit"
            >
              <ExternalLink size={16} />
              View credential
            </Link>
          )}
        </div>
      </div>
    </dialog>
  );
}
