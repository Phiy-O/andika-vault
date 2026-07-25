export type Milestone = {
  id: string;
  year: string;
  title: string;
  detail: string;
  sortOrder: number;
  isVisible: boolean;
};

export const milestones: Milestone[] = [
  {
    id: "started-andika-vault",
    year: "2026",
    title: "Started building Andika Vault",
    detail:
      "Began architecting a personal portfolio and CMS as a full-stack project to consolidate design, writing, and project work in one evolving space.",
    sortOrder: 1,
    isVisible: true,
  },
  {
    id: "meta-frontend-cert",
    year: "2025",
    title: "Earned Meta Front-End Developer certificate",
    detail:
      "Completed Meta's professional certificate on Coursera, covering modern component architecture, responsive design patterns, and accessible UI development.",
    sortOrder: 2,
    isVisible: true,
  },
  {
    id: "first-open-source-pr",
    year: "2025",
    title: "First open-source contribution merged",
    detail:
      "Submitted and merged a pull request improving documentation and type safety for an open-source React component library.",
    sortOrder: 3,
    isVisible: true,
  },
  {
    id: "portfolio-v1-launch",
    year: "2024",
    title: "Launched portfolio v1",
    detail:
      "Designed and deployed the first version of my personal portfolio, marking the transition from learning to building production-quality frontends.",
    sortOrder: 4,
    isVisible: true,
  },
  {
    id: "fullstack-cert",
    year: "2024",
    title: "Completed Full-Stack curriculum at freeCodeCamp",
    detail:
      "Worked through freeCodeCamp's full-stack certification, building projects across frontend, backend, API design, and database integration.",
    sortOrder: 5,
    isVisible: true,
  },
  {
    id: "rentalin-concept",
    year: "2024",
    title: "Built Rentalin — a rental marketplace concept",
    detail:
      "Developed a full-stack rental platform prototype with Next.js, Prisma, and PostgreSQL, focusing on clean UX and intuitive property discovery.",
    sortOrder: 6,
    isVisible: true,
  },
  {
    id: "started-react",
    year: "2023",
    title: "Started learning React seriously",
    detail:
      "Moved from vanilla JavaScript into React, building small apps and gradually understanding component state, hooks, and the ecosystem.",
    sortOrder: 7,
    isVisible: true,
  },
  {
    id: "first-line-of-code",
    year: "2023",
    title: "Wrote my first line of code",
    detail:
      "Started the journey with HTML, CSS, and basic JavaScript — the foundation that sparked everything that followed.",
    sortOrder: 8,
    isVisible: true,
  },
];
