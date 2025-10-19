import OpenAI from "openai";
import { GoogleGenAI, Type } from "@google/genai";
import { LPDocument } from "@/lib/schema/page";
import type { ResolvedProduct } from "@/lib/resolve/product";

const OPENAI_MODEL = process.env.OPENAI_MODEL || "gpt-4o-mini";
const GEMINI_MODEL = process.env.GEMINI_MODEL || "gemini-2.5-flash";

const SYSTEM_TEXT = [
  "أنت منشئ صفحات هبوط عربية للتجارة الإلكترونية بنظام الدفع عند الاستلام (COD).",
  "المصدر الوحيد للمعلومات الحقائقية: resolvedProduct (العنوان/السعر/الصور/المتجر/الخصائص).",
  "أنشئ نسخة تسويقية عربية موجزة ومقنعة (RTL).",
  "املأ جميع الحقول المطلوبة؛ لا تترك الحقول الأساسية فارغة.",
  "إن لم تتوفر معلومة (مثل السعر)، ضَعها null فقط، لكن استمر بإنتاج بقية الأقسام الإبداعية (Hero, Features, FAQ).",
  "قواعد الأسلوب: عنوان قوي، وصف قصير، 3–5 نقاط، 4 مزايا، 4 أسئلة شائعة، CTA واضح.",
].join("\n");

export type GenerateParams = {
  dialect?: "ar-msa"|"ar-darija";
  brief?: string | null;
  resolved: ResolvedProduct;
};

function ensureComplete(doc: Partial<LPDocument>, resolved: ResolvedProduct, dialect: string, brief?: string | null): LPDocument {
  const name = resolved.title || "منتج";
  const price = resolved.price || undefined;
  const images = (resolved.images && resolved.images.length ? resolved.images.slice(0,4) : undefined);

  const hero = doc.hero || {
    headline: name,
    subheadline: brief ? `لمحة: ${brief}` : `حلّ عملي لمشكلتك اليومية مع ${name}`,
    bulletPoints: [
      "جودة موثوقة للاستخدام اليومي",
      price ? `سعر مناسب: ${price}` : "قيمة ممتازة مقابل السعر",
      "تسليم سريع وخدمة ما بعد البيع",
    ],
    ctaText: "اطلب الآن"
  };

  const features = (doc.features && doc.features.length ? doc.features : [
    { title: "راحة الاستخدام", description: `مصمم ليوفّر لك سهولة وسرعة مع ${name}.` },
    { title: "مواد متينة", description: "تحمّل طويل وأداء ثابت طوال اليوم." },
    { title: "نتائج ملموسة", description: "تلاحظ الفرق منذ الاستعمال الأول." },
    { title: "مناسب للجميع", description: "تصميم يناسب مختلف الأعمار والاحتياجات." },
  ]);

  const faq = (doc.faq && doc.faq.length ? doc.faq : [
    { q: "كم يستغرق الوصول؟", a: "عادةً من 2 إلى 7 أيام عمل حسب المدينة." },
    { q: "هل يوجد استبدال أو إرجاع؟", a: "نعم خلال 7 أيام في حال وجود عيب مصنعي." },
    { q: "هل يمكن الدفع عند الاستلام؟", a: "نعم، نوفر خدمة الدفع عند الاستلام." },
    { q: "كيف أتتبع طلبي؟", a: "سنتواصل معك هاتفياً لتأكيد الطلب والمتابعة." },
  ]);

  const checkout = doc.checkout || {
    codEnabled: true,
    fields: [
      { name:"name", label:"الاسم الكامل", required:true },
      { name:"phone", label:"رقم الهاتف", required:true },
      { name:"city", label:"المدينة", required:true },
      { name:"address", label:"العنوان", required:false },
    ],
    ctaText: "تأكيد الطلب بالدفع عند الاستلام"
  };

  const seo = doc.seo || {
    title: name,
    metaDescription: brief ? brief : `اكتشف ${name} الآن!`,
    keywords: [name, "عرض خاص", "دفع عند الاستلام"]
  };

  return {
    language: (doc as any).language || (dialect as any) || "ar-msa",
    product: {
      name,
      price,
      images,
      badges: (doc.product && doc.product.badges) || []
    },
    hero, features, testimonials: doc.testimonials || [], faq, checkout,
    seo, legal: doc.legal
  };
}

