export const runtime = "nodejs";
import { NextRequest, NextResponse } from "next/server";
import { resolveProduct } from "@/lib/resolve/product";
import { fallbackResolvedProduct } from "@/lib/resolve/fallback";

export async function POST(req: NextRequest) {
  try {
    const { url } = await req.json();
    if (!url) throw new Error("Missing url");
    let resolved = await resolveProduct(url);
    if (resolved.status !== "OK" || !resolved.title) {
      const fallback = fallbackResolvedProduct(url, resolved);
      if (fallback) {
        resolved = fallback;
      }
    }
    return NextResponse.json(resolved);
  } catch (e:any) {
    return NextResponse.json({ status: "URL_UNREADABLE", error: e.message }, { status: 400 });
  }
}
