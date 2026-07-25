import { projectRepo } from "@/src/repositories";
import { projectSchema, projectUpdateSchema } from "@/src/lib/validations";
import type { ProjectCreateInput, ProjectUpdateInput } from "@/src/types";
import slugify from "@/src/lib/slugify";

export const projectService = {
  async getVisible() {
    return projectRepo.findVisible();
  },

  async getBySlug(slug: string) {
    return projectRepo.findBySlug(slug);
  },

  async getById(id: string) {
    return projectRepo.findById(id);
  },

  async create(input: ProjectCreateInput) {
    const parsed = projectSchema.parse(input);
    const slug = parsed.slug || slugify(parsed.title);
    return projectRepo.create({ ...parsed, slug } as any);
  },

  async update(id: string, input: ProjectUpdateInput) {
    const parsed = projectUpdateSchema.parse(input);
    return projectRepo.update(id, parsed as any);
  },

  async delete(id: string) {
    return projectRepo.delete(id);
  },
};
