import { skillRepo } from "@/src/repositories/skill";
import { skillSchema, skillUpdateSchema } from "@/src/lib/validations/skill";

export const skillService = {
  async getVisible() {
    return skillRepo.findVisible();
  },

  async getAll() {
    return skillRepo.findAll();
  },

  async getById(id: string) {
    return skillRepo.findById(id);
  },

  async create(input: { name: string; iconSrc: string; category: string; sortOrder?: number; isVisible?: boolean }) {
    const parsed = skillSchema.parse(input);
    return skillRepo.create(parsed);
  },

  async update(id: string, input: Partial<{ name: string; iconSrc: string; category: string; sortOrder: number; isVisible: boolean }>) {
    const parsed = skillUpdateSchema.parse(input);
    return skillRepo.update(id, parsed);
  },

  async delete(id: string) {
    return skillRepo.delete(id);
  },
};
