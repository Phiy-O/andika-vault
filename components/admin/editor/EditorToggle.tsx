"use client";

interface EditorToggleProps {
  id?: string;
  label: string;
  description?: string;
  badge?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
}

/**
 * Switch-style toggle built on a real checkbox with role="switch".
 * Both visual spans are siblings of the input so peer-checked reaches them.
 */
export function EditorToggle({
  id,
  label,
  description,
  badge,
  checked,
  onChange,
  disabled,
}: EditorToggleProps) {
  return (
    <label htmlFor={id} className="flex min-h-11 cursor-pointer items-start gap-3 py-1.5">
      <span className="relative mt-0.5 inline-block h-6 w-11 shrink-0">
        <input
          id={id}
          type="checkbox"
          role="switch"
          className="peer sr-only"
          checked={checked}
          onChange={(event) => onChange(event.target.checked)}
          disabled={disabled}
        />
        <span
          aria-hidden="true"
          className="absolute inset-0 border-2 border-line bg-background transition-colors peer-checked:bg-purple peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-purple peer-disabled:opacity-50"
        />
        <span
          aria-hidden="true"
          className="absolute left-1 top-1 size-3 border border-line bg-foreground transition-transform peer-checked:translate-x-5 motion-reduce:transition-none"
        />
      </span>
      <span className="min-w-0">
        <span className="block font-space text-[12px] font-bold">
          {label}
          {badge && (
            <span className="ml-2 inline-block border border-line bg-background px-1.5 py-0.5 font-jet text-[8px] font-bold uppercase tracking-[.06em]">
              {badge}
            </span>
          )}
        </span>
        {description && (
          <span className="mt-1 block text-[11px] leading-5 text-muted">
            {description}
          </span>
        )}
      </span>
    </label>
  );
}
