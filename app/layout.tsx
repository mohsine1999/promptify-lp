import "./globals.css";
import React from "react";
import SiteHeader from "../components/SiteHeader";

export const metadata = {
  title: "Promptify – LP Generator (OpenAI default)",
  description: "Arabic LP generator + editor using OpenAI by default, Gemini fallback",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl">
      <body>
        <div className="page-shell">
          <SiteHeader />
          <main className="container">{children}</main>
        </div>
      </body>
    </html>
  );
}
