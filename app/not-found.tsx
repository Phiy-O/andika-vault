import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-[80vh] max-w-2xl flex-col items-center justify-center px-[10vw] text-center">
      <span className="select-none text-[12rem] font-medium leading-none tracking-[-.065em] text-[#29292b] sm:text-[16rem]">
        404
      </span>
      <h1 className="-mt-10 text-[clamp(32px,5vw,56px)] font-medium tracking-[-.065em] leading-[.96] text-foreground">
        Page not found
      </h1>
      <p className="mt-4 max-w-sm text-muted text-[17px] leading-[1.7]">
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>
      <Link
        href="/"
        className="group mt-10 inline-flex items-center gap-3 rounded-lg border border-line px-7 py-4 text-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_0_2px_var(--foreground)]"
      >
        <svg className="h-4 w-4 transition-transform duration-200 group-hover:-translate-x-0.5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
        </svg>
        Back to home
      </Link>
    </main>
  );
}
