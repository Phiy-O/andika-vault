import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { getSiteSettings } from "@/src/actions/site-setting";

export async function Footer() {
  const { data: settings } = await getSiteSettings();
  const socialLinks = [
    { label: "GitHub", href: settings?.githubUrl },
    { label: "LinkedIn", href: settings?.linkedinUrl },
    { label: "Instagram", href: settings?.instagramUrl },
  ].filter((link): link is { label: string; href: string } => Boolean(link.href));

  return (
    <footer className="border-t-2 border-foreground bg-background">
      <div className="mx-auto flex max-w-7xl flex-col gap-8 px-[5.5vw] py-10 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-md">
          <p className="mb-3 font-mono text-[10px] uppercase tracking-[.14em]">Andika / Software Engineer</p>
          <p className="m-0 text-sm leading-[1.6] text-muted">Full-stack & systems software engineer specializing in resilient architectures, practical user systems, and runtime performance.</p>
        </div>
        <nav className="flex flex-wrap items-center gap-2" aria-label="Footer links">
          {socialLinks.map((link) => <a className="inline-flex items-center gap-1 border border-foreground px-3 py-2 font-mono text-[9px] uppercase tracking-[.08em] transition-colors hover:bg-surface" href={link.href} key={link.label} target="_blank" rel="noreferrer">{link.label} <ArrowUpRight size={12} aria-hidden="true" /></a>)}
          <Link className="inline-flex items-center gap-1 border border-foreground px-3 py-2 font-mono text-[9px] uppercase tracking-[.08em] transition-colors hover:bg-surface" href="#top">Back to top <ArrowUpRight size={12} aria-hidden="true" /></Link>
        </nav>
      </div>
      <div className="mx-auto flex max-w-7xl flex-col gap-2 border-t border-line px-[5.5vw] py-5 font-mono text-[9px] uppercase tracking-[.08em] text-muted sm:flex-row sm:items-center sm:justify-between"><span>© 2026 Andika. Built with care.</span><span>Available for thoughtful work / Indonesia</span></div>
    </footer>
  );
}
