import Image from "next/image";
import Link from "next/link";
import { AboutSkills } from "../../components/about/AboutSkills";
import { PublicShell } from "../../components/layout/PublicShell";
import { PageHero } from "../../components/content/PageHero";
import { skillService } from "@/src/services";
import { getSiteSettings } from "@/src/actions/site-setting";
import { CTAButton } from "../../components/content/CTAButton";
import { SectionEyebrow } from "../../components/content/SectionEyebrow";
import { Sparkles, Target, Layers, Download } from "lucide-react";

export const revalidate = 3600;

export const metadata = {
  title: "About | Andika",
  description: "Learn about Andika's approach to building useful digital products.",
};

export default async function AboutPage() {
  const [skills, settings] = await Promise.all([
    skillService.getVisible(),
    getSiteSettings(),
  ]);
  return (
    <PublicShell>
      <PageHero
        eyebrow="About me"
        title={<>Making the digital <em>feel more human.</em></>}
        description="I am a software engineer focused on turning complex ideas into clear, useful, and quietly memorable digital experiences."
      />

      {/* Photo + Narrative */}
      <section className="mx-auto w-full px-[10vw] max-md:px-[6vw] border-t border-line pt-[80px] pb-[120px] max-md:pt-[65px] max-md:pb-[85px]">
        <div className="grid gap-[70px] grid-cols-[1fr_1.2fr] items-center max-md:grid-cols-1 max-md:gap-[50px]">
          <div className="relative rounded-[18px] overflow-hidden aspect-[4/5] max-md:aspect-[4/3] border border-line/50 transition-all duration-300 hover:border-purple/30 hover:shadow-[0_0_30px_rgba(169,139,255,.08)]">
            <Image
              src="/images/andika-profile.png"
              alt="Andika"
              fill
              className="object-cover transition-transform duration-500 hover:scale-[1.02]"
              sizes="(max-width: 768px) 100vw, 45vw"
              priority
            />
          </div>
          <div className="flex flex-col gap-6">
            <p className="text-muted text-[11px] tracking-[.18em] mb-4 uppercase">
              <Sparkles size={12} className="inline mr-[6px] -mt-[2px]" aria-hidden="true" />
              The short version
            </p>
            <p className="text-muted text-lg leading-[1.8] m-0">
              Good work lives somewhere between sharp strategy and genuine
              curiosity about people. I care about the details, the architecture
              underneath, and the moment a product simply clicks.
            </p>
            <p className="text-muted text-lg leading-[1.8] m-0">
              My work sits at the intersection of product thinking, thoughtful
              interface design, and dependable full-stack engineering.
            </p>
            <div className="flex gap-6 mt-2">
              <div>
                <span className="text-foreground text-[26px] font-medium tracking-[-.04em]">5+</span>
                <span className="text-muted block text-[11px] tracking-[.06em] uppercase mt-1">Years coding</span>
              </div>
              <div>
                <span className="text-foreground text-[26px] font-medium tracking-[-.04em]">20+</span>
                <span className="text-muted block text-[11px] tracking-[.06em] uppercase mt-1">Projects built</span>
              </div>
              <div>
                <span className="text-foreground text-[26px] font-medium tracking-[-.04em]">∞</span>
                <span className="text-muted block text-[11px] tracking-[.06em] uppercase mt-1">Cups of coffee</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Skills */}
      <section className="mx-auto w-full px-[10vw] max-md:px-[6vw] border-t border-line pt-[80px] pb-[120px] max-md:pt-[65px] max-md:pb-[85px]">
        <SectionEyebrow>
          Skills
        </SectionEyebrow>
        <h2 className="text-[clamp(32px,4vw,48px)] font-medium tracking-[-.04em] leading-[1.1] mt-0 mb-10 max-w-[680px]">
          The skills, tools and technologies I am really good at.
        </h2>
        <AboutSkills skills={skills as any} />
      </section>

      {/* Resume */}
      <section className="mx-auto w-full px-[10vw] max-md:px-[6vw] border-t border-line pt-[80px] pb-[120px] max-md:pt-[65px] max-md:pb-[85px]">
        <SectionEyebrow>
          Resume
        </SectionEyebrow>
        <h2 className="text-[clamp(32px,4vw,48px)] font-medium tracking-[-.04em] leading-[1.1] mt-0 mb-6 max-w-[680px]">
          Want the full picture?
        </h2>
        <p className="text-muted text-base leading-[1.75] mb-8 max-w-[480px]">
          A complete overview of my experience, education, and skills in a single PDF.
        </p>
        <Link
          href={settings?.data?.resumeUrl ?? "/resume/dummy-resume.pdf"}
          target="_blank"
          download
          className="border border-line rounded-lg text-foreground inline-flex items-center gap-2.5 text-xs px-5 py-3 transition-all duration-200 hover:shadow-[0_0_2px_var(--foreground)] hover:-translate-y-0.5"
        >
          <Download size={14} />
          Download resume
        </Link>
      </section>

      {/* How I Work */}
      <section className="mx-auto w-full px-[10vw] max-md:px-[6vw] border-t border-line pt-[80px] pb-[120px] max-md:pt-[65px] max-md:pb-[85px]">
      <SectionEyebrow>
          <Target size={12} className="inline mr-[6px] -mt-[2px]" aria-hidden="true" />
          Process
        </SectionEyebrow>
        <h2 className="text-[clamp(32px,4vw,48px)] font-medium tracking-[-.04em] leading-[1.1] mt-0 mb-[60px] max-w-[680px]">
          How I work
        </h2>
        <div className="grid gap-[25px] grid-cols-3 max-md:grid-cols-1">
          <article className="border border-line rounded-xl p-8 pt-6 transition-all duration-300 hover:border-purple/30 hover:shadow-[0_0_24px_rgba(169,139,255,.06)] hover:-translate-y-1 max-md:p-6">
            <div className="flex items-center justify-between mb-5">
              <span className="text-purple text-xs font-medium">01</span>
              <Layers size={18} className="text-purple/50" aria-hidden="true" />
            </div>
            <h3 className="text-[22px] font-medium tracking-[-.03em] mt-0 mb-3 mx-0">
              Start with clarity
            </h3>
            <p className="text-muted text-sm leading-[1.7] m-0">
              Understand the real problem before reaching for a solution.
            </p>
          </article>
          <article className="border border-line rounded-xl p-8 pt-6 transition-all duration-300 hover:border-purple/30 hover:shadow-[0_0_24px_rgba(169,139,255,.06)] hover:-translate-y-1 max-md:p-6">
            <div className="flex items-center justify-between mb-5">
              <span className="text-purple text-xs font-medium">02</span>
              <Layers size={18} className="text-purple/50" aria-hidden="true" />
            </div>
            <h3 className="text-[22px] font-medium tracking-[-.03em] mt-0 mb-3 mx-0">
              Build with intent
            </h3>
            <p className="text-muted text-sm leading-[1.7] m-0">
              Choose simple, durable systems that can grow with the idea.
            </p>
          </article>
          <article className="border border-line rounded-xl p-8 pt-6 transition-all duration-300 hover:border-purple/30 hover:shadow-[0_0_24px_rgba(169,139,255,.06)] hover:-translate-y-1 max-md:p-6">
            <div className="flex items-center justify-between mb-5">
              <span className="text-purple text-xs font-medium">03</span>
              <Layers size={18} className="text-purple/50" aria-hidden="true" />
            </div>
            <h3 className="text-[22px] font-medium tracking-[-.03em] mt-0 mb-3 mx-0">
              Leave room for people
            </h3>
            <p className="text-muted text-sm leading-[1.7] m-0">
              Make technology feel approachable, useful, and considered.
            </p>
          </article>
        </div>
      </section>

      {/* CTA */}
      <div className="mx-auto w-full py-0 px-[10vw] pb-[130px] max-md:px-[6vw] max-md:pb-[90px]">
      <CTAButton href="/contact" label="Have a project in mind" />
    </div>
    </PublicShell>
  );
}
