import type { Skill } from "@prisma/client";

const groups = [
  { key: "frontend", label: "Frontend Engineering", accent: "#e76f51", description: "Building responsive, accessible interfaces with deterministic state and thoughtful interactions." },
  { key: "backend", label: "Backend & Systems", accent: "#6b8fe8", description: "Designing APIs, business logic, robust databases, and scalable distributed application architecture." },
  { key: "tools", label: "Experiments & Exploration", accent: "#50a878", description: "Exploring automation, hardware timers, algorithms, and low-level technical ideas." },
] as const;

export function HomeCapabilities({ skills }: { skills: Skill[] }) {
  const visible = skills.filter((skill) => skill.isVisible).sort((a, b) => a.sortOrder - b.sortOrder);
  return <section className="mx-auto max-w-7xl border-b border-line px-[5.5vw] py-20" id="capabilities" aria-labelledby="capabilities-title"><div className="mb-8 border-b border-line pb-5"><p className="mb-3 font-mono text-[10px] uppercase tracking-[.16em] text-amber">02 / What I do</p><h2 id="capabilities-title" className="mb-0 text-[clamp(40px,5vw,68px)] uppercase">Different tools. <em>One purpose.</em></h2></div><div className="grid gap-4 lg:grid-cols-3">{groups.map((group) => { const groupSkills = visible.filter((skill) => skill.category === group.key); return <article className="border-2 border-foreground bg-background p-5 shadow-[4px_4px_0_var(--foreground)]" key={group.key}><span className="mb-7 inline-flex border border-foreground px-2 py-1 font-mono text-[9px] uppercase tracking-[.1em]" style={{ backgroundColor: group.accent }}>Domain / {group.key}</span><h3 className="mb-3 text-2xl uppercase">{group.label}</h3><p className="mb-7 text-sm leading-[1.6] text-muted">{group.description}</p><p className="mb-2 font-mono text-[9px] uppercase tracking-[.12em] text-muted">Core stack:</p><div className="flex flex-wrap gap-2">{(groupSkills.length ? groupSkills : [{ id: `${group.key}-empty`, name: "Exploring" } as Skill]).map((skill) => <span className="border border-line px-2 py-1 text-[10px]" key={skill.id}>{skill.name}</span>)}</div></article>; })}</div></section>;
}
