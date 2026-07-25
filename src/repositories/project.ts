import { prisma } from "@/lib/prisma";
import type { Prisma } from "@prisma/client";
import { projectListSelect } from "@/src/types";

export const projectRepo = {
  async findAll(args?: { where?: Prisma.ProjectWhereInput }) {
    return prisma.project.findMany({
      where: args?.where,
      orderBy: { sortOrder: "asc" },
      select: projectListSelect,
    });
  },

  async findVisible() {
    return prisma.project.findMany({
      where: { isVisible: true },
      orderBy: { sortOrder: "asc" },
      select: projectListSelect,
    });
  },

  async findBySlug(slug: string) {
    return prisma.project.findUnique({ where: { slug } });
  },

  async findById(id: string) {
    return prisma.project.findUnique({ where: { id } });
  },

  async create(data: Prisma.ProjectCreateInput) {
    return prisma.project.create({ data });
  },

  async update(id: string, data: Prisma.ProjectUpdateInput) {
    return prisma.project.update({ where: { id }, data });
  },

  async delete(id: string) {
    return prisma.project.delete({ where: { id } });
  },
};
