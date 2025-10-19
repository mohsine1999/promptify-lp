import type { ResolvedProduct } from "./product";

function safeDecode(segment: string): string {
  try {
    return decodeURIComponent(segment);
  } catch {
    return segment;
  }
}

function prettifySegment(seg: string | null): string | null {
  if (!seg) return null;
  const trimmed = seg.replace(/\.[a-z0-9]{2,4}$/i, "");
  const spaced = trimmed.replace(/[-_]+/g, " ");
  const decoded = safeDecode(spaced);
  const cleaned = decoded.replace(/\s+/g, " ").trim();
  return cleaned || null;
}

export function fallbackResolvedProduct(
  url: string,
  existing?: Partial<ResolvedProduct>
): ResolvedProduct | null {
  try {
    const normalized = url.trim();
    const u = (() => {
      try {
        return new URL(normalized);
      } catch {
        if (!/^https?:\/\//i.test(normalized)) {
          return new URL(`https://${normalized}`);
        }
        throw new Error("UNPARSEABLE_URL");
      }
    })();
    const hostRaw = u.hostname || "";
    const host = hostRaw.replace(/^www\./i, "");
    const segments = u.pathname.split("/").filter(Boolean);
    const lastSegment = segments.length ? segments[segments.length - 1] : null;

    const inferredTitle =
      existing?.title ??
      existing?.ogTitle ??
      prettifySegment(lastSegment) ??
      (host || hostRaw || normalized);

    return {
      status: "OK",
      url,
      pageItemId: existing?.pageItemId ?? null,
      productId: existing?.productId ?? lastSegment ?? host,
      title: inferredTitle,
      ogTitle: existing?.ogTitle ?? null,
      price: existing?.price ?? null,
      images: existing?.images ?? [],
      storeName: existing?.storeName ?? host,
      selectedSkuId: existing?.selectedSkuId ?? null,
      variantSummary: existing?.variantSummary ?? null,
      rawOg: existing?.rawOg ?? undefined,
    };
  } catch {
    return null;
  }
}
