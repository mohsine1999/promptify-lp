const UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 " +
  "(KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36";

export type ResolvedProduct = {
  status: "OK" | "URL_UNREADABLE" | "NOT_FOUND";
  url: string;
  pageItemId: string | null;
  productId: string | null;
  title: string | null;
  ogTitle: string | null;
  price?: string | null;
  images?: { url: string; alt?: string }[];
  storeName?: string | null;
  selectedSkuId?: string | null;
  variantSummary?: string | null;
  rawOg?: Record<string, string>;
};

function getItemIdFromUrl(u: string) {
  const m = u.match(/\/item\/(\d+)\.html/i);
  return m ? m[1] : null;
}

async function fetchHtml(url: string): Promise<string> {
  for (let i = 0; i < 3; i++) {
    const res = await fetch(url, {
      headers: {
        "user-agent": UA,
        "accept-language": "en-US,en;q=0.8,ar;q=0.7",
        accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
      },
    });
    const text = await res.text();
    if (text && text.length > 5000) return text;
    await new Promise(r=>setTimeout(r, 500));
  }
  throw new Error("Failed to fetch meaningful HTML");
}

function extractOg(html: string): Record<string,string> {
  const out: Record<string,string> = {};
  const re = /<meta[^>]+property=["']og:([^"']+)["'][^>]+content=["']([^"']+)["'][^>]*>/gi;
  let m;
  while ((m = re.exec(html))) { out[m[1]] = m[2]; }
  return out;
}

function pickJsonBlocks(html: string) {
  const runParams: any[] = [];
  const rpRegex = /window\.runParams\s*=\s*(\{[\s\S]*?\});/g;
  for (let m; (m = rpRegex.exec(html)); ) {
    try { runParams.push(JSON.parse(m[1].replace(/;\s*$/, ""))); } catch {}
  }

  const jsonLd: any[] = [];
  const ldRegex = /<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;
  for (let m; (m = ldRegex.exec(html)); ) {
    try {
      const obj = JSON.parse(m[1]);
      const arr = Array.isArray(obj) ? obj : [obj];
      for (const it of arr) {
        if (it && (it["@type"] === "Product" || it["@type"]?.includes?.("Product"))) {
          jsonLd.push(it);
        }
      }
    } catch {}
  }
  return { runParams, jsonLd };
}

function resolveFromRunParams(blocks: any[], pageItemId: string | null, url: string) {
  for (const rp of blocks) {
    const data = rp?.data || rp?.page || rp;
    const productId =
      data?.productId?.toString?.() ||
      data?.pageModule?.productId?.toString?.() ||
      data?.seoModule?.productId?.toString?.() || null;
    const title =
      data?.seoModule?.productTitle ||
      data?.title ||
      data?.pageModule?.title || null;
    const storeName =
      data?.storeModule?.storeName ||
      data?.sellerModule?.shopName ||
      data?.sellerModule?.storeName || null;
    const price =
      data?.priceModule?.formatedActivityPrice ||
      data?.priceModule?.formatedPrice ||
      data?.price || null;

    if (!pageItemId || (productId && productId === pageItemId)) {
      const skuIdMatch = url.match(/[?&]sku_id=([^&]+)/i);
      const selectedSkuId = skuIdMatch ? decodeURIComponent(skuIdMatch[1]) : null;

      let variantSummary: string | null = null;
      if (selectedSkuId && data?.skuModule?.skuInfoMap) {
        const skuMap = data.skuModule.skuInfoMap;
        const hit = Object.values(skuMap).find((v: any) =>
          v?.skuId?.toString?.() === selectedSkuId || v?.skuPropIds?.includes?.(selectedSkuId)
        ) as any;
        if (hit?.skuPropIds && Array.isArray(data?.skuModule?.productSKUPropertyList)) {
          const propIds = hit.skuPropIds.split(";").filter(Boolean);
          const props = data.skuModule.productSKUPropertyList
            .map((p: any) => {
              const cho = p?.skuPropertyValues?.find((v: any) =>
                propIds.includes(v?.propertyValueId?.toString?.())
              );
              return cho ? `${p.skuPropertyName}: ${cho.propertyValueDisplayName || cho.propertyValueName}` : null;
            })
            .filter(Boolean)
            .join(" · ");
          variantSummary = props || null;
        }
      }

      const images: {url:string, alt?:string}[] = [];
      const gallery = data?.imageModule?.imagePathList || data?.imageModule?.images || [];
      if (Array.isArray(gallery)) {
        for (const it of gallery) {
          if (typeof it === "string") images.push({ url: it });
          else if (it?.imgUrl) images.push({ url: it.imgUrl, alt: it?.alt || "" });
        }
      }

      return { productId: productId || pageItemId || null, title, storeName, selectedSkuId, variantSummary, price, images };
    }
  }
  return null;
}

function resolveFromJsonLd(blocks: any[], pageItemId: string | null) {
  for (const p of blocks) {
    const name = p?.name || p?.headline || null;
    const pid = p?.sku?.toString?.() || p?.productID?.toString?.() || p?.mpn?.toString?.() || null;
    const offers = p?.offers;
    const price = offers?.price || offers?.lowPrice || offers?.highPrice || null;
    const images = Array.isArray(p?.image) ? p.image.map((u:string)=>({url:u})) : p?.image ? [{url:p.image}] : [];
    if (!pageItemId || (pid && pid === pageItemId)) {
      return { productId: pid || pageItemId || null, title: name || null, price, images };
    }
  }
  return null;
}

export async function resolveProduct(url: string): Promise<ResolvedProduct> {
  const pageItemId = getItemIdFromUrl(url);
  let html: string;
  try {
    html = await fetchHtml(url);
  } catch {
    return { status: "URL_UNREADABLE", url, pageItemId, productId: null, title: null, ogTitle: null };
  }

  const og = extractOg(html);
  const ogTitle = og?.title || og?.["title"] || null;
  const { runParams, jsonLd } = pickJsonBlocks(html);

  const rp = resolveFromRunParams(runParams, pageItemId, url);
  if (rp?.productId || rp?.title) {
    return { status: "OK", url, pageItemId, ogTitle, rawOg: og,
      productId: rp.productId, title: rp.title, storeName: rp.storeName,
      selectedSkuId: rp.selectedSkuId, variantSummary: rp.variantSummary,
      price: rp.price, images: rp.images };
  }

  const ld = resolveFromJsonLd(jsonLd, pageItemId);
  if (ld?.productId || ld?.title) {
    return { status: "OK", url, pageItemId, ogTitle, rawOg: og,
      productId: ld.productId, title: ld.title, price: ld.price, images: ld.images };
  }

  if (ogTitle) {
    return { status: "OK", url, pageItemId, ogTitle, rawOg: og,
      productId: pageItemId, title: ogTitle, price: og?.price || null, images: og?.image ? [{url: og.image}] : [] };
  }

  return { status: "NOT_FOUND", url, pageItemId, ogTitle: null, productId: null, title: null };
}
