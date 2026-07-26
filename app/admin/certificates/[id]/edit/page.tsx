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

  return (
    <section>
      <div className="mb-8">
        <h1 className="text-3xl font-medium tracking-[-.06em] text-foreground">
          Edit Certificate
        </h1>
        <p className="mt-1 text-sm text-muted">
          Update &ldquo;{certificate.title}&rdquo;.
        </p>
      </div>
      <div className="max-w-3xl">
        <CertificateForm certificate={certificate} />
      </div>
    </section>
  );
}
