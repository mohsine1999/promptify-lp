"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function GeneratePage() {
  const [url, setUrl] = useState("");
  const [brief, setBrief] = useState("");
  const [dialect, setDialect] = useState<"ar-msa" | "ar-darija">("ar-msa");
  const [provider, setProvider] = useState<"openai" | "gemini">("openai");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const router = useRouter();

  async function run() {
    setBusy(true);
    setErr(null);
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productUrl: url, brief: brief || undefined, dialect, provider }),
      });
      const data = await res.json();
      if (!data.ok) throw new Error(data.error || "Failed");
      router.push(`/editor/${data.id}`);
    } catch (e: any) {
      setErr(e.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="grid">
      <div className="card">
        <h1 style={{ marginTop: 0, marginBottom: 12 }}>إنشاء صفحة هبوط جديدة</h1>
        <p className="muted" style={{ margin: 0, maxWidth: "68ch" }}>
          الصق رابط المنتج الذي تريد الترويج له وأخبر Promptify عن التوجيه الإبداعي واللهجة المناسبة. سنتولى نحن جمع
          الصور والوصف وصياغة نسخة احترافية، مع ضمان انسجام الألوان بين الوضعين الداكن والفاتح تلقائياً.
        </p>

        <form
          className="grid"
          style={{ marginTop: 24 }}
          onSubmit={(e) => {
            e.preventDefault();
            if (!busy) run();
          }}
        >
          <div>
            <label>رابط المنتج</label>
            <input
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://www.aliexpress.com/item/..."
              autoComplete="off"
            />
          </div>
          <div>
            <label>وصف موجز (اختياري)</label>
            <textarea
              value={brief}
              onChange={(e) => setBrief(e.target.value)}
              rows={4}
              placeholder="مثال: لهجة ودّية، ركّز على حل الألم، وعد بالتسليم في 48 ساعة..."
            />
          </div>
          <div className="grid-2">
            <div>
              <label>اللهجة</label>
              <select value={dialect} onChange={(e) => setDialect(e.target.value as any)}>
                <option value="ar-msa">العربية الفصحى</option>
                <option value="ar-darija">الدارجة المغربية</option>
              </select>
            </div>
            <div>
              <label>المزوّد</label>
              <select value={provider} onChange={(e) => setProvider(e.target.value as any)}>
                <option value="openai">OpenAI (افتراضي)</option>
                <option value="gemini">Gemini</option>
              </select>
            </div>
          </div>
          <div className="editor-actions" style={{ marginTop: 12 }}>
            <button className="btn primary" type="submit" disabled={!url || busy}>
              {busy ? "جاري التوليد..." : "توليد الصفحة"}
            </button>
            <button
              type="button"
              className="btn ghost"
              onClick={() => {
                setUrl("");
                setBrief("");
              }}
              disabled={busy}
            >
              مسح الحقول
            </button>
          </div>
        </form>

        {err && <p className="alert-error">{err}</p>}

        <div className="info-banner" style={{ marginTop: 28 }}>
          <strong>تلميح للخبراء</strong>
          <span className="small">
            أضف في الوصف الموجز ما يهمك مثل شخصية العميل، الزاوية التسويقية، أو نبرة الصوت. تستخدم Promptify هذه
            المعلومات لتشكيل المحتوى بشكل أوثق لإستراتيجيتك، مع احترام الألوان التي تختارها للمخطط المرئي.
          </span>
        </div>
      </div>
    </div>
  );
}
