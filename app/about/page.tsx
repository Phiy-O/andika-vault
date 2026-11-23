import Image from "next/image";
import Link from "next/link";
import { PublicShell } from "../../components/layout/PublicShell";
import { AboutSkills } from "../../components/about/AboutSkills";
import { skillService } from "@/src/services";
import { getSiteSettings } from "@/src/actions/site-setting";
import { parseAboutContent } from "@/src/lib/about-content";
import { SITE_SETTINGS_DEFAULTS } from "@/src/lib/validations/site-settings";

export const revalidate = 3600;

export const metadata = {
  title: "About | Andika",
  description: "Learn about Andika's approach to building useful digital products.",
};

function SectionHeader({ index, label, note, color = "#f16b5e" }: { index: string; label: string; note: string; color?: string }) {
  return <div className="mb-6 flex items-center justify-between border-b-2 border-foreground pb-3 max-md:items-start max-md:gap-4"><div className="flex items-center gap-2 font-mono text-[11px] font-bold uppercase tracking-[.08em]"><span className="h-3 w-3 border-2 border-foreground" style={{ backgroundColor: color }} />{`${index} // ${label}`}</div><span className="font-mono text-[9px] uppercase tracking-[.1em] text-muted max-md:text-right">[ {note} ]</span></div>;
}

