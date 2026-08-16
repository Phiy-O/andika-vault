import Image from "next/image";
import Link from "next/link";
import { PublicShell } from "../../components/layout/PublicShell";
import { PageHero } from "../../components/content/PageHero";
import { CTAButton } from "../../components/content/CTAButton";
import { ContactForm } from "../../components/contact/ContactForm";
import { Mail, MapPin, Clock, ArrowUpRight } from "lucide-react";
import { getSiteSettings } from "@/src/actions/site-setting";

export const revalidate = 3600;

export const metadata = {
  title: "Contact | Andika",
  description: "Get in touch with Andika about a thoughtful digital project.",
};

export default async function ContactPage() {
  const { data: settings } = await getSiteSettings();
  const email = settings?.email ?? "andikapiyo12@gmail.com";
  const socialLinks = [
    { label: "LinkedIn", href: settings?.linkedinUrl ?? "#", icon: "/icons/linkedin-svgrepo-com.svg" },
    { label: "GitHub", href: settings?.githubUrl ?? "#", icon: "/icons/github-svgrepo-com.svg" },
    { label: "Instagram", href: settings?.instagramUrl ?? "#", icon: "/icons/instagram-svgrepo-com.svg" },
  ];

  return (
    <PublicShell>
      <PageHero
        eyebrow="Contact"
        title={<>Let&apos;s make <em>it real.</em></>}
        description="Have a product idea, a collaboration in mind, or simply want to say hello? I'd love to hear from you."
      />

      {/* ── Form + Info grid ── */}
      <section className="mx-auto w-full px-[10vw] max-md:px-[6vw] border-t border-line pt-[80px] pb-[100px] max-md:pt-[65px] max-md:pb-[70px]">
        <div className="grid gap-[70px] grid-cols-[1.3fr_1fr] max-md:grid-cols-1 max-md:gap-[50px]">

          {/* ── Contact form ── */}
          <div>
            <p className="text-muted text-[11px] tracking-[.18em] mb-4 uppercase">
              <Mail size={12} className="inline mr-[6px] -mt-[2px]" aria-hidden="true" />
              Send a message
            </p>
            <p className="text-muted text-[17px] leading-[1.7] max-w-[450px] mb-0">
              Fill in the form below and I&apos;ll get back to you as soon as I
              can.
            </p>

            <ContactForm />
          </div>

          {/* ── Email + Social ── */}
          <div className="flex flex-col gap-10">
            {/* Email card */}
            <div className="border border-line rounded-xl p-8 transition-all duration-200 hover:border-purple/30 hover:shadow-[0_0_20px_rgba(169,139,255,.06)]">
            <p className="text-muted text-[11px] tracking-[.18em] mb-4 uppercase">
                <Mail size={12} className="inline mr-[6px] -mt-[2px]" aria-hidden="true" />
                Email
              </p>
              <a
                className="text-foreground text-lg font-medium block mb-3 transition-colors duration-200 hover:text-purple"
                href={`mailto:${email}`}
              >
                {email}
              </a>
              <p className="text-muted text-[14px] leading-[1.7] m-0">
                The best way to reach me. Share what you&apos;re building and
                where you are in the process.
              </p>
            </div>

            {/* Social cards */}
            <div>
              <p className="text-muted text-[11px] tracking-[.18em] mb-[18px] uppercase">
                Social
              </p>
              <div className="flex flex-col gap-2.5">
                {socialLinks.map((social) => (
                  <a
                    className="group flex items-center gap-4 border border-line rounded-xl px-5 py-4 transition-all duration-200 hover:border-purple/30 hover:shadow-[0_0_16px_rgba(169,139,255,.06)] hover:-translate-y-0.5 no-underline"
                    href={social.href}
                    key={social.label}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <Image
                      src={social.icon}
                      alt=""
                      width={22}
                      height={22}
                      className="opacity-50 transition-opacity duration-200 group-hover:opacity-90"
                    />
                    <span className="text-foreground text-[15px] flex-1">
                      {social.label}
                    </span>
                    <ArrowUpRight
                      size={16}
                      className="text-purple opacity-0 -translate-y-1 translate-x-1 transition-all duration-200 group-hover:opacity-100 group-hover:translate-y-0 group-hover:translate-x-0"
                      aria-hidden="true"
                    />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Info row ── */}
      <section className="mx-auto w-full px-[10vw] max-md:px-[6vw] border-t border-line">
        <div className="grid grid-cols-3 divide-x divide-line max-md:grid-cols-1 max-md:divide-x-0 max-md:divide-y max-md:divide-line">
          <div className="py-[50px] pr-[50px] max-md:py-[35px] max-md:pr-0">
            <MapPin size={16} className="text-purple mb-4" aria-hidden="true" />
            <span className="text-muted block text-[10px] tracking-[.12em] mb-2 uppercase">
              Based in
            </span>
            <span className="text-foreground text-[15px]">Indonesia</span>
            <span className="text-muted text-[15px] ml-2">· Working worldwide</span>
          </div>
          <div className="py-[50px] px-[50px] max-md:py-[35px] max-md:px-0">
            <Clock size={16} className="text-purple mb-4" aria-hidden="true" />
            <span className="text-muted block text-[10px] tracking-[.12em] mb-2 uppercase">
              Response time
            </span>
            <span className="text-foreground text-[15px]">Usually within 2–3 days</span>
          </div>
          <div className="py-[50px] pl-[50px] max-md:py-[35px] max-md:pl-0">
            <div className="text-purple mb-4" aria-hidden="true">
              <span className="relative flex h-3 w-3">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75" />
                <span className="relative inline-flex h-3 w-3 rounded-full bg-red-500" />
              </span>
            </div>
            <span className="text-muted block text-[10px] tracking-[.12em] mb-2 uppercase">
              Availability
            </span>
            <span className="inline-flex items-center gap-2 text-foreground text-[15px]">
              Unavailable for freelance
            </span>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <div className="mx-auto w-full py-0 px-[10vw] pb-[130px] max-md:px-[6vw] max-md:pb-[90px]">
        <CTAButton href="/" label="Back to home" />
      </div>
    </PublicShell>
  );
}
