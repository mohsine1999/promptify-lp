"use client";

import { Toaster } from "sonner";

export function ToastProvider() {
  return (
    <Toaster
      theme="system"
      position="top-right"
      toastOptions={{
        style: {
          borderRadius: "16px",
          background: "var(--surface-3)",
          color: "var(--text-primary)",
          border: "1px solid var(--border-soft)",
          boxShadow: "var(--shadow-2)",
        },
      }}
      richColors
      closeButton
    />
  );
}
