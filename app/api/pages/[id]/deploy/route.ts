export const runtime = "nodejs";
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db/file";
import { buildDeploymentUrl } from "@/lib/config/deployment";

export async function POST(_: NextRequest, ctx: { params: { id: string }}) {
  try {
    const page = await db.publish(ctx.params.id);
    if (!page) {
      return NextResponse.json({ ok: false, error: "NOT_FOUND" }, { status: 404 });
    }
    const url = buildDeploymentUrl(page.slug);
    return NextResponse.json({ ok: true, page: { ...page, url }, url });
  } catch (error: any) {
    return NextResponse.json({ ok: false, error: error.message || "DEPLOY_FAILED" }, { status: 400 });
  }
}
