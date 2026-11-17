"use client";

import {
  BadgeCheck,
  Copy,
  Eye,
  EyeOff,
  ExternalLink,
  Link2,
  Pencil,
  Trash2,
} from "lucide-react";
import type { CertificateListItem } from "@/src/types";
import type {
  WorkspaceActionItem,
  WorkspaceRecordActions,
} from "@/components/admin/workspace/types";
import { WorkspaceActionsMenu } from "@/components/admin/workspace/WorkspaceActionsMenu";
import { hasCredential } from "./achievement-utils";

export type AchievementActionHandlers =
  WorkspaceRecordActions<CertificateListItem> & {
    onCopyCredentialUrl: (achievement: CertificateListItem) => void;
  };

export function AchievementActionsMenu({
  achievement,
  actions,
}: {
  achievement: CertificateListItem;
  actions: AchievementActionHandlers;
}) {
  const busy = actions.busyIds.has(achievement.id);
  const credentialUrl = achievement.credentialUrl ?? "";
  const credential = hasCredential(achievement);

  const items: WorkspaceActionItem[] = [
    {
      kind: "link",
      label: "Edit achievement",
      icon: Pencil,
      href: `/admin/certificates/${achievement.id}/edit`,
    },
    {
      kind: "link",
      label: "Open public archive",
      icon: ExternalLink,
      href: "/achievements",
      external: true,
    },
    ...(credential
      ? ([
          {
            kind: "link",
            label: "Open credential",
            icon: BadgeCheck,
            href: credentialUrl,
            external: true,
          },
        ] satisfies WorkspaceActionItem[])
      : []),
    {
      kind: "button",
      label: "Copy archive URL",
      icon: Copy,
      onSelect: () => actions.onCopyPublicUrl(achievement),
    },
    ...(credential
      ? ([
          {
            kind: "button",
            label: "Copy credential URL",
            icon: Link2,
            onSelect: () => actions.onCopyCredentialUrl(achievement),
          },
        ] satisfies WorkspaceActionItem[])
      : []),
    { kind: "separator" },
    {
      kind: "button",
      label: achievement.isVisible ? "Move to draft" : "Publish achievement",
      icon: achievement.isVisible ? EyeOff : Eye,
      onSelect: () => actions.onToggleVisibility(achievement),
    },
    { kind: "separator" },
    {
      kind: "button",
      label: "Delete achievement",
      icon: Trash2,
      danger: true,
      onSelect: () => actions.onDelete(achievement),
    },
  ];

  return (
    <WorkspaceActionsMenu
      label={`More actions for ${achievement.title}`}
      items={items}
      disabled={busy}
    />
  );
}
