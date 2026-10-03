import { SkillForm } from "@/components/admin/SkillForm";

export default function NewSkillPage() {
  return (
    <section>
      <div className="mb-8">
        <h1 className="text-3xl font-medium tracking-[-.06em] text-foreground">
          New Skill
        </h1>
        <p className="mt-1 text-sm text-muted">
          Add a new skill to your portfolio.
        </p>
      </div>
      <div className="max-w-3xl">
        <SkillForm />
      </div>
    </section>
  );
}
