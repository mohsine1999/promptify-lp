"use client";
import { LandingPage } from "@/components/LandingPage";
import type { LPDocument } from "@/lib/schema/page";
import { useEffect, useState } from "react";

export default function Preview({ params }: { params: { id: string }}) {
  const [doc, setDoc] = useState<LPDocument | null>(null);
  useEffect(() => {
    fetch(`/api/pages/${params.id}`).then(r => r.json()).then(d => setDoc(d.doc));
  }, [params.id]);
  if (!doc) return <div className="card subtle-card"><p>جاري التحميل…</p></div>;
  return <LandingPage doc={doc} />;
}
