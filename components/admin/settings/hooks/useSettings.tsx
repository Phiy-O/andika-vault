"use client";

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";
import type { SiteSettings } from "@/src/lib/validations/site-settings";
import { updateSiteSettings } from "@/src/actions/site-setting";
import { SITE_SETTINGS_DEFAULTS } from "@/src/lib/validations/site-settings";
import { useToast } from "@/components/ui/Toast";

interface SettingsContextValue {
  settings: SiteSettings;
  isLoading: boolean;
  isSaving: boolean;
  error: string | null;
  updateField: (key: keyof SiteSettings, value: string) => void;
  saveSettings: () => Promise<boolean>;
  resetSettings: () => void;
}

const SettingsContext = createContext<SettingsContextValue | null>(null);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<SiteSettings>(SITE_SETTINGS_DEFAULTS);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const showToast = useToast();

    // Fetch settings on mount
  useEffect(() => {
    async function loadSettings() {
      try {
        const res = await fetch("/api/admin/settings");
        if (!res.ok) throw new Error("Gagal memuat pengaturan");
        const data = await res.json();
        setSettings(data.data ?? SITE_SETTINGS_DEFAULTS);
      } catch (e: unknown) {
        const message = e instanceof Error ? e.message : "Gagal memuat pengaturan";
        setError(message);
        setSettings(SITE_SETTINGS_DEFAULTS);
      } finally {
        setIsLoading(false);
      }
    }
    loadSettings();
  }, []);

  const updateField = useCallback((key: keyof SiteSettings, value: string) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
    setError(null);
  }, []);

  const saveSettings = useCallback(async () => {
    setIsSaving(true);
    setError(null);
    try {
      const res = await updateSiteSettings(settings);
      if (res.error) {
        setError(res.error);
        showToast(res.error);
        return false;
      }
      showToast("Pengaturan berhasil disimpan");
      return true;
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Gagal menyimpan pengaturan";
      setError(msg);
      showToast(msg);
      return false;
    } finally {
      setIsSaving(false);
    }
  }, [settings, showToast]);

  const resetSettings = useCallback(() => {
    setSettings(SITE_SETTINGS_DEFAULTS);
    setError(null);
  }, []);

  return (
    <SettingsContext.Provider
      value={{
        settings,
        isLoading,
        isSaving,
        error,
        updateField,
        saveSettings,
        resetSettings,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const ctx = useContext(SettingsContext);
  if (!ctx) {
    throw new Error("useSettings must be used within a SettingsProvider");
  }
  return ctx;
}