export default async function AboutPage() {
  const [skills, settings] = await Promise.all([skillService.getVisible(), getSiteSettings()]);
  const settingsData = settings.data ?? SITE_SETTINGS_DEFAULTS;
  const content = parseAboutContent(settingsData);
  const resumeUrl = settingsData.resumeUrl ?? "/resume/dummy-resume.pdf";

  return (
    <PublicShell>
      <main className="bg-background px-[5.5vw] pb-20 pt-16 text-foreground">
        <div className="mx-auto w-full space-y-16">
          <section>
            <SectionHeader index="01" label="Behind the code" note="Profile verified // discipline: dev architect" />
            <div className="grid gap-6 lg:grid-cols-12">
              <div className="space-y-5 lg:col-span-7">
                <h1 className="max-w-3xl text-[clamp(42px,5vw,68px)] font-bold leading-[.94] tracking-[-.06em]">A little more about me.</h1>
                <p className="max-w-2xl text-lg font-semibold leading-[1.3] text-[#a9362e]">Curious about how things work. Even more curious about how to make them better.</p>
                <p className="max-w-2xl text-base leading-[1.65]">{content.aboutIntro}</p>
                <div className="border-2 border-foreground bg-surface p-5 shadow-[3px_3px_0_var(--foreground)]">
                  <div className="mb-4 flex justify-between border-b border-line pb-2 font-mono text-[10px] uppercase tracking-[.08em]"><span>Spec sheet // ELIAS_REID.V2</span><span className="bg-[#00aa76] px-2 py-1 text-[#003522]">Active on call</span></div>
                  <div className="grid gap-4 sm:grid-cols-3 font-mono text-[10px] uppercase tracking-[.06em]"><div><span className="text-muted">Primary role</span><strong className="mt-1 block font-sans text-sm normal-case tracking-normal">{content.aboutRole}</strong></div><div><span className="text-muted">Location</span><strong className="mt-1 block font-sans text-sm normal-case tracking-normal">{content.aboutLocation}</strong></div><div><span className="text-muted">Current focus</span><strong className="mt-1 block font-sans text-sm normal-case tracking-normal text-[#a9362e]">{content.aboutFocus}</strong></div></div>
                </div>
              </div>
              <div className="border-2 border-foreground bg-surface p-3 shadow-[4px_4px_0_var(--foreground)] lg:col-span-5">
                <div className="mb-2 flex items-center justify-between border-b-2 border-foreground pb-2 font-mono text-[9px] uppercase"><span className="flex gap-1.5"><i className="h-3 w-3 rounded-full border border-foreground bg-[#f16b5e]" /><i className="h-3 w-3 rounded-full border border-foreground bg-[#73b8ff]" /><i className="h-3 w-3 rounded-full border border-foreground bg-[#00aa76]" /></span><span>Fig. 01 // architect profile</span></div>
                <div className="border-2 border-foreground bg-background p-5"><div className="relative mx-auto aspect-square max-w-[230px] overflow-hidden rounded-xl border-2 border-foreground bg-surface shadow-[3px_3px_0_var(--foreground)]"><Image src="/images/andika-profile.png" alt="Andika profile" fill className="object-cover" sizes="230px" priority /></div><div className="mt-5 flex justify-between font-mono text-[9px] uppercase"><span className="border-2 border-foreground bg-background px-2 py-1">● {content.aboutRole}</span><span className="border-2 border-foreground bg-background px-2 py-1 text-[#a9362e]">{content.aboutLocation}</span></div></div>
                <div className="mt-2 border-2 border-foreground bg-background p-3 font-mono text-[10px] leading-[1.7] uppercase"><p><b className="text-[#58413f]">Discipline:</b> {content.aboutDiscipline}</p><p><b className="text-[#58413f]">Philosophy:</b> {content.aboutPhilosophy}</p><p><b className="text-[#58413f]">Core runtime:</b> {content.aboutRuntime}</p></div>
              </div>
            </div>
          </section>

          <section className="border-t-2 border-foreground pt-7"><SectionHeader index="02" label="The journey" note="Narrative log // chronology" color="#73b8ff" /><div className="grid gap-8 lg:grid-cols-12"><div className="space-y-5 lg:col-span-8"><h2 className="text-4xl font-bold tracking-[-.04em]">How it started.</h2>{content.journey.slice(0, 2).map((item) => <p className="leading-[1.7]" key={item.title}>{item.body}</p>)}</div><div className="border-2 border-foreground bg-surface p-4 font-mono text-xs leading-[1.8] shadow-[3px_3px_0_var(--foreground)] lg:col-span-4"><p className="border-b border-line pb-2 font-bold uppercase">Dispatch // origin notes</p><p className="mt-4 text-[#a9362e]">int main(void) &#123;</p><p className="pl-4 text-[#006c49]">printf(&quot;Init: Curiosity&quot;);</p><p className="pl-4">return ARCH_RESILIENT;</p><p>&#125;</p><p className="mt-5 border-t border-line pt-3 text-[#006c49]">Canonical state: stable 0xDEADBEEF</p></div></div></section>

          <section className="border-t-2 border-foreground pt-7"><SectionHeader index="03" label="Engineering focus" note="Three core pillars of operation" color="#00aa76" /><h2 className="mb-2 text-4xl font-bold tracking-[-.04em]">The kind of work I enjoy.</h2><p className="mb-7 max-w-2xl text-muted">A disciplined intersection between tactile graphical user interfaces, deterministic backend topologies, and low-level hardware experimentation.</p><div className="grid gap-5 md:grid-cols-3">{content.pillars.map((pillar, index) => <article className="border-2 border-foreground bg-surface p-5 shadow-[3px_3px_0_var(--foreground)]" key={pillar.title}><div className="mb-5 flex justify-between border-b-2 border-foreground pb-3"><span className="font-mono text-xl">{String(index + 1).padStart(2, "0")}</span><span className="bg-[#f16b5e] px-2 py-1 font-mono text-[9px] uppercase text-background">{pillar.tag}</span></div><h3 className="text-2xl font-bold">{pillar.title}</h3><p className="mt-2 text-sm leading-[1.6] text-muted">{pillar.description}</p><div className="mt-5 flex gap-1 font-mono text-[9px] uppercase"><span className="border border-line px-2 py-1">Systems</span><span className="border border-line px-2 py-1">Reliable</span></div></article>)}</div></section>

          <section className="border-t-2 border-foreground pt-7"><SectionHeader index="04" label="Tools I work with" note="Current stack // selected instruments" /><h2 className="mb-7 text-4xl font-bold tracking-[-.04em]">Tools I work with.</h2><div className="border-2 border-foreground bg-surface p-5"><AboutSkills skills={skills} /></div></section>

          <section className="border-t-2 border-foreground pt-7"><SectionHeader index="05" label="A journey in progress" note="Selected chapters // engineering timeline" color="#73b8ff" /><h2 className="mb-7 text-4xl font-bold tracking-[-.04em]">A journey in progress.</h2><div className="space-y-3">{content.timeline.map((item, index) => <article className="grid gap-3 border-2 border-foreground bg-surface p-4 md:grid-cols-[100px_1fr]" key={item.title}><span className="font-mono text-xs text-[#a9362e]">[{String(index + 1).padStart(2, "0")}]</span><div><h3 className="font-bold">{item.title}</h3><p className="mt-1 text-sm text-muted">{item.description}</p></div></article>)}</div></section>

          <section className="border-2 border-foreground bg-[#f16b5e] p-6 shadow-[4px_4px_0_var(--foreground)] md:flex md:items-center md:justify-between"><div><p className="font-mono text-[10px] uppercase">Ready to build // collaborate</p><h2 className="mt-2 text-3xl font-bold tracking-[-.04em]">Know you a little about me.</h2></div><Link href={resumeUrl} target="_blank" className="mt-5 inline-block border-2 border-foreground bg-background px-4 py-3 font-mono text-[10px] font-bold uppercase shadow-[3px_3px_0_var(--foreground)] md:mt-0">View resume ↗</Link></section>
        </div>
      </main>
    </PublicShell>
  );
}
