import { Navbar } from "../components/layout/Navbar";
import { Footer } from "../components/layout/Footer";
import { HomeProjectsSection } from "../components/projects";
import { HomeApproach, HomeCapabilities, HomeContactSection, HomeHero, HomeMilestones, HomeWriting } from "../components/home";
import { skillService, blogPostService, projectService, certificateService } from "@/src/services";
import { getSiteSettings } from "@/src/actions/site-setting";
import type { Skill, BlogPost, Project, Certificate } from "@/src/types";

export const revalidate = 3600;

export default async function Home() {
  const [skills, posts, projects, certificates, settings] = await Promise.all([
    skillService.getVisible(),
    blogPostService.getVisible(),
    projectService.getVisible(),
    certificateService.getVisible(),
    getSiteSettings(),
  ]);

  return (
    <main>
      <Navbar />
      <HomeHero resumeUrl={settings?.data?.resumeUrl} />
      <HomeApproach />
      <HomeProjectsSection projects={projects as Project[]} />
      <HomeCapabilities skills={skills as Skill[]} />
      <HomeWriting posts={posts as BlogPost[]} />
      <HomeMilestones certificates={certificates as Certificate[]} />
      <HomeContactSection email={settings?.data?.email} />
      <Footer />
    </main>
  );
}
