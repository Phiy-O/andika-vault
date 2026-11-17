import { ArrowUpRight, Mail } from "lucide-react";
import Link from "next/link";

export function HomeContactSection({ email }: { email?: string | null }) {
  const contactEmail = email ?? "andikapiyo12@gmail.com";

  return (
    <section className="mx-auto max-w-7xl px-[5.5vw] py-12" id="contact" aria-labelledby="home-contact-title">
      <div className="grid gap-8 border-2 border-foreground bg-[#e76f51] px-6 py-7 shadow-[5px_5px_0_var(--foreground)] lg:grid-cols-[1fr_auto] lg:items-center lg:px-8">
        <div>
          <p className="mb-3 inline-flex border border-foreground bg-background px-2 py-1 font-mono text-[9px] uppercase tracking-[.12em]">Ready to deploy</p>
          <h2 id="home-contact-title" className="mb-3 max-w-[620px] text-[clamp(38px,5vw,68px)] font-semibold uppercase leading-[.88] tracking-[-.07em]">Let&apos;s build something <em>good.</em></h2>
          <p className="m-0 max-w-xl text-sm leading-[1.6]">Have a project, an interesting problem, or an idea worth exploring? Let&apos;s talk.</p>
        </div>
        <div className="flex flex-wrap gap-3 lg:justify-end">
          <Link className="inline-flex items-center gap-2 border-2 border-foreground bg-background px-5 py-3 text-xs font-semibold uppercase shadow-[3px_3px_0_var(--foreground)] transition-transform hover:-translate-y-0.5" href="/contact">Get in touch <ArrowUpRight size={15} aria-hidden="true" /></Link>
          <a className="inline-flex items-center gap-2 border-2 border-foreground bg-background px-5 py-3 text-xs font-semibold uppercase transition-colors hover:bg-surface" href={`mailto:${contactEmail}`}><Mail size={14} aria-hidden="true" /> Email me</a>
        </div>
      </div>
    </section>
  );
}
