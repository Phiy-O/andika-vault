import { label } from "framer-motion/client";
import Image from "next/image";
import Link from "next/link";

const randomLinks = [
  { label: "Dicoding", href: "#" },
  { label: "Udemy", href: "#" },
  { label: "Fullstack", href: "#" },
  { label: "Free Course", href: "#" },
  { label: "Hobby", href: "#" },
]

const exploreLinks = [
  { label: "Projects", href: "/projects" },
  { label: "Blog", href: "/blog" },
  { label: "Achievements", href: "/achievements" },
  { label: "Web Development", href: "#" },
  { label: "Tutorial", href: "#" },
  { label: "Personal", href: "#" },
  { label: "Information", href: "#" },
];

const aboutLinks = [
  { label: "About me", href: "/about" },
  { label: "Contact", href: "/contact" },
  { label: "Resume", href: "/resume.pdf" },
  { label: "Skills", href: "#" },
  { label: "Rentalin", href: "#" },
  { label: "Dashboard", href: "#" },
];

const quickLinks = [
  { label: "Home", href: "/#top" },
  { label: "LinkedIn", href: "https://linkedin.com", external: true },
  { label: "GitHub", href: "https://github.com", external: true },
];

const socialIcons = [
  { label: "LinkedIn", href: "https://linkedin.com", icon: "/icons/linkedin-svgrepo-com.svg" },
  { label: "GitHub", href: "https://github.com", icon: "/icons/github-svgrepo-com.svg" },
  { label: "Instagram", href: "https://instagram.com", icon: "/icons/instagram-svgrepo-com.svg" },
];

function FooterColumn({ title, links }: { title: string; links: { label: string; href: string; external?: boolean }[] }) {
  return (
    <div className="flex flex-col gap-3.5">
      <p className="text-foreground text-base font-medium tracking-[.02em]">{title}</p>
      <ul className="list-none p-0 m-0 flex flex-col gap-2">
        {links.map((link) => (
          <li key={link.label}>
            <Link
              className="text-muted text-[15px] transition-colors duration-200 hover:text-foreground"
              href={link.href}
              {...(link.external ? { target: "_blank", rel: "noreferrer" } : {})}
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function Footer() {
  return (
    <footer className="bg-surface" id="contact">
      <div className="py-[90px] px-[10vw] max-md:py-[65px] max-md:px-[6vw]">
        <div className="flex justify-between items-start gap-20 max-md:flex-col max-md:gap-[70px]">
          <div className="max-w-[420px] max-md:max-w-none">
            <p className="text-muted border border-line w-fit px-3 py-1.5 rounded-full text-[10px] tracking-[.18em] mb-6 uppercase">Have a good idea?</p>
            <h2 className="text-[clamp(52px,7vw,92px)] font-medium tracking-[-.065em] leading-[.96] mb-5">Let&apos;s make<br /><em>it real.</em></h2>
            <p className="text-muted text-[14px] leading-[1.7]">Building thoughtful digital products that are clear, useful, and built to last.</p>
          </div>
          <div className="grid grid-cols-4 gap-32 max-md:grid-cols-4 max-md:gap-8 max-md:w-full">
            <FooterColumn title="Random" links={randomLinks} />
            <FooterColumn title="Explore" links={exploreLinks} />
            <FooterColumn title="About me" links={aboutLinks} />
            <FooterColumn title="Quick links" links={quickLinks} />
          </div>
        </div>
      </div>
      <div className="border-t border-line flex justify-between items-center py-6 px-[10vw] max-md:px-[6vw]">
        <p className="text-muted text-[11px]">© 2025 Andika. Built with care❤️</p>
        <div className="flex items-center gap-3">
          {socialIcons.map((social) => (
            <a
              className="flex items-center justify-center w-10 h-10 text-white/60 transition-all duration-200 hover:text-white"
              href={social.href}
              key={social.label}
              aria-label={social.label}
              rel="noreferrer"
              target="_blank"
            >
              <Image src={social.icon} alt="" width={24} height={24} />
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
