import { messageRepo } from "@/src/repositories";
import { messageSchema } from "@/src/lib/validations";
import type { MessageCreateInput } from "@/src/types";

export const messageService = {
  async getAll() {
    return messageRepo.findAll();
  },

  async getById(id: string) {
    return messageRepo.findById(id);
  },

  async create(input: MessageCreateInput) {
    const parsed = messageSchema.parse(input);
    return messageRepo.create(parsed as any);
  },

  async markRead(id: string) {
    return messageRepo.markRead(id);
  },

  async delete(id: string) {
    return messageRepo.delete(id);
  },
};