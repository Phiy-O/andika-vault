"use client";

import { ArrowUpRight, Menu, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { useDialogA11y } from "@/components/ui/useDialogA11y";

const navigationItems = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Achievements", href: "/achievements" },
  { label: "Projects", href: "/projects" },
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "/contact" },
];

const navLinkClasses = "font-mono text-[10px] font-bold uppercase tracking-[.08em] text-[#595652] transition-colors duration-200 py-[5px] relative after:content-[''] after:absolute after:bottom-[-4px] after:left-0 after:h-0.5 after:w-full after:bg-[#f46d66] after:scale-x-0 after:origin-right after:transition-transform after:duration-300 hover:text-[#1d1d1b] focus-visible:text-[#1d1d1b] hover:after:scale-x-100 hover:after:origin-left max-md:py-[14px] max-md:after:bottom-[7px]";

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const panelRef = useRef<HTMLElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  const closeMenu = useCallback(() => setIsMenuOpen(false), []);
  useDialogA11y(isMenuOpen, panelRef, closeRef, closeMenu);

  useEffect(() => {
    let lastScrollY = 0;
    const threshold = 10;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY < 10) {
        setIsHidden(false);
        lastScrollY = currentScrollY;
        return;
      }

      if (currentScrollY > lastScrollY + threshold) {
        setIsHidden(true);
      } else if (currentScrollY < lastScrollY - threshold) {
        setIsHidden(false);
      }

      lastScrollY = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <header
        className={`flex items-center justify-between mx-auto max-w-full py-3 px-[5.5vw] z-50 border-b-2 border-[#1d1d1b] bg-[#f4ebdc] sticky top-0 left-0 w-full transition-transform duration-300 ease-in-out ${
          isHidden ? "-translate-y-full" : "translate-y-0"
        }`}
      >
        <Link className="inline-flex w-auto h-auto items-center gap-2.5 max-md:order-2" href="/" aria-label="Andika.dev home" onClick={closeMenu}>
          <Image src="/icons/portfolio-logo.svg" alt="" width={40} height={40} priority />
          <span className="whitespace-nowrap font-space text-[19px] font-bold leading-none tracking-[-.04em] text-foreground">
            Andika.dev
          </span>
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
          className="flex justify-center gap-6 max-md:hidden"
          aria-label="Main navigation"
        >
          {navigationItems.map((item) => (
            <Link className={navLinkClasses} key={item.href} href={item.href} onClick={closeMenu}>
              {item.label}
            </Link>
          ))}
        </nav>

        <Link className="items-center bg-[#e76f51] border border-foreground rounded-none text-foreground shadow-[3px_3px_0_var(--foreground)] inline-flex text-sm font-semibold gap-2 py-[11px] px-6 transition-all duration-200 hover:brightness-[1.05] hover:shadow-[0_0_16px_rgba(255,255,255,.25)] hover:text-[#ebebeb] hover:-translate-y-0.5 max-md:order-3 max-md:py-2 max-md:px-4 max-md:text-[10px]" href="/contact" onClick={closeMenu}>
          Hire Me
          <ArrowUpRight size={15} aria-hidden="true" />
        </Link>
      </header>

      {/* Mobile sidebar — outside header so navbar scroll effect doesn't affect it */}
      <nav
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        className={`hidden max-md:flex max-md:flex-col max-md:fixed max-md:left-0 max-md:top-0 max-md:z-50 max-md:bg-background max-md:border-l max-md:border-line max-md:min-h-screen max-md:py-[100px] max-md:px-8 max-md:w-[min(82vw,340px)] max-md:overflow-y-auto max-md:transition-transform max-md:duration-300 ${isMenuOpen ? "max-md:translate-x-0" : "max-md:-translate-x-full"}`}
        id="main-navigation"
        aria-label="Mobile navigation"
        aria-hidden={!isMenuOpen}
      >
        <button
          ref={closeRef}
          className="flex items-center bg-transparent border-0 text-foreground cursor-pointer justify-center p-2 absolute right-[22px] top-[22px]"
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

      {/* Backdrop */}
      {isMenuOpen && (
        <button
          className="hidden max-md:block bg-[rgba(10,8,15,.68)] border-0 inset-0 fixed z-40"
          type="button"
          aria-label="Close navigation menu"
          onClick={closeMenu}
        />
      )}
    </>
  );
}
