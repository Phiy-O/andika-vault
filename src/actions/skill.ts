"use server";

import { skillService } from "@/src/services/skill";
import { skillSchema, skillUpdateSchema } from "@/src/lib/validations/skill";
import type { SkillCreateInput, SkillUpdateInput } from "@/src/types";
import type { Skill } from "@prisma/client";

type ActionResult<T> = { data?: T; error?: string };

export async function getSkills(): Promise<ActionResult<Skill[]>> {
  try {
    const skills = await skillService.getVisible();
    return { data: skills as any };
  } catch (e: any) {
    return { error: e.message ?? "Failed to fetch skills" };
  }
}

export async function getAllSkills(): Promise<ActionResult<Skill[]>> {
  try {
    const skills = await skillService.getAll();
    return { data: skills as any };
  } catch (e: any) {
    return { error: e.message ?? "Failed to fetch skills" };
  }
}

export async function getSkill(id: string): Promise<ActionResult<Skill | null>> {
  try {
    const skill = await skillService.getById(id);
    return { data: (skill as any) ?? null };
  } catch (e: any) {
    return { error: e.message ?? "Failed to fetch skill" };
  }
}

export async function createSkill(
  input: SkillCreateInput
): Promise<ActionResult<Skill>> {
  try {
    const parsed = skillSchema.parse(input);
    const skill = await skillService.create(parsed as any);
    return { data: skill as any };
  } catch (e: any) {
    if (e.issues) return { error: e.issues.map((i: any) => i.message).join(", ") };
    return { error: e.message ?? "Failed to create skill" };
  }
}

export async function updateSkill(
  id: string,
  input: SkillUpdateInput
): Promise<ActionResult<Skill>> {
  try {
    const parsed = skillUpdateSchema.parse(input);
    const skill = await skillService.update(id, parsed as any);
    return { data: skill as any };
  } catch (e: any) {
    if (e.issues) return { error: e.issues.map((i: any) => i.message).join(", ") };
    return { error: e.message ?? "Failed to update skill" };
  }
}

export async function deleteSkill(id: string): Promise<ActionResult<void>> {
  try {
    await skillService.delete(id);
    return {};
  } catch (e: any) {
    return { error: e.message ?? "Failed to delete skill" };
  }
}
