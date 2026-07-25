import Link from "next/link";
import { type ElementType, type ReactNode } from "react";

type CardProps = {
  children: ReactNode;
  className?: string;
  as?: ElementType;
  href?: string;
};

const base =
  "bg-[rgba(16,14,23,.48)] border border-line rounded-[18px] flex flex-col overflow-hidden relative transition-all duration-200 hover:border-[rgba(169,139,255,.42)] hover:shadow-[0_22px_50px_rgba(0,0,0,.24)] hover:-translate-y-[5px]";

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
