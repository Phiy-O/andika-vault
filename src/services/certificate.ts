import { certificateRepo } from "@/src/repositories";
import { certificateSchema, certificateUpdateSchema } from "@/src/lib/validations";
import type { CertificateCreateInput, CertificateUpdateInput } from "@/src/types";

export const certificateService = {
  async getVisible() {
    return certificateRepo.findVisible();
  },

  async getById(id: string) {
    return certificateRepo.findById(id);
  },

  async create(input: CertificateCreateInput) {
    const parsed = certificateSchema.parse(input);
    return certificateRepo.create(parsed as any);
  },

  async update(id: string, input: CertificateUpdateInput) {
    const parsed = certificateUpdateSchema.parse(input);
    return certificateRepo.update(id, parsed as any);
  },

  async delete(id: string) {
    return certificateRepo.delete(id);
  },
};
