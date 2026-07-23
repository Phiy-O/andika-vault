import { ContentPage, ContentSection } from "../../components/content/ContentPage";
import { PublicShell } from "../../components/layout/PublicShell";

export const metadata = {
  title: "Projects | Andika",
  description: "Selected projects by Andika, from product concepts to full-stack builds.",
};

const projects = [
  {
    number: "01",
    name: "Rentalin",
    type: "Product design · Full-stack development",
    detail: "A clearer way to discover and manage rentals.",
    tone: "art-violet",
  },
  {
    number: "02",
    name: "Andika Vault",
    type: "Design system · Development",
    detail: "A personal home for projects, writing, and ideas.",
    tone: "art-amber",
  },
];

export default function ProjectsPage() {
  return (
    <PublicShell>
      <ContentPage
        eyebrow="Projects"
        title={
          <>
            Things I&apos;ve <em>shaped.</em>
          </>
        }
        description="A selection of work where product thinking, design, and engineering meet."
      >
        <ContentSection title="Selected work">
          <div className="project-grid page-project-grid">
            {projects.map((project) => (
              <article className="project-card" key={project.name}>
                <div className={`project-art ${project.tone}`}>
                  <span>{project.number}</span>
                  <strong>{project.name.toUpperCase()}</strong>
                  <i>{project.detail}</i>
                </div>
                <div className="project-meta">
                  <div>
                    <h3>{project.name}</h3>
                    <p>{project.type}</p>
                  </div>
                  <span>2025</span>
                </div>
              </article>
            ))}
          </div>
        </ContentSection>
      </ContentPage>
    </PublicShell>
  );
}
