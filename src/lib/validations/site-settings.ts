import { z } from "zod";
import { safeUrlString } from "./url";

const aboutJourneyItem = z.object({ title: z.string().min(1), body: z.string().min(1) });
const aboutPillar = z.object({ title: z.string().min(1), description: z.string().min(1), tag: z.string().min(1) });
const aboutTimelineItem = z.object({ title: z.string().min(1), description: z.string().min(1) });

// Guard JSON parsing so malformed config returns a validation issue instead
// of throwing a raw SyntaxError out of the schema.
function jsonArray(value: z.ZodTypeAny, message: string) {
  return z.string().refine((input) => {
    try {
      return z.array(value).safeParse(JSON.parse(input)).success;
    } catch {
      return false;
    }
  }, message);
}

export const siteSettingsSchema = z.object({
  // Social & Contact
  email: z.string().email("Email tidak valid"),
  linkedinUrl: safeUrlString,
  githubUrl: safeUrlString,
  instagramUrl: safeUrlString,
  // Resume / CV
  resumeUrl: safeUrlString,
  // About
  aboutName: z.string().min(1),
  aboutRole: z.string().min(1),
  aboutLocation: z.string().min(1),
  aboutFocus: z.string().min(1),
  aboutIntro: z.string().min(1),
  aboutDiscipline: z.string().min(1),
  aboutPhilosophy: z.string().min(1),
  aboutRuntime: z.string().min(1),
  aboutJourney: jsonArray(aboutJourneyItem, "Journey JSON tidak valid"),
  aboutPillars: jsonArray(aboutPillar, "Pillars JSON tidak valid"),
  aboutTimeline: jsonArray(aboutTimelineItem, "Timeline JSON tidak valid"),
  aboutQuote: z.string().min(1),
});

export type SiteSettings = z.infer<typeof siteSettingsSchema>;

const journey = JSON.stringify([
  { title: "Systems Architecture & Scalable Platforms", body: "Designing resilient services, practical APIs, and infrastructure that stays understandable under load." },
  { title: "Full-Stack Development & Applied Tooling", body: "Connecting thoughtful interfaces with reliable backend behavior and useful developer workflows." },
  { title: "Embedded Systems & Hardware Prototyping", body: "Learning from deterministic machines, physical constraints, and the systems beneath the screen." },
  { title: "Foundations in Computer Science", body: "Keeping fundamentals close: algorithms, networking, operating systems, and data structures." },
]);
const pillars = JSON.stringify([
  { title: "Web Applications", description: "Designing useful interfaces with clear state, responsive behavior, and durable frontend systems.", tag: "FRONTEND // UI" },
  { title: "Backend & Systems", description: "Architecting APIs, business logic, databases, and distributed systems built to keep working.", tag: "BACKEND // API" },
  { title: "Experiments & Exploration", description: "Exploring automation, hardware timers, algorithms, and low-level technical ideas.", tag: "TOOLS // LAB" },
]);
const timeline = JSON.stringify([
  { title: "Systems Architecture & Scalable Platforms", description: "Designing resilient services, practical APIs, and infrastructure that stays understandable under load." },
  { title: "Full-Stack Development & Applied Tooling", description: "Connecting thoughtful interfaces with reliable backend behavior and useful developer workflows." },
  { title: "Embedded Systems & Hardware Prototyping", description: "Learning from deterministic machines, physical constraints, and the systems beneath the screen." },
  { title: "Foundations in Computer Science", description: "Keeping fundamentals close: algorithms, networking, operating systems, and data structures." },
]);

export const SITE_SETTINGS_DEFAULTS: SiteSettings = {
  email: "andikapiyo12@gmail.com",
  linkedinUrl: "https://linkedin.com",
  githubUrl: "https://github.com",
  instagramUrl: "https://instagram.com",
  resumeUrl: "/resume/dummy-resume.pdf",
  aboutName: "Elias Reid",
  aboutRole: "Dev Architect",
  aboutLocation: "Seattle, WA [PST/UTC-8]",
  aboutFocus: "Distributed State & Edge",
  aboutIntro: "Hi, I'm a software developer with a strong interest in building useful applications and understanding the systems behind them. I enjoy working across frontend interfaces, backend architecture, and practical technology experiments with deterministic behavior and mechanical rigor.",
  aboutDiscipline: "Full-Stack & Distributed Systems",
  aboutPhilosophy: "Deterministic, resilient, pragmatic",
  aboutRuntime: "Go · TypeScript · Linux Kernel",
  aboutJourney: journey,
  aboutPillars: pillars,
  aboutTimeline: timeline,
  aboutQuote: "Simple architectures fail in simple, observable ways. Complex architectures fail catastrophically.",
};
