import { prisma } from "@/lib/prisma";
import type { Prisma } from "@prisma/client";
import { blogPostListSelect } from "@/src/types";

export const blogPostRepo = {
  async findAll(args?: { where?: Prisma.BlogPostWhereInput }) {
    return prisma.blogPost.findMany({
      where: args?.where,
      orderBy: { sortOrder: "asc" },
      select: blogPostListSelect,
    });
  },

  async findVisible() {
    return prisma.blogPost.findMany({
      where: { isVisible: true },
      orderBy: { sortOrder: "asc" },
      select: blogPostListSelect,
    });
  },

  async findBySlug(slug: string) {
    return prisma.blogPost.findUnique({ where: { slug } });
  },

  async findVisibleBySlug(slug: string) {
    return prisma.blogPost.findFirst({
      where: { slug, isVisible: true },
    });
  },

  async findById(id: string) {
    return prisma.blogPost.findUnique({ where: { id } });
  },

  async create(data: Prisma.BlogPostCreateInput) {
    return prisma.blogPost.create({ data });
  },

  async update(id: string, data: Prisma.BlogPostUpdateInput) {
    return prisma.blogPost.update({ where: { id }, data });
  },

  async delete(id: string) {
    return prisma.blogPost.delete({ where: { id } });
  },
};
