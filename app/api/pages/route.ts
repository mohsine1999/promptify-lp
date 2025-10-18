export const runtime = "nodejs";
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db/file";
import { LPDocument } from "@/lib/schema/page";
import { z } from "zod";

export async function GET() { return NextResponse.json({ ok: true, pages: db.list() }); }

const BodySchema = z.object({ doc: LPDocument });
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { doc } = BodySchema.parse(body);
    const page = db.create({ doc });
    return NextResponse.json({ ok: true, id: page.id, page });
  } catch (e:any) {
    return NextResponse.json({ ok: false, error: e.message }, { status: 400 });
  }
}
