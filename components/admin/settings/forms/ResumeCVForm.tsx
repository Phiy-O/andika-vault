"use client";

import { useSettings } from "@/components/admin/settings/hooks/useSettings";
import { SectionCard } from "../ui/SectionCard";
import { InputField } from "../ui/FormField";

export function ResumeCVForm() {
  const { settings, updateField } = useSettings();

  return (
    <SectionCard
      title="Resume / CV"
      description="URL file PDF resume (ditaruh di folder public atau Cloudinary)."
    >
      <InputField
        label="Resume URL"
        htmlFor="resumeUrl"
        type="url"
        value={settings.resumeUrl}
        onChange={(e) => updateField("resumeUrl", e.target.value)}
        placeholder="/resume/your-resume.pdf atau https://cloudinary.com/..."
      />
    </SectionCard>
  );
}