"use client";

import { Eye, EyeOff } from "lucide-react";
import type { SkillListItem } from "@/src/types";
import { formatCategory } from "./skill-utils";

export function SkillCategoryBadge({ category }: { category: string }) {
  return (
    <span className="inline-flex h-5 shrink-0 items-center gap-1.5 border border-line/25 bg-surface/30 px-2 py-0.5 font-jet text-[8px] font-bold uppercase tracking-[.06em] text-muted">
      {formatCategory(category)}
    </span>
  );
}

export function SkillStatusBadge({ skill }: { skill: SkillListItem }) {
  if (skill.isVisible) {
    return (
      <span className="inline-flex items-center gap-1 text-xs text-green-400">
        <Eye size={12} aria-hidden="true" />
        Visible
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 text-xs text-muted">
      <EyeOff size={12} aria-hidden="true" />
      Hidden
    </span>
  );
}