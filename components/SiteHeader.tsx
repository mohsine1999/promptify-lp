"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import ThemeToggle from "./ThemeToggle";

const LINKS = [
  { href: "/", label: "الرئيسية" },
  { href: "/generate", label: "توليد صفحة" },
  { href: "/dashboard", label: "لوحة التحكم" },
];

export function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const closeOnResize = () => {
      if (window.innerWidth >= 960) {
        setMenuOpen(false);
      }
    };
    window.addEventListener("resize", closeOnResize);
    return () => window.removeEventListener("resize", closeOnResize);
  }, []);

  useEffect(() => {
    if (typeof document === "undefined") return;
    const originalOverflow = document.body.style.overflow;
    if (menuOpen) {
      document.body.style.overflow = "hidden";
      document.body.classList.add("nav-open");
    } else {
      document.body.style.overflow = "";
      document.body.classList.remove("nav-open");
    }
    return () => {
      document.body.style.overflow = originalOverflow;
      document.body.classList.remove("nav-open");
    };
  }, [menuOpen]);

  const toggleMenu = () => setMenuOpen((prev) => !prev);
  const closeMenu = () => setMenuOpen(false);

  return (
    <header className="site-header">
      <div className="site-header__inner">
        <Link href="/" className="brand" aria-label="Promptify">
          <Image
            className="brand__image"
            src="/promptify-logo.svg"
            alt="Promptify"
            width={176}
            height={48}
            priority
            sizes="(max-width: 768px) 160px, 176px"
          />
        </Link>
        <div className="site-header__controls">
          <nav
            id="primary-navigation"
            aria-label="روابط أساسية"
            className={`site-nav${menuOpen ? " is-open" : ""}`}
          >
            <div className="site-nav__links">
              {LINKS.map((link) => (
                <Link key={link.href} href={link.href} className="nav-link" onClick={closeMenu}>
                  {link.label}
                </Link>
              ))}
            </div>
            <div className="site-nav__meta">
              <ThemeToggle />
              <Link className="btn primary site-nav__cta" href="/generate" onClick={closeMenu}>
                ابدأ الآن
              </Link>
            </div>
          </nav>
          <button
            type="button"
            className={`site-nav__toggle${menuOpen ? " is-open" : ""}`}
            aria-expanded={menuOpen}
            aria-controls="primary-navigation"
            aria-label="القائمة الرئيسية"
            onClick={toggleMenu}
          >
            <span className="site-nav__toggle-bars" aria-hidden="true">
              <span />
            </span>
            <span className="site-nav__toggle-text">القائمة</span>
          </button>
        </div>
      </div>
      {menuOpen ? <button type="button" className="site-nav__backdrop" onClick={closeMenu} aria-hidden="true" /> : null}
    </header>
  );
}

export default SiteHeader;
