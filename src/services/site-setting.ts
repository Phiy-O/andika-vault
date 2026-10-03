import { siteSettingRepo } from "@/src/repositories";
import {
  siteSettingsSchema,
  type SiteSettings,
} from "@/src/lib/validations/site-settings";

export const siteSettingService = {
  async get() {
    return siteSettingRepo.getAll();
  },

  async update(input: SiteSettings) {
    const parsed = siteSettingsSchema.parse(input);
    await siteSettingRepo.upsertMany(parsed);
    return parsed;
  },
};
