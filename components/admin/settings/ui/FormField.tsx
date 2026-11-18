"use client";

import { ReactNode, InputHTMLAttributes, TextareaHTMLAttributes, forwardRef } from "react";

interface FormFieldProps {
  label: string;
  children: ReactNode;
  htmlFor?: string;
  className?: string;
  labelClassName?: string;
}

export function FormField({
  label,
  children,
  htmlFor,
  className,
  labelClassName,
}: FormFieldProps) {
  return (
    <div className={`flex flex-col gap-1.5 ${className ?? ""}`}>
      <label
        htmlFor={htmlFor}
        className={`text-[13px] uppercase tracking-[.06em] text-foreground ${labelClassName ?? ""}`}
      >
        {label}
      </label>
      <div>{children}</div>
    </div>
  );
}

interface InputFieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "id"> {
  label: string;
  htmlFor: string;
}

export const InputField = forwardRef<HTMLInputElement, InputFieldProps>(
  ({ label, htmlFor, className, ...props }, ref) => {
    return (
      <FormField label={label} htmlFor={htmlFor} labelClassName="sr-only">
        <input
          id={htmlFor}
          ref={ref}
          className={`w-full rounded-none border-2 border-foreground bg-background px-4 py-3 text-sm text-foreground outline-none transition-all duration-200 placeholder:text-muted/60 focus:shadow-[3px_3px_0_var(--line)] cursor-text ${className ?? ""}`}
          {...props}
        />
      </FormField>
    );
  }
);
InputField.displayName = "InputField";

interface TextareaFieldProps extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, "id"> {
  label: string;
  htmlFor: string;
  rows?: number;
}

export const TextareaField = forwardRef<HTMLTextAreaElement, TextareaFieldProps>(
  ({ label, htmlFor, rows = 3, className, ...props }, ref) => {
    return (
      <FormField label={label} htmlFor={htmlFor} labelClassName="sr-only">
        <textarea
          id={htmlFor}
          ref={ref}
          rows={rows}
          className={`w-full rounded-none border-2 border-foreground bg-background px-4 py-3 text-sm text-foreground outline-none transition-all duration-200 placeholder:text-muted/60 focus:shadow-[3px_3px_0_var(--line)] resize-y cursor-text ${className ?? ""}`}
          {...props}
        />
      </FormField>
    );
  }
);
TextareaField.displayName = "TextareaField";