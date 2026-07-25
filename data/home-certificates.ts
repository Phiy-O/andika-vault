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

const CERT_DEFAULT_IMAGE = "/images/thumbnails/achievements-default.png";

export const homeCertificates: HomeCertificate[] = [
  {
    id: "frontend-development",
    title: "Frontend Development",
    issuer: "Meta",
    issueDate: "2024-09-15",
    credentialUrl: "#",
    image: CERT_DEFAULT_IMAGE,
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
    image: CERT_DEFAULT_IMAGE,
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
    image: CERT_DEFAULT_IMAGE,
    description:
      "User-centered design thinking, wireframing, prototyping, and usability testing foundations.",
    sortOrder: 3,
    isVisible: true,
  },
  {
    id: "javascript-algorithms",
    title: "JavaScript Algorithms & Data Structures",
    issuer: "freeCodeCamp",
    issueDate: "2024-01-22",
    credentialUrl: "#",
    image: CERT_DEFAULT_IMAGE,
    description:
      "Mastery of core data structures, algorithm design, and problem-solving patterns in JavaScript.",
    sortOrder: 4,
    isVisible: true,
  },
  {
    id: "aws-cloud-practitioner",
    title: "AWS Cloud Practitioner",
    issuer: "Amazon Web Services",
    issueDate: "2023-11-10",
    credentialUrl: "#",
    image: CERT_DEFAULT_IMAGE,
    description:
      "Foundational understanding of AWS cloud services, security, architecture best practices, and pricing.",
    sortOrder: 5,
    isVisible: true,
  },
];
