import { AchievementsContent } from "../../components/achievements/AchievementsContent";
import { PublicShell } from "../../components/layout/PublicShell";
import { certificateService } from "@/src/services";

export const revalidate = 3600;

export const metadata = {
  title: "Achievements | Andika",
  description: "Achievements, milestones, and certificates from Andika's journey.",
};

export default async function AchievementsPage() {
  const certificates = await certificateService.getVisible();
  return <PublicShell><AchievementsContent certificates={certificates} /></PublicShell>;
}
