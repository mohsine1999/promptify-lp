export const runtime = "nodejs";
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db/file";
import { LPDocument } from "@/lib/schema/page";

export async function GET(_: NextRequest, ctx: { params: { id: string }}) {
  const page = db.get(ctx.params.id);
  if (!page) return NextResponse.json({ ok: false, error: "NOT_FOUND" }, { status: 404 });
  return NextResponse.json({ ok: true, ...page });
}

export async function PUT(req: NextRequest, ctx: { params: { id: string }}) {
  try {
    const body = await req.json();
    const doc: LPDocument = body.doc;
    const updated = db.update(ctx.params.id, doc);
    if (!updated) return NextResponse.json({ ok: false, error: "NOT_FOUND" }, { status: 404 });
    return NextResponse.json({ ok: true, ...updated });
  } catch (e:any) { return NextResponse.json({ ok: false, error: e.message }, { status: 400 }); }
}

export async function DELETE(_: NextRequest, ctx: { params: { id: string }}) {
  const ok = db.delete(ctx.params.id);
  return NextResponse.json({ ok });
}
