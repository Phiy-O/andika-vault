import { messageRepo } from "@/src/repositories";
import { messageSchema } from "@/src/lib/validations";
import { checkRateLimit } from "@/src/lib/rate-limit";
import type { MessageCreateInput } from "@/src/types";

export const messageService = {
  async getAll() {
    return messageRepo.findAll();
  },

  async getById(id: string) {
    return messageRepo.findById(id);
  },

  async create(input: MessageCreateInput, clientKey = "direct") {
    checkRateLimit(`contact:${clientKey}`);
    const parsed = messageSchema.parse(input);
    const { subject, consent: _consent, ...data } = parsed;
    void _consent;
    // The Message model has no dedicated subject column; keep it with the
    // body so the admin inbox still shows what the visitor wrote.
    return messageRepo.create({
      ...data,
      message: `Subject: ${subject}\n\n${data.message}`,
    });
  },

  async markRead(id: string, isRead = true) {
    return messageRepo.markRead(id, isRead);
  },

  async delete(id: string) {
    return messageRepo.delete(id);
  },
};
