import { getAllCertificates } from "@/src/actions/certificate";
import { AchievementsWorkspace } from "./_components/AchievementsWorkspace";

export default async function AdminCertificatesPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string | string[] }>;
}) {
  const params = await searchParams;
  const rawQuery = params.q;
  const initialSearch = Array.isArray(rawQuery)
    ? (rawQuery[0] ?? "")
    : (rawQuery ?? "");
  const { data: certs, error } = await getAllCertificates();

  return (
    <AchievementsWorkspace
      key={initialSearch || "achievements"}
      certificates={certs ?? []}
      initialSearch={initialSearch}
      loadError={error}
    />
  );
}
