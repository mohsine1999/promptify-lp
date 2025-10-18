import "./globals.css";
import React from "react";
import Link from "next/link";
import Image from "next/image";

export const metadata = {
  title: "Promptify – LP Generator (OpenAI default)",
  description: "Arabic LP generator + editor using OpenAI by default, Gemini fallback",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl">
      <body>
        <div className="page-shell">
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
              <nav aria-label="روابط أساسية" className="site-nav">
                <Link href="/" className="nav-link">الرئيسية</Link>
                <Link href="/generate" className="nav-link">توليد صفحة</Link>
                <Link href="/dashboard" className="nav-link">لوحة التحكم</Link>
              </nav>
            </div>
          </header>
          <main className="container">{children}</main>
        </div>
      </body>
    </html>
  );
}
