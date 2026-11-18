"use client";

import { Mail, MailOpen } from "lucide-react";
import type { Message } from "@prisma/client";

export function MessageStatusBadge({ message }: { message: Message }) {
  if (message.isRead) {
    return (
      <span className="inline-flex items-center gap-1 text-xs text-muted">
        <MailOpen size={12} aria-hidden="true" />
        Read
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 text-xs text-purple">
      <Mail size={12} aria-hidden="true" />
      Unread
    </span>
  );
}