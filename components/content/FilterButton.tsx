import { type ButtonHTMLAttributes, type ReactNode } from "react";

type FilterButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  isActive?: boolean;
  count?: number;
};

export function FilterButton({ children, isActive, count, className = "", ...rest }: FilterButtonProps) {
  return (
    <button
      className={`items-center border border-line rounded-lg text-xs px-4 py-3 transition-all duration-200 cursor-pointer flex justify-between ${
        isActive
          ? "border-purple text-purple bg-[rgba(169,139,255,.08)]"
          : "text-muted hover:border-foreground hover:text-foreground"
      } ${className}`.trim()}
      {...rest}
    >
      <span>{children}</span>
      {count !== undefined && (
        <span className="text-muted text-[10px] ml-auto pl-3">{count}</span>
      )}
    </button>
  );
}
