import "./globals.css";
import React from "react";
import Link from "next/link";

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
                <span className="brand__logo" aria-hidden>✨</span>
                <span className="brand__text">Promptify</span>
              </div>
              <nav aria-label="روابط أساسية">
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
