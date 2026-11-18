"use client";

import { WorkspaceSelectCheckbox } from "@/components/admin/workspace/WorkspaceSelectCheckbox";
import type { Message } from "@prisma/client";
import { MessageStatusBadge } from "./MessageBadges";
import { MessageActionsMenu, type MessageActionHandlers } from "./MessageActionsMenu";
import { shortRecordId } from "@/components/admin/workspace/utils";

export function MessagesListCards({
  messages,
  actions,
  selectDisabled,
}: {
  messages: Message[];
  actions: MessageActionHandlers;
  selectDisabled: boolean;
}) {
  return (
    <div className="divide-y divide-line/30" role="list">
      {messages.map((message) => {
        const selected = actions.selectedIds.has(message.id);
        const busy = actions.busyIds.has(message.id);

        return (
          <article
            key={message.id}
            className={`flex flex-col gap-2 px-3 py-3 transition-colors ${
              selected ? "bg-admin-wash/70" : "hover:bg-admin-wash/35"
            } ${message.isRead ? "opacity-60" : ""}`}
            role="listitem"
          >
            <div className="flex items-start gap-3">
              <WorkspaceSelectCheckbox
                checked={selected}
                disabled={selectDisabled}
                onChange={() => actions.onToggleSelected(message.id)}
                label={`Select message from ${message.name}`}
                className="mt-0.5 shrink-0"
              />
              <div className="flex min-w-0 flex-1 items-start gap-3">
                <div className="min-w-0 flex-1">
                  <div className="flex min-w-0 items-start gap-2">
                    <div className="min-w-0">
                      <p className="truncate font-medium text-foreground">{message.name}</p>
                      <a
                        href={`mailto:${message.email}`}
                        className="mt-0.5 block truncate font-jet text-[8.5px] font-medium tracking-[.01em] text-purple underline-offset-2 hover:underline"
                      >
                        {message.email}
                      </a>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <MessageStatusBadge message={message} />
                    </div>
                  </div>
                  <p className="mt-1 line-clamp-2 text-sm leading-5 text-muted">{message.message}</p>
                  <div className="mt-2 flex items-center gap-2 text-xs text-muted">
                    <span className="font-jet text-[9px] font-bold">
                      {new Date(message.createdAt).toLocaleDateString("en", {
                        month: "short",
                        day: "2-digit",
                        year: "numeric",
                      })}
                    </span>
                    <span className="font-jet text-[7.5px] font-medium uppercase">
                      {new Date(message.createdAt).toLocaleTimeString("en", {
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: false,
                      })}
                    </span>
                  </div>
                </div>
                <div className="flex shrink-0 items-center gap-1">
                  <MessageActionsMenu message={message} actions={actions} />
                </div>
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
}

export function MessagesGrid({
  messages,
  actions,
  selectDisabled,
}: {
  messages: Message[];
  actions: MessageActionHandlers;
  selectDisabled: boolean;
}) {
  return (
    <div
      className="grid gap-3 p-3"
      style={{
        gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
      }}
      role="list"
    >
      {messages.map((message) => {
        const selected = actions.selectedIds.has(message.id);
        const busy = actions.busyIds.has(message.id);

        return (
          <article
            key={message.id}
            className={`flex flex-col gap-2 border-2 border-line bg-surface shadow-[2px_2px_0_var(--foreground)] p-3 transition-colors ${
              selected ? "border-foreground bg-admin-wash/70" : "hover:border-foreground/50"
            } ${message.isRead ? "opacity-60" : ""}`}
            role="listitem"
          >
            <div className="flex items-start gap-2">
              <WorkspaceSelectCheckbox
                checked={selected}
                disabled={selectDisabled}
                onChange={() => actions.onToggleSelected(message.id)}
                label={`Select message from ${message.name}`}
                className="mt-0.5 shrink-0"
              />
              <div className="min-w-0 flex-1">
                <div className="flex items-start gap-2">
                  <div className="min-w-0">
                    <p className="truncate font-medium text-foreground">{message.name}</p>
                    <a
                      href={`mailto:${message.email}`}
                      className="mt-0.5 block truncate font-jet text-[8.5px] font-medium tracking-[.01em] text-purple underline-offset-2 hover:underline"
                    >
                      {message.email}
                    </a>
                  </div>
                  <MessageStatusBadge message={message} />
                </div>
                <p className="mt-2 line-clamp-3 text-sm leading-5 text-muted">{message.message}</p>
                <div className="mt-2 flex items-center gap-2 text-xs text-muted">
                  <span className="font-jet text-[9px] font-bold">
                    {new Date(message.createdAt).toLocaleDateString("en", {
                      month: "short",
                      day: "2-digit",
                      year: "numeric",
                    })}
                  </span>
                  <span className="font-jet text-[7.5px] font-medium uppercase">
                    {new Date(message.createdAt).toLocaleTimeString("en", {
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: false,
                    })}
                  </span>
                </div>
              </div>
              <MessageActionsMenu message={message} actions={actions} />
            </div>
          </article>
        );
      })}
    </div>
  );
}