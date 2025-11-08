export const runtime = "nodejs";
export const maxDuration = 60;
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { randomUUID } from "crypto";

import { resolveProduct } from "@/lib/resolve/product";
import { fallbackResolvedProduct } from "@/lib/resolve/fallback";
import { generateWithOpenAI, generateWithGemini } from "@/lib/ai/providers";
import type { LPDocument } from "@/lib/schema/page";
import { db } from "@/lib/db/file";

const BodySchema = z.object({
  productUrl: z.string().url(),
  brief: z.string().optional(),
  dialect: z.enum(["ar-msa", "ar-darija"]).optional(),
  provider: z.enum(["openai", "gemini"]).optional(),
});

export async function GET() {
  const haveOpenAI = !!process.env.OPENAI_API_KEY;
  const haveGemini = !!(process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY);
  return NextResponse.json({
    ok: true,
    env: {
      OPENAI_API_KEY: haveOpenAI ? "present" : "missing",
      GEMINI_OR_GOOGLE_API_KEY: haveGemini ? "present" : "missing",
    },
  });
}

export async function POST(req: NextRequest) {
  try {
    const json = await req.json().catch(() => null);
    const parsed = BodySchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json(
        { ok: false, error: "INVALID_BODY", issues: parsed.error.issues },
        { status: 400 }
      );
    }
    const { productUrl, brief, dialect, provider } = parsed.data;

    let resolved = await resolveProduct(productUrl).catch((error: unknown) => {
      console.error("resolveProduct failed:", error);
      return null;
    });

    if (!resolved || resolved.status !== "OK" || !resolved.title) {
      const fallback = fallbackResolvedProduct(productUrl, resolved ?? undefined);
      if (fallback) {
        resolved = fallback;
      }
    }

    if (!resolved || resolved.status !== "OK" || !resolved.title) {
      return NextResponse.json(
        { ok: false, error: "FAILED_TO_RESOLVE_MAIN_PRODUCT" },
        { status: 400 }
      );
    }

    const haveOpenAI = !!process.env.OPENAI_API_KEY;
    const haveGemini = !!(process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY);

    if (provider === "openai" && !haveOpenAI && !haveGemini) {
      return NextResponse.json(
        { ok: false, error: "NO_MODEL_KEYS_FOR_OPENAI_OR_FALLBACK" },
        { status: 500 }
      );
    }

    if (provider === "gemini" && !haveGemini && !haveOpenAI) {
      return NextResponse.json(
        { ok: false, error: "NO_MODEL_KEYS_FOR_GEMINI_OR_FALLBACK" },
        { status: 500 }
      );
    }

    let doc: LPDocument | null = null;
    const want: "openai" | "gemini" = provider || "openai";

    if (want === "openai") {
      try {
        doc = await generateWithOpenAI({ dialect, brief: brief || null, resolved });
      } catch (error: unknown) {
        if (haveGemini) {
          console.warn("OpenAI generation failed, falling back to Gemini:", (error as Error)?.message ?? error);
          doc = await generateWithGemini({ dialect, brief: brief || null, resolved });
        } else {
          throw error;
        }
      }
    } else {
      try {
        doc = await generateWithGemini({ dialect, brief: brief || null, resolved });
      } catch (error: unknown) {
        if (haveOpenAI) {
          console.warn("Gemini generation failed, falling back to OpenAI:", (error as Error)?.message ?? error);
          doc = await generateWithOpenAI({ dialect, brief: brief || null, resolved });
        } else {
          throw error;
        }
      }
    }

    if (!doc?.hero?.headline || !doc?.features?.length || !doc?.faq?.length) {
      return NextResponse.json(
        { ok: false, error: "PROVIDER_RETURNED_INCOMPLETE_DOC" },
        { status: 500 }
      );
    }

    let id: string = randomUUID();
    try {
      const page = await db.create({ doc });
      if (page?.id) id = page.id;
    } catch (error: unknown) {
      console.error(
        "db.create failed (database persistence issue is likely):",
        (error as Error)?.message ?? error
      );
    }

    return NextResponse.json({ ok: true, id }, { status: 200 });
  } catch (error: unknown) {
    console.error("generate route error:", error);
    const isZodError = (error as { name?: string })?.name === "ZodError";
    const status = isZodError ? 400 : 500;
    const message = isZodError ? "INVALID_BODY" : (error as Error)?.message ?? "GENERATION_FAILED";
    return NextResponse.json({ ok: false, error: message }, { status });
  }
}
