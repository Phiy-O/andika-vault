import Link from "next/link";
import { AchievementsContent } from "../../components/achievements/AchievementsContent";
import { PublicShell } from "../../components/layout/PublicShell";

export const metadata = {
  title: "Achievements | Andika",
  description: "Achievements, milestones, and certificates from Andika's journey.",
};

export default function AchievementsPage() {
  return (
    <PublicShell>
      <header className="mx-auto w-full py-[150px] px-[10vw] pb-[110px] max-md:py-[100px] max-md:px-[6vw] max-md:pb-[75px]">
        <p className="text-muted border border-line w-fit px-3 py-1.5 rounded-full text-[10px] tracking-[.18em] mb-6 uppercase">
          Achievements
        </p>
        <h1>
          A journey made of <em>small wins.</em>
        </h1>
        <p className="text-muted text-[17px] leading-[1.7] max-w-[510px]">
          A growing record of projects, learning milestones, and work that shaped
          how I build.
        </p>
      </header>

      <AchievementsContent />

      <div className="mx-auto w-full py-0 px-[10vw] pb-[130px] max-md:px-[6vw] max-md:pb-[90px]">
        <Link
          className="border border-line rounded-lg text-foreground inline-flex items-center w-fit text-xs px-5 py-3 transition-all duration-200 hover:shadow-[0_0_2px_var(--foreground)] hover:-translate-y-0.5"
          href="/contact"
        >
          Have a project in mind{" "}
          <span className="text-foreground text-[17px] ml-2" aria-hidden="true">
            ↗
          </span>
        </Link>
      </div>
    </PublicShell>
  );
}
