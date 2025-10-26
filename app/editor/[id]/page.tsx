"use client";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { buildDeploymentUrl } from "@/lib/config/deployment";

export default function Editor() {
  const { id } = useParams<{id:string}>();
  const router = useRouter();
  const [page, setPage] = useState<any>(null);
  const [doc, setDoc] = useState<any>(null);
  const [busy, setBusy] = useState(false);
  const [saved, setSaved] = useState(false);
  const [err, setErr] = useState<string|null>(null);
  const [deploying, setDeploying] = useState(false);
  const [deployFlash, setDeployFlash] = useState(false);
  const [imageUrlInput, setImageUrlInput] = useState("");
  const [imageAltInput, setImageAltInput] = useState("");

  useEffect(() => {
    setErr(null);
    fetch(`/api/pages/${id}`)
      .then(r => {
        if (!r.ok) throw new Error("LOAD_FAILED");
        return r.json();
      })
      .then(d => {
        setDoc(d.doc);
        setPage(d);
        setDeployFlash(false);
      })
      .catch(() => setErr("تعذّر التحميل"));
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
      setDoc(d.doc);
      setPage(d);
      setSaved(true); setTimeout(()=>setSaved(false), 1500);
    } catch (e:any) { setErr(e.message); } finally { setBusy(false); }
  }

  async function deploy() {
    if (!doc || deploying) return;
    setDeploying(true); setErr(null);
    try {
      const res = await fetch(`/api/pages/${id}/deploy`, { method: "POST" });
      const data = await res.json();
      if (!res.ok || !data.ok) throw new Error(data.error || "فشل النشر");
      const nextPage = data.page || data;
      if (nextPage?.doc) setDoc(nextPage.doc);
      setPage(nextPage);
      setDeployFlash(true);
      setTimeout(() => setDeployFlash(false), 2000);
    } catch (e: any) {
      setErr(e.message);
    } finally {
      setDeploying(false);
    }
  }

  const hero = doc?.hero || {};
  const heroTypography = hero?.typography || {};
  const heroVideo = hero?.heroVideo || {};
  const features = doc?.features || [];
  const faq = doc?.faq || [];
  const checkout = doc?.checkout || {};
  const product = doc?.product || {};
  const productImages = (product.images || []).filter((img:any)=>img && img.url);
  const isPublished = page?.status === "published";
  const deploymentUrl = page?.slug ? buildDeploymentUrl(page.slug) : null;
  const publishedAt = page?.publishedAt ? new Date(page.publishedAt).toLocaleString("ar-MA") : null;

  if (!doc) return <div className="card subtle-card"><p>{err || "جاري التحميل…"}</p></div>;

  const setHero = (u:any)=> {
    const nextHero: any = { ...hero, ...u };
    if (u && Object.prototype.hasOwnProperty.call(u, "heroImage") && u.heroImage === undefined) {
      delete nextHero.heroImage;
    }
    if (u && Object.prototype.hasOwnProperty.call(u, "heroVideo")) {
      if (!u.heroVideo) {
        delete nextHero.heroVideo;
      } else {
        nextHero.heroVideo = u.heroVideo;
      }
    }
    if (u && Object.prototype.hasOwnProperty.call(u, "typography")) {
      if (!u.typography || !Object.keys(u.typography).length) {
        delete nextHero.typography;
      } else {
        nextHero.typography = u.typography;
      }
    }
    setDoc({ ...doc, hero: nextHero });
  };
  const addFeature = ()=> setDoc({...doc, features:[...features, { title:"ميزة", description:"وصف مختصر" }]});
  const updFeature = (i:number,u:any)=>{ const a=[...features]; a[i]={...a[i],...u}; setDoc({...doc, features:a}); };
  const delFeature = (i:number)=> setDoc({...doc, features: features.filter((_x:any,j:number)=>j!==i)});
  const addFaq = ()=> setDoc({...doc, faq:[...faq, { q:"سؤال شائع؟", a:"إجابة مختصرة." }]});
  const updFaq = (i:number,u:any)=>{ const a=[...faq]; a[i]={...a[i],...u}; setDoc({...doc, faq:a}); };
  const delFaq = (i:number)=> setDoc({...doc, faq: faq.filter((_x:any,j:number)=>j!==i)});
  const setProduct = (u:any)=> setDoc({ ...doc, product: { ...(product || {}), ...u } });

  const updateHeroTypography = (updates: Record<string, string>) => {
    const current = hero.typography || {};
    const next = { ...current, ...updates } as Record<string, string>;
    const cleaned: Record<string, string> = {};
    Object.entries(next).forEach(([key, value]) => {
      if (typeof value === "string") {
        const trimmed = value.trim();
        if (trimmed) cleaned[key] = trimmed;
      }
    });
    setHero({ typography: Object.keys(cleaned).length ? cleaned : undefined });
  };

  const updateHeroVideo = (updates: any) => {
    const current = hero.heroVideo || {};
    const merged = { ...current, ...updates } as any;
    const url = typeof merged.url === "string" ? merged.url.trim() : current.url;
    if (!url) {
      setHero({ heroVideo: undefined });
      return;
    }
    const cleaned: any = { ...merged, url };
    if (typeof cleaned.poster === "string") {
      const posterTrimmed = cleaned.poster.trim();
      if (posterTrimmed) cleaned.poster = posterTrimmed; else delete cleaned.poster;
    }
    if (typeof cleaned.caption === "string") {
      const captionTrimmed = cleaned.caption.trim();
      if (captionTrimmed) cleaned.caption = captionTrimmed; else delete cleaned.caption;
    }
    ["autoplay", "muted", "loop"].forEach((flag) => {
      if (typeof cleaned[flag] === "boolean" && cleaned[flag] === false) {
        delete cleaned[flag];
      } else if (cleaned[flag] === undefined || cleaned[flag] === null) {
        delete cleaned[flag];
      }
    });
    setHero({ heroVideo: cleaned });
  };

  const fileToDataUrl = (file: File) => new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });

  const handleUpload = async (files: FileList | null) => {
    if (!files || !files.length) return;
    const existing = productImages.slice();
    for (const file of Array.from(files)) {
      try {
        const dataUrl = await fileToDataUrl(file);
        existing.push({ url: dataUrl, alt: file.name.replace(/\.[^.]+$/, "") });
      } catch (error) {
        console.error("image upload failed", error);
      }
    }
    setProduct({ images: existing });
  };

  const addImageFromUrl = () => {
    if (!imageUrlInput.trim()) return;
    const list = [
      ...productImages,
      { url: imageUrlInput.trim(), alt: imageAltInput.trim() || hero?.headline || product?.name || "صورة المنتج" },
    ];
    setProduct({ images: list });
    setImageUrlInput("");
    setImageAltInput("");
  };

  const removeImage = (index: number) => {
    const list = productImages.filter((_img:any, i:number)=> i !== index);
    setProduct({ images: list });
    if (hero?.heroImage?.url && productImages[index]?.url === hero.heroImage.url) {
      setHero({ heroImage: undefined });
    }
  };

  const setHeroImageFromProduct = (index: number) => {
    const target = productImages[index];
    if (!target) return;
    setHero({ heroImage: target });
  };

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
          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 6 }}>
            <span className="status-pill">{isPublished ? "منشورة" : "مسودة"}</span>
            <span className="small muted" style={{ margin: 0 }}>معرف الصفحة: {id}</span>
            {isPublished && publishedAt ? (
              <span className="small muted" style={{ margin: 0 }}>نُشرت في {publishedAt}</span>
            ) : null}
          </div>
        </div>

        <div className="info-banner" style={{ marginTop: 18 }}>
          <strong>{doc?.docTitle || doc?.hero?.headline || "صفحة بدون عنوان"}</strong>
          <span className="small">احرص على أن تعكس أقسام الصفحة وعد المنتج وقيمته بلغة واضحة وجذابة.</span>
        </div>

        {isPublished && deploymentUrl ? (
          <div className="info-banner" style={{ marginTop: 16 }}>
            <strong>الصفحة منشورة على نطاق فرعي</strong>
            <span className="small">
              شارك الرابط المباشر مع جمهورك:
              <a href={deploymentUrl} target="_blank" rel="noopener noreferrer" style={{ marginInlineStart: 8 }}>
                {deploymentUrl}
              </a>
            </span>
          </div>
        ) : null}

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
          <div className="editor-group" style={{ marginTop: 18 }}>
            <div className="editor-section__header" style={{ margin: 0 }}>
              <h4 style={{ margin: 0 }}>تنسيق النص</h4>
              {hero.typography ? (
                <button type="button" className="btn ghost" onClick={() => setHero({ typography: undefined })}>
                  إعادة التعيين
                </button>
              ) : null}
            </div>
            <label>لون العنوان والنص (يقبل قيم CSS مثل #ffffff أو var(--color))</label>
            <input
              placeholder="#f8fafc"
              value={heroTypography.color || ""}
              onChange={e => updateHeroTypography({ color: e.target.value })}
            />
            <label>حجم العنوان الرئيسي</label>
            <input
              placeholder="مثال: 3rem أو clamp(2.5rem, 6vw, 3.75rem)"
              value={heroTypography.fontSize || ""}
              onChange={e => updateHeroTypography({ fontSize: e.target.value })}
            />
            <label>أقصى عرض لمجموعة النص</label>
            <input
              placeholder="مثال: 52ch أو 640px"
              value={heroTypography.maxWidth || ""}
              onChange={e => updateHeroTypography({ maxWidth: e.target.value })}
            />
            <p className="small muted">اترك الحقول فارغة للعودة إلى الإعدادات الافتراضية.</p>
          </div>
          <div className="editor-hero-image">
            <div className="editor-section__header" style={{ marginTop: 16 }}>
              <h4 style={{ margin: 0 }}>الصورة الرئيسية</h4>
              {hero?.heroImage?.url ? (
                <button type="button" className="btn ghost" onClick={() => setHero({ heroImage: undefined })}>إزالة</button>
              ) : null}
            </div>
            {hero?.heroImage?.url ? (
              <div className="editor-hero-image__preview">
                <img src={hero.heroImage.url} alt={hero.heroImage.alt || ""} />
                <input
                  placeholder="نص بديل للصورة"
                  value={hero.heroImage.alt || ""}
                  onChange={e => setHero({ heroImage: { ...hero.heroImage, alt: e.target.value } })}
                />
              </div>
            ) : (
              <p className="small">اختر إحدى صور المنتج أدناه واجعلها صورة البطل لإبراز المنتج من أول لحظة.</p>
            )}
          </div>
          <div className="editor-group">
            <div className="editor-section__header" style={{ marginTop: 16 }}>
              <h4 style={{ margin: 0 }}>فيديو البطل</h4>
              {heroVideo?.url ? (
                <button type="button" className="btn ghost" onClick={() => setHero({ heroVideo: undefined })}>
                  إزالة الفيديو
                </button>
              ) : null}
            </div>
            <label>رابط الفيديو (MP4 أو بث مباشر عبر CDN)</label>
            <input
              placeholder="https://cdn.example.com/hero.mp4"
              value={heroVideo?.url || ""}
              onChange={e => updateHeroVideo({ url: e.target.value })}
            />
            <label>صورة الغلاف (اختياري)</label>
            <input
              placeholder="https://cdn.example.com/poster.jpg"
              value={heroVideo?.poster || ""}
              onChange={e => updateHeroVideo({ poster: e.target.value })}
            />
            <label>وصف مختصر/تعليق للفيديو</label>
            <input
              placeholder="لمحة عن الفيديو تظهر أسفل المشغّل"
              value={heroVideo?.caption || ""}
              onChange={e => updateHeroVideo({ caption: e.target.value })}
            />
            <div className="editor-checkboxes">
              <label>
                <input
                  type="checkbox"
                  checked={Boolean(heroVideo?.autoplay)}
                  onChange={e => updateHeroVideo({ autoplay: e.target.checked, muted: e.target.checked ? true : heroVideo?.muted })}
                />
                تشغيل تلقائي (سيتم كتم الصوت تلقائياً)
              </label>
              <label>
                <input
                  type="checkbox"
                  checked={Boolean(heroVideo?.loop)}
                  onChange={e => updateHeroVideo({ loop: e.target.checked })}
                />
                تكرار التشغيل
              </label>
              <label>
                <input
                  type="checkbox"
                  checked={Boolean(heroVideo?.muted)}
                  onChange={e => updateHeroVideo({ muted: e.target.checked })}
                />
                كتم الصوت
              </label>
            </div>
            <p className="small muted">اترك الرابط فارغاً لإخفاء الفيديو والاعتماد على الصورة الرئيسية فقط.</p>
          </div>
        </section>

        <section className="editor-section">
          <div className="editor-section__header">
            <h3 style={{ margin: 0 }}>صور المنتج</h3>
            <label className="btn ghost file-upload">
              رفع صور
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={async e => {
                  await handleUpload(e.target.files);
                  e.target.value = "";
                }}
              />
            </label>
          </div>
          <p className="small">
            ارفع أفضل صور المنتج أو ألصق روابط مباشرة. اختر صورة أساسية لعرضها في القسم الرئيسي، واحتفظ بباقي الصور كمعرض يقنع الزائر بسرعة.
          </p>
          <div className="editor-image-url">
            <input
              placeholder="https://example.com/product.jpg"
              value={imageUrlInput}
              onChange={e => setImageUrlInput(e.target.value)}
            />
            <input
              placeholder="وصف مختصر للصورة"
              value={imageAltInput}
              onChange={e => setImageAltInput(e.target.value)}
            />
            <button type="button" className="btn ghost" onClick={addImageFromUrl}>إضافة</button>
          </div>
          {productImages.length ? (
            <div className="editor-image-grid">
              {productImages.map((img:any, i:number) => (
                <div key={i} className={`editor-image-card${hero?.heroImage?.url === img.url ? " hero" : ""}`}>
                  <img src={img.url} alt={img.alt || ""} />
                  <input
                    placeholder="نص بديل للصورة"
                    value={img.alt || ""}
                    onChange={e => {
                      const list = productImages.slice();
                      list[i] = { ...list[i], alt: e.target.value };
                      setProduct({ images: list });
                      if (hero?.heroImage?.url === img.url) {
                        setHero({ heroImage: { ...hero.heroImage, alt: e.target.value } });
                      }
                    }}
                  />
                  <div className="editor-image-card__actions">
                    <button type="button" className="btn ghost" onClick={() => setHeroImageFromProduct(i)}>
                      تعيين كصورة البطل
                    </button>
                    <button type="button" className="btn ghost" onClick={() => removeImage(i)}>
                      حذف
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="small">لم يتم إضافة صور بعد.</p>
          )}
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
          <button className="btn primary" onClick={save} disabled={busy}>
            {busy ? "جاري الحفظ…" : "حفظ"}
          </button>
          <button className="btn success" onClick={deploy} disabled={deploying || busy}>
            {deploying ? "جاري النشر…" : isPublished ? "تحديث النشر" : "نشر على النطاق الفرعي"}
          </button>
          <button className="btn ghost" onClick={() => router.push(`/preview/${id}`)}>
            معاينة
          </button>
          <button className="btn ghost" onClick={() => router.push(`/dashboard`)}>
            رجوع
          </button>
        </div>
        {saved && <div className="alert-success">تم الحفظ ✓</div>}
        {deployFlash && <div className="alert-success">تم النشر على النطاق الفرعي ✓</div>}
        {err && <div className="alert-error">{err}</div>}
      </div>
    </div>
  );
}
