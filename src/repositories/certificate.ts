import { prisma } from "@/lib/prisma";
import type { Prisma } from "@prisma/client";
import { certificateListSelect } from "@/src/types";

export const certificateRepo = {
  async findAll(args?: { where?: Prisma.CertificateWhereInput }) {
    return prisma.certificate.findMany({
      where: args?.where,
      orderBy: { sortOrder: "asc" },
      select: certificateListSelect,
    });
  },

  async findVisible() {
    return prisma.certificate.findMany({
      where: { isVisible: true },
      orderBy: { sortOrder: "asc" },
      select: certificateListSelect,
    });
  },

  async findById(id: string) {
    return prisma.certificate.findUnique({ where: { id } });
  },

  async create(data: Prisma.CertificateCreateInput) {
    return prisma.certificate.create({ data });
  },

  async update(id: string, data: Prisma.CertificateUpdateInput) {
    return prisma.certificate.update({ where: { id }, data });
  },

  async delete(id: string) {
    return prisma.certificate.delete({ where: { id } });
  },
};
