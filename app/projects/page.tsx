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
          <div className="grid gap-7 grid-cols-[1.4fr_1fr] mt-[70px] m-0 max-md:grid-cols-1 max-md:mt-10">
            {projects.map((project) => (
              <article className="project-card" key={project.name}>
                <div className={`flex flex-col items-center justify-center h-[450px] relative max-md:h-[310px] ${project.tone === "art-violet" ? "bg-[#6f5a9f] text-[#211b2d]" : "bg-amber text-[#493324]"}`}>
                  <span className="text-[11px] left-[25px] absolute top-6">{project.number}</span>
                  <strong className="text-[clamp(28px,4vw,57px)] tracking-[-.08em]">{project.name.toUpperCase()}</strong>
                  <i className={`[font-family:Georgia,serif] text-lg mt-2 ${project.tone === "art-violet" ? "text-[#d4c4f4]" : "text-[#93613c]"}`}>{project.detail}</i>
                </div>
                <div className="flex items-start justify-between pt-[18px]">
                  <div>
                    <h3 className="text-base font-medium mb-[7px]">{project.name}</h3>
                    <p className="text-muted text-[11px] m-0">{project.type}</p>
                  </div>
                  <span className="text-muted text-[11px] m-0">2025</span>
                </div>
              </article>
            ))}
          </div>
        </ContentSection>
      </ContentPage>
    </PublicShell>
  );
}
