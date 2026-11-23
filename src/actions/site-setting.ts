"use server";

import { siteSettingService } from "@/src/services";
import { siteSettingsSchema } from "@/src/lib/validations/site-settings";
import type { SiteSettings } from "@/src/lib/validations/site-settings";
import { requireAdmin } from "@/src/lib/auth";
import { revalidatePublicContent } from "@/src/lib/revalidate-public";
import { actionError } from "./action-error";

type ActionResult<T> = { data?: T; error?: string };

export async function getSiteSettings(): Promise<ActionResult<SiteSettings>> {
  try {
    const settings = await siteSettingService.get();
    return { data: settings };
  } catch (e) {
    return { error: actionError(e, "Failed to fetch settings") };
  }
}

export async function updateSiteSettings(
  input: SiteSettings
): Promise<ActionResult<SiteSettings>> {
  if (!(await requireAdmin())) return { error: "Unauthorized" };
  try {
    const parsed = siteSettingsSchema.parse(input);
    const settings = await siteSettingService.update(parsed);
    revalidatePublicContent();
    return { data: settings };
  } catch (e) {
    return { error: actionError(e, "Failed to update settings") };
  }
}
