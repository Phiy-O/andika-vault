import { notFound } from "next/navigation";
import { certificateService } from "@/src/services";
import { CertificateForm } from "@/components/admin/CertificateForm";

export default async function EditCertificatePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const certificate = await certificateService.getById(id);
  if (!certificate) notFound();

  return <CertificateForm certificate={certificate} />;
}