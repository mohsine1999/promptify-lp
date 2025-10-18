"use client";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";

export default function Editor() {
  const { id } = useParams<{id:string}>();
  const router = useRouter();
  const [doc, setDoc] = useState<any>(null);
  const [busy, setBusy] = useState(false);
  const [saved, setSaved] = useState(false);
  const [err, setErr] = useState<string|null>(null);

  useEffect(()=>{
    fetch(`/api/pages/${id}`).then(r=>r.json()).then(d=>setDoc(d.doc)).catch(()=>setErr("تعذّر التحميل"));
  }, [id]);

  async function save() {
    if (!doc) return;
    setBusy(true); setErr(null);
    try {
      const res = await fetch(`/api/pages/${id}`, {
        method: "PUT", headers: {"Content-Type": "application/json"},
        body: JSON.stringify({ doc })
      });
      const d = await res.json();
      if (!d.ok) throw new Error(d.error || "فشل الحفظ");
      setSaved(true); setTimeout(()=>setSaved(false), 1500);
    } catch (e:any) { setErr(e.message); } finally { setBusy(false); }
  }

  if (!doc) return <div className="card subtle-card"><p>{err || "جاري التحميل…"}</p></div>;

  const hero = doc.hero || {};
  const features = doc.features || [];
  const faq = doc.faq || [];
  const checkout = doc.checkout || {};

  const setHero = (u:any)=> setDoc({...doc, hero:{...hero, ...u}});
  const addFeature = ()=> setDoc({...doc, features:[...features, { title:"ميزة", description:"وصف مختصر" }]});
  const updFeature = (i:number,u:any)=>{ const a=[...features]; a[i]={...a[i],...u}; setDoc({...doc, features:a}); };
  const delFeature = (i:number)=> setDoc({...doc, features: features.filter((_x:any,j:number)=>j!==i)});
  const addFaq = ()=> setDoc({...doc, faq:[...faq, { q:"سؤال شائع؟", a:"إجابة مختصرة." }]});
  const updFaq = (i:number,u:any)=>{ const a=[...faq]; a[i]={...a[i],...u}; setDoc({...doc, faq:a}); };
  const delFaq = (i:number)=> setDoc({...doc, faq: faq.filter((_x:any,j:number)=>j!==i)});

  return (
    <div className="grid">
      <div className="card">
        <div className="editor-section__header">
          <div>
            <h1 style={{ margin: 0 }}>المحرّر</h1>
            <p className="muted" style={{ margin: 6, marginInlineStart: 0 }}>
              عدّل كل جزء من صفحة الهبوط، أضف أقساماً جديدة، وتابع حفظ التغييرات باستمرار قبل مشاركتها مع الفريق.
            </p>
          </div>
          <span className="status-pill">معرف الصفحة: {id}</span>
        </div>

        <div className="info-banner" style={{ marginTop: 18 }}>
          <strong>{doc?.docTitle || doc?.hero?.headline || "صفحة بدون عنوان"}</strong>
          <span className="small">احرص على أن تعكس أقسام الصفحة وعد المنتج وقيمته بلغة واضحة وجذابة.</span>
        </div>

        <section className="editor-section" style={{ marginTop: 32 }}>
          <div className="editor-section__header">
            <h3 style={{ margin: 0 }}>قسم البطل</h3>
          </div>
          <label>العنوان</label>
          <input value={hero.headline || ""} onChange={e => setHero({ headline: e.target.value })} />
          <label>الوصف</label>
          <textarea rows={3} value={hero.subheadline || ""} onChange={e => setHero({ subheadline: e.target.value })} />
          <label>نقاط مختصرة (سطر لكل نقطة)</label>
          <textarea
            rows={4}
            value={(hero.bulletPoints || []).join("\n")}
            onChange={e => setHero({ bulletPoints: e.target.value.split(/\n+/).filter(Boolean) })}
          />
          <label>نص زر الدعوة</label>
          <input value={hero.ctaText || ""} onChange={e => setHero({ ctaText: e.target.value })} />
        </section>

        <section className="editor-section">
          <div className="editor-section__header">
            <h3 style={{ margin: 0 }}>المزايا</h3>
            <button type="button" className="btn ghost" onClick={addFeature}>+ إضافة ميزة</button>
          </div>
          {features.length === 0 && <p className="small">أضف على الأقل ثلاث مزايا تسلط الضوء على قوة المنتج.</p>}
          {features.map((f: any, i: number) => (
            <div key={i} className="editor-group">
              <button type="button" className="btn ghost" onClick={() => delFeature(i)}>حذف</button>
              <label>العنوان</label>
              <input value={f.title} onChange={e => updFeature(i, { title: e.target.value })} />
              <label>الوصف</label>
              <textarea rows={2} value={f.description} onChange={e => updFeature(i, { description: e.target.value })} />
            </div>
          ))}
        </section>

        <section className="editor-section">
          <div className="editor-section__header">
            <h3 style={{ margin: 0 }}>الأسئلة الشائعة</h3>
            <button type="button" className="btn ghost" onClick={addFaq}>+ إضافة سؤال</button>
          </div>
          {faq.length === 0 && <p className="small">أدرج أسئلة شائعة تزيل العقبات وتطمئن العميل قبل الشراء.</p>}
          {faq.map((qa: any, i: number) => (
            <div key={i} className="editor-group">
              <button type="button" className="btn ghost" onClick={() => delFaq(i)}>حذف</button>
              <label>سؤال</label>
              <input value={qa.q} onChange={e => updFaq(i, { q: e.target.value })} />
              <label>إجابة</label>
              <textarea rows={2} value={qa.a} onChange={e => updFaq(i, { a: e.target.value })} />
            </div>
          ))}
        </section>

        <section className="editor-section">
          <div className="editor-section__header">
            <h3 style={{ margin: 0 }}>الدفع عند الاستلام</h3>
          </div>
          <label>نص زر التأكيد</label>
          <input
            value={checkout.ctaText || "تأكيد الطلب بالدفع عند الاستلام"}
            onChange={e => setDoc({ ...doc, checkout: { ...(checkout || {}), ctaText: e.target.value } })}
          />
        </section>

        <div className="editor-actions">
          <button className="primary" onClick={save} disabled={busy}>{busy ? "جاري الحفظ…" : "حفظ"}</button>
          <button onClick={() => router.push(`/preview/${id}`)}>معاينة</button>
          <button onClick={() => router.push(`/dashboard`)}>رجوع</button>
        </div>
        {saved && <div className="alert-success">تم الحفظ ✓</div>}
        {err && <div className="alert-error">{err}</div>}
      </div>
    </div>
  );
}
