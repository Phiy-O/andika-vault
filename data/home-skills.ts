export type HomeSkill = {
  id: string;
  name: string;
  iconSrc: string;
  sortOrder: number;
  isVisible: boolean;
};

export const homeSkills: HomeSkill[] = [
  {
    id: "javascript",
    name: "JavaScript",
    iconSrc: "/icons/skills/javascript.svg",
    sortOrder: 1,
    isVisible: true,
  },
  {
    id: "react",
    name: "React",
    iconSrc: "/icons/skills/react.svg",
    sortOrder: 2,
    isVisible: true,
  },
  {
    id: "nodejs",
    name: "Node.js",
    iconSrc: "/icons/skills/nodejs.svg",
    sortOrder: 3,
    isVisible: true,
  },
  {
    id: "express",
    name: "Express.js",
    iconSrc: "/icons/skills/express.svg",
    sortOrder: 4,
    isVisible: true,
  },
  {
    id: "nextjs",
    name: "Next.js",
    iconSrc: "/icons/skills/nextjs.svg",
    sortOrder: 5,
    isVisible: true,
  },
  {
    id: "postgresql",
    name: "PostgreSQL",
    iconSrc: "/icons/skills/postgresql.svg",
    sortOrder: 6,
    isVisible: true,
  },
  {
    id: "mongodb",
    name: "MongoDB",
    iconSrc: "/icons/skills/mongodb.svg",
    sortOrder: 7,
    isVisible: true,
  },
  {
    id: "sass",
    name: "Sass",
    iconSrc: "/icons/skills/sass.svg",
    sortOrder: 8,
    isVisible: true,
  },
  {
    id: "tailwindcss",
    name: "Tailwind CSS",
    iconSrc: "/icons/skills/tailwindcss.svg",
    sortOrder: 9,
    isVisible: true,
  },
  {
    id: "figma",
    name: "Figma",
    iconSrc: "/icons/skills/figma.svg",
    sortOrder: 10,
    isVisible: true,
  },
  {
    id: "cypress",
    name: "Cypress",
    iconSrc: "/icons/skills/cypress.svg",
    sortOrder: 11,
    isVisible: true,
  },
  {
    id: "storybook",
    name: "Storybook",
    iconSrc: "/icons/skills/storybook.svg",
    sortOrder: 12,
    isVisible: true,
  },
  {
    id: "git",
    name: "Git",
    iconSrc: "/icons/skills/git.svg",
    sortOrder: 13,
    isVisible: true,
  },
  {
    id: "typescript",
    name: "TypeScript",
    iconSrc: "/icons/skills/typescript.svg",
    sortOrder: 14,
    isVisible: true,
  },
];
