"use client";

import Image from "next/image";
import Link from "next/link";
import { WorkspaceSelectCheckbox } from "@/components/admin/workspace/WorkspaceSelectCheckbox";
import type { SkillListItem } from "@/src/types";
import { SkillCategoryBadge, SkillStatusBadge } from "./SkillBadges";
import { SkillActionsMenu, type SkillActionHandlers } from "./SkillActionsMenu";
import { shortRecordId } from "@/components/admin/workspace/utils";

export function SkillsListCards({
  skills,
  actions,
  selectDisabled,
}: {
  skills: SkillListItem[];
  actions: SkillActionHandlers;
  selectDisabled: boolean;
}) {
  return (
    <div className="divide-y divide-line/30" role="list">
      {skills.map((skill) => {
        const selected = actions.selectedIds.has(skill.id);

        return (
          <article
            key={skill.id}
            className={`flex flex-col gap-2 px-3 py-3 transition-colors ${
              selected ? "bg-admin-wash/70" : "hover:bg-admin-wash/35"
            }`}
            role="listitem"
          >
            <div className="flex items-start gap-3">
              <WorkspaceSelectCheckbox
                checked={selected}
                disabled={selectDisabled}
                onChange={() => actions.onToggleSelected(skill.id)}
                label={`Select ${skill.name}`}
                className="mt-0.5 shrink-0"
              />
              <div className="flex min-w-0 flex-1 items-center gap-3">
                <Image
                  src={skill.iconSrc}
                  alt=""
                  width={28}
                  height={28}
                  className="h-7 w-7 shrink-0"
                  unoptimized
                />
                <div className="min-w-0 flex-1">
                  <div className="flex min-w-0 items-center gap-2">
                    <span className="truncate font-space text-[13px] font-bold leading-4 tracking-[-.01em] text-foreground">
                      {skill.name}
                    </span>
                    <SkillCategoryBadge category={skill.category} />
                    <SkillStatusBadge skill={skill} />
                  </div>
                  <Link
                    href={`/admin/skills/${skill.id}/edit`}
                    className="mt-0.5 block truncate font-jet text-[8.5px] font-medium tracking-[.01em] text-purple underline-offset-2 hover:underline"
                  >
                    /admin/skills/{shortRecordId(skill.id)}
                  </Link>
                </div>
                <div className="flex shrink-0 items-center gap-1">
                  <Link
                    href={`/admin/skills/${skill.id}/edit`}
                    className="inline-flex h-8 items-center gap-1 border border-line bg-surface px-2 font-jet text-[8px] font-bold uppercase tracking-[.04em] transition-colors hover:bg-admin-wash"
                    aria-label={`Edit ${skill.name}`}
                    title="Edit skill"
                  >
                    Edit
                  </Link>
                  <SkillActionsMenu skill={skill} actions={actions} />
                </div>
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
}

export function SkillsGrid({
  skills,
  actions,
  selectDisabled,
}: {
  skills: SkillListItem[];
  actions: SkillActionHandlers;
  selectDisabled: boolean;
}) {
  return (
    <div
      className="grid gap-3 p-3"
      style={{
        gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
      }}
      role="list"
    >
      {skills.map((skill) => {
        const selected = actions.selectedIds.has(skill.id);

        return (
          <article
            key={skill.id}
            className={`flex flex-col gap-2 border-2 border-line bg-surface shadow-[2px_2px_0_var(--foreground)] p-3 transition-colors ${
              selected ? "border-foreground bg-admin-wash/70" : "hover:border-foreground/50"
            }`}
            role="listitem"
          >
            <div className="flex items-start gap-2">
              <WorkspaceSelectCheckbox
                checked={selected}
                disabled={selectDisabled}
                onChange={() => actions.onToggleSelected(skill.id)}
                label={`Select ${skill.name}`}
                className="mt-0.5 shrink-0"
              />
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <Image
                    src={skill.iconSrc}
                    alt=""
                    width={24}
                    height={24}
                    className="h-6 w-6 shrink-0"
                    unoptimized
                  />
                  <span className="truncate font-space text-[12.5px] font-bold leading-4 tracking-[-.01em] text-foreground">
                    {skill.name}
                  </span>
                </div>
                <div className="mt-2 flex items-center gap-2">
                  <SkillCategoryBadge category={skill.category} />
                  <SkillStatusBadge skill={skill} />
                </div>
                <Link
                  href={`/admin/skills/${skill.id}/edit`}
                  className="mt-1 block truncate font-jet text-[8.5px] font-medium tracking-[.01em] text-purple underline-offset-2 hover:underline"
                >
                  /admin/skills/{shortRecordId(skill.id)}
                </Link>
              </div>
              <SkillActionsMenu skill={skill} actions={actions} />
            </div>
          </article>
        );
      })}
    </div>
  );
}