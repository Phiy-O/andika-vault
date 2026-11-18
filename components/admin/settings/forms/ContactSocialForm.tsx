"use client";

import { useSettings } from "@/components/admin/settings/hooks/useSettings";
import { SectionCard } from "../ui/SectionCard";
import { InputField } from "../ui/FormField";

export function ContactSocialForm() {
  const { settings, updateField } = useSettings();

  return (
    <SectionCard
      title="Sosial & Kontak"
      description="Email dan link sosial yang tampil di footer serta halaman kontak."
    >
      <InputField
        label="Email"
        htmlFor="email"
        type="email"
        value={settings.email}
        onChange={(e) => updateField("email", e.target.value)}
        placeholder="you@example.com"
      />
      <InputField
        label="LinkedIn URL"
        htmlFor="linkedinUrl"
        type="url"
        value={settings.linkedinUrl}
        onChange={(e) => updateField("linkedinUrl", e.target.value)}
        placeholder="https://linkedin.com/in/username"
      />
      <InputField
        label="GitHub URL"
        htmlFor="githubUrl"
        type="url"
        value={settings.githubUrl}
        onChange={(e) => updateField("githubUrl", e.target.value)}
        placeholder="https://github.com/username"
      />
      <InputField
        label="Instagram URL"
        htmlFor="instagramUrl"
        type="url"
        value={settings.instagramUrl}
        onChange={(e) => updateField("instagramUrl", e.target.value)}
        placeholder="https://instagram.com/username"
      />
    </SectionCard>
  );
}