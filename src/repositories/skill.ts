import { prisma } from "@/lib/prisma";

export const skillRepo = {
  async findAll() {
    return prisma.skill.findMany({ orderBy: { sortOrder: "asc" } });
  },

  async findVisible() {
    return prisma.skill.findMany({
      where: { isVisible: true },
      orderBy: { sortOrder: "asc" },
    });
  },

  async findById(id: string) {
    return prisma.skill.findUnique({ where: { id } });
  },

  async create(data: { name: string; iconSrc: string; category: string; sortOrder?: number; isVisible?: boolean }) {
    return prisma.skill.create({ data });
  },

  async update(id: string, data: { name?: string; iconSrc?: string; category?: string; sortOrder?: number; isVisible?: boolean }) {
    return prisma.skill.update({ where: { id }, data });
  },

  async delete(id: string) {
    return prisma.skill.delete({ where: { id } });
  },
};
