export const runtime = "nodejs";
import { NextRequest, NextResponse } from "next/server";
import { resolveProduct } from "@/lib/resolve/product";

export async function POST(req: NextRequest) {
  try {
    const { url } = await req.json();
    if (!url) throw new Error("Missing url");
    const resolved = await resolveProduct(url);
    return NextResponse.json(resolved);
  } catch (e:any) {
    return NextResponse.json({ status: "URL_UNREADABLE", error: e.message }, { status: 400 });
  }
}