/* ---------------- OpenAI (function calling) ---------------- */
export async function generateWithOpenAI(params: GenerateParams): Promise<LPDocument> {
  const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  const dialect = params.dialect || "ar-msa";

  const tools: OpenAI.Chat.Completions.ChatCompletionTool[] = [{
    type: "function",
    function: {
      name: "produce_lp",
      description: "إنشاء صفحة هبوط عربية كاملة وفق مخطط LPDocument مع أقسام: hero (3-5 نقاط)، 4 features، 4 faq، checkout COD.",
      parameters: {
        type: "object",
        properties: {
          language: { type: "string", enum: ["ar-msa","ar-darija"] },
          product: {
            type: "object",
            properties: {
              name: { type: "string" },
              price: { type: "string" },
              images: { type: "array", items: { type: "object", properties: { url:{type:"string"}, alt:{type:"string"} } } },
              badges: { type: "array", items: { type: "string" } }
            },
            required: ["name"]
          },
          hero: {
            type: "object",
            properties: {
              headline: { type: "string" },
              subheadline: { type: "string" },
              bulletPoints: { type: "array", items: { type: "string" }, minItems: 3, maxItems: 8 },
              heroImage: { type: "object", properties: { url:{type:"string"}, alt:{type:"string"} } },
              ctaText: { type: "string" }
            },
            required: ["headline","ctaText","bulletPoints"]
          },
          features: {
            type: "array",
            items: {
              type: "object",
              properties: { title:{type:"string"}, description:{type:"string"}, iconHint:{type:"string"} },
              required: ["title","description"]
            },
            minItems: 4
          },
          testimonials: {
            type: "array",
            items: {
              type: "object",
              properties: {
                name:{type:"string"}, quote:{type:"string"}, rating:{type:"number"},
                avatar:{ type:"object", properties:{ url:{type:"string"}, alt:{type:"string"} } }
              },
              required: ["quote"]
            }
          },
          faq: {
            type: "array",
            items: { type: "object", properties: { q:{type:"string"}, a:{type:"string"} }, required:["q","a"] },
            minItems: 4
          },
          checkout: {
            type: "object",
            properties: {
              codEnabled: { type: "boolean" },
              fields: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    name: { type: "string", enum: ["name","phone","city","address"] },
                    label: { type: "string" },
                    required: { type: "boolean" }
                  },
                  required: ["name","label"]
                }
              },
              ctaText: { type: "string" }
            },
            required: ["codEnabled","fields","ctaText"]
          },
          seo: {
            type: "object",
            properties: {
              title: { type: "string" },
              metaDescription: { type: "string" },
              keywords: { type: "array", items: { type: "string" } }
            }
          },
          legal: {
            type: "object",
            properties: {
              disclaimers: { type: "array", items: { type: "string" } },
              returnPolicy: { type: "string" }
            }
          }
        },
        required: ["language","product","hero","features","faq","checkout"]
      }
    }
  }];

  const userPayload = {
    dialect,
    brief: params.brief || null,
    resolvedProduct: params.resolved
  };

  const completion = await client.chat.completions.create({
    model: OPENAI_MODEL,
    temperature: 0.3,
    messages: [
      { role: "system", content: SYSTEM_TEXT },
      { role: "user", content: JSON.stringify(userPayload) }
    ],
    tools,
    tool_choice: "auto",
  });

  const choice = completion.choices[0];
  let doc: Partial<LPDocument> = {};
  const tc = choice.message.tool_calls?.[0];
  if (tc?.function?.arguments) {
    try { doc = JSON.parse(tc.function.arguments); } catch {}
  } else if (choice.message.content) {
    try { doc = JSON.parse(choice.message.content); } catch {}
  }

  return ensureComplete(doc as LPDocument, params.resolved, dialect, params.brief);
}

