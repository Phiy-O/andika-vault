import { getAllSkills } from "@/src/actions/skill";
import { SkillListClient } from "./SkillListClient";

export default async function AdminSkillsPage() {
  const { data: skills, error } = await getAllSkills();

  return (
    <section>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-medium tracking-[-.06em] text-foreground">
            Skills
          </h1>
          <p className="mt-1 text-sm text-muted">
            Manage the skills shown on your home and about pages.
          </p>
        </div>
        <a
          href="/admin/skills/new"
          className="rounded-lg bg-purple px-4 py-2 text-sm font-medium text-[#17151c] transition-opacity hover:opacity-90"
        >
          + New Skill
        </a>
      </div>

      {error && (
        <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
          {error}
        </div>
      )}

      <SkillListClient skills={skills ?? []} />
    </section>
  );
}
