import type { LPDocument } from "@/lib/schema/page";

type LandingPageProps = {
  doc: LPDocument;
};

export function LandingPage({ doc }: LandingPageProps) {
  const heroImage = doc?.hero?.heroImage;
  const gallery = (doc?.product?.images || []).filter((img) => img?.url && img.url !== heroImage?.url);
  const checkoutFields = doc?.checkout?.fields || [];

  return (
    <div className="preview-wrapper" style={{ marginTop: 16 }}>
      <div dir="rtl" className="preview">
        <div className={`hero${heroImage?.url ? " with-image" : ""}`}>
          <div className="hero-copy">
            <h1>{doc?.hero?.headline}</h1>
            {doc?.hero?.subheadline && <p>{doc.hero.subheadline}</p>}
            {doc?.hero?.bulletPoints?.length ? (
              <ul>{doc.hero.bulletPoints.map((b, i) => (<li key={i}>{b}</li>))}</ul>
            ) : null}
            <a className="cta" href="#checkout">{doc?.hero?.ctaText || "اطلب الآن"}</a>
          </div>
          {heroImage?.url ? (
            <figure className="hero-media">
              <img src={heroImage.url} alt={heroImage.alt || "صورة المنتج"} />
              {heroImage.alt && <figcaption>{heroImage.alt}</figcaption>}
            </figure>
          ) : null}
        </div>
        {gallery.length ? (
          <section className="preview-gallery">
            <h3>معرض الصور</h3>
            <div className="preview-gallery__grid">
              {gallery.map((img, i) => (
                <figure key={i}>
                  <img src={img.url!} alt={img.alt || `صورة ${i + 1}`} />
                  {img.alt && <figcaption>{img.alt}</figcaption>}
                </figure>
              ))}
            </div>
          </section>
        ) : null}
        {doc?.features?.length ? (
          <section className="features">
            <h3>المزايا</h3>
            <div>
              {doc.features.map((f, i) => (
                <div key={i} className="item">
                  <strong>{f.title}</strong>
                  <div>{f.description}</div>
                </div>
              ))}
            </div>
          </section>
        ) : null}
        {doc?.faq?.length ? (
          <section>
            <h3>الأسئلة الشائعة</h3>
            <div>
              {doc.faq.map((qa, i) => (
                <details key={i}>
                  <summary>{qa.q}</summary>
                  <div>{qa.a}</div>
                </details>
              ))}
            </div>
          </section>
        ) : null}
        <section id="checkout">
          <h3>طلب بالدفع عند الاستلام</h3>
          <form className="checkout-form" onSubmit={(e) => e.preventDefault()}>
            <div className="checkout-grid">
              {checkoutFields.map((field, i) => (
                <input
                  key={i}
                  placeholder={field.label}
                  name={field.name}
                  required={field.required}
                  autoComplete={
                    field.name === "name"
                      ? "name"
                      : field.name === "phone"
                      ? "tel"
                      : field.name === "city"
                      ? "address-level2"
                      : field.name === "address"
                      ? "street-address"
                      : undefined
                  }
                />
              ))}
            </div>
            <button className="cta checkout-submit" type="submit">
              {doc?.checkout?.ctaText || "تأكيد الطلب"}
            </button>
          </form>
        </section>
      </div>
    </div>
  );
}
