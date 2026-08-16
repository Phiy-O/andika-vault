import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, ChevronLeft, ExternalLink, GitBranch } from "lucide-react";
import { PublicShell } from "../../../components/layout/PublicShell";
import { projectService } from "@/src/services";
import { getServerSession } from "next-auth";
import { authOptions } from "@/src/lib/auth";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const session = await getServerSession(authOptions);
  const project = session
    ? await projectService.getBySlug(slug)
    : await projectService.getVisibleBySlug(slug);
  if (!project) return { title: "Projects | Andika" };
  return {
    title: `${project.title} | Andika`,
    description: project.description,
  };
}

export async function generateStaticParams() {
  const projects = await projectService.getVisible();
  return projects
    .filter((p) => p.isVisible)
    .map((project: any) => ({ slug: project.slug }));
}

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const session = await getServerSession(authOptions);
  const project = session
    ? await projectService.getBySlug(slug)
    : await projectService.getVisibleBySlug(slug);
  if (!project) notFound();

  const paragraphs = project.body.split("\n\n");
  const screenshot = project.screenshots?.[0] || project.thumbnail;

  return (
    <PublicShell>
      <article className="mx-auto w-full px-[10vw] max-md:px-[6vw]">
        {/* Back link */}
        <div className="mt-16 pt-[60px] pb-4">
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 text-muted text-sm hover:text-foreground transition-colors"
          >
            <ChevronLeft size={16} />
            Back to projects
          </Link>
        </div>

        {/* Hero screenshot */}
        {screenshot && (
          <div className="relative w-full h-[420px] max-md:h-[240px] rounded-[18px] overflow-hidden border border-line/50 mb-12 mt-2">
            <Image
              src={screenshot}
              alt={`${project.title} screenshot`}
              fill
              sizes="(max-width: 768px) 100vw, 80vw"
              className="object-cover"
            />
          </div>
        )}

        {/* Header */}
        <header className="w-full mx-auto mb-14">
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
            {project.liveUrl && project.liveUrl !== "#" && (
              <Link
                href={project.liveUrl}
                target="_blank"
                className="border border-line rounded-lg text-foreground inline-flex items-center gap-2 text-xs px-5 py-3 transition-all duration-200 hover:shadow-[0_0_2px_var(--foreground)] hover:-translate-y-0.5"
              >
                <ExternalLink size={14} />
                Live site
              </Link>
            )}
            {project.githubUrl && project.githubUrl !== "#" && (
              <Link
                href={project.githubUrl}
                target="_blank"
                className="border border-line rounded-lg text-foreground inline-flex items-center gap-2 text-xs px-5 py-3 transition-all duration-200 hover:shadow-[0_0_2px_var(--foreground)] hover:-translate-y-0.5"
              >
                <GitBranch size={14} />
                Source code
              </Link>
            )}
          </div>
        </header>

        {/* Body */}
        <div className="w-full mx-auto space-y-5 text-[15px] leading-[1.8] text-foreground/90 pb-[130px] max-md:pb-[90px]">
          {project.body.startsWith("<") ? (
            <div
              className="prose-content"
              dangerouslySetInnerHTML={{ __html: project.body }}
            />
          ) : (
            paragraphs.map((para, i) => {
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
            })
          )}
        </div>
      </article>
    </PublicShell>
  );
}
