import { Navbar } from "../components/layout/Navbar";
import { Footer } from "../components/layout/Footer";
import { CodeSnippet } from "../components/content/CodeSnippet";
import { SectionEyebrow } from "../components/content/SectionEyebrow";
import { HomeBlogSection } from "../components/blog";
import { HomeCertificatesSection } from "../components/certificates";
import { HomeProjectsSection } from "../components/projects";
import { SkillsSection } from "../components/skills";
import Image from "next/image";
import { ArrowUpRight, Download, User } from "lucide-react";

export default function Home() {
  return (
    <main>
      <Navbar />

      <section
        className="flex items-center justify-between gap-10 mx-auto max-w-full min-h-[640px] mt-16 overflow-hidden py-[12vh] px-[10vw] relative after:content-[''] after:absolute after:right-[15%] after:top-[21%] after:h-[5px] after:w-[5px] after:rounded-full after:bg-purple max-md:items-start max-md:flex-col max-md:min-h-0 max-md:py-[90px] max-md:px-[6vw] max-md:pb-[50px]"
        id="top"
        aria-labelledby="hero-title"
      >
        <div className="max-w-[610px] relative z-20 max-md:max-w-none max-md:w-full">
          <SectionEyebrow>
            <span className="bg-purple rounded-full inline-block h-[6px] w-[6px] mr-[10px] align-[1px]" /> I&apos;m a software engineer
          </SectionEyebrow>
          <h1 id="hero-title" className="text-[clamp(46px,5vw,72px)] font-medium tracking-[-.065em] leading-[.96] mb-7 max-md:text-[clamp(42px,9vw,72px)]">Hi, I&apos;m <em>Andika</em><br />I build things for <em>Fun</em></h1>
          <p className="text-muted text-xl leading-[1.7] max-w-[640px] max-md:text-base max-md:leading-[1.7]">I&apos;m passionate about creating thoughtful digital products that are clear, useful, and built to last.</p>
          <div className="flex items-center gap-[27px] mt-[38px]">
            <a className="inline-flex rounded-lg text-base gap-5 py-4 px-7 transition-all duration-200 hover:-translate-y-0.5 bg-gradient-to-br from-[#a98bff] to-[#7391ff] text-[#f0f0f0] hover:brightness-[1.05] hover:shadow-[0_0_16px_rgba(255,255,255,.25)] max-md:py-3 max-md:px-5 max-md:text-xs max-md:flex max-md:items-center" href="#projects">View my work <span className="flex items-center" aria-hidden="true"><ArrowUpRight size={20} aria-hidden="true" /></span></a>
            <a className="inline-flex rounded-lg text-base gap-5 py-4 px-7 transition-all duration-200 hover:-translate-y-0.5 border border-muted text-foreground hover:border-purple max-md:py-3 max-md:px-5 max-md:text-xs max-md:flex max-md:items-center" href="/resume.pdf">Download CV <span className="flex items-center" aria-hidden="true"><Download size={20} aria-hidden="true" /></span></a>
          </div>
          <div className="mt-[55px]" aria-label="Technologies I work with">
            <p className="text-muted text-[10px] tracking-[.12em] mb-[18px] uppercase">Technologies I work with</p>
            <div className="flex flex-wrap gap-2.5">
              {["HTML", "CSS", "JS", "TS", "React", "Node", "Git"].map((tech) => (
                <span className="items-center border border-line rounded-[5px] text-foreground inline-flex text-[11px] h-[34px] justify-center px-[11px] py-0" key={tech}>{tech}</span>
              ))}
            </div>
          </div>
        </div>
        <div className="self-stretch flex-[0_1_560px] min-h-[500px] relative max-md:self-center max-md:flex-none max-md:min-h-[390px] max-md:w-full" aria-label="Portrait of Andika">
          <div className="bg-gradient-to-br from-[#3119e6] via-[#7745ed] to-[#755aec] rounded-full absolute right-[18%] top-[10%] h-[min(35vw,520px)] w-[min(35vw,520px)] max-md:h-[310px] max-md:right-[8%] max-md:top-[18%] max-md:w-[310px]" aria-hidden="true" />
          <div className="bg-[radial-gradient(var(--muted)_1px,transparent_1px)] bg-[length:16px_16px] h-[160px] opacity-35 absolute right-[10%] top-[2%] w-[210px] max-md:right-0 max-md:scale-[.75] max-md:origin-top-right" aria-hidden="true" />
          <Image className="absolute bottom-0 h-[150%] max-w-none object-contain object-bottom top-[-20%] right-[-8%] w-auto z-10 max-md:right-[-20%] max-md:w-[140%]" src="/images/andika-profile.png" alt="Andika working at a laptop" width={640} height={720} priority />
          <CodeSnippet />
        </div>
      </section>

      <section className="items-center border-b border-line border-t grid gap-[60px] grid-cols-2 mx-auto max-w-full py-[145px] px-[10vw] relative z-20 max-md:grid-cols-1 max-md:py-[90px] max-md:px-[6vw]" id="about" aria-labelledby="about-title">
        <div className="self-stretch min-h-[420px] relative max-md:min-h-[280px] max-md:order-2" aria-hidden="true">
          <div className="items-center bg-[rgba(16,14,23,.6)] border border-dashed border-line rounded-xl text-muted flex text-xs h-full justify-center tracking-[.08em] min-h-[420px] relative z-10 max-md:min-h-[280px]">
            <span>Photo coming soon</span>
          </div>
        </div>
        <div className="relative z-20 max-md:order-1">
          <SectionEyebrow>A little things about me</SectionEyebrow>
          <h2 id="about-title" className="text-[clamp(43px,6vw,77px)] font-medium tracking-[-.065em] leading-[.96] mb-8 max-md:text-[clamp(36px,8vw,56px)]">I don&apos;t just write code.<br /><em>I craft experiences.</em></h2>
          <p className="text-muted text-base leading-[1.75] max-w-[520px]">I&apos;m Andika, a software engineer who believes the best products are born from curiosity, precision, and a deep respect for the people who use them. Every line of code I write is a step toward something that feels effortless on the surface and solid underneath.</p><br />
          <p className="text-muted text-base leading-[1.75] max-w-[520px] mt-[18px] max-md:mt-[50px]">I care about the details that most people skip the micro-interactions, the edge cases, the architecture that holds everything together when things get complex.</p>
          <div className="grid gap-6 grid-cols-3 mt-12 max-md:grid-cols-1 max-md:gap-[18px]">
            <div className="border-t border-line pt-4">
              <span className="text-purple text-[11px]">01</span>
              <h3 className="text-[15px] font-medium mt-3.5 mb-2 mx-0">Clarity over complexity</h3>
              <p className="text-muted text-[13px] leading-[1.6] m-0">If it can be simple, it should be. Simple is not easy it takes work.</p>
            </div>
            <div className="border-t border-line pt-4">
              <span className="text-purple text-[11px]">02</span>
              <h3 className="text-[15px] font-medium mt-3.5 mb-2 mx-0">Build with intention</h3>
              <p className="text-muted text-[13px] leading-[1.6] m-0">Every decision has a reason. No shortcuts that become dead ends.</p>
            </div>
            <div className="border-t border-line pt-4">
              <span className="text-purple text-[11px]">03</span>
              <h3 className="text-[15px] font-medium mt-3.5 mb-2 mx-0">Ship, then refine</h3>
              <p className="text-muted text-[13px] leading-[1.6] m-0">Progress beats perfection. But polish is never optional.</p>
            </div>
          </div>
          <a className="flex items-center mt-10 text-sm gap-2 border border-line rounded-lg text-foreground inline-flex w-fit text-xs px-5 py-3 transition-all duration-200 hover:shadow-[0_0_2px_var(--foreground)] hover:-translate-y-0.5" href="/about">Learn more about me <span className="text-foreground text-[17px] ml-2" aria-hidden="true"><User size={20} aria-hidden="true" /></span></a>
        </div>
      </section>

      <SkillsSection />
      <HomeProjectsSection />
      <HomeBlogSection />
      <HomeCertificatesSection />

      <Footer />
    </main>
  );
}
