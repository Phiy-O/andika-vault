"use client";

import Link from "next/link";
import { ExternalLink, Pencil } from "lucide-react";
import type { ProjectListItem } from "@/src/types";
import {
  FeaturedButton,
  ProjectCategoryBadge,
  ProjectStatusBadge,
  ProjectTechBadge,
  ProjectThumbnail,
} from "./ProjectBadges";
import { ProjectActionsMenu } from "./ProjectActionsMenu";
import { SelectCheckbox } from "./SelectCheckbox";
import type { ProjectActionHandlers } from "./types";
import { formatDate, formatRelativeTime } from "./project-utils";

export function ProjectsTable({
  projects,
  actions,
  allSelected,
  someSelected,
  onSelectAll,
  selectDisabled,
}: {
  projects: ProjectListItem[];
  actions: ProjectActionHandlers;
  allSelected: boolean;
  someSelected: boolean;
  onSelectAll: (checked: boolean) => void;
  selectDisabled: boolean;
}) {
  return (
    <table className="w-full table-fixed border-collapse text-left">
      <caption className="sr-only">
        Portfolio projects with category, visibility, featured status, and last
        update
      </caption>
      <colgroup>
        <col className="w-[34px]" />
        <col />
        <col className="w-[112px]" />
        <col className="w-[112px]" />
        <col className="w-16" />
        <col className="w-[104px]" />
        <col className="w-[152px]" />
      </colgroup>

      <thead>
        <tr className="border-b-2 border-line bg-admin-wash/60">
          <th scope="col" className="py-2.5 pl-3 pr-1">
            <SelectCheckbox
              checked={allSelected}
              indeterminate={someSelected}
              disabled={selectDisabled || projects.length === 0}
              onChange={onSelectAll}
              label="Select all projects on this page"
            />
          </th>
          <th
            scope="col"
            className="px-2.5 py-2.5 font-jet text-[8px] font-bold uppercase tracking-[.12em] text-muted"
          >
            Project
          </th>
          <th
            scope="col"
            className="px-2 py-2.5 font-jet text-[8px] font-bold uppercase tracking-[.12em] text-muted"
          >
            Category
          </th>
          <th
            scope="col"
            className="px-2 py-2.5 font-jet text-[8px] font-bold uppercase tracking-[.12em] text-muted"
          >
            Status
          </th>
          <th
            scope="col"
            className="px-1 py-2.5 text-center font-jet text-[8px] font-bold uppercase tracking-[.12em] text-muted"
          >
            Featured
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
        {projects.map((project) => {
          const selected = actions.selectedIds.has(project.id);
          const busy = actions.busyIds.has(project.id);

          return (
            <tr
              key={project.id}
              className={`border-b border-line/30 transition-colors last:border-b-0 ${
                selected ? "bg-admin-wash/70" : "hover:bg-admin-wash/35"
              }`}
            >
              <td className="h-[84px] py-3 pl-3 pr-1 align-middle">
                <SelectCheckbox
                  checked={selected}
                  disabled={selectDisabled}
                  onChange={() => actions.onToggleSelected(project.id)}
                  label={`Select ${project.title}`}
                />
              </td>

              <td className="px-2.5 py-3 align-middle">
                <div className="flex min-w-0 items-center gap-3">
                  <ProjectThumbnail project={project} />
                  <div className="min-w-0 flex-1">
                    <div className="flex min-w-0 items-center gap-1.5">
                      <span className="truncate font-space text-[12.5px] font-bold leading-4 tracking-[-.01em] text-foreground">
                        {project.title}
                      </span>
                      {!project.isVisible && (
                        <span className="shrink-0 font-jet text-[7px] font-bold uppercase tracking-[.06em] text-muted">
                          Draft
                        </span>
                      )}
                    </div>
                    <Link
                      href={`/projects/${project.slug}`}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-0.5 block truncate font-jet text-[8.5px] font-medium tracking-[.01em] text-purple underline-offset-2 hover:underline"
                    >
                      /projects/{project.slug}
                    </Link>
                    <p className="mt-1 line-clamp-1 text-[10.5px] leading-4 text-muted">
                      {project.description}
                    </p>
                  </div>
                  <span className="hidden shrink-0 2xl:inline-flex">
                    <ProjectTechBadge techStack={project.techStack} />
                  </span>
                </div>
              </td>

              <td className="px-2 py-3 align-middle">
                <ProjectCategoryBadge category={project.category} />
              </td>

              <td className="px-2 py-3 align-middle">
                <ProjectStatusBadge project={project} />
              </td>

              <td className="px-1 py-3 text-center align-middle">
                <FeaturedButton
                  project={project}
                  busy={busy}
                  onToggle={() => actions.onToggleFeatured(project)}
                  className="mx-auto border border-transparent hover:border-line"
                />
              </td>

              <td className="px-2 py-3 align-middle">
                <p className="font-jet text-[9px] font-bold leading-4 text-foreground">
                  {formatDate(project.updatedAt)}
                </p>
                <p className="truncate font-jet text-[7.5px] font-medium uppercase leading-4 tracking-[.02em] text-muted">
                  {formatRelativeTime(project.updatedAt)}
                </p>
              </td>

              <td className="py-3 pl-2 pr-2.5 align-middle">
                <div className="flex items-center justify-end gap-1">
                  <Link
                    href={`/admin/projects/${project.id}/edit`}
                    className="inline-flex h-8 items-center gap-1 border border-line bg-surface px-2 font-jet text-[8px] font-bold uppercase tracking-[.04em] transition-colors hover:bg-admin-wash"
                    aria-label={`Edit ${project.title}`}
                    title="Edit project"
                  >
                    <Pencil size={10} aria-hidden="true" />
                    Edit
                  </Link>
                  <a
                    href={`/projects/${project.slug}`}
                    target="_blank"
                    rel="noreferrer"
                    className="grid size-8 place-items-center border border-line bg-surface transition-colors hover:bg-admin-wash"
                    aria-label={`Open ${project.title} public page`}
                    title="Open public page"
                  >
                    <ExternalLink size={12} aria-hidden="true" />
                  </a>
                  <ProjectActionsMenu project={project} actions={actions} />
                </div>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
