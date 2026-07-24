export type HomeCertificate = {
  id: string;
  title: string;
  issuer: string;
  issueDate: string;
  credentialUrl?: string;
  image?: string;
  description: string;
  sortOrder: number;
  isVisible: boolean;
};

export const homeCertificates: HomeCertificate[] = [
  {
    id: "frontend-development",
    title: "Frontend Development",
    issuer: "Meta",
    issueDate: "2024-09-15",
    credentialUrl: "#",
    image: "/images/thumbnails/cert-frontend.png",
    description:
      "Core competencies in modern frontend development, responsive design, and component-driven architecture.",
    sortOrder: 1,
    isVisible: true,
  },
  {
    id: "full-stack-development",
    title: "Full-Stack Development",
    issuer: "freeCodeCamp",
    issueDate: "2024-06-20",
    credentialUrl: "#",
    image: "/images/thumbnails/cert-fullstack.png",
    description:
      "Comprehensive training in full-stack JavaScript, APIs, databases, and deployment workflows.",
    sortOrder: 2,
    isVisible: true,
  },
  {
    id: "ux-design",
    title: "UX Design",
    issuer: "Google",
    issueDate: "2024-03-10",
    credentialUrl: "#",
    image: "/images/thumbnails/cert-ux.png",
    description:
      "User-centered design thinking, wireframing, prototyping, and usability testing foundations.",
    sortOrder: 3,
    isVisible: true,
  },
];
