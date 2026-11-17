import { ProjectsContent } from "../../components/projects/ProjectsContent";
import { PublicShell } from "../../components/layout/PublicShell";
import { projectService } from "@/src/services";

export const revalidate = 3600;
export const metadata = { title: "Projects | Andika", description: "Selected projects by Andika, from product concepts to full-stack builds." };

export default async function ProjectsPage() {
  const projects = await projectService.getVisible();
  return <PublicShell><ProjectsContent projects={projects} /></PublicShell>;
}
