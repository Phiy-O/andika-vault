import { notFound } from "next/navigation";
import { skillService } from "@/src/services";
import { SkillForm } from "@/components/admin/SkillForm";

export default async function EditSkillPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const skill = await skillService.getById(id);
  if (!skill) notFound();

  return (
    <section>
      <div className="mb-8">
        <h1 className="text-3xl font-medium tracking-[-.06em] text-foreground">
          Edit Skill
        </h1>
        <p className="mt-1 text-sm text-muted">
          Update &ldquo;{skill.name}&rdquo;.
        </p>
      </div>
      <div className="max-w-3xl">
        <SkillForm skill={skill} />
      </div>
    </section>
  );
}
