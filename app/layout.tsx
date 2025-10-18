import "./globals.css";
import React from "react";
import SiteHeader from "../components/SiteHeader";
import { ThemeProvider } from "../components/ThemeProvider";
import { Cairo, IBM_Plex_Sans_Arabic } from "next/font/google";

const headingFont = Cairo({
  subsets: ["arabic"],
  weight: ["600", "700", "800"],
  variable: "--font-heading",
  display: "swap",
});

const bodyFont = IBM_Plex_Sans_Arabic({
  subsets: ["arabic"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-body",
  display: "swap",
});

export const metadata = {
  title: "Promptify – LP Generator (OpenAI default)",
  description: "Arabic LP generator + editor using OpenAI by default, Gemini fallback",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <body className={`${headingFont.variable} ${bodyFont.variable}`}>
        <ThemeProvider>
          <div className="page-shell">
            <SiteHeader />
            <main className="page-content">{children}</main>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
