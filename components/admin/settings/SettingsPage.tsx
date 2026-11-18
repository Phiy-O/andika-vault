"use client";

import { SettingsProvider } from "./hooks/useSettings";
import { ContactSocialForm } from "./forms/ContactSocialForm";
import { AboutForm } from "./forms/AboutForm";
import { ResumeCVForm } from "./forms/ResumeCVForm";
import { Tabs } from "./ui/Tabs";
import { SettingsFormContent } from "./SettingsFormContent";

export function SettingsPage() {
  return (
    <SettingsProvider>
      <div className="max-w-5xl mx-auto space-y-8">
        <header className="border-b-2 border-foreground pb-6">
          <h1 className="text-4xl font-bold tracking-[-.04em] text-foreground">
            Pengaturan Situs
          </h1>
          <p className="mt-2 text-base text-muted max-w-2xl">
            Kelola kontak, profil, dan resume yang tampil di halaman publik. Semua perubahan tersimpan secara langsung.
          </p>
        </header>

        <Tabs defaultTab="contact">
          <Tabs.List>
            <Tabs.Trigger tabId="contact">
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                <polyline points="22,6 12,13 2,6" />
              </svg>
              Kontak & Sosial
            </Tabs.Trigger>
            <Tabs.Trigger tabId="about">
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <path d="M12 16v-4" />
                <path d="M12 8h.01" />
              </svg>
              Profil / About
            </Tabs.Trigger>
            <Tabs.Trigger tabId="resume">
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="16" y1="13" x2="8" y2="13" />
                <line x1="16" y1="17" x2="8" y2="17" />
                <polyline points="10 9 9 9 8 9" />
              </svg>
              Resume / CV
            </Tabs.Trigger>
          </Tabs.List>

          <Tabs.Content>
            <div className="mt-8 space-y-8">
              <Tabs.Panel tabId="contact">
                <ContactSocialForm />
              </Tabs.Panel>
              <Tabs.Panel tabId="about">
                <AboutForm />
              </Tabs.Panel>
              <Tabs.Panel tabId="resume">
                <ResumeCVForm />
              </Tabs.Panel>
            </div>
          </Tabs.Content>
        </Tabs>

        <div className="border-t-2 border-foreground pt-6">
          <SettingsFormContent />
        </div>
      </div>
    </SettingsProvider>
  );
}