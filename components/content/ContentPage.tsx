import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { SectionEyebrow } from "./SectionEyebrow";

type ContentPageProps = {
  eyebrow: string;
  title: React.ReactNode;
  description: string;
  children: React.ReactNode;
};

export function ContentPage({ eyebrow, title, description, children }: ContentPageProps) {
  return (
    <>
      <header className="mx-auto w-full py-[150px] px-[10vw] pb-[110px] max-md:py-[100px] max-md:px-[6vw] max-md:pb-[75px]">
        <SectionEyebrow>{eyebrow}</SectionEyebrow>
        <h1>{title}</h1>
        <p className="text-muted text-[17px] leading-[1.7] max-w-[510px]">{description}</p>
      </header>
      <div className="mx-auto w-full py-0 px-[10vw] max-md:px-[6vw]">{children}</div>
      <div className="mx-auto w-full py-0 px-[10vw] pb-[130px] max-md:px-[6vw] max-md:pb-[90px]">
        <Link className="group border border-line rounded-lg text-foreground inline-flex items-center w-fit text-xs px-5 py-3 transition-all duration-200 hover:shadow-[0_0_2px_var(--foreground)] hover:-translate-y-0.5" href="/contact">
          Have a project in mind{" "}
          <ArrowUpRight size={16} className="text-purple ml-2 transition-all duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden="true" />
        </Link>
      </div>
    </>
  );
}

export function ContentSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="border-t border-line py-[80px] pb-[120px] px-0 max-md:py-[65px] max-md:pb-[85px]">
      <SectionEyebrow>{title}</SectionEyebrow>
      {children}
    </section>
  );
}
