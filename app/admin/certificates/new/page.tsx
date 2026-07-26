import { CertificateForm } from "@/components/admin/CertificateForm";

export default function NewCertificatePage() {
  return (
    <section>
      <div className="mb-8">
        <h1 className="text-3xl font-medium tracking-[-.06em] text-foreground">
          New Certificate
        </h1>
        <p className="mt-1 text-sm text-muted">
          Add a new certificate to your portfolio.
        </p>
      </div>
      <div className="max-w-3xl">
        <CertificateForm />
      </div>
    </section>
  );
}
