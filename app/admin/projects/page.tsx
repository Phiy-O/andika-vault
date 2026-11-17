import { getAllProjects } from "@/src/actions/project";
import { ProjectsWorkspace } from "./_components/ProjectsWorkspace";

export default async function AdminProjectsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string | string[] }>;
}) {
  const params = await searchParams;
  const rawQuery = params.q;
  const initialSearch = Array.isArray(rawQuery)
    ? (rawQuery[0] ?? "")
    : (rawQuery ?? "");
  const { data: projects, error } = await getAllProjects();

  return (
    <ProjectsWorkspace
      key={initialSearch || "projects"}
      projects={projects ?? []}
      initialSearch={initialSearch}
      loadError={error}
    />
  );
}
