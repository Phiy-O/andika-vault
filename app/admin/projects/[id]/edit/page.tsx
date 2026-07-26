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

  return (
    <section>
      <div className="mb-8">
        <h1 className="text-3xl font-medium tracking-[-.06em] text-foreground">
          Edit Project
        </h1>
        <p className="mt-1 text-sm text-muted">
          Update &ldquo;{project.title}&rdquo;.
        </p>
      </div>
      <div className="max-w-3xl">
        <ProjectForm project={project} />
      </div>
    </section>
  );
}
