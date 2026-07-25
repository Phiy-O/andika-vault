import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { homeProjects, type HomeProject } from "../../data/home-projects";
import { SectionEyebrow } from "../content/SectionEyebrow";
import { Card } from "../content/Card";

type HomeProjectsSectionProps = {
  projects?: HomeProject[];
};

const DEFAULT_PROJECT_THUMBNAIL = "/images/thumbnails/projects-thumbnail.png";

export function HomeProjectsSection({
  projects = homeProjects,
}: HomeProjectsSectionProps) {
  const visibleProjects = projects
    .filter((project) => project.isVisible)
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .slice(0, 3);

  return (
    <section
      className="border-b border-line mx-auto py-[130px] px-[10vw] relative max-md:py-[90px] max-md:px-[6vw]"
      id="projects"
      aria-labelledby="home-projects-title"
    >
      <div className="items-end grid gap-[60px] grid-cols-[1.1fr_.9fr] mx-auto mb-[64px] w-full max-md:items-start max-md:gap-[34px] max-md:grid-cols-1 max-md:mb-[44px]">
        <div>
          <SectionEyebrow>Projects</SectionEyebrow>
          <h2
            className="text-[clamp(48px,6vw,78px)] mb-0 max-md:text-[clamp(36px,8vw,56px)]"
            id="home-projects-title"
          >
            Things I&apos;ve <em>shaped.</em>
          </h2>
        </div>
        <div className="items-start flex flex-col gap-7">
          <p className="text-muted text-base leading-[1.75] m-0 max-w-[430px]">
            A selection of work where product thinking, design, and engineering
            meet.
          </p>
          <Link
            className="border border-line rounded-lg text-foreground inline-flex items-center w-fit text-xs px-5 py-3 transition-all duration-200 hover:shadow-[0_0_2px_var(--foreground)] hover:-translate-y-0.5"
            href="/projects"
          >
            View all projects{" "}
            <span className="text-foreground text-[17px] ml-2" aria-hidden="true">
              <ArrowUpRight size={18} />
            </span>
          </Link>
        </div>
      </div>

      <div className="grid gap-[18px] grid-cols-3 mx-auto w-full max-md:grid-cols-1">
        {visibleProjects.map((project, index) => (
          <Card href={`/projects/${project.slug}`} className="min-h-[360px] max-md:min-h-0" key={project.id}>
            <div className="rounded-tl-[14px] h-[220px] mb-6 overflow-hidden relative max-md:h-[180px]">
              <Image
                src={project.thumbnail || DEFAULT_PROJECT_THUMBNAIL}
                alt=""
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 33vw"
              />
            </div>
            <span className="text-purple text-xs tracking-[.14em] px-6 py-0 relative z-10">
              {String(index + 1).padStart(2, "0")}
            </span>
            <div className="mt-[18px] px-6 pb-4 relative z-10">
              <h3 className="text-[clamp(22px,2vw,30px)] font-medium tracking-[-.04em] leading-[1.05] mb-3.5 line-clamp-2">
                {project.title}
              </h3>
              <p className="text-muted text-sm leading-[1.7] mb-[18px] line-clamp-2">
                {project.description}
              </p>
              <div className="flex flex-wrap gap-2 mb-0">
                {project.techStack.map((tech) => (
                  <span
                    className="items-center border border-line rounded-[5px] text-muted inline-flex text-[11px] h-[28px] justify-center px-2.5 py-0"
                    key={tech}
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
            <div className="items-center border-t border-line text-muted flex text-xs justify-between mt-auto py-[22px] px-6 relative z-10">
              <span>View project</span>
              <ArrowUpRight className="text-purple" size={18} aria-hidden="true" />
            </div>
          </Card>
        ))}
      </div>
    </section>
  );
}
