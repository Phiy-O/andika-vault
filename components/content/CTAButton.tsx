import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

type CTAButtonProps = {
  href: string;
  label: string;
};

export function CTAButton({ href, label }: CTAButtonProps) {
  return (
    <Link
      className="group border border-line rounded-lg text-foreground inline-flex items-center w-fit text-xs px-5 py-3 transition-all duration-200 hover:shadow-[0_0_2px_var(--foreground)] hover:-translate-y-0.5"
      href={href}
    >
      {label}{" "}
      <ArrowUpRight
        size={16}
        className="text-purple ml-2 transition-all duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
        aria-hidden="true"
      />
    </Link>
  );
}
