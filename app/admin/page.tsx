import { getServerSession } from "next-auth";
import { authOptions } from "@/src/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  FileText,
  FolderKanban,
  Award,
  Wrench,
} from "lucide-react";
import Link from "next/link";

async function getStats() {
  const [blogCount, projectCount, certificateCount, skillCount] =
    await Promise.all([
      prisma.blogPost.count(),
      prisma.project.count(),
      prisma.certificate.count(),
      prisma.skill.count(),
    ]);
  return { blogCount, projectCount, certificateCount, skillCount };
}

const statCards = [
  {
    label: "Blog Posts",
    href: "/admin/blog",
    icon: FileText,
    countKey: "blogCount" as const,
    color: "from-[#a98bff] to-[#7391ff]",
  },
  {
    label: "Projects",
    href: "/admin/projects",
    icon: FolderKanban,
    countKey: "projectCount" as const,
    color: "from-[#f1b86d] to-[#e8954a]",
  },
  {
    label: "Certificates",
    href: "/admin/certificates",
    icon: Award,
    countKey: "certificateCount" as const,
    color: "from-[#5c7cfa] to-[#4a6ae0]",
  },
  {
    label: "Skills",
    href: "/admin/skills",
    icon: Wrench,
    countKey: "skillCount" as const,
    color: "from-[#51c9a8] to-[#3db892]",
  },
];

export default async function AdminPage() {
  const session = await getServerSession(authOptions);
  const stats = await getStats();

  return (
    <div>
      {/* header */}
      <div className="mb-10">
        <p className="text-muted text-[11px] tracking-[.18em] mb-5 uppercase">
          Dashboard
        </p>
        <h1 className="text-[clamp(32px,5vw,43px)] font-medium tracking-[-.065em] leading-[.96] text-foreground">
          Welcome back{session?.user?.name ? `, ${session.user.name}` : ""}
        </h1>
        <p className="mt-4 text-muted text-[15px] leading-[1.7] max-w-md">
          Here&apos;s an overview of your portfolio content.
        </p>
      </div>

      {/* stat cards */}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <Link
              key={card.href}
              href={card.href}
              className="group rounded-xl border border-line bg-surface/30 p-6 transition-all duration-200 hover:-translate-y-0.5 hover:border-purple hover:shadow-[0_0_2px_var(--foreground)]"
            >
              <div
                className={`mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br ${card.color}`}
              >
                <Icon size={18} className="text-white" />
              </div>
              <p className="text-3xl font-medium tracking-[-.03em] text-foreground">
                {stats[card.countKey]}
              </p>
              <p className="mt-1 text-sm text-muted">{card.label}</p>
            </Link>
          );
        })}
      </div>

      {/* quick links */}
      <div className="mt-12 border-t border-line pt-8">
        <p className="text-muted text-[10px] tracking-[.12em] mb-5 uppercase">
          Quick Actions
        </p>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/admin/blog"
            className="rounded-lg border border-line px-5 py-3 text-sm text-foreground transition-all duration-200 hover:-translate-y-0.5 hover:border-purple hover:shadow-[0_0_2px_var(--foreground)]"
          >
            + New Blog Post
          </Link>
          <Link
            href="/admin/projects"
            className="rounded-lg border border-line px-5 py-3 text-sm text-foreground transition-all duration-200 hover:-translate-y-0.5 hover:border-purple hover:shadow-[0_0_2px_var(--foreground)]"
          >
            + New Project
          </Link>
          <Link
            href="/"
            className="rounded-lg border border-line px-5 py-3 text-sm text-foreground transition-all duration-200 hover:-translate-y-0.5 hover:border-purple hover:shadow-[0_0_2px_var(--foreground)]"
          >
            View Site
          </Link>
        </div>
      </div>
    </div>
  );
}
