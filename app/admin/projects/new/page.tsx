import { ProjectForm } from "@/components/admin/ProjectForm";

export default function NewProjectPage() {
  return (
    <section>
      <div className="mb-8">
        <h1 className="text-3xl font-medium tracking-[-.06em] text-foreground">
          New Project
        </h1>
        <p className="mt-1 text-sm text-muted">
          Add a new project to your portfolio.
        </p>
      </div>
      <div className="max-w-3xl">
        <ProjectForm />
      </div>
    </section>
  );
}
