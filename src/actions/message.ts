"use server";

import { messageService } from "@/src/services";
import type { MessageCreateInput } from "@/src/types";
import type { Message } from "@prisma/client";
import { requireAdmin } from "@/src/lib/auth";
import { RateLimitError } from "@/src/lib/rate-limit";
import { actionError } from "./action-error";

type ActionResult<T> = { data?: T; error?: string };

export async function getAllMessages(): Promise<ActionResult<Message[]>> {
  if (!(await requireAdmin())) return { error: "Unauthorized" };
  try {
    const messages = await messageService.getAll();
    return { data: messages as any };
  } catch (e) {
    return { error: actionError(e, "Failed to fetch messages") };
  }
}

export async function createMessage(
  input: MessageCreateInput,
  clientKey = "direct"
): Promise<ActionResult<Message>> {
  try {
    const message = await messageService.create(input, clientKey);
    return { data: message as any };
  } catch (e) {
    // Our own rate-limit message is safe and the API route maps it to 429.
    if (e instanceof RateLimitError) return { error: e.message };
    return { error: actionError(e, "Failed to send message") };
  }
}

export async function markMessageRead(
  id: string,
  isRead = true
): Promise<ActionResult<void>> {
  if (!(await requireAdmin())) return { error: "Unauthorized" };
  try {
    await messageService.markRead(id, isRead);
    return {};
  } catch (e) {
    return { error: actionError(e, "Failed to update message") };
  }
}

export async function deleteMessage(id: string): Promise<ActionResult<void>> {
  if (!(await requireAdmin())) return { error: "Unauthorized" };
  try {
    await messageService.delete(id);
    return {};
  } catch (e) {
    return { error: actionError(e, "Failed to delete message") };
  }
}
