import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Download } from "lucide-react";

export function HomeHero({ resumeUrl }: { resumeUrl?: string | null }) {
  return (
    <section className="mx-auto grid max-w-7xl gap-12 border-b border-line px-[5.5vw] pb-14 pt-28 lg:grid-cols-[1.08fr_.92fr] lg:items-center lg:gap-20 lg:pb-20" id="top" aria-labelledby="hero-title">
      <div>
        <p className="mb-5 font-mono text-[10px] uppercase tracking-[.16em] text-muted">Hello / I&apos;m Andika</p>
        <h1 id="hero-title" className="mb-7 max-w-[680px] text-[clamp(48px,7vw,92px)] font-semibold uppercase leading-[.87] tracking-[-.075em]">I build things that <em>make sense.</em></h1>
        <p className="max-w-[560px] text-base leading-[1.7] text-muted lg:text-lg">I&apos;m a software developer who enjoys turning ideas into useful applications, reliable systems, and practical technical experiments.</p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link className="inline-flex items-center gap-2 border border-foreground bg-[#e76f51] px-5 py-3 text-xs font-semibold uppercase shadow-[3px_3px_0_var(--foreground)] transition-transform hover:-translate-y-0.5" href="#projects">Explore my work <ArrowUpRight size={15} aria-hidden="true" /></Link>
          <Link className="inline-flex items-center gap-2 border border-foreground bg-background px-5 py-3 text-xs font-semibold uppercase transition-colors hover:bg-surface" href="/about">More about me <ArrowUpRight size={15} aria-hidden="true" /></Link>
          <a className="inline-flex items-center gap-2 border border-foreground bg-background px-5 py-3 text-xs font-semibold uppercase transition-colors hover:bg-surface" href={resumeUrl ?? "/resume/dummy-resume.pdf"} download>CV <Download size={15} aria-hidden="true" /></a>
        </div>
        <p className="mt-8 border-t border-line pt-3 font-mono text-[9px] uppercase tracking-[.12em] text-muted">Web development / backend / engineering</p>
      </div>
      <div className="relative mx-auto w-full max-w-[520px] border-2 border-foreground bg-surface p-2 shadow-[7px_7px_0_var(--foreground)]">
        <div className="relative aspect-[4/3] overflow-hidden border border-foreground bg-background">
          <Image src="/images/andika-profile.png" alt="Andika working at a laptop" fill className="object-contain object-bottom" priority sizes="(max-width: 1024px) 90vw, 520px" />
        </div>
        <div className="flex justify-between pt-2 font-mono text-[8px] uppercase tracking-[.1em] text-muted"><span>Selected visual / 01</span><span>Available / 2026</span></div>
      </div>
    </section>
  );
}
