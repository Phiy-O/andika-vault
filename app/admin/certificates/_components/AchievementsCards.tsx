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

export function AchievementsListCards({
  achievements,
  actions,
  selectDisabled,
}: {
  achievements: CertificateListItem[];
  actions: AchievementActionHandlers;
  selectDisabled: boolean;
}) {
  return (
    <div>
      {achievements.map((achievement) => {
        const selected = actions.selectedIds.has(achievement.id);

        return (
          <article
            key={achievement.id}
            aria-label={achievement.title}
            className={`border-b border-line/30 p-3.5 transition-colors last:border-b-0 sm:p-4 ${
              selected ? "bg-admin-wash/70" : ""
            }`}
          >
            <div className="flex items-start gap-2.5 sm:gap-3">
              <WorkspaceSelectCheckbox
                checked={selected}
                disabled={selectDisabled}
                onChange={() => actions.onToggleSelected(achievement.id)}
                label={`Select ${achievement.title}`}
                className="mt-1.5"
              />

              <AchievementThumbnail achievement={achievement} />

              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="line-clamp-2 break-words font-space text-[13px] font-bold leading-4 tracking-[-.01em] text-foreground">
                      {achievement.title}
                    </p>
                    <p className="mt-0.5 block truncate font-jet text-[8.5px] font-medium tracking-[.01em] text-muted">
                      Issued {formatMonthYear(achievement.issueDate)}
                    </p>
                  </div>
                  <CredentialBadge achievement={achievement} />
                </div>

                <p className="mt-1.5 line-clamp-2 text-[11px] leading-4 text-muted">
                  {achievement.description}
                </p>

                <div className="mt-2 flex flex-wrap items-center gap-1.5">
                  <WorkspaceStatusBadge visible={achievement.isVisible} />
                  <WorkspaceTextBadge
                    label={achievement.issuer}
                    title={achievement.issuer}
                  />
                </div>
              </div>
            </div>

            <div className="mt-3 flex flex-wrap items-center justify-between gap-x-3 gap-y-2 border-t border-line/25 pt-2.5 sm:pl-7">
              <p className="font-jet text-[8px] font-medium uppercase leading-4 tracking-[.03em] text-muted">
                Updated{" "}
                <span className="font-bold text-foreground">
                  {formatDate(achievement.updatedAt)}
                </span>
                <span aria-hidden="true" className="mx-1.5 text-muted/50">
                  /
                </span>
                {formatRelativeTime(achievement.updatedAt)}
              </p>

              <div className="flex items-center gap-1">
                <Link
                  href={`/admin/certificates/${achievement.id}/edit`}
                  className="inline-flex h-7 items-center gap-1 border border-line bg-surface px-2 font-jet text-[8px] font-bold uppercase tracking-[.04em] transition-colors hover:bg-admin-wash"
                  aria-label={`Edit ${achievement.title}`}
                >
                  <Pencil size={10} aria-hidden="true" />
                  Edit
                </Link>
                <a
                  href="/achievements"
                  target="_blank"
                  rel="noreferrer"
                  className="grid size-7 place-items-center border border-line bg-surface transition-colors hover:bg-admin-wash"
                  aria-label="Open the public achievements archive"
                  title="Open public archive"
                >
                  <ExternalLink size={11} aria-hidden="true" />
                </a>
                <AchievementActionsMenu
                  achievement={achievement}
                  actions={actions}
                />
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
}

export function AchievementsGrid({
  achievements,
  actions,
  selectDisabled,
}: {
  achievements: CertificateListItem[];
  actions: AchievementActionHandlers;
  selectDisabled: boolean;
}) {
  return (
    <div className="grid gap-4 p-4 sm:grid-cols-2 2xl:grid-cols-3">
      {achievements.map((achievement) => {
        const selected = actions.selectedIds.has(achievement.id);

        return (
          <article
            key={achievement.id}
            aria-label={achievement.title}
            className={`flex flex-col border-2 border-line bg-surface transition-colors ${
              selected
                ? "shadow-[3px_3px_0_var(--purple)]"
                : "shadow-[3px_3px_0_var(--foreground)]"
            }`}
          >
            <div className="relative">
              <AchievementThumbnail achievement={achievement} size="card" />
              <span className="absolute left-2 top-2 grid size-6 place-items-center border border-line bg-surface/95">
                <WorkspaceSelectCheckbox
                  checked={selected}
                  disabled={selectDisabled}
                  onChange={() => actions.onToggleSelected(achievement.id)}
                  label={`Select ${achievement.title}`}
                />
              </span>
            </div>

            <div className="flex min-h-0 flex-1 flex-col p-3.5">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="truncate font-space text-[14px] font-bold leading-5 tracking-[-.02em]">
                    {achievement.title}
                  </p>
                  <p className="mt-0.5 block truncate font-jet text-[8.5px] font-medium tracking-[.01em] text-muted">
                    Issued {formatMonthYear(achievement.issueDate)}
                  </p>
                </div>
                <CredentialBadge achievement={achievement} />
              </div>

              <p className="mt-2 line-clamp-2 text-[11px] leading-[1.6] text-muted">
                {achievement.description}
              </p>

              <div className="mt-3 flex flex-wrap items-center gap-1.5">
                <WorkspaceStatusBadge visible={achievement.isVisible} />
                <WorkspaceTextBadge
                  label={achievement.issuer}
                  title={achievement.issuer}
                />
              </div>

              <div className="mt-auto flex items-center justify-between gap-2 border-t border-line/25 pt-3">
                <p className="min-w-0 truncate font-jet text-[7.5px] font-medium uppercase leading-4 tracking-[.03em] text-muted">
                  Updated{" "}
                  <span className="font-bold text-foreground">
                    {formatDate(achievement.updatedAt)}
                  </span>
                </p>
                <div className="flex shrink-0 items-center gap-1">
                  <Link
                    href={`/admin/certificates/${achievement.id}/edit`}
                    className="inline-flex h-7 items-center gap-1 border border-line bg-surface px-2 font-jet text-[8px] font-bold uppercase tracking-[.04em] transition-colors hover:bg-admin-wash"
                    aria-label={`Edit ${achievement.title}`}
                  >
                    <Pencil size={10} aria-hidden="true" />
                    Edit
                  </Link>
                  <AchievementActionsMenu
                    achievement={achievement}
                    actions={actions}
                  />
                </div>
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
}
