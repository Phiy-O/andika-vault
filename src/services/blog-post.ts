import { blogPostRepo } from "@/src/repositories";
import { blogPostSchema, blogPostUpdateSchema } from "@/src/lib/validations";
import type { BlogPostCreateInput, BlogPostUpdateInput } from "@/src/types";
import slugify from "@/src/lib/slugify";

export const blogPostService = {
  async getAll() {
    return blogPostRepo.findAll();
  },

  async getVisible() {
    return blogPostRepo.findVisible();
  },

  async getBySlug(slug: string) {
    return blogPostRepo.findBySlug(slug);
  },

  async getVisibleBySlug(slug: string) {
    return blogPostRepo.findVisibleBySlug(slug);
  },

  async getById(id: string) {
    return blogPostRepo.findById(id);
  },

  async create(input: BlogPostCreateInput) {
    const parsed = blogPostSchema.parse(input);
    const slug = parsed.slug || slugify(parsed.title);
    return blogPostRepo.create({ ...parsed, slug } as any);
  },

  async update(id: string, input: BlogPostUpdateInput) {
    const parsed = blogPostUpdateSchema.parse(input);
    return blogPostRepo.update(id, parsed as any);
  },

  async delete(id: string) {
    return blogPostRepo.delete(id);
  },
};
