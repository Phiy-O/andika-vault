"use client";

import Link from "next/link";
import { ExternalLink, Pencil } from "lucide-react";
import type { CertificateListItem } from "@/src/types";
import { WorkspaceSelectCheckbox } from "@/components/admin/workspace/WorkspaceSelectCheckbox";
import {
  WorkspaceStatusBadge,
  WorkspaceTextBadge,
} from "@/components/admin/workspace/WorkspaceBadges";
import {
  formatDate,
  formatMonthYear,
  formatRelativeTime,
} from "@/components/admin/workspace/utils";
import {
  AchievementThumbnail,
  CredentialBadge,
} from "./AchievementBadges";
import {
  AchievementActionsMenu,
  type AchievementActionHandlers,
} from "./AchievementActionsMenu";

export function AchievementsTable({
  achievements,
  actions,
  allSelected,
  someSelected,
  onSelectAll,
  selectDisabled,
}: {
  achievements: CertificateListItem[];
  actions: AchievementActionHandlers;
  allSelected: boolean;
  someSelected: boolean;
  onSelectAll: (checked: boolean) => void;
  selectDisabled: boolean;
}) {
  return (
    <table className="w-full table-fixed border-collapse text-left">
      <caption className="sr-only">
        Achievements with issuer, visibility, credential link, and last update
      </caption>
      <colgroup>
        <col className="w-[34px]" />
        <col />
        <col className="w-[112px]" />
        <col className="w-[112px]" />
        <col className="w-[104px]" />
        <col className="w-[104px]" />
        <col className="w-[152px]" />
      </colgroup>

      <thead>
        <tr className="border-b-2 border-line bg-admin-wash/60">
          <th scope="col" className="py-2.5 pl-3 pr-1">
            <WorkspaceSelectCheckbox
              checked={allSelected}
              indeterminate={someSelected}
              disabled={selectDisabled || achievements.length === 0}
              onChange={onSelectAll}
              label="Select all achievements on this page"
            />
          </th>
          <th
            scope="col"
            className="px-2.5 py-2.5 font-jet text-[8px] font-bold uppercase tracking-[.12em] text-muted"
          >
            Achievement
          </th>
          <th
            scope="col"
            className="px-2 py-2.5 font-jet text-[8px] font-bold uppercase tracking-[.12em] text-muted"
          >
            Issuer
          </th>
          <th
            scope="col"
            className="px-2 py-2.5 font-jet text-[8px] font-bold uppercase tracking-[.12em] text-muted"
          >
            Status
          </th>
          <th
            scope="col"
            className="px-2 py-2.5 font-jet text-[8px] font-bold uppercase tracking-[.12em] text-muted"
          >
            Credential
          </th>
          <th
            scope="col"
            className="px-2 py-2.5 font-jet text-[8px] font-bold uppercase tracking-[.12em] text-muted"
          >
            Updated
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
        {achievements.map((achievement) => {
          const selected = actions.selectedIds.has(achievement.id);

          return (
            <tr
              key={achievement.id}
              className={`border-b border-line/30 transition-colors last:border-b-0 ${
                selected ? "bg-admin-wash/70" : "hover:bg-admin-wash/35"
              }`}
            >
              <td className="h-[84px] py-3 pl-3 pr-1 align-middle">
                <WorkspaceSelectCheckbox
                  checked={selected}
                  disabled={selectDisabled}
                  onChange={() => actions.onToggleSelected(achievement.id)}
                  label={`Select ${achievement.title}`}
                />
              </td>

              <td className="px-2.5 py-3 align-middle">
                <div className="flex min-w-0 items-center gap-3">
                  <AchievementThumbnail achievement={achievement} />
                  <div className="min-w-0 flex-1">
                    <div className="flex min-w-0 items-center gap-1.5">
                      <span className="truncate font-space text-[12.5px] font-bold leading-4 tracking-[-.01em] text-foreground">
                        {achievement.title}
                      </span>
                      {!achievement.isVisible && (
                        <span className="shrink-0 font-jet text-[7px] font-bold uppercase tracking-[.06em] text-muted">
                          Draft
                        </span>
                      )}
                    </div>
                    <p className="mt-0.5 block truncate font-jet text-[8.5px] font-medium tracking-[.01em] text-muted">
                      Issued {formatMonthYear(achievement.issueDate)}
                    </p>
                    <p className="mt-1 line-clamp-1 text-[10.5px] leading-4 text-muted">
                      {achievement.description}
                    </p>
                  </div>
                </div>
              </td>

              <td className="px-2 py-3 align-middle">
                <WorkspaceTextBadge
                  label={achievement.issuer}
                  title={achievement.issuer}
                />
              </td>

              <td className="px-2 py-3 align-middle">
                <WorkspaceStatusBadge visible={achievement.isVisible} />
              </td>

              <td className="px-2 py-3 align-middle">
                <CredentialBadge achievement={achievement} />
              </td>

              <td className="px-2 py-3 align-middle">
                <p className="font-jet text-[9px] font-bold leading-4 text-foreground">
                  {formatDate(achievement.updatedAt)}
                </p>
                <p className="truncate font-jet text-[7.5px] font-medium uppercase leading-4 tracking-[.02em] text-muted">
                  {formatRelativeTime(achievement.updatedAt)}
                </p>
              </td>

              <td className="py-3 pl-2 pr-2.5 align-middle">
                <div className="flex items-center justify-end gap-1">
                  <Link
                    href={`/admin/certificates/${achievement.id}/edit`}
                    className="inline-flex h-8 items-center gap-1 border border-line bg-surface px-2 font-jet text-[8px] font-bold uppercase tracking-[.04em] transition-colors hover:bg-admin-wash"
                    aria-label={`Edit ${achievement.title}`}
                    title="Edit achievement"
                  >
                    <Pencil size={10} aria-hidden="true" />
                    Edit
                  </Link>
                  <a
                    href="/achievements"
                    target="_blank"
                    rel="noreferrer"
                    className="grid size-8 place-items-center border border-line bg-surface transition-colors hover:bg-admin-wash"
                    aria-label={`Open the public achievements archive`}
                    title="Open public archive"
                  >
                    <ExternalLink size={12} aria-hidden="true" />
                  </a>
                  <AchievementActionsMenu
                    achievement={achievement}
                    actions={actions}
                  />
                </div>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
