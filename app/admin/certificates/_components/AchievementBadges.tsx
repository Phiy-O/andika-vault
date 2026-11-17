import { Award } from "lucide-react";
import type { CertificateListItem } from "@/src/types";
import { WorkspaceThumbnail } from "@/components/admin/workspace/WorkspaceThumbnail";
import { WorkspaceFlagBadge } from "@/components/admin/workspace/WorkspaceBadges";
import { hasCredential } from "./achievement-utils";

export function AchievementThumbnail({
  achievement,
  size = "row",
}: {
  achievement: Pick<CertificateListItem, "image">;
  size?: "row" | "card";
}) {
  return (
    <WorkspaceThumbnail
      src={achievement.image}
      size={size}
      fallback={
        <Award
          size={size === "row" ? 18 : 30}
          strokeWidth={1.5}
          className="text-muted"
          aria-hidden="true"
        />
      }
    />
  );
}

export function CredentialBadge({
  achievement,
}: {
  achievement: Pick<CertificateListItem, "credentialUrl">;
}) {
  const linked = hasCredential(achievement);
  return (
    <WorkspaceFlagBadge active={linked}>
      {linked ? "Linked" : "None"}
    </WorkspaceFlagBadge>
  );
}
