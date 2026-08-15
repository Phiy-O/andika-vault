import { getSiteSettings } from "@/src/actions/site-setting";
import { SITE_SETTINGS_DEFAULTS } from "@/src/lib/validations/site-settings";
import { SettingsForm } from "@/components/admin/SettingsForm";

export default async function AdminSettingsPage() {
  const { data, error } = await getSiteSettings();

  return (
    <section>
      <div className="mb-8">
        <h1 className="text-3xl font-medium tracking-[-.06em] text-foreground">
          Settings
        </h1>
        <p className="mt-1 text-sm text-muted">
          Kelola kontak, SEO, dan resume situs.
        </p>
      </div>

      {error && (
        <div className="mb-6 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
          {error}
        </div>
      )}

      <SettingsForm settings={data ?? SITE_SETTINGS_DEFAULTS} />
    </section>
  );
}
