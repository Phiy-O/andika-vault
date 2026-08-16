import { getAllCertificates } from "@/src/actions/certificate";
import dynamic from "next/dynamic";

const CertificateListClient = dynamic(
  () => import("./CertificateListClient").then((m) => m.CertificateListClient)
);

export default async function AdminCertificatesPage() {
  const { data: certs, error } = await getAllCertificates();

  return (
    <section>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-medium tracking-[-.06em] text-foreground">
            Certificates
          </h1>
          <p className="mt-1 text-sm text-muted">
            Manage your certificates and credentials.
          </p>
        </div>
        <a
          href="/admin/certificates/new"
          className="rounded-lg bg-purple px-4 py-2 text-sm font-medium text-[#17151c] transition-opacity hover:opacity-90"
        >
          + New Certificate
        </a>
      </div>

      {error && (
        <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
          {error}
        </div>
      )}

      <CertificateListClient certificates={certs ?? []} />
    </section>
  );
}
