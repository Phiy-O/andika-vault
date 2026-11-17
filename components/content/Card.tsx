import Link from "next/link";
import { type ElementType, type ReactNode } from "react";

type CardProps = {
  children: ReactNode;
  className?: string;
  as?: ElementType;
  href?: string;
};

const base =
  "bg-surface border border-foreground rounded-none flex flex-col overflow-hidden relative transition-all duration-200 hover:bg-background hover:shadow-[8px_8px_0_var(--foreground)] hover:-translate-y-1";

export function Card({ children, className = "", as: Component = "div", href }: CardProps) {
  if (href) {
    return (
      <Link href={href} className={`${base} ${className}`.trim()}>
        {children}
      </Link>
    );
  }

  return (
    <Component className={`${base} ${className}`.trim()}>
      {children}
    </Component>
  );
}
