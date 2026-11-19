import { BlogForm } from "@/components/admin/BlogForm";
import { getSiteSettings } from "@/src/actions/site-setting";

export default async function NewBlogPage() {
  const { data: settings } = await getSiteSettings();

  return (
    <BlogForm
      previewAuthor={{
        name: settings?.aboutName?.trim() || "Andika",
        role: settings?.aboutRole?.trim() || "Software Engineer",
      }}
    />
  );
}
