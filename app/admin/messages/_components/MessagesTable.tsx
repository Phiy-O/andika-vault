"use client";

import { WorkspaceSelectCheckbox } from "@/components/admin/workspace/WorkspaceSelectCheckbox";
import type { Message } from "@prisma/client";
import { MessageStatusBadge } from "./MessageBadges";
import { MessageActionsMenu, type MessageActionHandlers } from "./MessageActionsMenu";
import { shortRecordId } from "@/components/admin/workspace/utils";

export function MessagesTable({
  messages,
  actions,
  allSelected,
  someSelected,
  onSelectAll,
  selectDisabled,
}: {
  messages: Message[];
  actions: MessageActionHandlers;
  allSelected: boolean;
  someSelected: boolean;
  onSelectAll: (checked: boolean) => void;
  selectDisabled: boolean;
}) {
  return (
    <table className="w-full table-fixed border-collapse text-left">
      <caption className="sr-only">
        Messages with sender, content preview, status, and actions
      </caption>
      <colgroup>
        <col className="w-[34px]" />
        <col />
        <col className="w-[160px]" />
        <col className="w-[100px]" />
        <col className="w-[152px]" />
      </colgroup>

      <thead>
        <tr className="border-b-2 border-line bg-admin-wash/60">
          <th scope="col" className="py-2.5 pl-3 pr-1">
            <WorkspaceSelectCheckbox
              checked={allSelected}
              indeterminate={someSelected}
              disabled={selectDisabled || messages.length === 0}
              onChange={onSelectAll}
              label="Select all messages on this page"
            />
          </th>
          <th
            scope="col"
            className="px-2.5 py-2.5 font-jet text-[8px] font-bold uppercase tracking-[.12em] text-muted"
          >
            From
          </th>
          <th
            scope="col"
            className="px-2 py-2.5 font-jet text-[8px] font-bold uppercase tracking-[.12em] text-muted"
          >
            Message
          </th>
          <th
            scope="col"
            className="px-2 py-2.5 font-jet text-[8px] font-bold uppercase tracking-[.12em] text-muted"
          >
            Received
          </th>
          <th
            scope="col"
            className="px-2 py-2.5 font-jet text-[8px] font-bold uppercase tracking-[.12em] text-muted"
          >
            Status
          </th>
          <th
            scope="col"
            className="py-2.5 pl-2 pr-2.5 text-right font-jet text-[8px] font-bold uppercase tracking-[.12em] text-muted"
          >
            Actions
          </th>
        </tr>
      </thead>

      <tbody>
        {messages.map((message) => {
          const selected = actions.selectedIds.has(message.id);
          const busy = actions.busyIds.has(message.id);

          return (
            <tr
              key={message.id}
              className={`border-b border-line/30 transition-colors last:border-b-0 ${
                selected ? "bg-admin-wash/70" : "hover:bg-admin-wash/35"
              } ${message.isRead ? "opacity-60" : ""}`}
            >
              <td className="h-[64px] py-3 pl-3 pr-1 align-middle">
                <WorkspaceSelectCheckbox
                  checked={selected}
                  disabled={selectDisabled}
                  onChange={() => actions.onToggleSelected(message.id)}
                  label={`Select message from ${message.name}`}
                />
              </td>

              <td className="px-2.5 py-3 align-middle">
                <div className="min-w-0">
                  <div className="font-medium text-foreground truncate">{message.name}</div>
                  <a
                    href={`mailto:${message.email}`}
                    className="mt-0.5 block truncate font-jet text-[8.5px] font-medium tracking-[.01em] text-purple underline-offset-2 hover:underline"
                  >
                    {message.email}
                  </a>
                </div>
              </td>

              <td className="px-2 py-3 align-middle max-w-[320px]">
                <p className="line-clamp-2 text-sm leading-5 text-muted">{message.message}</p>
              </td>

              <td className="px-2 py-3 align-middle">
                <p className="font-jet text-[9px] font-bold leading-4 text-foreground">
                  {new Date(message.createdAt).toLocaleDateString("en", {
                    month: "short",
                    day: "2-digit",
                    year: "numeric",
                  })}
                </p>
                <p className="truncate font-jet text-[7.5px] font-medium uppercase leading-4 tracking-[.02em] text-muted">
                  {new Date(message.createdAt).toLocaleTimeString("en", {
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: false,
                  })}
                </p>
              </td>

              <td className="px-2 py-3 align-middle">
                <MessageStatusBadge message={message} />
              </td>

              <td className="py-3 pl-2 pr-2.5 align-middle">
                <div className="flex items-center justify-end gap-1">
                  <MessageActionsMenu message={message} actions={actions} />
                </div>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}