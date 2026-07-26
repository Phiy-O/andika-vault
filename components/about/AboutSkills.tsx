"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { skillCategories, type SkillCategory } from "@/src/types";
import type { Skill } from "@prisma/client";

export function AboutSkills({ skills }: { skills: Skill[] }) {
  const [activeCategory, setActiveCategory] = useState<SkillCategory>("frontend");

  const visibleSkills = useMemo(() => {
    return skills
      .filter((s) => s.isVisible)
      .sort((a, b) => a.sortOrder - b.sortOrder);
  }, [skills]);

  const filteredSkills = useMemo(() => {
    return visibleSkills.filter((s) => s.category === activeCategory);
  }, [visibleSkills, activeCategory]);

  return (
    <div>
      {/* Filter pills */}
      <div className="flex flex-wrap gap-2 mb-10">
        {skillCategories.map((cat) => (
          <button
            key={cat.value}
            onClick={() => setActiveCategory(cat.value)}
            className={`border rounded-lg text-xs px-4 py-2 transition-all duration-200 cursor-pointer ${
              activeCategory === cat.value
                ? "border-purple text-purple bg-[rgba(169,139,255,.08)]"
                : "border-line text-muted hover:border-foreground hover:text-foreground"
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Skills grid */}
      <div className="grid gap-[34px_42px] grid-cols-[repeat(7,minmax(72px,1fr))] max-md:gap-[28px_20px] max-md:grid-cols-3">
        {filteredSkills.map((skill) => (
          <div
            className="flex flex-col items-center text-muted text-xs font-semibold gap-3 tracking-[-.01em] min-w-0 text-center transition-all duration-200 hover:text-foreground hover:-translate-y-1 group"
            key={skill.id}
          >
            <Image
              className="block drop-shadow-[0_12px_24px_rgba(0,0,0,.28)] h-[46px] object-contain transition-all duration-200 w-[46px] max-md:h-[42px] max-md:w-[42px] group-hover:drop-shadow-[0_16px_28px_rgba(169,139,255,.24)] group-hover:scale-[1.06]"
              src={skill.iconSrc}
              alt=""
              width={48}
              height={48}
              aria-hidden="true"
            />
            <span>{skill.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
