"use client";

import { useSettings } from "./hooks/useSettings";

export function SettingsFormContent() {
  const { isSaving, error, saveSettings } = useSettings();

  return (
    <div className="flex items-center justify-between gap-4">
      {error && (
        <div className="flex-1 rounded-none border-2 border-red-500 bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">
          {error}
        </div>
      )}

      <button
        type="button"
        onClick={saveSettings}
        disabled={isSaving}
        className="inline-flex items-center justify-center gap-2 rounded-none border-2 border-foreground bg-foreground px-6 py-3 text-sm font-bold text-background shadow-[4px_4px_0_var(--line)] transition-all hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0_var(--line)] active:translate-x-[0px] active:translate-y-[0px] active:shadow-[4px_4px_0_var(--line)] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-x-0 disabled:hover:translate-y-0 disabled:hover:shadow-[4px_4px_0_var(--line)]"
      >
        {isSaving ? (
          <>
            <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" strokeOpacity="0.25" />
              <path d="M12 2a10 10 0 0 1 10 10" strokeLinecap="round" />
            </svg>
            Menyimpan...
          </>
        ) : (
          "Simpan Perubahan"
        )}
      </button>
    </div>
  );
}