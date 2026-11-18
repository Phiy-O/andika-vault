import { notFound } from "next/navigation";
import { projectService } from "@/src/services";
import { ProjectForm } from "@/components/admin/ProjectForm";

export default async function EditProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const project = await projectService.getById(id);
  if (!project) notFound();

  return <ProjectForm project={project} />;
}