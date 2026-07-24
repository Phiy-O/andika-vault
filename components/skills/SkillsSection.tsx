import { homeSkills, type HomeSkill } from "../../data/home-skills";
import Image from "next/image";

type SkillsSectionProps = {
  skills?: HomeSkill[];
};

export function SkillsSection({ skills = homeSkills }: SkillsSectionProps) {
  const visibleSkills = skills
    .filter((skill) => skill.isVisible)
    .sort((firstSkill, secondSkill) => firstSkill.sortOrder - secondSkill.sortOrder);

  return (
    <section
      className="border-b border-line mx-auto overflow-hidden py-[120px] px-[10vw] pb-[130px] relative max-md:py-[90px] max-md:px-[6vw] before:content-[''] before:absolute before:left-1/2 before:-translate-x-1/2 before:top-[18%] before:h-[420px] before:w-[min(760px,90vw)] before:rounded-full before:bg-[radial-gradient(circle,rgba(169,139,255,.16),transparent_62%)] before:pointer-events-none"
      id="skills"
      aria-labelledby="skills-title"
    >
      <div className="flex flex-col items-center mx-auto mb-[64px] max-w-[760px] relative text-center z-10 max-md:items-start max-md:mb-[46px] max-md:text-left">
        <p className="text-muted border border-line w-fit px-3 py-1.5 rounded-full text-[10px] tracking-[.18em] mb-6 mt-0 mx-0 uppercase">
          Skills
        </p>
        <h2 className="text-[clamp(56px,2vw,64px)] mb-0 max-md:text-[clamp(32px,8vw,52px)]" id="skills-title">
          The skills, tools and technologies I am really good at.
        </h2>
      </div>

      <ul
        className="grid gap-[34px_42px] grid-cols-[repeat(7,minmax(72px,1fr))] list-none mx-auto max-w-[1040px] p-0 relative z-10 max-md:gap-[28px_20px] max-md:grid-cols-3"
        aria-label="Skills and technologies"
      >
        {visibleSkills.map((skill) => (
          <li className="flex flex-col items-center text-muted text-xs font-semibold gap-3 tracking-[-.01em] min-w-0 text-center transition-all duration-200 hover:text-foreground hover:-translate-y-1 group" key={skill.id}>
            <Image
              className="block drop-shadow-[0_12px_24px_rgba(0,0,0,.28)] h-[46px] object-contain transition-all duration-200 w-[46px] max-md:h-[42px] max-md:w-[42px] group-hover:drop-shadow-[0_16px_28px_rgba(169,139,255,.24)] group-hover:scale-[1.06]"
              src={skill.iconSrc}
              alt=""
              width={48}
              height={48}
              aria-hidden="true"
            />
            <span>{skill.name}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
