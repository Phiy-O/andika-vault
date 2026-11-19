import Link from "next/link";
import { ArrowLeft, ArrowUpRight } from "lucide-react";

const mono = "font-mono text-[10px] font-bold uppercase tracking-[.1em]";

export default function NotFound() {
  return (
    <main className="relative mx-auto flex min-h-screen w-full flex-col overflow-hidden px-[5.5vw]">
      {/* editorial dot texture */}
      <div
        className="pointer-events-none absolute right-[3%] top-[16%] h-[240px] w-[260px] opacity-[.14] max-md:hidden"
        style={{
          backgroundImage: "radial-gradient(#595652 1px, transparent 1px)",
          backgroundSize: "16px 16px",
        }}
        aria-hidden="true"
      />

      <div className="relative z-10 flex items-center justify-between border-b-2 border-[#1d1d1b] py-4">
        <span className={`${mono} text-[#595652]`}>ANDIKA / SOFTWARE ENGINEER</span>
        <span className={`${mono} text-[#595652] max-sm:hidden`}>PORTFOLIO / 2026</span>
      </div>

      <section
        aria-labelledby="not-found-title"
        className="relative z-10 flex flex-1 flex-col items-center justify-center py-16 text-center max-md:py-12"
      >
        <div className="flex flex-wrap justify-center gap-2">
          <span className={`${mono} border border-[#1d1d1b] bg-[#fffdf7] px-2 py-1`}>
            ERROR // 404
          </span>
          <span className={`${mono} border border-[#1d1d1b] bg-[#fffdf7] px-2 py-1`}>
            ROUTE NOT FOUND
          </span>
        </div>

        <div
          className="mt-2 mb-6 select-none font-serif text-[clamp(5rem,16vw,13rem)] font-black uppercase leading-[.8] tracking-[-.06em] text-[#1d1d1b]"
          aria-hidden="true"
        >
          404
        </div>

        <h1
          id="not-found-title"
          className="mt-10 max-w-[1000px] font-serif text-6xl font-black uppercase leading-[.9] tracking-[.02em] [word-spacing:.14em] sm:text-[5.5rem]"
        >
          THIS PAGE
          <br className="max-sm:hidden" /> WENT{" "}
          <span className="inline-block border-2 border-[#1d1d1b] bg-[#f46d66] px-2 py-1 shadow-[4px_4px_0_#1d1d1b]">
            MISSING.
          </span>
        </h1>

        <p className="mx-auto mt-6 max-w-[560px] text-base leading-7 text-[#595652] sm:text-lg">
          The page you&apos;re looking for has moved on. Head back to the
          start, or dig through the project archive.
        </p>

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link
            href="/"
            className={`${mono} inline-flex items-center gap-2 border-2 border-[#1d1d1b] bg-[#f46d66] px-5 py-3 shadow-[4px_4px_0_#1d1d1b] transition-transform duration-200 hover:-translate-y-0.5 motion-reduce:transition-none motion-reduce:hover:translate-y-0`}
          >
            <ArrowLeft size={14} aria-hidden="true" />
            BACK TO HOME
          </Link>
          <Link
            href="/projects"
            className={`${mono} inline-flex items-center gap-2 border-2 border-[#1d1d1b] bg-[#fffdf7] px-5 py-3 shadow-[3px_3px_0_#1d1d1b] transition-transform duration-200 hover:-translate-y-0.5 motion-reduce:transition-none motion-reduce:hover:translate-y-0`}
          >
            BROWSE PROJECTS
            <ArrowUpRight size={14} aria-hidden="true" />
          </Link>
        </div>
      </section>

      <div className="relative z-10 flex flex-wrap items-center justify-between gap-2 border-t-2 border-[#1d1d1b] py-4">
        <span className={`${mono} text-[#595652]`}>
          © 2026 ANDIKA. BUILT WITH CARE.
        </span>
        <span className={`${mono} text-[#595652]`}>
          <b className="mr-2 text-[#f46d66]">#</b>STATUS // PAGE NOT FOUND
        </span>
      </div>
    </main>
  );
}
