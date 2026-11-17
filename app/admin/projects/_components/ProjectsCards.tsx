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

export function ProjectsListCards({
  projects,
  actions,
  selectDisabled,
}: {
  projects: ProjectListItem[];
  actions: ProjectActionHandlers;
  selectDisabled: boolean;
}) {
  return (
    <div>
      {projects.map((project) => {
        const selected = actions.selectedIds.has(project.id);
        const busy = actions.busyIds.has(project.id);

        return (
          <article
            key={project.id}
            aria-label={project.title}
            className={`border-b border-line/30 p-3.5 transition-colors last:border-b-0 sm:p-4 ${
              selected ? "bg-admin-wash/70" : ""
            }`}
          >
            <div className="flex items-start gap-2.5 sm:gap-3">
              <SelectCheckbox
                checked={selected}
                disabled={selectDisabled}
                onChange={() => actions.onToggleSelected(project.id)}
                label={`Select ${project.title}`}
                className="mt-1.5"
              />

              <ProjectThumbnail project={project} />

              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="truncate font-space text-[13px] font-bold leading-4 tracking-[-.01em] text-foreground">
                      {project.title}
                    </p>
                    <Link
                      href={`/projects/${project.slug}`}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-0.5 block truncate font-jet text-[8.5px] font-medium tracking-[.01em] text-purple underline-offset-2 hover:underline"
                    >
                      /projects/{project.slug}
                    </Link>
                  </div>
                  <FeaturedButton
                    project={project}
                    busy={busy}
                    onToggle={() => actions.onToggleFeatured(project)}
                    className="-mr-1 -mt-1 border border-transparent hover:border-line"
                  />
                </div>

                <p className="mt-1.5 line-clamp-2 text-[11px] leading-4 text-muted">
                  {project.description}
                </p>

                <div className="mt-2 flex flex-wrap items-center gap-1.5">
                  <ProjectStatusBadge project={project} />
                  <ProjectCategoryBadge category={project.category} />
                  <ProjectTechBadge techStack={project.techStack} />
                </div>
              </div>
            </div>

            <div className="mt-3 flex flex-wrap items-center justify-between gap-x-3 gap-y-2 border-t border-line/25 pt-2.5 sm:pl-7">
              <p className="font-jet text-[8px] font-medium uppercase leading-4 tracking-[.03em] text-muted">
                Updated{" "}
                <span className="font-bold text-foreground">
                  {formatDate(project.updatedAt)}
                </span>
                <span aria-hidden="true" className="mx-1.5 text-muted/50">
                  /
                </span>
                {formatRelativeTime(project.updatedAt)}
              </p>

              <div className="flex items-center gap-1">
                <Link
                  href={`/admin/projects/${project.id}/edit`}
                  className="inline-flex h-7 items-center gap-1 border border-line bg-surface px-2 font-jet text-[8px] font-bold uppercase tracking-[.04em] transition-colors hover:bg-admin-wash"
                  aria-label={`Edit ${project.title}`}
                >
                  <Pencil size={10} aria-hidden="true" />
                  Edit
                </Link>
                <a
                  href={`/projects/${project.slug}`}
                  target="_blank"
                  rel="noreferrer"
                  className="grid size-7 place-items-center border border-line bg-surface transition-colors hover:bg-admin-wash"
                  aria-label={`Open ${project.title} public page`}
                  title="Open public page"
                >
                  <ExternalLink size={11} aria-hidden="true" />
                </a>
                <ProjectActionsMenu project={project} actions={actions} />
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
}

export function ProjectsGrid({
  projects,
  actions,
  selectDisabled,
}: {
  projects: ProjectListItem[];
  actions: ProjectActionHandlers;
  selectDisabled: boolean;
}) {
  return (
    <div className="grid gap-4 p-4 sm:grid-cols-2 2xl:grid-cols-3">
      {projects.map((project) => {
        const selected = actions.selectedIds.has(project.id);
        const busy = actions.busyIds.has(project.id);

        return (
          <article
            key={project.id}
            aria-label={project.title}
            className={`flex flex-col border-2 border-line bg-surface transition-colors ${
              selected
                ? "shadow-[3px_3px_0_var(--purple)]"
                : "shadow-[3px_3px_0_var(--foreground)]"
            }`}
          >
            <div className="relative">
              <ProjectThumbnail project={project} size="card" />
              <span className="absolute left-2 top-2 grid size-6 place-items-center border border-line bg-surface/95">
                <SelectCheckbox
                  checked={selected}
                  disabled={selectDisabled}
                  onChange={() => actions.onToggleSelected(project.id)}
                  label={`Select ${project.title}`}
                />
              </span>
            </div>

            <div className="flex min-h-0 flex-1 flex-col p-3.5">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="truncate font-space text-[14px] font-bold leading-5 tracking-[-.02em]">
                    {project.title}
                  </p>
                  <Link
                    href={`/projects/${project.slug}`}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-0.5 block truncate font-jet text-[8.5px] font-medium tracking-[.01em] text-purple underline-offset-2 hover:underline"
                  >
                    /projects/{project.slug}
                  </Link>
                </div>
                <FeaturedButton
                  project={project}
                  busy={busy}
                  onToggle={() => actions.onToggleFeatured(project)}
                  className="-mr-1 -mt-1 border border-transparent hover:border-line"
                />
              </div>

              <p className="mt-2 line-clamp-2 text-[11px] leading-[1.6] text-muted">
                {project.description}
              </p>

              <div className="mt-3 flex flex-wrap items-center gap-1.5">
                <ProjectStatusBadge project={project} />
                <ProjectCategoryBadge category={project.category} />
              </div>

              <div className="mt-auto flex items-center justify-between gap-2 border-t border-line/25 pt-3">
                <p className="min-w-0 truncate font-jet text-[7.5px] font-medium uppercase leading-4 tracking-[.03em] text-muted">
                  Updated{" "}
                  <span className="font-bold text-foreground">
                    {formatDate(project.updatedAt)}
                  </span>
                </p>
                <div className="flex shrink-0 items-center gap-1">
                  <Link
                    href={`/admin/projects/${project.id}/edit`}
                    className="inline-flex h-7 items-center gap-1 border border-line bg-surface px-2 font-jet text-[8px] font-bold uppercase tracking-[.04em] transition-colors hover:bg-admin-wash"
                    aria-label={`Edit ${project.title}`}
                  >
                    <Pencil size={10} aria-hidden="true" />
                    Edit
                  </Link>
                  <ProjectActionsMenu project={project} actions={actions} />
                </div>
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
}
