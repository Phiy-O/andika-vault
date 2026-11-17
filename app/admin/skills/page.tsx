import { getAllSkills } from "@/src/actions/skill";
import dynamic from "next/dynamic";

const SkillListClient = dynamic(
  () => import("./SkillListClient").then((m) => m.SkillListClient)
);

export default async function AdminSkillsPage() {
  const { data: skills, error } = await getAllSkills();

  return (
    <section>
      <div className="mb-8 flex items-end justify-between gap-4 border-b-2 border-foreground pb-6">
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
          className="border-2 border-foreground bg-[#e76f51] px-4 py-2 text-sm font-semibold uppercase shadow-[3px_3px_0_var(--foreground)] transition-transform hover:-translate-y-0.5"
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
