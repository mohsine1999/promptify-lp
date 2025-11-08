"use client";
import { buildDeploymentUrl } from "@/lib/config/deployment";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Dashboard() {
  const [pages, setPages] = useState<any[]>([]);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        setLoadError(null);
        const res = await fetch("/api/pages", { cache: "no-store" });
        if (!res.ok) {
          throw new Error(`REQUEST_FAILED_${res.status}`);
        }
        const contentType = res.headers.get("content-type") || "";
        if (!contentType.includes("application/json")) {
          throw new Error("UNEXPECTED_CONTENT_TYPE");
        }
        const data = await res.json();
        if (!cancelled) {
          const nextPages = Array.isArray(data?.pages) ? data.pages : [];
          setPages(nextPages);
        }
      } catch (error) {
        console.error("failed to load pages", error);
        if (!cancelled) {
          setLoadError("تعذّر تحميل الصفحات. حاول تحديث الصفحة.");
          setPages([]);
        }
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const deletePage = async (id: string) => {
    if (deletingId === id) return;
    if (typeof window !== "undefined") {
      const confirmed = window.confirm("هل أنت متأكد من حذف هذه الصفحة؟");
      if (!confirmed) return;
    }
    try {
      setDeletingId(id);
      const res = await fetch(`/api/pages/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("DELETE_FAILED");
      setPages(prev => prev.filter(p => p.id !== id));
    } catch (error) {
      if (typeof window !== "undefined") {
        window.alert("تعذر حذف الصفحة، يرجى المحاولة لاحقاً.");
      }
    } finally {
      setDeletingId(null);
    }
  };
  return (
    <div className="grid">
      <div className="card">
        <div className="editor-section__header" style={{ marginBottom: 8 }}>
          <div>
            <h1 style={{ margin: 0 }}>لوحة الصفحات</h1>
            <p className="muted" style={{ margin: 6, marginInlineStart: 0 }}>
              راقب الصفحات المتولدة، عدّلها، أو شاركها مع فريقك. يتم حفظ كل نسخة بتاريخها وحالتها الحالية.
            </p>
          </div>
          <Link className="btn primary" href="/generate">+ إنشاء صفحة</Link>
        </div>

        {loadError ? (
          <div className="info-banner" role="alert" style={{ marginTop: 24 }}>
            <strong>حدث خطأ أثناء تحميل الصفحات</strong>
            <span className="small">{loadError}</span>
          </div>
        ) : pages.length === 0 ? (
          <div className="info-banner" style={{ marginTop: 24 }}>
            <strong>لم تنشئ أي صفحة بعد</strong>
            <span className="small">ابدأ من خلال توليد صفحة جديدة، وسنضيفها هنا تلقائياً مع تفاصيلها.</span>
            <Link className="btn primary" href="/generate" style={{ alignSelf: "flex-start", marginTop: 12 }}>بدء التوليد</Link>
          </div>
        ) : (
          <>
            <div className="info-banner" style={{ marginTop: 24 }}>
              <strong>عدد الصفحات المحفوظة: {pages.length}</strong>
              <span className="small">انقر على أي بطاقة للتعديل أو المعاينة أو استخدم زر الحذف لإزالتها فوراً.</span>
            </div>
            <div className="lp-grid" role="list">
              {pages.map((p: any) => {
                const liveUrl = buildDeploymentUrl(p.slug);
                return (
                  <article key={p.id} className="lp-card" role="listitem">
                  <header className="lp-card__header">
                    <div>
                      <h3>{p.doc?.product?.name || p.slug}</h3>
                      <p className="small muted" style={{ margin: 0 }}>{p.id}</p>
                    </div>
                    <span className="status-pill">{p.status === "published" ? "منشورة" : "مسودة"}</span>
                  </header>
                  {p.doc?.product?.description ? (
                    <p className="small" style={{ marginTop: 12 }}>{p.doc.product.description}</p>
                  ) : null}
                  <dl className="lp-card__meta">
                    {p.doc?.product?.price ? (
                      <div>
                        <dt>السعر</dt>
                        <dd>{p.doc.product.price}</dd>
                      </div>
                    ) : null}
                    {p.doc?.hero?.ctaText ? (
                      <div>
                        <dt>الدعوة للإجراء</dt>
                        <dd>{p.doc.hero.ctaText}</dd>
                      </div>
                    ) : null}
                    <div>
                      <dt>أُنشئت في</dt>
                      <dd>{p.createdAt ? new Date(p.createdAt).toLocaleString("ar-MA") : "غير معروف"}</dd>
                    </div>
                    {p.status === "published" ? (
                      <div>
                        <dt>الرابط المباشر</dt>
                        <dd>
                          <a
                            href={liveUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {liveUrl}
                          </a>
                        </dd>
                      </div>
                    ) : null}
                  </dl>
                  <div className="lp-card__actions">
                    <Link className="btn primary" href={`/editor/${p.id}`}>تعديل</Link>
                    <Link className="btn ghost" href={`/preview/${p.id}`}>معاينة</Link>
                    {p.status === "published" ? (
                      <a
                        className="btn ghost"
                        href={liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        فتح الرابط المنشور
                      </a>
                    ) : null}
                    <button
                      type="button"
                      className="btn danger"
                      onClick={() => deletePage(p.id)}
                      disabled={deletingId === p.id}
                    >
                      {deletingId === p.id ? "جار الحذف…" : "حذف"}
                    </button>
                  </div>
                  </article>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
