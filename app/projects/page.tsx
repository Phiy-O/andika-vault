import Link from "next/link";
import { ProjectsContent } from "../../components/projects/ProjectsContent";
import { PublicShell } from "../../components/layout/PublicShell";
import { PageHero } from "../../components/content/PageHero";
import { CTAButton } from "../../components/content/CTAButton";
import { projectService } from "@/src/services";

export const metadata = {
  title: "Projects | Andika",
  description: "Selected projects by Andika, from product concepts to full-stack builds.",
};

export default async function ProjectsPage() {
  const projects = await projectService.getVisible();

  return (
    <PublicShell>
      <PageHero
        eyebrow="Projects"
        title={<>Things I&apos;ve <em>shaped.</em></>}
        description="A selection of work where product thinking, design, and engineering meet."
      />

      <ProjectsContent projects={projects as any} />

      <div className="mx-auto w-full py-0 px-[10vw] pb-[130px] max-md:px-[6vw] max-md:pb-[90px]">
        <CTAButton href="/contact" label="Have a project in mind" />
      </div>
    </PublicShell>
  );
}
