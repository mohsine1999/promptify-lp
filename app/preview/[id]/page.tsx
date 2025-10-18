"use client";
import { useEffect, useState } from "react";

export default function Preview({ params }: { params: { id: string }}) {
  const [doc, setDoc] = useState<any>(null);
  useEffect(()=>{ fetch(`/api/pages/${params.id}`).then(r=>r.json()).then(d=>setDoc(d.doc)); }, [params.id]);
  if (!doc) return <div className="card subtle-card"><p>جاري التحميل…</p></div>;
  const heroImage = doc?.hero?.heroImage;
  const gallery = (doc?.product?.images || []).filter((img:any)=>img?.url && img.url !== heroImage?.url);
  return (
    <div className="preview-wrapper" style={{ marginTop: 16 }}>
      <div dir="rtl" className="preview">
        <div className={`hero${heroImage?.url ? " with-image" : ""}`}>
          <div className="hero-copy">
            <h1>{doc?.hero?.headline}</h1>
            {doc?.hero?.subheadline && <p>{doc.hero.subheadline}</p>}
            {doc?.hero?.bulletPoints?.length ? (
              <ul>{doc.hero.bulletPoints.map((b:string, i:number)=><li key={i}>{b}</li>)}</ul>
            ) : null}
            <a className="cta" href="#checkout">{doc?.hero?.ctaText || "اطلب الآن"}</a>
          </div>
          {heroImage?.url ? (
            <figure className="hero-media">
              <img src={heroImage.url} alt={heroImage.alt || "صورة المنتج"} />
              {heroImage.alt && <figcaption>{heroImage.alt}</figcaption>}
            </figure>
          ) : null}
        </div>
        {gallery.length ? (
          <section className="preview-gallery">
            <h3>معرض الصور</h3>
            <div className="preview-gallery__grid">
              {gallery.map((img:any, i:number) => (
                <figure key={i}>
                  <img src={img.url} alt={img.alt || `صورة ${i+1}`} />
                  {img.alt && <figcaption>{img.alt}</figcaption>}
                </figure>
              ))}
            </div>
          </section>
        ) : null}
        {doc?.features?.length ? (
          <section className="features">
            <h3>المزايا</h3>
            <div>
              {doc.features.map((f:any,i:number)=>(
                <div key={i} className="item">
                  <strong>{f.title}</strong>
                  <div>{f.description}</div>
                </div>
              ))}
            </div>
          </section>
        ) : null}
        {doc?.faq?.length ? (
          <section>
            <h3>الأسئلة الشائعة</h3>
            <div>
              {doc.faq.map((qa:any,i:number)=>(
                <details key={i}>
                  <summary>{qa.q}</summary>
                  <div>{qa.a}</div>
                </details>
              ))}
            </div>
          </section>
        ) : null}
        <section id="checkout">
          <h3>طلب بالدفع عند الاستلام</h3>
          <form onSubmit={(e)=>e.preventDefault()}>
            <div>
              <input placeholder="الاسم الكامل" />
              <input placeholder="المدينة" />
              <input placeholder="رقم الهاتف" />
              <button className="cta" type="submit">{doc?.checkout?.ctaText || "تأكيد الطلب"}</button>
            </div>
          </form>
        </section>
      </div>
    </div>
  );
}
