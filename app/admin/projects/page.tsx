import { getAllProjects } from "@/src/actions/project";
import { ProjectListClient } from "./ProjectListClient";

export default async function AdminProjectsPage() {
  const { data: projects, error } = await getAllProjects();

  return (
    <section>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-medium tracking-[-.06em] text-foreground">
            Projects
          </h1>
          <p className="mt-1 text-sm text-muted">
            Manage your portfolio projects.
          </p>
        </div>
        <a
          href="/admin/projects/new"
          className="rounded-lg bg-purple px-4 py-2 text-sm font-medium text-[#17151c] transition-opacity hover:opacity-90"
        >
          + New Project
        </a>
      </div>

      {error && (
        <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
          {error}
        </div>
      )}

      <ProjectListClient projects={projects ?? []} />
    </section>
  );
}
