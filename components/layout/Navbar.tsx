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
    <header className="site-header">
      <Link className="wordmark" href="/" aria-label="Andika home" onClick={closeMenu}>
        <Image src="/icons/navbar-logo.svg" alt="Andika Lab" width={162} height={32} priority />
      </Link>

      <button
        className="menu-toggle"
        type="button"
        aria-expanded={isMenuOpen}
        aria-controls="main-navigation"
        aria-label={isMenuOpen ? "Close navigation menu" : "Open navigation menu"}
        onClick={() => setIsMenuOpen((isOpen) => !isOpen)}
      >
        {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      <nav
        className={`main-navigation${isMenuOpen ? " is-open" : ""}`}
        id="main-navigation"
        aria-label="Main navigation"
      >
        <button
          className="navigation-close"
          type="button"
          aria-label="Close navigation menu"
          onClick={closeMenu}
        >
          <X size={20} aria-hidden="true" />
        </button>
        {navigationItems.map((item) => (
          <Link key={item.href} href={item.href} onClick={closeMenu}>
            {item.label}
          </Link>
        ))}
      </nav>

      {isMenuOpen && (
        <button
          className="navigation-backdrop"
          type="button"
          aria-label="Close navigation menu"
          onClick={closeMenu}
        />
      )}

      <Link className="header-cta" href="/contact" onClick={closeMenu}>
        Hire Me
        <ArrowUpRight size={15} aria-hidden="true" />
      </Link>
    </header>
  );
}