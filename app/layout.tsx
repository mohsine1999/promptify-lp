import "./globals.css";
import React from "react";

export const metadata = {
  title: "Promptify – LP Generator (OpenAI default)",
  description: "Arabic LP generator + editor using OpenAI by default, Gemini fallback",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl">
      <body><div className="container">{children}</div></body>
    </html>
  );
}
