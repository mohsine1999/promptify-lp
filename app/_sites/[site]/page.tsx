import { LandingPage } from "@/components/LandingPage";
import { db } from "@/lib/db/file";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

type PageProps = {
  params: { site: string };
};

export function generateMetadata({ params }: PageProps): Metadata {
  const page = db.findBySlug(params.site);
  if (!page || page.status !== "published") {
    return {};
  }
  const title = page.doc?.seo?.title || page.doc?.hero?.headline || page.doc?.product?.name || page.slug;
  const description = page.doc?.seo?.metaDescription || page.doc?.hero?.subheadline || undefined;
  return {
    title,
    description,
  };
}

export default function SitePage({ params }: PageProps) {
  const page = db.findBySlug(params.site);
  if (!page || page.status !== "published") {
    notFound();
  }
  return <LandingPage doc={page.doc} />;
}
