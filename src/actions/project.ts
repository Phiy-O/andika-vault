"use server";

import { projectService } from "@/src/services";
import { projectSchema, projectUpdateSchema } from "@/src/lib/validations";
import type { ProjectCreateInput, ProjectUpdateInput } from "@/src/types";
import type { Project } from "@prisma/client";
import { requireAdmin } from "@/src/lib/auth";
import { revalidatePublicContent } from "@/src/lib/revalidate-public";
import { actionError } from "./action-error";
import { idSchema } from "@/src/lib/validations/id";

type ActionResult<T> = { data?: T; error?: string };

export async function getProjects(): Promise<ActionResult<Project[]>> {
  try {
    const projects = await projectService.getVisible();
    return { data: projects as any };
  } catch (e) {
    return { error: actionError(e, "Failed to fetch projects") };
  }
}

export async function getAllProjects(): Promise<ActionResult<Project[]>> {
  if (!(await requireAdmin())) return { error: "Unauthorized" };
  try {
    const projects = await projectService.getAll();
    return { data: projects as any };
  } catch (e) {
    return { error: actionError(e, "Failed to fetch projects") };
  }
}

export async function getProject(
  slug: string
): Promise<ActionResult<Project | null>> {
  if (!(await requireAdmin())) return { error: "Unauthorized" };
  try {
    const project = await projectService.getBySlug(slug);
    return { data: project as any ?? null };
  } catch (e) {
    return { error: actionError(e, "Failed to fetch project") };
  }
}

export async function createProject(
  input: ProjectCreateInput
): Promise<ActionResult<Project>> {
  if (!(await requireAdmin())) return { error: "Unauthorized" };
  try {
    const parsed = projectSchema.parse(input);
    const project = await projectService.create(parsed as any);
    revalidatePublicContent({ project: [project.slug] });
    return { data: project as any };
  } catch (e) {
    return { error: actionError(e, "Failed to create project") };
  }
}

export async function updateProject(
  id: string,
  input: ProjectUpdateInput
): Promise<ActionResult<Project>> {
  if (!(await requireAdmin())) return { error: "Unauthorized" };
  try {
    idSchema.parse(id);
    const parsed = projectUpdateSchema.parse(input);
    const existing = await projectService.getById(id);
    const project = await projectService.update(id, parsed as any);
    revalidatePublicContent({
      project: [existing?.slug, project.slug].filter(
        (slug): slug is string => Boolean(slug)
      ),
    });
    return { data: project as any };
  } catch (e) {
    return { error: actionError(e, "Failed to update project") };
  }
}

export async function deleteProject(
  id: string
): Promise<ActionResult<void>> {
  if (!(await requireAdmin())) return { error: "Unauthorized" };
  try {
    idSchema.parse(id);
    const existing = await projectService.getById(id);
    await projectService.delete(id);
    revalidatePublicContent({ project: existing?.slug ? [existing.slug] : [] });
    return {};
  } catch (e) {
    return { error: actionError(e, "Failed to delete project") };
  }
}
