import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, ChevronLeft, ExternalLink, GitBranch } from "lucide-react";
import { PublicShell } from "../../../components/layout/PublicShell";
import { projectService } from "@/src/services";
import { optimizeCloudinaryUrl } from "@/src/lib/cloudinary-url";
import { ScreenshotSlider } from "@/components/projects/ScreenshotSlider";
import { requireAdmin } from "@/src/lib/auth";
import { sanitizeContent } from "@/src/lib/sanitize";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const canPreview = await requireAdmin();
  const project = canPreview
    ? await projectService.getBySlug(slug)
    : await projectService.getVisibleBySlug(slug);
  if (!project) return { title: "Projects | Andika" };
  const siteUrl = process.env.NEXTAUTH_URL || "https://andika.dev";
  const image = project.thumbnail || project.screenshots?.[0] || `${siteUrl}/images/andika-profile.png`;
  return {
    title: `${project.title} | Andika`,
    description: project.description,
    openGraph: {
      title: `${project.title} | Andika`,
      description: project.description,
      type: "article",
      images: [{ url: image, alt: `${project.title} cover` }],
    },
    twitter: { card: "summary_large_image", images: [image] },
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
  const canPreview = await requireAdmin();
  const project = canPreview
    ? await projectService.getBySlug(slug)
    : await projectService.getVisibleBySlug(slug);
  if (!project) notFound();

  const paragraphs = project.body.split("\n\n");
  const heroImage = project.thumbnail || project.screenshots?.[0];

  return (
    <PublicShell>
      <main className="bg-background px-[5.5vw] pb-24 pt-16 text-foreground max-md:px-4">
        <article className="mx-auto w-full max-w-[1100px]">
          {/* Back link */}
          <div className="mb-10">
            <Link
              href="/projects"
              className="inline-flex items-center gap-2 border-2 border-foreground bg-surface px-3 py-1.5 font-mono text-[10px] font-bold uppercase tracking-wide shadow-[3px_3px_0_var(--foreground)] transition-transform hover:translate-x-[-2px] hover:translate-y-[-2px]"
            >
              <ChevronLeft size={14} />
              Back to projects
            </Link>
          </div>

          {/* Hero */}
          {heroImage && (
            <div className="relative w-full aspect-[16/9] overflow-hidden border-2 border-foreground bg-surface shadow-[4px_4px_0_var(--foreground)] mb-12">
              <Image
                src={optimizeCloudinaryUrl(heroImage, 1600)}
                alt={`${project.title} cover`}
                fill
                sizes="(max-width: 768px) 100vw, 80vw"
                unoptimized
                className="object-cover"
              />
            </div>
          )}

          {/* Header */}
          <header className="mb-12">
            <div className="mb-6 flex flex-wrap items-center gap-3">
              <span className="border-2 border-foreground bg-foreground px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-wide text-background">
                {project.category}
              </span>
              {project.featured && (
                <span className="border-2 border-[#f16b5e] bg-[#f16b5e] px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-wide text-background">
                  Featured
                </span>
              )}
              <span className="ml-auto font-mono text-[10px] uppercase tracking-wide text-muted">
                Project // {slug}
              </span>
            </div>

            <h1 className="text-[clamp(36px,4.5vw,64px)] font-bold tracking-[-.04em] leading-[1.05] mb-6">
              {project.title}
            </h1>

            <p className="text-lg leading-[1.7] text-muted max-w-[720px] mb-8">
              {project.description}
            </p>

            {/* Tech stack */}
            <div className="mb-8 flex flex-wrap gap-2">
              {project.techStack.map((tech) => (
                <span
                  key={tech}
                  className="border-2 border-foreground bg-surface px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-wide shadow-[2px_2px_0_var(--foreground)]"
                >
                  {tech}
                </span>
              ))}
            </div>

            {/* Links */}
            <div className="flex flex-wrap gap-3">
              {project.liveUrl && project.liveUrl !== "#" && (
                <Link
                  href={project.liveUrl}
                  target="_blank"
                  className="inline-flex items-center gap-2 border-2 border-foreground bg-foreground px-5 py-3 font-bold shadow-[4px_4px_0_var(--line)] transition-transform hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0_var(--line)]"
                >
                  <ExternalLink size={16} />
                  Live site
                </Link>
              )}
              {project.githubUrl && project.githubUrl !== "#" && (
                <Link
                  href={project.githubUrl}
                  target="_blank"
                  className="inline-flex items-center gap-2 border-2 border-foreground bg-surface px-5 py-3 font-bold shadow-[4px_4px_0_var(--foreground)] transition-transform hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0_var(--line)]"
                >
                  <GitBranch size={16} />
                  Source code
                </Link>
              )}
            </div>
          </header>

          {/* Screenshots */}
          <section className="mb-16 border-t-2 border-foreground pt-10">
            <h2 className="mb-6 font-mono text-[11px] font-bold uppercase tracking-[.08em]">Screenshots // Visual reference</h2>
            <div className="border-2 border-foreground bg-surface p-3 shadow-[4px_4px_0_var(--foreground)]">
              <ScreenshotSlider images={project.screenshots} title={project.title} />
            </div>
          </section>

          {/* Body */}
          <section className="border-t-2 border-foreground pt-10">
            <h2 className="mb-6 font-mono text-[11px] font-bold uppercase tracking-[.08em]">Details // Case study</h2>
            <div className="prose-content max-w-none">
              {project.body.startsWith("<") ? (
                <div
                  className="border-2 border-foreground bg-surface p-6 shadow-[4px_4px_0_var(--foreground)]"
                  dangerouslySetInnerHTML={{ __html: sanitizeContent(project.body) }}
                />
              ) : (
                <div className="space-y-5">
                  {paragraphs.map((para, i) => {
                    if (para.startsWith("**")) {
                      return (
                        <p key={i} className="border-l-4 border-foreground bg-surface pl-4 py-3 font-bold text-lg">
                          {para.replace(/\*\*/g, "")}
                        </p>
                      );
                    }
                    return (
                      <p key={i} className="leading-[1.8] text-foreground">
                        {para}
                      </p>
                    );
                  })}
                </div>
              )}
            </div>
          </section>
        </article>
      </main>
    </PublicShell>
  );
}
