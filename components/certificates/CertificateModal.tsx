"use client";

import { X, ExternalLink, Calendar, Award } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";
import type { HomeCertificate } from "../../data/home-certificates";

const dateFormatter = new Intl.DateTimeFormat("en", {
  month: "long",
  day: "2-digit",
  year: "numeric",
});

type CertificateModalProps = {
  cert: HomeCertificate;
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
      className="fixed inset-0 z-50 m-auto w-full max-w-[560px] bg-transparent backdrop:bg-black/70 open:flex open:items-center open:justify-center p-4 border-0"
    >
      <div className="bg-[var(--surface)] border border-[var(--line)] rounded-[18px] w-full max-h-[90vh] overflow-y-auto shadow-[0_30px_80px_rgba(0,0,0,.5)]">
        {/* Close button */}
        <div className="flex justify-end pt-4 pr-4">
          <button
            onClick={onClose}
            className="border border-line rounded-lg text-muted hover:text-foreground transition-colors p-2 cursor-pointer"
            aria-label="Close modal"
          >
            <X size={16} />
          </button>
        </div>

        {/* Image */}
        {cert.image && (
          <div className="relative h-[240px] max-md:h-[180px] mx-6 rounded-[12px] overflow-hidden border border-line/50">
            <Image
              src={cert.image}
              alt={cert.title}
              fill
              className="object-cover"
              sizes="500px"
            />
          </div>
        )}

        {/* Content */}
        <div className="px-6 pb-6 pt-5 space-y-5">
          {/* Issuer + Date */}
          <div className="flex flex-wrap items-center gap-4 text-muted text-[11px] tracking-[.12em] uppercase">
            <span className="inline-flex items-center gap-1.5">
              <Award size={12} aria-hidden="true" />
              {cert.issuer}
            </span>
            <span className="w-1 h-1 rounded-full bg-line" />
            <span className="inline-flex items-center gap-1.5">
              <Calendar size={12} aria-hidden="true" />
              {dateFormatter.format(new Date(cert.issueDate))}
            </span>
          </div>

          {/* Title */}
          <h2 className="text-[clamp(22px,3vw,32px)] font-medium tracking-[-.04em] leading-[1.1] m-0">
            {cert.title}
          </h2>

          {/* Description */}
          <p className="text-muted text-sm leading-[1.8] m-0">
            {cert.description}
          </p>

          {/* Credential link */}
          {cert.credentialUrl && cert.credentialUrl !== "#" && (
            <Link
              href={cert.credentialUrl}
              target="_blank"
              className="border border-line rounded-lg text-foreground inline-flex items-center gap-2 text-xs px-5 py-3 transition-all duration-200 hover:shadow-[0_0_2px_var(--foreground)] hover:-translate-y-0.5 w-fit"
            >
              <ExternalLink size={14} />
              View credential
            </Link>
          )}
        </div>
      </div>
    </dialog>
  );
}
