import { prisma } from "@/lib/prisma";
import type { Prisma } from "@prisma/client";

export const messageRepo = {
  async findAll() {
    return prisma.message.findMany({
      orderBy: { createdAt: "desc" },
    });
  },

  async findById(id: string) {
    return prisma.message.findUnique({ where: { id } });
  },

  async create(data: Prisma.MessageCreateInput) {
    return prisma.message.create({ data });
  },

  async markRead(id: string) {
    return prisma.message.update({ where: { id }, data: { isRead: true } });
  },

  async delete(id: string) {
    return prisma.message.delete({ where: { id } });
  },
};