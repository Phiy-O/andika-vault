import type { Prisma } from "@prisma/client";

// ── Re-export Prisma-generated types ──
export type { BlogPost, Project, Certificate, Skill } from "@prisma/client";

// ── Create / Update input types (omit auto-managed fields) ──
export type BlogPostCreateInput = Omit<
  Prisma.BlogPostCreateInput,
  "id" | "createdAt" | "updatedAt"
>;

export type BlogPostUpdateInput = Partial<BlogPostCreateInput>;

export type ProjectCreateInput = Omit<
  Prisma.ProjectCreateInput,
  "id" | "createdAt" | "updatedAt"
>;

export type ProjectUpdateInput = Partial<ProjectCreateInput>;

export type CertificateCreateInput = Omit<
  Prisma.CertificateCreateInput,
  "id" | "createdAt" | "updatedAt"
>;

export type CertificateUpdateInput = Partial<CertificateCreateInput>;

export type SkillCreateInput = Omit<
  Prisma.SkillCreateInput,
  "id" | "createdAt" | "updatedAt"
>;

export type SkillUpdateInput = Partial<SkillCreateInput>;

// ── Lean select return types (for list views — no body) ──
export const blogPostListSelect = {
  id: true,
  title: true,
  slug: true,
  excerpt: true,
  category: true,
  readTime: true,
  publishedAt: true,
  thumbnail: true,
  sortOrder: true,
  isVisible: true,
} satisfies Prisma.BlogPostSelect;

export type BlogPostListItem = Prisma.BlogPostGetPayload<{
  select: typeof blogPostListSelect;
}>;

export const projectListSelect = {
  id: true,
  title: true,
  slug: true,
  description: true,
  thumbnail: true,
  techStack: true,
  githubUrl: true,
  liveUrl: true,
  category: true,
  featured: true,
  sortOrder: true,
  isVisible: true,
} satisfies Prisma.ProjectSelect;

export type ProjectListItem = Prisma.ProjectGetPayload<{
  select: typeof projectListSelect;
}>;

export const certificateListSelect = {
  id: true,
  title: true,
  issuer: true,
  issueDate: true,
  credentialUrl: true,
  image: true,
  description: true,
  sortOrder: true,
  isVisible: true,
} satisfies Prisma.CertificateSelect;

export type CertificateListItem = Prisma.CertificateGetPayload<{
  select: typeof certificateListSelect;
}>;

export const skillListSelect = {
  id: true,
  name: true,
  iconSrc: true,
  category: true,
  sortOrder: true,
  isVisible: true,
} satisfies Prisma.SkillSelect;

export type SkillListItem = Prisma.SkillGetPayload<{
  select: typeof skillListSelect;
}>;

// ── Skill category constants (frontend-facing) ──
export type SkillCategory = "frontend" | "backend" | "tools";

export const skillCategories: { value: SkillCategory; label: string }[] = [
  { value: "frontend", label: "Frontend" },
  { value: "backend", label: "Backend" },
  { value: "tools", label: "Tools" },
];
