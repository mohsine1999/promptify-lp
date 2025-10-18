import { z } from "zod";

export const LPSectionImage = z.object({
  url: z.string().url().optional(),
  alt: z.string().optional(),
});

export const LPFAQ = z.object({ q: z.string(), a: z.string() });

export const LPHero = z.object({
  headline: z.string(),
  subheadline: z.string().optional(),
  bulletPoints: z.array(z.string()).max(8).default([]),
  heroImage: LPSectionImage.optional(),
  ctaText: z.string().default("اطلب الآن"),
});

export const LPFeature = z.object({
  title: z.string(),
  description: z.string(),
  iconHint: z.string().optional(),
});

export const LPTestimonial = z.object({
  name: z.string().default("عميل موثوق"),
  quote: z.string(),
  rating: z.number().min(1).max(5).default(5),
  avatar: LPSectionImage.optional(),
});

export const LPCheckout = z.object({
  codEnabled: z.boolean().default(true),
  fields: z.array(z.object({
    name: z.enum(["name","phone","city","address"]).default("name"),
    label: z.string(),
    required: z.boolean().default(true),
  })).default([
    { name: "name", label: "الاسم الكامل", required: true },
    { name: "phone", label: "رقم الهاتف", required: true },
    { name: "city", label: "المدينة", required: true },
    { name: "address", label: "العنوان", required: false },
  ]),
  ctaText: z.string().default("تأكيد الطلب بالدفع عند الاستلام"),
});

export const LPSEO = z.object({
  title: z.string().optional(),
  metaDescription: z.string().optional(),
  keywords: z.array(z.string()).optional(),
});

export const LPDocument = z.object({
  language: z.enum(["ar-msa","ar-darija"]).default("ar-msa"),
  product: z.object({
    name: z.string(),
    price: z.string().optional(),
    images: z.array(LPSectionImage).optional(),
    badges: z.array(z.string()).optional(),
  }),
  hero: LPHero,
  features: z.array(LPFeature).default([]),
  testimonials: z.array(LPTestimonial).default([]),
  faq: z.array(LPFAQ).default([]),
  checkout: LPCheckout,
  seo: LPSEO.optional(),
  legal: z.object({
    disclaimers: z.array(z.string()).optional(),
    returnPolicy: z.string().optional(),
  }).optional(),
});

export type LPDocument = z.infer<typeof LPDocument>;
