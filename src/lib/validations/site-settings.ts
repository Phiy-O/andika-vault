import { z } from "zod";

export const siteSettingsSchema = z.object({
  email: z.string().email("Email tidak valid"),
  linkedinUrl: z.string().url("URL LinkedIn tidak valid"),
  githubUrl: z.string().url("URL GitHub tidak valid"),
  instagramUrl: z.string().url("URL Instagram tidak valid"),
  siteTitle: z.string().min(1, "Judul situs wajib diisi"),
  metaDescription: z.string().min(1, "Deskripsi meta wajib diisi"),
  resumeUrl: z.string().min(1, "URL resume wajib diisi"),
});

export type SiteSettings = z.infer<typeof siteSettingsSchema>;

export const SITE_SETTINGS_DEFAULTS: SiteSettings = {
  email: "andikapiyo12@gmail.com",
  linkedinUrl: "https://linkedin.com",
  githubUrl: "https://github.com",
  instagramUrl: "https://instagram.com",
  siteTitle: "Andika | Portofolio",
  metaDescription:
    "The portfolio and journal of Andika, a software engineer creating thoughtful digital products.",
  resumeUrl: "/resume/dummy-resume.pdf",
};
