"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function Dashboard() {
  const [pages, setPages] = useState<any[]>([]);
  useEffect(() => { fetch("/api/pages").then(r => r.json()).then(d => setPages(d.pages || [])); }, []);
  return (
    <div className="grid">
      <div className="card">
        <h1>صفحاتي</h1>
        <div className="sep" />
        {pages.length === 0 ? (
          <p>لا توجد صفحات بعد. <Link href="/generate">ابدأ من هنا</Link></p>
        ) : (
          <table>
            <thead><tr><th>الاسم</th><th>المعرف</th><th>الحالة</th><th>تعديل</th><th>معاينة</th></tr></thead>
            <tbody>
              {pages.map((p: any) => (
                <tr key={p.id}>
                  <td>{p.doc?.product?.name || p.slug}</td>
                  <td className="small">{p.id}</td>
                  <td>{p.status}</td>
                  <td><Link href={`/editor/${p.id}`}>تعديل</Link></td>
                  <td><Link href={`/preview/${p.id}`}>معاينة</Link></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
