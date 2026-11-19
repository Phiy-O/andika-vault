"use client";

import dynamic from "next/dynamic";

const LexKitEditor = dynamic(
  () => import("@/components/admin/LexKitEditor").then((m) => m.LexKitEditor),
  { ssr: false }
);

export type BodyMode = "visual" | "html";

export function BodyModeToggle({
  mode,
  onChange,
}: {
  mode: BodyMode;
  onChange: (mode: BodyMode) => void;
}) {
  const options: { value: BodyMode; label: string }[] = [
    { value: "visual", label: "Visual" },
    { value: "html", label: "HTML" },
  ];

  return (
    <div
      role="group"
      aria-label="Body editing mode"
      className="inline-flex border-2 border-line bg-background"
    >
      {options.map((option) => {
        const active = mode === option.value;

        return (
          <button
            key={option.value}
            type="button"
            aria-pressed={active}
            onClick={() => onChange(option.value)}
            className={`px-2.5 py-1 font-jet text-[8px] font-bold uppercase tracking-[.08em] transition-colors ${
              active
                ? "bg-foreground text-background"
                : "text-muted hover:bg-admin-wash hover:text-foreground"
            }`}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}

interface BodyEditorProps {
  content: string;
  onChange: (html: string) => void;
  mode: BodyMode;
  onModeChange: (mode: BodyMode) => void;
  editorKey: number;
  tall?: boolean;
  className?: string;
}

export function BodyEditor({
  content,
  onChange,
  mode,
  onModeChange,
  editorKey,
  tall = false,
  className,
}: BodyEditorProps) {
  return (
    <div
      role="group"
      aria-label="Body content"
      className={`space-y-2 ${className ?? ""}`}
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <BodyModeToggle mode={mode} onChange={onModeChange} />
        <span className="font-jet text-[8px] font-bold uppercase tracking-[.08em] text-muted">
          {mode === "visual"
            ? "Visual editor · exports HTML"
            : `${content.length.toLocaleString()} chars`}
        </span>
      </div>

      {mode === "visual" ? (
        <div
          className={
            tall
              ? "[&_[contenteditable=true]]:min-h-[calc(100dvh-20rem)]"
              : undefined
          }
        >
          <LexKitEditor key={editorKey} content={content} onChange={onChange} />
        </div>
      ) : (
        <textarea
          value={content}
          onChange={(event) => onChange(event.target.value)}
          spellCheck={false}
          autoCapitalize="off"
          autoCorrect="off"
          aria-label="Body HTML source"
          className={`w-full resize-y border-2 border-line bg-background px-3 py-3 font-jet text-[12px] leading-6 text-foreground outline-none transition-colors focus:border-foreground focus-visible:outline-2 focus-visible:outline-purple focus-visible:outline-offset-0 ${
            tall ? "min-h-[calc(100dvh-22rem)]" : "min-h-[420px]"
          }`}
        />
      )}
    </div>
  );
}
