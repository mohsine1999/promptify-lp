import "./globals.css";
import { Metadata } from "next";
import React from "react";

import { ThemeProvider } from "../components/ThemeProvider";
import { PageShell } from "../components/layout/PageShell";
import { Inter, Sora } from "next/font/google";

const headingFont = Sora({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-heading",
  display: "swap",
});

const bodyFont = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Promptify – AI landing page generator",
  description:
    "Promptify builds high-converting landing pages in minutes with AI templates, live previews, and instant publishing.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${headingFont.variable} ${bodyFont.variable}`}>
        <ThemeProvider>
          <PageShell>{children}</PageShell>
        </ThemeProvider>
      </body>
    </html>
  );
}
