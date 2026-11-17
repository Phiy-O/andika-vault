import { z } from "zod";
import type { SiteSettings } from "./validations/site-settings";

export const aboutJourneySchema = z.array(z.object({ title: z.string(), body: z.string() }));
export const aboutPillarSchema = z.array(z.object({ title: z.string(), description: z.string(), tag: z.string() }));
export const aboutTimelineSchema = z.array(z.object({ title: z.string(), description: z.string() }));

export type AboutContent = Pick<SiteSettings, "aboutName" | "aboutRole" | "aboutLocation" | "aboutFocus" | "aboutIntro" | "aboutDiscipline" | "aboutPhilosophy" | "aboutRuntime" | "aboutQuote"> & {
  journey: z.infer<typeof aboutJourneySchema>;
  pillars: z.infer<typeof aboutPillarSchema>;
  timeline: z.infer<typeof aboutTimelineSchema>;
};

export function parseAboutContent(settings: SiteSettings): AboutContent {
  return {
    aboutName: settings.aboutName,
    aboutRole: settings.aboutRole,
    aboutLocation: settings.aboutLocation,
    aboutFocus: settings.aboutFocus,
    aboutIntro: settings.aboutIntro,
    aboutDiscipline: settings.aboutDiscipline,
    aboutPhilosophy: settings.aboutPhilosophy,
    aboutRuntime: settings.aboutRuntime,
    aboutQuote: settings.aboutQuote,
    journey: aboutJourneySchema.parse(JSON.parse(settings.aboutJourney)),
    pillars: aboutPillarSchema.parse(JSON.parse(settings.aboutPillars)),
    timeline: aboutTimelineSchema.parse(JSON.parse(settings.aboutTimeline)),
  };
}
