export const runtime = "nodejs";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { resolveProduct } from "@/lib/resolve/product";
import { generateWithOpenAI, generateWithGemini } from "@/lib/ai/providers";
import { LPDocument } from "@/lib/schema/page";
import { db } from "@/lib/db/file";

const BodySchema = z.object({
  productUrl: z.string().url(),
  brief: z.string().optional(),
  dialect: z.enum(["ar-msa","ar-darija"]).optional(),
  provider: z.enum(["openai","gemini"]).optional(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { productUrl, brief, dialect, provider } = BodySchema.parse(body);

    const resolved = await resolveProduct(productUrl);
    if (resolved.status !== "OK" || !resolved.title) {
      return NextResponse.json({ ok: false, error: "FAILED_TO_RESOLVE_MAIN_PRODUCT" }, { status: 400 });
    }

    let doc: LPDocument | null = null;
    const want = provider || "openai";

    if (want === "openai") {
      try {
        doc = await generateWithOpenAI({ dialect, brief: brief || null, resolved });
      } catch (e:any) {
        if (process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY) {
          doc = await generateWithGemini({ dialect, brief: brief || null, resolved });
        } else { throw e; }
      }
    } else {
      try {
        doc = await generateWithGemini({ dialect, brief: brief || null, resolved });
      } catch (e:any) {
        doc = await generateWithOpenAI({ dialect, brief: brief || null, resolved });
      }
    }

    // Guard: ensure must-have sections present (filled in providers ensureComplete too)
    if (!doc?.hero?.headline || !doc?.features?.length || !doc?.faq?.length) {
      return NextResponse.json({ ok: false, error: "PROVIDER_RETURNED_INCOMPLETE_DOC" }, { status: 500 });
    }

    const page = db.create({ doc });
    return NextResponse.json({ ok: true, id: page.id });
  } catch (err:any) {
    console.error(err);
    return NextResponse.json({ ok: false, error: err?.message || "GENERATION_FAILED" }, { status: 400 });
  }
}
