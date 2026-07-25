import { type ReactNode } from "react";

type SectionEyebrowProps = {
  children: ReactNode;
  className?: string;
};

export function SectionEyebrow({ children, className = "" }: SectionEyebrowProps) {
  return (
    <p className={`text-muted text-[11px] tracking-[.18em] mb-5 uppercase${className ? " " + className : ""}`}>
      {children}
    </p>
  );
}
