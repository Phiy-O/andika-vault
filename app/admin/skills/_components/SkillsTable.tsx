"use client";

import Image from "next/image";
import Link from "next/link";
import { WorkspaceSelectCheckbox } from "@/components/admin/workspace/WorkspaceSelectCheckbox";
import type { SkillListItem } from "@/src/types";
import { SkillCategoryBadge, SkillStatusBadge } from "./SkillBadges";
import { SkillActionsMenu, type SkillActionHandlers } from "./SkillActionsMenu";
import { shortRecordId } from "@/components/admin/workspace/utils";

export function SkillsTable({
  skills,
  actions,
  allSelected,
  someSelected,
  onSelectAll,
  selectDisabled,
}: {
  skills: SkillListItem[];
  actions: SkillActionHandlers;
  allSelected: boolean;
  someSelected: boolean;
  onSelectAll: (checked: boolean) => void;
  selectDisabled: boolean;
}) {
  return (
    <table className="w-full table-fixed border-collapse text-left">
      <caption className="sr-only">
        Skills with category, visibility, sort order, and actions
      </caption>
      <colgroup>
        <col className="w-[34px]" />
        <col />
        <col className="w-[112px]" />
        <col className="w-[72px]" />
        <col className="w-[104px]" />
        <col className="w-[152px]" />
      </colgroup>

      <thead>
        <tr className="border-b-2 border-line bg-admin-wash/60">
          <th scope="col" className="py-2.5 pl-3 pr-1">
            <WorkspaceSelectCheckbox
              checked={allSelected}
              indeterminate={someSelected}
              disabled={selectDisabled || skills.length === 0}
              onChange={onSelectAll}
              label="Select all skills on this page"
            />
          </th>
          <th
            scope="col"
            className="px-2.5 py-2.5 font-jet text-[8px] font-bold uppercase tracking-[.12em] text-muted"
          >
            Skill
          </th>
          <th
            scope="col"
            className="px-2 py-2.5 font-jet text-[8px] font-bold uppercase tracking-[.12em] text-muted"
          >
            Category
          </th>
          <th
            scope="col"
            className="px-2 py-2.5 text-center font-jet text-[8px] font-bold uppercase tracking-[.12em] text-muted"
          >
            Order
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
        {skills.map((skill) => {
          const selected = actions.selectedIds.has(skill.id);

          return (
            <tr
              key={skill.id}
              className={`border-b border-line/30 transition-colors last:border-b-0 ${
                selected ? "bg-admin-wash/70" : "hover:bg-admin-wash/35"
              }`}
            >
              <td className="h-[64px] py-3 pl-3 pr-1 align-middle">
                <WorkspaceSelectCheckbox
                  checked={selected}
                  disabled={selectDisabled}
                  onChange={() => actions.onToggleSelected(skill.id)}
                  label={`Select ${skill.name}`}
                />
              </td>

              <td className="px-2.5 py-3 align-middle">
                <div className="flex min-w-0 items-center gap-3">
                  <Image
                    src={skill.iconSrc}
                    alt=""
                    width={22}
                    height={22}
                    className="h-5.5 w-5.5 shrink-0"
                    unoptimized
                  />
                  <div className="min-w-0 flex-1">
                    <span className="truncate font-space text-[12.5px] font-bold leading-4 tracking-[-.01em] text-foreground">
                      {skill.name}
                    </span>
                    <Link
                      href={`/admin/skills/${skill.id}/edit`}
                      className="mt-0.5 block truncate font-jet text-[8.5px] font-medium tracking-[.01em] text-purple underline-offset-2 hover:underline"
                    >
                      /admin/skills/{shortRecordId(skill.id)}
                    </Link>
                  </div>
                </div>
              </td>

              <td className="px-2 py-3 align-middle">
                <SkillCategoryBadge category={skill.category} />
              </td>

              <td className="px-2 py-3 text-center align-middle">
                <p className="font-jet text-[9px] font-bold leading-4 text-foreground">
                  {skill.sortOrder}
                </p>
              </td>

              <td className="px-2 py-3 align-middle">
                <SkillStatusBadge skill={skill} />
              </td>

              <td className="py-3 pl-2 pr-2.5 align-middle">
                <div className="flex items-center justify-end gap-1">
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
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}