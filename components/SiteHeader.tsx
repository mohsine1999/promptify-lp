"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";

const LINKS = [
  { href: "/", label: "الرئيسية" },
  { href: "/generate", label: "توليد صفحة" },
  { href: "/dashboard", label: "لوحة التحكم" },
];

export function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const closeOnResize = () => {
      if (window.innerWidth >= 900) {
        setMenuOpen(false);
      }
    };
    window.addEventListener("resize", closeOnResize);
    return () => window.removeEventListener("resize", closeOnResize);
  }, []);

  useEffect(() => {
    document.body.classList.toggle("nav-open", menuOpen);
    return () => {
      document.body.classList.remove("nav-open");
    };
  }, [menuOpen]);

  const toggleMenu = () => setMenuOpen((prev) => !prev);
  const closeMenu = () => setMenuOpen(false);

  return (
    <header className="site-header">
      <div className="site-header__inner">
        <div className="brand">
          <Image
            className="brand__image"
            src="/promptify-logo.svg"
            alt="Promptify"
            width={184}
            height={48}
            priority
            sizes="(max-width: 640px) 150px, 184px"
          />
          <span className="sr-only">Promptify</span>
        </div>
        <button
          type="button"
          className={`site-nav__toggle${menuOpen ? " is-open" : ""}`}
          aria-label="القائمة الرئيسية"
          aria-expanded={menuOpen}
          aria-controls="primary-navigation"
          onClick={toggleMenu}
        >
          <span className="site-nav__toggle-bars" aria-hidden="true">
            <span />
          </span>
          <span className="site-nav__toggle-text">القائمة</span>
        </button>
        <nav
          id="primary-navigation"
          aria-label="روابط أساسية"
          className={`site-nav${menuOpen ? " is-open" : ""}`}
        >
          {LINKS.map((link) => (
            <Link key={link.href} href={link.href} className="nav-link" onClick={closeMenu}>
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
      {menuOpen ? <button type="button" className="site-nav__backdrop" onClick={closeMenu} aria-hidden="true" /> : null}
    </header>
  );
}

export default SiteHeader;
