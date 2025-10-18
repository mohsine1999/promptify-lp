"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function Dashboard() {
  const [pages, setPages] = useState<any[]>([]);
  useEffect(() => { fetch("/api/pages").then(r => r.json()).then(d => setPages(d.pages || [])); }, []);
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

        {pages.length === 0 ? (
          <div className="info-banner" style={{ marginTop: 24 }}>
            <strong>لم تنشئ أي صفحة بعد</strong>
            <span className="small">ابدأ من خلال توليد صفحة جديدة، وسنضيفها هنا تلقائياً مع تفاصيلها.</span>
            <Link className="btn primary" href="/generate" style={{ alignSelf: "flex-start", marginTop: 12 }}>بدء التوليد</Link>
          </div>
        ) : (
          <>
            <div className="info-banner" style={{ marginTop: 24 }}>
              <strong>عدد الصفحات المحفوظة: {pages.length}</strong>
              <span className="small">انقر على أي صفحة للتعديل أو المعاينة. يمكنك أيضاً حذفها من داخل المحرّر.</span>
            </div>
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>الاسم</th>
                    <th>المعرف</th>
                    <th>الحالة</th>
                    <th>تعديل</th>
                    <th>معاينة</th>
                  </tr>
                </thead>
                <tbody>
                  {pages.map((p: any) => (
                    <tr key={p.id}>
                      <td>{p.doc?.product?.name || p.slug}</td>
                      <td className="small">{p.id}</td>
                      <td>
                        <span className="status-pill">{p.status}</span>
                      </td>
                      <td><Link href={`/editor/${p.id}`}>تعديل</Link></td>
                      <td><Link href={`/preview/${p.id}`}>معاينة</Link></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
