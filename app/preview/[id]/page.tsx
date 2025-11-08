"use client";
import { LandingPage } from "@/components/LandingPage";
import type { LPDocument } from "@/lib/schema/page";
import { useEffect, useState } from "react";

export default function Preview({ params }: { params: { id: string }}) {
  const [doc, setDoc] = useState<LPDocument | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        setError(null);
        setLoading(true);
        const res = await fetch(`/api/pages/${params.id}`, { cache: "no-store" });
        if (!res.ok) {
          throw new Error(`REQUEST_FAILED_${res.status}`);
        }
        const contentType = res.headers.get("content-type") || "";
        if (!contentType.includes("application/json")) {
          throw new Error("UNEXPECTED_CONTENT_TYPE");
        }
        const data = await res.json();
        if (!cancelled) {
          setDoc(data?.doc ?? null);
        }
      } catch (err) {
        console.error("failed to load preview page", err);
        if (!cancelled) {
          setError("تعذّر تحميل الصفحة المطلوبة.");
          setDoc(null);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, [params.id]);

  if (loading) return <div className="card subtle-card"><p>جاري التحميل…</p></div>;
  if (error) return <div className="card subtle-card"><p>{error}</p></div>;
  if (!doc) return <div className="card subtle-card"><p>لا توجد بيانات متاحة لهذه الصفحة.</p></div>;
  return <LandingPage doc={doc} />;
}
