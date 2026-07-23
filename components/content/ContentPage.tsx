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
      <header className="page-hero">
        <p className="eyebrow">{eyebrow}</p>
        <h1>{title}</h1>
        <p className="page-intro">{description}</p>
      </header>
      <div className="page-content">{children}</div>
      <div className="page-next">
        <Link className="text-link" href="/contact">
          Have a project in mind <span aria-hidden="true">↗</span>
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
    <section className="content-section">
      <p className="eyebrow">{title}</p>
      {children}
    </section>
  );
}
