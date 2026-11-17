"use client";

import { useEffect, useRef } from "react";

export function WorkspaceSelectCheckbox({
  checked,
  indeterminate = false,
  disabled = false,
  onChange,
  label,
  className = "",
}: {
  checked: boolean;
  indeterminate?: boolean;
  disabled?: boolean;
  onChange: (checked: boolean) => void;
  label: string;
  className?: string;
}) {
  const ref = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (ref.current) ref.current.indeterminate = indeterminate;
  }, [indeterminate]);

  return (
    <input
      ref={ref}
      type="checkbox"
      checked={checked}
      disabled={disabled}
      onChange={(event) => onChange(event.target.checked)}
      aria-label={label}
      className={`size-3.5 shrink-0 cursor-pointer accent-foreground disabled:cursor-wait disabled:opacity-50 ${className}`}
    />
  );
}
