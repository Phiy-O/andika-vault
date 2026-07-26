"use server";

import { projectService } from "@/src/services";
import { projectSchema, projectUpdateSchema } from "@/src/lib/validations";
import type { ProjectCreateInput, ProjectUpdateInput } from "@/src/types";
import type { Project } from "@prisma/client";

type ActionResult<T> = { data?: T; error?: string };

export async function getProjects(): Promise<ActionResult<Project[]>> {
  try {
    const projects = await projectService.getVisible();
    return { data: projects as any };
  } catch (e: any) {
    return { error: e.message ?? "Failed to fetch projects" };
  }
}

export async function getAllProjects(): Promise<ActionResult<Project[]>> {
  try {
    const projects = await projectService.getAll();
    return { data: projects as any };
  } catch (e: any) {
    return { error: e.message ?? "Failed to fetch projects" };
  }
}

export async function getProject(
  slug: string
): Promise<ActionResult<Project | null>> {
  try {
    const project = await projectService.getBySlug(slug);
    return { data: project as any ?? null };
  } catch (e: any) {
    return { error: e.message ?? "Failed to fetch project" };
  }
}

export async function createProject(
  input: ProjectCreateInput
): Promise<ActionResult<Project>> {
  try {
    const parsed = projectSchema.parse(input);
    const project = await projectService.create(parsed as any);
    return { data: project as any };
  } catch (e: any) {
    if (e.issues) return { error: e.issues.map((i: any) => i.message).join(", ") };
    return { error: e.message ?? "Failed to create project" };
  }
}

export async function updateProject(
  id: string,
  input: ProjectUpdateInput
): Promise<ActionResult<Project>> {
  try {
    const parsed = projectUpdateSchema.parse(input);
    const project = await projectService.update(id, parsed as any);
    return { data: project as any };
  } catch (e: any) {
    if (e.issues) return { error: e.issues.map((i: any) => i.message).join(", ") };
    return { error: e.message ?? "Failed to update project" };
  }
}

export async function deleteProject(
  id: string
): Promise<ActionResult<void>> {
  try {
    await projectService.delete(id);
    return {};
  } catch (e: any) {
    return { error: e.message ?? "Failed to delete project" };
  }
}
