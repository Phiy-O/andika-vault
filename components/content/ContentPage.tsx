import Link from "next/link";

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
        <p className="text-muted border border-line w-fit px-3 py-1.5 rounded-full text-[10px] tracking-[.18em] mb-6 uppercase">{eyebrow}</p>
        <h1>{title}</h1>
        <p className="text-muted text-[17px] leading-[1.7] max-w-[510px]">{description}</p>
      </header>
      <div className="mx-auto w-full py-0 px-[10vw] max-md:px-[6vw]">{children}</div>
      <div className="mx-auto w-full py-0 px-[10vw] pb-[130px] max-md:px-[6vw] max-md:pb-[90px]">
        <Link className="border border-line rounded-lg text-foreground inline-flex items-center w-fit text-xs px-5 py-3 transition-all duration-200 hover:shadow-[0_0_2px_var(--foreground)] hover:-translate-y-0.5" href="/contact">
          Have a project in mind <span className="text-foreground text-[17px] ml-2" aria-hidden="true">↗</span>
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
      <p className="text-muted border border-line w-fit px-3 py-1.5 rounded-full text-[10px] tracking-[.18em] mb-6 uppercase">{title}</p>
      {children}
    </section>
  );
}
