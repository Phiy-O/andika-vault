import Link from "next/link";
import { ExternalLink, Plus, RefreshCw } from "lucide-react";
import type { ProjectListItem } from "@/src/types";
import { formatRelativeTime, latestUpdatedAt } from "./project-utils";

export function ProjectsHeader({
  projects,
  refreshing,
  onRefresh,
}: {
  projects: ProjectListItem[];
  refreshing: boolean;
  onRefresh: () => void;
}) {
  const lastUpdated = latestUpdatedAt(projects);

  return (
    <>
      <div
        className="mb-4 flex min-h-11 flex-wrap items-center justify-between gap-x-4 gap-y-2 border-2 border-line bg-surface px-2.5 py-2 shadow-[2px_2px_0_var(--foreground)]"
        aria-label="Workspace status"
      >
        <div className="flex min-w-0 flex-wrap items-center gap-x-3 gap-y-1.5">
          <span className="inline-flex h-5 shrink-0 items-center gap-1.5 bg-purple px-2 font-jet text-[9px] font-bold uppercase leading-none tracking-[.08em] text-foreground">
            <span className="size-1.5 rounded-full bg-surface" aria-hidden="true" />
            Sync ready
          </span>
          <p className="min-w-0 truncate font-jet text-[9px] font-medium uppercase leading-4 tracking-[.08em] text-muted">
            <span className="text-foreground">Workspace // Projects</span>
            <span className="mx-2 text-muted/50" aria-hidden="true">
              /
            </span>
            Last updated:{" "}
            <span aria-live="polite">{formatRelativeTime(lastUpdated)}</span>
          </p>
        </div>

        <div className="flex shrink-0 flex-wrap items-center gap-2">
          <span className="hidden h-6 items-center gap-1.5 border border-line bg-background px-2 font-jet text-[8px] font-bold uppercase tracking-[.06em] sm:inline-flex">
            <span className="size-1.5 rounded-full bg-admin-success" aria-hidden="true" />
            Live database
          </span>
          <button
            type="button"
            onClick={onRefresh}
            disabled={refreshing}
            className="inline-flex h-6 items-center gap-1.5 border border-line bg-background px-2 font-jet text-[8px] font-bold uppercase tracking-[.06em] transition-colors hover:bg-admin-wash disabled:cursor-wait disabled:opacity-60"
          >
            <RefreshCw
              size={10}
              className={refreshing ? "animate-spin" : ""}
              aria-hidden="true"
            />
            Sync now
          </button>
        </div>
      </div>

      <div className="mb-6 flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0 max-w-[680px]">
          <p className="font-jet text-[9px] font-bold uppercase leading-[14px] tracking-[.12em]">
            <span className="text-purple">Content // Projects</span>
            <span className="mx-2 text-muted/50" aria-hidden="true">
              /
            </span>
            <span className="text-muted">Project index</span>
          </p>
          <h1
            id="projects-heading"
            className="font-space text-foreground"
            style={{
              fontSize: "clamp(32px, 3.2vw, 40px)",
              lineHeight: "1.05",
              fontWeight: 700,
              letterSpacing: "-.05em",
              margin: "4px 0 0",
            }}
          >
            Projects
          </h1>
          <p
            className="font-sans text-[13px] leading-6 text-muted"
            style={{ margin: "6px 0 0" }}
          >
            Manage the work that represents your practice. Curate case studies,
            control public visibility, and keep every project record in sync.
          </p>
        </div>

        <div className="flex shrink-0 flex-wrap items-center gap-3 lg:pt-[22px]">
          <Link
            href="/projects"
            target="_blank"
            rel="noreferrer"
            className="inline-flex h-10 items-center gap-2 border-2 border-line bg-surface px-4 font-jet text-[9px] font-bold uppercase tracking-[.08em] shadow-[2px_2px_0_var(--foreground)] transition-transform hover:-translate-y-0.5 hover:bg-admin-wash motion-reduce:transform-none"
          >
            Public archive
            <ExternalLink size={12} aria-hidden="true" />
          </Link>
          <Link
            href="/admin/projects/new"
            className="inline-flex h-10 items-center gap-2 border-2 border-line bg-purple px-4 font-space text-[12px] font-bold tracking-[-.01em] shadow-[3px_3px_0_var(--foreground)] transition-transform hover:-translate-y-0.5 hover:bg-[#ef7e70] motion-reduce:transform-none"
          >
            <Plus size={13} strokeWidth={2.2} aria-hidden="true" />
            New Project
          </Link>
        </div>
      </div>
    </>
  );
}
