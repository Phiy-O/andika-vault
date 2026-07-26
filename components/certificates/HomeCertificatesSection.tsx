"use client";

import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { SectionEyebrow } from "../content/SectionEyebrow";
import { Card } from "../content/Card";
import { CertificateModal } from "./CertificateModal";
import type { Certificate } from "@prisma/client";

type HomeCertificatesSectionProps = {
  certificates: Certificate[];
};

const DEFAULT_CERT_IMAGE = "/images/thumbnails/achievements-default.png";

const dateFormatter = new Intl.DateTimeFormat("en", {
  month: "short",
  day: "2-digit",
  year: "numeric",
});

export function HomeCertificatesSection({
  certificates,
}: HomeCertificatesSectionProps) {
  const visibleCertificates = certificates
    .filter((cert) => cert.isVisible)
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .slice(0, 3);

  const [modalCert, setModalCert] = useState<Certificate | null>(null);

  return (
    <>
      <section
      className="border-b border-line mx-auto py-[130px] px-[10vw] relative max-md:py-[90px] max-md:px-[6vw]"
      id="certificates"
      aria-labelledby="home-cert-title"
    >
      <div className="items-end grid gap-[60px] grid-cols-[1.1fr_.9fr] mx-auto mb-[64px] w-full max-md:items-start max-md:gap-[34px] max-md:grid-cols-1 max-md:mb-[44px]">
        <div>
          <SectionEyebrow>Certificates</SectionEyebrow>
          <h2
            className="text-[clamp(48px,6vw,78px)] mb-0 max-md:text-[clamp(36px,8vw,56px)]"
            id="home-cert-title"
          >
            Credentials that reflect <em>real learning.</em>
          </h2>
        </div>
        <div className="items-start flex flex-col gap-7">
          <p className="text-muted text-base leading-[1.75] m-0 max-w-[430px]">
            Certifications and milestones that mark meaningful progress in my
            craft.
          </p>
          <Link
            className="border border-line rounded-lg text-foreground inline-flex items-center w-fit text-xs px-5 py-3 transition-all duration-200 hover:shadow-[0_0_2px_var(--foreground)] hover:-translate-y-0.5"
            href="/achievements"
          >
            View all achievements{" "}
            <span className="text-foreground text-[17px] ml-2" aria-hidden="true">
              <ArrowUpRight size={18} />
            </span>
          </Link>
        </div>
      </div>

      <div className="grid gap-[18px] grid-cols-3 mx-auto w-full max-md:grid-cols-1">
        {visibleCertificates.map((cert, index) => (
          <button onClick={() => setModalCert(cert)} className="text-left block w-full cursor-pointer" key={cert.id}>
            <Card className="min-h-[360px] max-md:min-h-0">
              <div className="rounded-tl-[14px] h-[220px] mb-6 overflow-hidden relative max-md:h-[180px]">
                <img
                  src={DEFAULT_CERT_IMAGE || cert.image}
                  alt=""
                  className="absolute inset-0 w-full h-full object-cover"
                />
              </div>
              <span className="text-purple text-xs tracking-[.14em] px-6 py-0 relative z-10">
                {String(index + 1).padStart(2, "0")}
              </span>
              <div className="mt-0 px-6 pb-4 relative z-10">
                <p className="text-muted text-[10px] tracking-[.12em] mb-[18px] uppercase">
                  {cert.issuer} /{" "}
                  {dateFormatter.format(new Date(cert.issueDate))}
                </p>
                <h3 className="text-[clamp(22px,2vw,30px)] font-medium tracking-[-.04em] leading-[1.05] mb-[18px] line-clamp-2">
                  {cert.title}
                </h3>
                <p className="text-muted text-sm leading-[1.7] mb-0 line-clamp-2">{cert.description}</p>
              </div>
              <div className="items-center border-t border-line text-muted flex text-xs justify-between mt-auto py-[22px] px-6 relative z-10">
                <span>View credential</span>
                <ArrowUpRight className="text-purple" size={18} aria-hidden="true" />
              </div>
            </Card>
          </button>
        ))}
      </div>

      {modalCert && (
        <CertificateModal cert={modalCert} onClose={() => setModalCert(null)} />
      )}
    </section>
    </>
  );
}
