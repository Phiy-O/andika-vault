import { prisma } from "@/lib/prisma";
import {
  SITE_SETTINGS_DEFAULTS,
  type SiteSettings,
} from "@/src/lib/validations/site-settings";

const KEYS = Object.keys(SITE_SETTINGS_DEFAULTS) as (keyof SiteSettings)[];

export const siteSettingRepo = {
  async getAll(): Promise<SiteSettings> {
    const rows = await prisma.siteSetting.findMany({
      where: { key: { in: KEYS as string[] } },
    });
    const map = Object.fromEntries(rows.map((r) => [r.key, r.value]));
    return Object.fromEntries(
      KEYS.map((k) => [k, map[k] ?? SITE_SETTINGS_DEFAULTS[k]])
    ) as SiteSettings;
  },

  async upsertMany(settings: SiteSettings) {
    return prisma.$transaction(
      KEYS.map((key) =>
        prisma.siteSetting.upsert({
          where: { key },
          update: { value: settings[key] },
          create: { key, value: settings[key] },
        })
      )
    );
  },
};
