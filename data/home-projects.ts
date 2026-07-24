export type HomeProject = {
  id: string;
  title: string;
  slug: string;
  description: string;
  thumbnail?: string;
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
    thumbnail: "/images/thumbnails/projects-thumbnail.png",
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
    thumbnail: "/images/thumbnails/projects-thumbnail.png",
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
    thumbnail: "/images/thumbnails/projects-thumbnail.png",
    techStack: ["Next.js", "Auth.js", "Zod", "shadcn/ui"],
    githubUrl: "#",
    category: "tool",
    featured: false,
    sortOrder: 3,
    isVisible: true,
  },
];
