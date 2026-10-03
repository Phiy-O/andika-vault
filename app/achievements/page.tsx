import Link from "next/link";
import { AchievementsContent } from "../../components/achievements/AchievementsContent";
import { PublicShell } from "../../components/layout/PublicShell";
import { PageHero } from "../../components/content/PageHero";
import { CTAButton } from "../../components/content/CTAButton";
import { certificateService } from "@/src/services";

export const revalidate = 3600;

export const metadata = {
  title: "Achievements | Andika",
  description: "Achievements, milestones, and certificates from Andika's journey.",
};

export default async function AchievementsPage() {
  const certificates = await certificateService.getVisible();

  return (
    <PublicShell>
      <PageHero
        eyebrow="Achievements"
        title={<>A journey made of <em>small wins.</em></>}
        description="A growing record of projects, learning milestones, and work that shaped how I build."
      />

      <AchievementsContent certificates={certificates as any} />

      <div className="mx-auto w-full py-0 px-[10vw] pb-[130px] max-md:px-[6vw] max-md:pb-[90px]">
        <CTAButton href="/contact" label="Have a project in mind" />
      </div>
    </PublicShell>
  );
}
