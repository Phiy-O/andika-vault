"use client";

import { useState, useMemo } from "react";
import { useSettings } from "@/components/admin/settings/hooks/useSettings";
import { SectionCard } from "../ui/SectionCard";
import { InputField, TextareaField, FormField } from "../ui/FormField";
import { LexKitEditor } from "@/components/admin/LexKitEditor";
import { sanitizeContent } from "@/src/lib/sanitize";

type JourneyItem = { title: string; body: string };
type PillarItem = { title: string; description: string; tag: string };
type TimelineItem = { title: string; description: string };

function parseJSON<T>(value: string, fallback: T): T {
  try {
    return JSON.parse(value);
  } catch {
    return fallback;
  }
}

function stringifyJSON(value: unknown): string {
  return JSON.stringify(value, null, 2);
}

function ArrayEditor<T extends { title: string }>({
  label,
  value,
  onChange,
  renderItem,
  createEmpty,
  itemLabel,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  renderItem: (props: { item: T; index: number; onUpdate: (index: number, item: T) => void; onRemove: (index: number) => void }) => React.ReactNode;
  createEmpty: () => T;
  itemLabel: (item: T, index: number) => string;
}) {
  const [items, setItems] = useState<T[]>(() => parseJSON(value, [] as T[]));

  const handleUpdate = (index: number, item: T) => {
    const updated = [...items];
    updated[index] = item;
    setItems(updated);
    onChange(stringifyJSON(updated));
  };

  const handleRemove = (index: number) => {
    const updated = items.filter((_, i) => i !== index);
    setItems(updated);
    onChange(stringifyJSON(updated));
  };

  const handleAdd = () => {
    const newItem = createEmpty();
    const updated = [...items, newItem];
    setItems(updated);
    onChange(stringifyJSON(updated));
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-xs uppercase tracking-wide text-muted">{label}</span>
        <button
          type="button"
          onClick={handleAdd}
          className="text-sm font-medium text-primary hover:underline"
        >
          + Tambah
        </button>
      </div>
      
      {items.length === 0 ? (
        <p className="text-sm text-muted italic">Belum ada data</p>
      ) : (
        <ul className="space-y-3">
          {items.map((item, index) => (
            <li key={index} className="rounded-lg border border-line bg-surface/40 p-4">
              <div className="flex items-start gap-4">
                <div className="flex-1 min-w-0">
                  {renderItem({ item, index, onUpdate: handleUpdate, onRemove: handleRemove })}
                </div>
                <button
                  type="button"
                  onClick={() => handleRemove(index)}
                  className="flex-shrink-0 p-1 text-muted hover:text-red-400"
                >
                  Hapus
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function JourneyEditor({ item, index, onUpdate, onRemove }: { item: JourneyItem; index: number; onUpdate: (index: number, item: JourneyItem) => void; onRemove: (index: number) => void }) {
  const [title, setTitle] = useState(item.title);
  const [body, setBody] = useState(item.body);

  return (
    <div className="space-y-2">
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        onBlur={() => onUpdate(index, { title, body })}
        placeholder="Judul"
        className="w-full rounded border border-line bg-transparent px-3 py-1.5 text-sm focus:outline-none focus:border-primary"
      />
      <textarea
        value={body}
        onChange={(e) => setBody(e.target.value)}
        onBlur={() => onUpdate(index, { title, body })}
        placeholder="Deskripsi"
        rows={2}
        className="w-full rounded border border-line bg-transparent px-3 py-1.5 text-sm focus:outline-none focus:border-primary resize-y"
      />
    </div>
  );
}

function PillarEditor({ item, index, onUpdate, onRemove }: { item: PillarItem; index: number; onUpdate: (index: number, item: PillarItem) => void; onRemove: (index: number) => void }) {
  const [title, setTitle] = useState(item.title);
  const [description, setDescription] = useState(item.description);
  const [tag, setTag] = useState(item.tag);

  return (
    <div className="space-y-2">
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        onBlur={() => onUpdate(index, { title, description, tag })}
        placeholder="Judul"
        className="w-full rounded border border-line bg-transparent px-3 py-1.5 text-sm focus:outline-none focus:border-primary"
      />
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        onBlur={() => onUpdate(index, { title, description, tag })}
        placeholder="Deskripsi"
        rows={2}
        className="w-full rounded border border-line bg-transparent px-3 py-1.5 text-sm focus:outline-none focus:border-primary resize-y"
      />
      <input
        type="text"
        value={tag}
        onChange={(e) => setTag(e.target.value)}
        onBlur={() => onUpdate(index, { title, description, tag })}
        placeholder="Tag"
        className="w-full rounded border border-line bg-transparent px-3 py-1.5 text-sm focus:outline-none focus:border-primary"
      />
    </div>
  );
}

function TimelineEditor({ item, index, onUpdate, onRemove }: { item: TimelineItem; index: number; onUpdate: (index: number, item: TimelineItem) => void; onRemove: (index: number) => void }) {
  const [title, setTitle] = useState(item.title);
  const [description, setDescription] = useState(item.description);

  return (
    <div className="space-y-2">
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        onBlur={() => onUpdate(index, { title, description })}
        placeholder="Judul / Periode"
        className="w-full rounded border border-line bg-transparent px-3 py-1.5 text-sm focus:outline-none focus:border-primary"
      />
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        onBlur={() => onUpdate(index, { title, description })}
        placeholder="Deskripsi"
        rows={2}
        className="w-full rounded border border-line bg-transparent px-3 py-1.5 text-sm focus:outline-none focus:border-primary resize-y"
      />
    </div>
  );
}

export function AboutForm() {
  const { settings, updateField } = useSettings();

  // Ensure LexKitEditor always receives valid HTML
  const introContent = useMemo(() => {
    const content = settings.aboutIntro?.trim();
    if (!content || content === "") {
      return "<p></p>";
    }
    // Validate basic HTML structure
    try {
      const div = document.createElement("div");
      div.innerHTML = content;
      // If parsing succeeds and has at least one element node
      if (div.children.length > 0) {
        return content;
      }
    } catch {
      // Fall through to default
    }
    return "<p></p>";
  }, [settings.aboutIntro]);

  return (
    <SectionCard title="Profil / About" description="Konten yang tampil di halaman About.">
      <InputField label="Nama" htmlFor="aboutName" value={settings.aboutName} onChange={(e) => updateField("aboutName", e.target.value)} />
      <InputField label="Peran" htmlFor="aboutRole" value={settings.aboutRole} onChange={(e) => updateField("aboutRole", e.target.value)} />
      <InputField label="Lokasi" htmlFor="aboutLocation" value={settings.aboutLocation} onChange={(e) => updateField("aboutLocation", e.target.value)} />
      <InputField label="Fokus" htmlFor="aboutFocus" value={settings.aboutFocus} onChange={(e) => updateField("aboutFocus", e.target.value)} />
      <InputField label="Disiplin" htmlFor="aboutDiscipline" value={settings.aboutDiscipline} onChange={(e) => updateField("aboutDiscipline", e.target.value)} />
      <InputField label="Filosofi" htmlFor="aboutPhilosophy" value={settings.aboutPhilosophy} onChange={(e) => updateField("aboutPhilosophy", e.target.value)} />
      <InputField label="Stack / Runtime" htmlFor="aboutRuntime" value={settings.aboutRuntime} onChange={(e) => updateField("aboutRuntime", e.target.value)} />
      
      <TextareaField label="Kutipan" htmlFor="aboutQuote" rows={2} value={settings.aboutQuote} onChange={(e) => updateField("aboutQuote", e.target.value)} />
      
      <FormField label="Intro / Perkenalan">
        <LexKitEditor
          content={introContent}
          onChange={(html) => updateField("aboutIntro", sanitizeContent(html))}
        />
      </FormField>

      <FormField label="Journey">
        <ArrayEditor
          label="Item Journey"
          value={settings.aboutJourney}
          onChange={(v) => updateField("aboutJourney", v)}
          renderItem={(props) => <JourneyEditor {...props} />}
          createEmpty={() => ({ title: "", body: "" })}
          itemLabel={() => "Item"}
        />
      </FormField>

      <FormField label="Pillars">
        <ArrayEditor
          label="Item Pillar"
          value={settings.aboutPillars}
          onChange={(v) => updateField("aboutPillars", v)}
          renderItem={(props) => <PillarEditor {...props} />}
          createEmpty={() => ({ title: "", description: "", tag: "" })}
          itemLabel={() => "Pillar"}
        />
      </FormField>

      <FormField label="Timeline">
        <ArrayEditor
          label="Item Timeline"
          value={settings.aboutTimeline}
          onChange={(v) => updateField("aboutTimeline", v)}
          renderItem={(props) => <TimelineEditor {...props} />}
          createEmpty={() => ({ title: "", description: "" })}
          itemLabel={() => "Item"}
        />
      </FormField>
    </SectionCard>
  );
}