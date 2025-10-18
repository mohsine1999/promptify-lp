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

  if (!doc) return <div className="card"><p>{err || "جاري التحميل…"}</p></div>;

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
        <h1>المحرّر</h1>
        <div className="sep" />
        <h3>قسم البطل</h3>
        <label>العنوان</label>
        <input value={hero.headline || ""} onChange={e=>setHero({ headline:e.target.value })}/>
        <label>الوصف</label>
        <textarea rows={3} value={hero.subheadline || ""} onChange={e=>setHero({ subheadline:e.target.value })}/>
        <label>نقاط مختصرة (سطر لكل نقطة)</label>
        <textarea rows={4} value={(hero.bulletPoints||[]).join("\n")} onChange={e=>setHero({ bulletPoints: e.target.value.split(/\n+/).filter(Boolean) })}/>
        <label>نص زر الدعوة</label>
        <input value={hero.ctaText || ""} onChange={e=>setHero({ ctaText:e.target.value })}/>

        <div className="sep" />
        <h3>المزايا</h3>
        {features.map((f:any,i:number)=>(
          <div key={i} className="card" style={{padding:12, marginBottom:8}}>
            <button onClick={()=>delFeature(i)} style={{float:"left"}}>حذف</button>
            <label>العنوان</label>
            <input value={f.title} onChange={e=>updFeature(i,{title:e.target.value})}/>
            <label>الوصف</label>
            <textarea rows={2} value={f.description} onChange={e=>updFeature(i,{description:e.target.value})}/>
          </div>
        ))}
        <button onClick={addFeature}>+ إضافة ميزة</button>

        <div className="sep" />
        <h3>الأسئلة الشائعة</h3>
        {faq.map((qa:any,i:number)=>(
          <div key={i} className="card" style={{padding:12, marginBottom:8}}>
            <button onClick={()=>delFaq(i)} style={{float:"left"}}>حذف</button>
            <label>سؤال</label>
            <input value={qa.q} onChange={e=>updFaq(i,{q:e.target.value})}/>
            <label>إجابة</label>
            <textarea rows={2} value={qa.a} onChange={e=>updFaq(i,{a:e.target.value})}/>
          </div>
        ))}
        <button onClick={addFaq}>+ إضافة سؤال</button>

        <div className="sep" />
        <h3>الدفع عند الاستلام</h3>
        <label>نص زر التأكيد</label>
        <input value={checkout.ctaText || "تأكيد الطلب بالدفع عند الاستلام"} onChange={e=>setDoc({...doc, checkout:{...(checkout||{}), ctaText:e.target.value}})}/>

        <div className="sep" />
        <div style={{display:"flex", gap:12}}>
          <button className="primary" onClick={save} disabled={busy}>{busy ? "جاري الحفظ…" : "حفظ"}</button>
          <button onClick={()=>router.push(`/preview/${id}`)}>معاينة</button>
          <button onClick={()=>router.push(`/dashboard`)}>رجوع</button>
        </div>
        {saved && <div className="small">تم الحفظ ✓</div>}
        {err && <div style={{color:"#fca5a5"}}>{err}</div>}
      </div>
    </div>
  );
}
