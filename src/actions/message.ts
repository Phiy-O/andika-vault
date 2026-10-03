"use server";

import { messageService } from "@/src/services";
import { messageSchema } from "@/src/lib/validations";
import type { MessageCreateInput } from "@/src/types";
import type { Message } from "@prisma/client";
import { requireAdmin } from "@/src/lib/auth";

type ActionResult<T> = { data?: T; error?: string };

export async function getAllMessages(): Promise<ActionResult<Message[]>> {
  try {
    const messages = await messageService.getAll();
    return { data: messages as any };
  } catch (e: any) {
    return { error: e.message ?? "Failed to fetch messages" };
  }
}

export async function createMessage(
  input: MessageCreateInput
): Promise<ActionResult<Message>> {
  try {
    const parsed = messageSchema.parse(input);
    const message = await messageService.create(parsed as any);
    return { data: message as any };
  } catch (e: any) {
    if (e.issues)
      return { error: e.issues.map((i: any) => i.message).join(", ") };
    return { error: e.message ?? "Failed to send message" };
  }
}

export async function markMessageRead(id: string): Promise<ActionResult<void>> {
  if (!(await requireAdmin())) return { error: "Unauthorized" };
  try {
    await messageService.markRead(id);
    return {};
  } catch (e: any) {
    return { error: e.message ?? "Failed to update message" };
  }
}

export async function deleteMessage(id: string): Promise<ActionResult<void>> {
  if (!(await requireAdmin())) return { error: "Unauthorized" };
  try {
    await messageService.delete(id);
    return {};
  } catch (e: any) {
    return { error: e.message ?? "Failed to delete message" };
  }
}