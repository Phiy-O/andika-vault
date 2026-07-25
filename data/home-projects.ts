export type HomeProject = {
  id: string;
  title: string;
  slug: string;
  description: string;
  body: string;
  thumbnail?: string;
  screenshots?: string[];
  techStack: string[];
  githubUrl?: string;
  liveUrl?: string;
  category: "product" | "tool";
  featured: boolean;
  sortOrder: number;
  isVisible: boolean;
};

export const homeProjects: HomeProject[] = [
  {
    id: "rentalin",
    title: "Rentalin",
    slug: "rentalin",
    description:
      "A clearer way to discover and manage rentals, built with a focus on simplicity and product clarity.",
    body: "Rentalin is a rental marketplace concept that prioritizes clarity over complexity. The goal was to build a platform where both renters and lessors can navigate listings, bookings, and management without friction.\n\nBuilt as a full-stack project with Next.js and Prisma, the focus was on clean data models, intuitive filtering, and a straightforward booking flow. The project demonstrated how thoughtful product design can simplify an inherently complex domain.\n\n**Key features:** listing management, search with filters, booking system, user profiles, and responsive design. The tech stack was chosen for rapid iteration and type safety across the full stack.",
    thumbnail: "/images/thumbnails/projects-thumbnail.png",
    screenshots: ["/images/thumbnails/projects-thumbnail.png"],
    techStack: ["Next.js", "TypeScript", "Prisma", "PostgreSQL"],
    liveUrl: "#",
    category: "product",
    featured: true,
    sortOrder: 1,
    isVisible: true,
  },
  {
    id: "andika-vault",
    title: "Andika Vault",
    slug: "andika-vault",
    description:
      "A personal home for projects, writing, and ideas — designed to grow over time.",
    body: "Andika Vault is the site you're currently browsing. It serves as a living portfolio, blog, and digital garden where projects, writing, and ideas converge.\n\nBuilt with Next.js and Tailwind CSS on a dark editorial theme, the focus was on creating a reading experience that feels calm and intentional. Every component was designed with restraint — nothing distracting, nothing unnecessary.\n\n**Learning outcome:** Deepened understanding of the App Router, server components, static generation, and how Tailwind CSS 4 + CSS custom properties can create a cohesive design system without a component library.",
    thumbnail: "/images/thumbnails/projects-thumbnail.png",
    screenshots: ["/images/thumbnails/projects-thumbnail.png"],
    techStack: ["Next.js", "React", "Tailwind CSS", "Prisma"],
    githubUrl: "#",
    category: "tool",
    featured: true,
    sortOrder: 2,
    isVisible: true,
  },
  {
    id: "portfolio-dashboard",
    title: "Portfolio Dashboard",
    slug: "portfolio-dashboard",
    description:
      "A private CMS for managing portfolio content, blog posts, and credentials in one place.",
    body: "A private content management dashboard built to manage the pieces of a portfolio site — blog posts, projects, certificates, and skills — from a single interface.\n\nThe dashboard includes authentication via Auth.js, form validation with Zod, and a UI built with shadcn/ui components. The goal was to create a tool that makes content updates as quick as writing a file, without touching code.\n\n**Key features:** CRUD for all content types, markdown editing with preview, image uploads, role-based access, and responsive dashboards. A practical exploration of admin interfaces and permission models.",
    thumbnail: "/images/thumbnails/projects-thumbnail.png",
    screenshots: ["/images/thumbnails/projects-thumbnail.png"],
    techStack: ["Next.js", "Auth.js", "Zod", "shadcn/ui"],
    githubUrl: "#",
    category: "tool",
    featured: false,
    sortOrder: 3,
    isVisible: true,
  },
  {
    id: "task-flow",
    title: "TaskFlow",
    slug: "task-flow",
    description:
      "A lightweight kanban board for solo developers who want to track tasks without the overhead of enterprise project management tools.",
    body: "TaskFlow is a minimal kanban board designed for solo developers. No teams, no permissions, no sprint planning — just columns, cards, and drag-and-drop.\n\nBuilt with React and TypeScript on the frontend and Node.js + MongoDB on the backend, the focus was on performance and a fluid drag-and-drop experience. The UI strips away everything that doesn't help you move a task from \"To Do\" to \"Done.\"\n\n**Key features:** Drag-and-drop cards, markdown descriptions, tags, due dates, and a focus mode that hides all but the current board. A study in minimal productivity tools.",
    thumbnail: "/images/thumbnails/projects-thumbnail.png",
    screenshots: ["/images/thumbnails/projects-thumbnail.png"],
    techStack: ["React", "TypeScript", "Node.js", "MongoDB"],
    githubUrl: "#",
    liveUrl: "#",
    category: "tool",
    featured: false,
    sortOrder: 4,
    isVisible: true,
  },
  {
    id: "devmark",
    title: "DevMark",
    slug: "devmark",
    description:
      "A bookmarking app for developers that auto-tags and categorizes links using semantic analysis.",
    body: "DevMark is a smart bookmarking app for developers. It saves links and automatically categorizes them using semantic analysis — no manual tagging required.\n\nBuilt with Next.js, Prisma, and PostgreSQL, the core feature is an auto-tagging pipeline that extracts topics, languages, and categories from saved URLs. The result is a searchable, organized library of links that grows without effort.\n\n**Key features:** Auto-tagging via semantic analysis, full-text search, collections, browser extension for quick saves, and RSS feed import. An exploration of how machine learning can solve small but persistent UX problems.",
    thumbnail: "/images/thumbnails/projects-thumbnail.png",
    screenshots: ["/images/thumbnails/projects-thumbnail.png"],
    techStack: ["Next.js", "Prisma", "PostgreSQL", "Tailwind CSS"],
    githubUrl: "#",
    category: "tool",
    featured: false,
    sortOrder: 5,
    isVisible: true,
  },
];
