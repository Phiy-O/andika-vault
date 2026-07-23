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
          <div className="timeline-list">
            {achievements.map((item) => (
              <article className="timeline-item" key={item.year}>
                <span>{item.year}</span>
                <div>
                  <h2>{item.title}</h2>
                  <p>{item.detail}</p>
                </div>
                <b aria-hidden="true">↗</b>
              </article>
            ))}
          </div>
        </ContentSection>
        <ContentSection title="Certificates">
          <div className="empty-state">
            <p>Certificates and credentials will be added here as the portfolio grows.</p>
          </div>
        </ContentSection>
      </ContentPage>
    </PublicShell>
  );
}
