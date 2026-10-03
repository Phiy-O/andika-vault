import { z } from "zod";
import { safeUrlString } from "./url";

export const siteSettingsSchema = z.object({
  email: z.string().email("Email tidak valid"),
  linkedinUrl: safeUrlString,
  githubUrl: safeUrlString,
  instagramUrl: safeUrlString,
  siteTitle: z.string().min(1, "Judul situs wajib diisi"),
  metaDescription: z.string().min(1, "Deskripsi meta wajib diisi"),
  resumeUrl: safeUrlString,
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
