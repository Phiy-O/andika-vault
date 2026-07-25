export type SkillCategory = "frontend" | "backend" | "tools";

export type HomeSkill = {
  id: string;
  name: string;
  iconSrc: string;
  category: SkillCategory;
  sortOrder: number;
  isVisible: boolean;
};

export const skillCategories: { value: SkillCategory; label: string }[] = [
  { value: "frontend", label: "Frontend" },
  { value: "backend", label: "Backend" },
  { value: "tools", label: "Tools" },
];

export const homeSkills: HomeSkill[] = [
  {
    id: "javascript",
    name: "JavaScript",
    iconSrc: "/icons/skills/javascript.svg",
    category: "frontend",
    sortOrder: 1,
    isVisible: true,
  },
  {
    id: "typescript",
    name: "TypeScript",
    iconSrc: "/icons/skills/typescript.svg",
    category: "frontend",
    sortOrder: 2,
    isVisible: true,
  },
  {
    id: "react",
    name: "React",
    iconSrc: "/icons/skills/react.svg",
    category: "frontend",
    sortOrder: 3,
    isVisible: true,
  },
  {
    id: "nextjs",
    name: "Next.js",
    iconSrc: "/icons/skills/nextjs.svg",
    category: "frontend",
    sortOrder: 4,
    isVisible: true,
  },
  {
    id: "tailwindcss",
    name: "Tailwind CSS",
    iconSrc: "/icons/skills/tailwindcss.svg",
    category: "frontend",
    sortOrder: 5,
    isVisible: true,
  },
  {
    id: "sass",
    name: "Sass",
    iconSrc: "/icons/skills/sass.svg",
    category: "frontend",
    sortOrder: 6,
    isVisible: true,
  },
  {
    id: "nodejs",
    name: "Node.js",
    iconSrc: "/icons/skills/nodejs.svg",
    category: "backend",
    sortOrder: 7,
    isVisible: true,
  },
  {
    id: "express",
    name: "Express.js",
    iconSrc: "/icons/skills/express.svg",
    category: "backend",
    sortOrder: 8,
    isVisible: true,
  },
  {
    id: "postgresql",
    name: "PostgreSQL",
    iconSrc: "/icons/skills/postgresql.svg",
    category: "backend",
    sortOrder: 9,
    isVisible: true,
  },
  {
    id: "mongodb",
    name: "MongoDB",
    iconSrc: "/icons/skills/mongodb.svg",
    category: "backend",
    sortOrder: 10,
    isVisible: true,
  },
  {
    id: "figma",
    name: "Figma",
    iconSrc: "/icons/skills/figma.svg",
    category: "tools",
    sortOrder: 11,
    isVisible: true,
  },
  {
    id: "cypress",
    name: "Cypress",
    iconSrc: "/icons/skills/cypress.svg",
    category: "tools",
    sortOrder: 12,
    isVisible: true,
  },
  {
    id: "storybook",
    name: "Storybook",
    iconSrc: "/icons/skills/storybook.svg",
    category: "tools",
    sortOrder: 13,
    isVisible: true,
  },
  {
    id: "git",
    name: "Git",
    iconSrc: "/icons/skills/git.svg",
    category: "tools",
    sortOrder: 14,
    isVisible: true,
  },
];