/* ---------------- Gemini (structured output) ---------------- */
export async function generateWithGemini(params: GenerateParams): Promise<LPDocument> {
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY });
  const dialect = params.dialect || "ar-msa";

  const LP_RESPONSE_SCHEMA = {
    type: Type.OBJECT,
    properties: {
      language: { type: Type.STRING, enum: ["ar-msa","ar-darija"] },
      product: { type: Type.OBJECT, properties: {
        name: { type: Type.STRING }, price: { type: Type.STRING },
        images: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { url:{type: Type.STRING}, alt:{type: Type.STRING} } } },
        badges: { type: Type.ARRAY, items: { type: Type.STRING } }
      }, required: ["name"] },
      hero: { type: Type.OBJECT, properties: {
        headline: { type: Type.STRING }, subheadline: { type: Type.STRING },
        bulletPoints: { type: Type.ARRAY, items: { type: Type.STRING } },
        heroImage: { type: Type.OBJECT, properties: { url:{type: Type.STRING}, alt:{type: Type.STRING} } },
        ctaText: { type: Type.STRING }
      }, required: ["headline","ctaText","bulletPoints"] },
      features: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: {
        title: { type: Type.STRING }, description: { type: Type.STRING }, iconHint: { type: Type.STRING }
      }, required: ["title","description"] }, },
      testimonials: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: {
        name: { type: Type.STRING }, quote: { type: Type.STRING }, rating: { type: Type.NUMBER },
        avatar: { type: Type.OBJECT, properties: { url: { type: Type.STRING }, alt: { type: Type.STRING } } }
      }, required: ["quote"] } },
      faq: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: {
        q: { type: Type.STRING }, a: { type: Type.STRING }
      }, required: ["q","a"] } },
      checkout: { type: Type.OBJECT, properties: {
        codEnabled: { type: Type.BOOLEAN },
        fields: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: {
          name: { type: Type.STRING, enum: ["name","phone","city","address"] }, label: { type: Type.STRING }, required: { type: Type.BOOLEAN }
        }, required: ["name","label"] } },
        ctaText: { type: Type.STRING }
      }, required: ["codEnabled","fields","ctaText"] },
      seo: { type: Type.OBJECT, properties: {
        title: { type: Type.STRING }, metaDescription: { type: Type.STRING }, keywords: { type: Type.ARRAY, items: { type: Type.STRING } }
      }},
      legal: { type: Type.OBJECT, properties: {
        disclaimers: { type: Type.ARRAY, items: { type: Type.STRING } }, returnPolicy: { type: Type.STRING }
      }}
    },
    required: ["language","product","hero","features","faq","checkout"]
  } as const;

  const payload = {
    dialect,
    brief: params.brief || null,
    resolvedProduct: params.resolved,
    instructions: "املأ جميع الحقول المطلوبة. التزم بـ 3–5 نقاط في البطل، 4 مزايا، 4 أسئلة شائعة. لا تُرجع حقولاً فارغة إن أمكن."
  };

  const res = await ai.models.generateContent({
  model: GEMINI_MODEL,
  contents: [
    {
      role: "user",
      parts: [{ text: `${SYSTEM_TEXT}\n\n${JSON.stringify(payload)}` }],
    },
  ],
  config: {
    responseMimeType: "application/json",
    responseSchema: LP_RESPONSE_SCHEMA as any,
    temperature: 0.3,
  },
});

  let doc: Partial<LPDocument> = {};
  const raw = res.text ?? "{}";       // <= default when undefined
  try { doc = JSON.parse(raw); } catch {}
  return ensureComplete(doc as LPDocument, params.resolved, dialect, params.brief);
}
