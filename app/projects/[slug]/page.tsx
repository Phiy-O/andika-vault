import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowUpRight, ChevronLeft, ExternalLink, GitBranch } from "lucide-react";
import { homeProjects } from "../../../data/home-projects";
import { PublicShell } from "../../../components/layout/PublicShell";

export const metadata = {
  title: "Projects | Andika",
};

export function generateStaticParams() {
  return homeProjects
    .filter((p) => p.isVisible)
    .map((project) => ({ slug: project.slug }));
}

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = homeProjects.find((p) => p.slug === slug);
  if (!project) notFound();

  const paragraphs = project.body.split("\n\n");

  return (
    <PublicShell>
      <article className="mx-auto w-full px-[10vw] py-[100px] max-md:px-[6vw] max-md:py-[60px]">
        {/* Back link */}
        <Link
          href="/projects"
          className="inline-flex items-center gap-2 text-muted text-sm hover:text-foreground transition-colors mb-12"
        >
          <ChevronLeft size={16} />
          Back to projects
        </Link>

        {/* Header */}
        <header className="max-w-[720px] mx-auto mb-14">
          <div className="flex items-center gap-3 text-muted text-[11px] tracking-[.18em] uppercase mb-6">
            <span className="border border-purple/30 text-purple rounded-md text-[11px] px-2.5 py-1 inline-block">
              {project.category}
            </span>
            {project.featured && (
              <>
                <span className="w-1 h-1 rounded-full bg-line" />
                <span>Featured</span>
              </>
            )}
          </div>

          <h1 className="text-[clamp(36px,4.5vw,64px)] font-medium tracking-[-.04em] leading-[1.05] mb-6">
            {project.title}
          </h1>

          <p className="text-muted text-lg leading-[1.7] max-w-[600px] mb-8">
            {project.description}
          </p>

          {/* Tech stack */}
          <div className="flex flex-wrap gap-2 mb-8">
            {project.techStack.map((tech) => (
              <span
                key={tech}
                className="border border-line rounded-[5px] text-muted text-[11px] h-[28px] inline-flex items-center justify-center px-2.5"
              >
                {tech}
              </span>
            ))}
          </div>

          {/* Links */}
          <div className="flex gap-4">
            {project.liveUrl && (
              <Link
                href={project.liveUrl}
                className="border border-line rounded-lg text-foreground inline-flex items-center gap-2 text-xs px-5 py-3 transition-all duration-200 hover:shadow-[0_0_2px_var(--foreground)] hover:-translate-y-0.5"
              >
                <ExternalLink size={14} />
                Live site
              </Link>
            )}
            {project.githubUrl && (
              <Link
                href={project.githubUrl}
                className="border border-line rounded-lg text-foreground inline-flex items-center gap-2 text-xs px-5 py-3 transition-all duration-200 hover:shadow-[0_0_2px_var(--foreground)] hover:-translate-y-0.5"
              >
                <GitBranch size={14} />
                Source code
              </Link>
            )}
          </div>
        </header>

        {/* Body */}
        <div className="max-w-[680px] mx-auto space-y-5 text-[15px] leading-[1.8] text-foreground/90">
          {paragraphs.map((para, i) => {
            if (para.startsWith("**")) {
              return (
                <p key={i} className="font-medium text-foreground">
                  {para.replace(/\*\*/g, "")}
                </p>
              );
            }
            return (
              <p key={i} className="text-muted">
                {para}
              </p>
            );
          })}
        </div>
      </article>
    </PublicShell>
  );
}
