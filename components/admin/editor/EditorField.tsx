"use client";

import type { ReactNode } from "react";
import { ChevronDown } from "lucide-react";

export const editorInputClass =
  "h-10 w-full border-2 border-line bg-background px-3 font-sans text-sm text-foreground outline-none transition-colors placeholder:text-muted/60 focus:border-foreground focus-visible:outline-2 focus-visible:outline-purple focus-visible:outline-offset-0 disabled:cursor-not-allowed disabled:opacity-60";

export const editorTextareaClass =
  "min-h-24 w-full border-2 border-line bg-background px-3 py-2.5 font-sans text-sm leading-6 text-foreground outline-none transition-colors placeholder:text-muted/60 focus:border-foreground focus-visible:outline-2 focus-visible:outline-purple focus-visible:outline-offset-0 disabled:cursor-not-allowed disabled:opacity-60";

export const editorMonoInputClass = `${editorInputClass} font-jet text-[12px] tracking-[.02em]`;

const editorLabelClass =
  "font-jet text-[9px] font-bold uppercase tracking-[.1em] text-muted";

const editorCounterClass = "font-jet text-[8px] text-muted";

const editorHintClass =
  "font-jet text-[8px] leading-4 tracking-[.08em] text-muted";

interface EditorFieldProps {
  id?: string;
  label: string;
  required?: boolean;
  hint?: ReactNode;
  counter?: ReactNode;
  className?: string;
  children: ReactNode;
}

/**
 * Labeled form field shell. Server validation errors are surfaced at form
 * level by design, so there is intentionally no per-field error prop.
 */
export function EditorField({
  id,
  label,
  required,
  hint,
  counter,
  className,
  children,
}: EditorFieldProps) {
  const labelContent = (
    <>
      {label}
      {required && <span className="ml-1 text-purple">*</span>}
    </>
  );

  return (
    <div className={`space-y-1.5 ${className ?? ""}`}>
      <div className="flex items-baseline justify-between gap-3">
        {id ? (
          <label htmlFor={id} className={editorLabelClass}>
            {labelContent}
          </label>
        ) : (
          <span className={editorLabelClass}>{labelContent}</span>
        )}
        {counter && <span className={editorCounterClass}>{counter}</span>}
      </div>
      {children}
      {hint && <p className={editorHintClass}>{hint}</p>}
    </div>
  );
}

type EditorSelectProps = React.SelectHTMLAttributes<HTMLSelectElement> & {
  id?: string;
};

/** Native select styled as an editor input, with a chevron affordance. */
export function EditorSelect({
  id,
  className,
  children,
  ...props
}: EditorSelectProps) {
  return (
    <div className="relative">
      <select
        id={id}
        className={`${editorInputClass} appearance-none pr-9 ${className ?? ""}`}
        {...props}
      >
        {children}
      </select>
      <ChevronDown
        aria-hidden="true"
        className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted"
      />
    </div>
  );
}
