"use server";

import { skillService } from "@/src/services/skill";

type ActionResult<T> = { data?: T; error?: string };

export async function getSkills(): Promise<ActionResult<any[]>> {
  try {
    const skills = await skillService.getVisible();
    return { data: skills };
  } catch (e: any) {
    return { error: e.message ?? "Failed to fetch skills" };
  }
}
