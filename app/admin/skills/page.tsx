import { getAllSkills } from "@/src/actions/skill";
import { SkillWorkspace } from "./_components/SkillWorkspace";

export default async function AdminSkillsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string | string[] }>;
}) {
  const params = await searchParams;
  const rawQuery = params.q;
  const initialSearch = Array.isArray(rawQuery)
    ? (rawQuery[0] ?? "")
    : (rawQuery ?? "");
  const { data: skills, error } = await getAllSkills();

  return (
    <SkillWorkspace
      key={initialSearch || "skills"}
      skills={skills ?? []}
      initialSearch={initialSearch}
      loadError={error}
    />
  );
}