import Link from "next/link";

export default function Home() {
  return (
    <div className="grid" style={{marginTop: 24}}>
      <div className="card">
        <h1>Promptify – توليد صفحات هبوط (OpenAI افتراضياً)</h1>
        <p className="small">أدخل رابط المنتج (وصف اختياري). سنحلّل الصفحة، ثم نولد صفحة هبوط عربية قابلة للتحرير.</p>
        <div className="grid grid-2" style={{marginTop: 16}}>
          <Link className="card" href="/generate"><b>إنشاء صفحة جديدة</b><div className="small">OpenAI ← Gemini fallback</div></Link>
          <Link className="card" href="/dashboard"><b>لوحة التحكم</b><div className="small">إدارة الصفحات</div></Link>
        </div>
      </div>
    </div>
  );
}
