import { type ReactNode } from "react";
import { SectionEyebrow } from "./SectionEyebrow";

type PageHeroProps = {
  eyebrow: string;
  title: ReactNode;
  description: string;
};

export function PageHero({ eyebrow, title, description }: PageHeroProps) {
  return (
    <header className="relative mx-auto w-full py-[150px] px-[10vw] pb-[110px] max-md:py-[100px] max-md:px-[6vw] max-md:pb-[75px] overflow-hidden">
      {/* decorative glow */}
      <div
        className="absolute left-[-8%] top-[-20%] h-[520px] w-[520px] rounded-full opacity-[.08] blur-[120px] pointer-events-none"
        style={{ background: "radial-gradient(circle, #a98bff, transparent 70%)" }}
        aria-hidden="true"
      />
      {/* decorative dots */}
      <div
        className="absolute right-[5%] top-[10%] h-[180px] w-[220px] opacity-20 pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(var(--muted) 1px, transparent 1px)",
          backgroundSize: "16px 16px",
        }}
        aria-hidden="true"
      />

      <SectionEyebrow className="relative z-10">
        {eyebrow}
      </SectionEyebrow>
      <h1 className="relative z-10">{title}</h1>
      <p className="relative z-10 text-muted text-[17px] leading-[1.7] max-w-[510px]">
        {description}
      </p>
    </header>
  );
}
