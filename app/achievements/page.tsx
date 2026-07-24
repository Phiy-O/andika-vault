import { ContentPage, ContentSection } from "../../components/content/ContentPage";
import { PublicShell } from "../../components/layout/PublicShell";

export const metadata = {
  title: "Achievements | Andika",
  description: "Achievements, milestones, and certificates from Andika's journey.",
};

const achievements = [
  {
    year: "2025",
    title: "Rentalin product foundation",
    detail: "Designed and engineered a full-stack rental product concept.",
  },
  {
    year: "2024",
    title: "Full-stack development milestone",
    detail: "Expanded from interface work into dependable application architecture.",
  },
  {
    year: "2023",
    title: "Started building in public",
    detail: "Documented the process of learning, shipping, and improving.",
  },
];

export default function AchievementsPage() {
  return (
    <PublicShell>
      <ContentPage
        eyebrow="Achievements"
        title={
          <>
            A journey made of <em>small wins.</em>
          </>
        }
        description="A growing record of projects, learning milestones, and work that shaped how I build."
      >
        <ContentSection title="Selected milestones">
          <div className="border-t border-line">
            {achievements.map((item) => (
              <article className="items-start border-b border-line grid gap-[30px] grid-cols-[80px_1fr_20px] py-7 px-0 max-md:gap-[15px] max-md:grid-cols-[45px_1fr_15px]" key={item.year}>
                <span className="text-purple text-xs">{item.year}</span>
                <div>
                  <h2 className="text-[25px] mb-2.5 mt-0 mx-0 max-md:text-xl">{item.title}</h2>
                  <p className="text-muted text-sm leading-[1.6]">{item.detail}</p>
                </div>
                <b aria-hidden="true">↗</b>
              </article>
            ))}
          </div>
        </ContentSection>
        <ContentSection title="Certificates">
          <div className="border border-dashed border-line text-muted p-[35px]">
            <p className="m-0">Certificates and credentials will be added here as the portfolio grows.</p>
          </div>
        </ContentSection>
      </ContentPage>
    </PublicShell>
  );
}
