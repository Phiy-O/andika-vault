"use client";

import { ArrowUpRight, Menu, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

const navigationItems = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Achievements", href: "/achievements" },
  { label: "Projects", href: "/projects" },
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "/contact" },
];

const navLinkClasses = "text-muted text-base tracking-[.02em] transition-colors duration-200 font-medium py-[5px] relative after:content-[''] after:absolute after:bottom-[-4px] after:left-0 after:h-px after:w-full after:bg-gradient-to-br after:from-[#8f6bff] after:to-[#5c7cfa] after:scale-x-0 after:origin-right after:transition-transform after:duration-300 hover:text-foreground focus-visible:text-foreground hover:after:scale-x-100 hover:after:origin-left max-md:py-[14px] max-md:after:bottom-[7px]";

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const closeMenu = () => setIsMenuOpen(false);

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [isMenuOpen]);

  return (
    <header className="flex items-center justify-between mx-auto max-w-full py-[2vh] px-[10vw] relative z-10 border-b-2 border-line max-md:py-[22px] max-md:px-[6vw]">
      <Link className="text-foreground text-xl font-bold tracking-[-.06em] leading-none w-auto h-auto max-md:order-2" href="/" aria-label="Andika home" onClick={closeMenu}>
        <Image src="/icons/navbar-logo.svg" alt="Andika Lab" width={162} height={32} priority />
      </Link>

      <button
        className="bg-transparent border-0 text-foreground cursor-pointer hidden p-2 max-md:block max-md:m-0 max-md:order-1"
        type="button"
        aria-expanded={isMenuOpen}
        aria-controls="main-navigation"
        aria-label={isMenuOpen ? "Close navigation menu" : "Open navigation menu"}
        onClick={() => setIsMenuOpen((isOpen) => !isOpen)}
      >
        {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      <nav
        className={`flex justify-center gap-[31px] max-md:bg-[#211e28] max-md:border-l max-md:border-line max-md:flex-col max-md:gap-0 max-md:m-0 max-md:min-h-screen max-md:py-[100px] max-md:px-8 max-md:fixed max-md:left-0 max-md:top-0 max-md:transition-transform max-md:duration-300 max-md:w-[min(82vw,340px)] max-md:z-20 max-md:-translate-x-full${isMenuOpen ? " max-md:translate-x-0" : ""}`}
        id="main-navigation"
        aria-label="Main navigation"
      >
        <button
          className="hidden max-md:flex max-md:items-center max-md:bg-transparent max-md:border-0 max-md:text-foreground max-md:cursor-pointer max-md:justify-center max-md:p-2 max-md:absolute max-md:right-[22px] max-md:top-[22px]"
          type="button"
          aria-label="Close navigation menu"
          onClick={closeMenu}
        >
          <X size={20} aria-hidden="true" />
        </button>
        {navigationItems.map((item) => (
          <Link className={navLinkClasses} key={item.href} href={item.href} onClick={closeMenu}>
            {item.label}
          </Link>
        ))}
      </nav>

      {isMenuOpen && (
        <button
          className="bg-[rgba(10,8,15,.68)] border-0 inset-0 fixed z-[15]"
          type="button"
          aria-label="Close navigation menu"
          onClick={closeMenu}
        />
      )}

      <Link className="items-center bg-gradient-to-br from-[#a98bff] to-[#7391ff] rounded-md text-[#f0f0f0] inline-flex text-sm font-semibold gap-2 py-[11px] px-6 transition-all duration-200 hover:brightness-[1.05] hover:shadow-[0_0_16px_rgba(255,255,255,.25)] hover:text-[#ebebeb] hover:-translate-y-0.5 max-md:order-3 max-md:py-2 max-md:px-4 max-md:text-[10px]" href="/contact" onClick={closeMenu}>
        Hire Me
        <ArrowUpRight size={15} aria-hidden="true" />
      </Link>
    </header>
  );
}
