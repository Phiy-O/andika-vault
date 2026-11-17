import { getServerSession } from "next-auth";
import { authOptions } from "@/src/lib/auth";
import { blogPostService, projectService } from "@/src/services";
import { prisma } from "@/lib/prisma";
import { FileText, FolderKanban, Award, Wrench, ArrowUpRight, Plus } from "lucide-react";
import Link from "next/link";

async function getDashboardData() {
  const [blogCount, projectCount, certificateCount, skillCount, projects, posts] = await Promise.all([
    prisma.blogPost.count(), prisma.project.count(), prisma.certificate.count(), prisma.skill.count(), projectService.getVisible(), blogPostService.getVisible(),
  ]);
  return { counts: { blogCount, projectCount, certificateCount, skillCount }, projects: projects.slice(0, 4), posts: posts.slice(0, 4) };
}

const statCards = [
  { label: "Published articles", key: "blogCount" as const, href: "/admin/blog", icon: FileText, accent: "#6b8fe8" },
  { label: "Published projects", key: "projectCount" as const, href: "/admin/projects", icon: FolderKanban, accent: "#e76f51" },
  { label: "Verified milestones", key: "certificateCount" as const, href: "/admin/certificates", icon: Award, accent: "#50a878" },
  { label: "Skills in studio", key: "skillCount" as const, href: "/admin/skills", icon: Wrench, accent: "#c58a56" },
];

function PanelHeader({ title, href, action }: { title: string; href?: string; action?: string }) {
  return <div className="flex items-center justify-between border-b-2 border-foreground px-4 py-3"><h2 className="text-lg font-semibold">{title}</h2>{href && <Link className="inline-flex items-center gap-1 font-mono text-[9px] uppercase tracking-[.1em] hover:text-amber" href={href}>{action ?? "View all"} <ArrowUpRight size={13} aria-hidden="true" /></Link>}</div>;
}

export default async function AdminPage() {
  const session = await getServerSession(authOptions);
  const { counts, projects, posts } = await getDashboardData();
  return <div>
    <div className="mb-8 flex flex-wrap items-end justify-between gap-6 border-b-2 border-foreground pb-7"><div><p className="mb-3 font-mono text-[10px] uppercase tracking-[.16em] text-amber">Workspace / Overview</p><h1 className="text-[clamp(34px,5vw,58px)] font-semibold uppercase leading-[.9] tracking-[-.07em]">Welcome back, <em>{session?.user?.name ?? "admin"}.</em></h1><p className="mt-4 max-w-xl text-sm leading-[1.7] text-muted">Manage your portfolio content, technical case studies, and engineering dispatches from one central workspace.</p></div><div className="flex gap-2"><Link href="/admin/blog/new" className="inline-flex items-center gap-2 border-2 border-foreground bg-background px-4 py-3 text-xs font-semibold uppercase shadow-[3px_3px_0_var(--foreground)]"><Plus size={15} aria-hidden="true" /> Write article</Link><Link href="/admin/projects/new" className="inline-flex items-center gap-2 border-2 border-foreground bg-[#e76f51] px-4 py-3 text-xs font-semibold uppercase shadow-[3px_3px_0_var(--foreground)]"><Plus size={15} aria-hidden="true" /> New project</Link></div></div>
    <div className="mb-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{statCards.map((card) => { const Icon = card.icon; return <Link href={card.href} key={card.key} className="border-2 border-foreground bg-background p-4 shadow-[4px_4px_0_var(--foreground)] transition-transform hover:-translate-y-0.5"><div className="mb-7 flex items-start justify-between"><span className="font-mono text-[9px] uppercase tracking-[.12em] text-muted">{card.label}</span><span className="border border-foreground p-2" style={{ backgroundColor: card.accent }}><Icon size={16} aria-hidden="true" /></span></div><strong className="block text-4xl font-semibold tracking-[-.06em]">{counts[card.key].toString().padStart(2, "0")}</strong><span className="mt-2 block font-mono text-[9px] uppercase tracking-[.1em] text-muted">Content synced ↗</span></Link>; })}</div>
    <div className="grid gap-6 xl:grid-cols-[1.65fr_1fr]">
      <div className="space-y-6"><section className="border-2 border-foreground bg-background shadow-[4px_4px_0_var(--foreground)]"><PanelHeader title="Recent projects" href="/admin/projects" action="View all projects" /><div className="divide-y divide-line">{projects.length ? projects.map((project) => <Link href={`/admin/projects/${project.id}/edit`} className="grid gap-2 px-4 py-4 transition-colors hover:bg-surface sm:grid-cols-[1fr_130px_100px] sm:items-center" key={project.id}><span><strong className="block text-sm">{project.title}</strong><small className="font-mono text-[10px] text-muted">/projects/{project.slug}</small></span><span className="w-fit border border-line px-2 py-1 font-mono text-[9px]">{project.category}</span><span className="font-mono text-[9px] uppercase text-[#25825c]">● Published</span></Link>) : <p className="px-4 py-6 text-sm text-muted">No projects yet.</p>}</div></section><section className="border-2 border-foreground bg-background shadow-[4px_4px_0_var(--foreground)]"><PanelHeader title="Recent articles & dispatches" href="/admin/blog" action="View all articles" /><div className="divide-y divide-line">{posts.length ? posts.map((post) => <Link href={`/admin/blog/${post.id}/edit`} className="grid gap-2 px-4 py-4 transition-colors hover:bg-surface sm:grid-cols-[1fr_130px_80px] sm:items-center" key={post.id}><span><strong className="block text-sm">{post.title}</strong><small className="font-mono text-[10px] text-muted">/blog/{post.slug}</small></span><span className="w-fit border border-line px-2 py-1 font-mono text-[9px]">{post.category}</span><span className="font-mono text-[9px] text-muted">{post.readTime}</span></Link>) : <p className="px-4 py-6 text-sm text-muted">No articles yet.</p>}</div></section></div>
      <aside className="space-y-6"><section className="border-2 border-foreground bg-background p-4 shadow-[4px_4px_0_var(--foreground)]"><div className="mb-4 flex items-center justify-between border-b-2 border-foreground pb-3"><h2 className="text-lg font-semibold">Quick actions</h2><span className="font-mono text-[9px] uppercase text-muted">Studio ops</span></div><div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-1">{[["Add project", "/admin/projects/new", "Case study spec"], ["Draft article", "/admin/blog/new", "Technical dispatch"], ["Log milestone", "/admin/certificates/new", "Award / certificate"], ["Manage skills", "/admin/skills", "Stack inventory"]].map(([label, href, description]) => <Link href={href} key={href} className="border-2 border-foreground p-3 transition-colors hover:bg-[#e76f51]"><strong className="block text-sm">{label}</strong><small className="mt-2 block text-xs text-muted">{description}</small></Link>)}</div></section><section className="border-2 border-foreground bg-surface p-4 shadow-[4px_4px_0_var(--foreground)]"><p className="mb-2 font-mono text-[9px] uppercase tracking-[.12em] text-muted">Workspace status</p><p className="text-sm leading-[1.6]">Content studio online. Existing records remain available through each management module.</p></section></aside>
    </div>
  </div>;
}
