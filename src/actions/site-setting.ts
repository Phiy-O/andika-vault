"use server";

import { siteSettingService } from "@/src/services";
import { siteSettingsSchema } from "@/src/lib/validations/site-settings";
import type { SiteSettings } from "@/src/lib/validations/site-settings";
import { requireAdmin } from "@/src/lib/auth";
import { revalidatePublicContent } from "@/src/lib/revalidate-public";

type ActionResult<T> = { data?: T; error?: string };

export async function getSiteSettings(): Promise<ActionResult<SiteSettings>> {
  try {
    const settings = await siteSettingService.get();
    return { data: settings };
  } catch (e: any) {
    return { error: e.message ?? "Failed to fetch settings" };
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
  } catch (e: any) {
    if (e.issues) return { error: e.issues.map((i: any) => i.message).join(", ") };
    return { error: e.message ?? "Failed to update settings" };
  }
}
