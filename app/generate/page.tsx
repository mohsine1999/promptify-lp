"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function GeneratePage() {
  const [url, setUrl] = useState("");
  const [brief, setBrief] = useState("");
  const [dialect, setDialect] = useState<"ar-msa"|"ar-darija">("ar-msa");
  const [provider, setProvider] = useState<"openai"|"gemini">("openai");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string|null>(null);
  const router = useRouter();

  async function run() {
    setBusy(true); setErr(null);
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productUrl: url, brief: brief || undefined, dialect, provider })
      });
      const data = await res.json();
      if (!data.ok) throw new Error(data.error || "Failed");
      router.push(`/editor/${data.id}`);
    } catch (e:any) { setErr(e.message); } finally { setBusy(false); }
  }

  return (
    <div className="grid">
      <div className="card">
        <h1>إنشاء صفحة جديدة</h1>
        <label>رابط المنتج</label>
        <input value={url} onChange={e=>setUrl(e.target.value)} placeholder="https://www.aliexpress.com/item/..." />
        <label>وصف موجز (اختياري)</label>
        <textarea value={brief} onChange={e=>setBrief(e.target.value)} rows={4} placeholder="مثال: لهجة ودية، ركّز على حل الألم، وعد التسليم السريع..." />
        <label>اللهجة</label>
        <select value={dialect} onChange={e=>setDialect(e.target.value as any)}>
          <option value="ar-msa">العربية الفصحى</option>
          <option value="ar-darija">الدارجة المغربية</option>
        </select>
        <label>المزوّد</label>
        <select value={provider} onChange={e=>setProvider(e.target.value as any)}>
          <option value="openai">OpenAI (افتراضي)</option>
          <option value="gemini">Gemini</option>
        </select>
        <div style={{display:"flex", gap: 12, marginTop: 12}}>
          <button className="primary" onClick={run} disabled={!url || busy}>{busy ? "جاري التوليد..." : "توليد الصفحة"}</button>
        </div>
        {err && <p style={{color:"#fca5a5"}}>{err}</p>}
      </div>
    </div>
  );
}
