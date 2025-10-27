import type { CSSProperties } from "react";
import type { LPDocument } from "@/lib/schema/page";

type LandingPageProps = {
  doc: LPDocument;
};

export function LandingPage({ doc }: LandingPageProps) {
  const heroImage = doc?.hero?.heroImage;
  const heroVideo = doc?.hero?.heroVideo;
  const heroTypography = doc?.hero?.typography;
  const gallery = (doc?.product?.images || []).filter((img) => img?.url && img.url !== heroImage?.url);
  const checkoutFields = doc?.checkout?.fields || [];

  type HeroStyleVars = CSSProperties & {
    "--hero-copy-color"?: string;
    "--hero-copy-muted-color"?: string;
    "--hero-copy-accent-color"?: string;
    "--hero-copy-marker-color"?: string;
    "--hero-headline-size"?: string | number;
    "--hero-copy-width"?: string | number;
  };

  const heroStyleVars: HeroStyleVars = {};
  if (heroTypography?.color) {
    const color = heroTypography.color;
    heroStyleVars["--hero-copy-color"] = color;
    heroStyleVars["--hero-copy-muted-color"] = color;
    heroStyleVars["--hero-copy-accent-color"] = color;
    heroStyleVars["--hero-copy-marker-color"] = color;
  }
  if (heroTypography?.fontSize) {
    heroStyleVars["--hero-headline-size"] = heroTypography.fontSize;
  }
  if (heroTypography?.maxWidth) {
    heroStyleVars["--hero-copy-width"] = heroTypography.maxWidth;
  }

  const renderHeroMedia = () => {
    if (heroVideo?.url) {
      const autoplay = heroVideo.autoplay ?? false;
      const muted = heroVideo.muted ?? autoplay;
      const loop = heroVideo.loop ?? false;
      return (
        <figure className="hero-media">
          <video
            controls
            autoPlay={autoplay}
            muted={muted}
            loop={loop}
            playsInline
            poster={heroVideo.poster || heroImage?.url}
          >
            <source src={heroVideo.url} />
            متصفحك لا يدعم تشغيل الفيديو.
          </video>
          {(heroVideo.caption || heroImage?.alt) && (
            <figcaption>{heroVideo.caption || heroImage?.alt}</figcaption>
          )}
        </figure>
      );
    }

    if (heroImage?.url) {
      return (
        <figure className="hero-media">
          <img src={heroImage.url} alt={heroImage.alt || "صورة المنتج"} />
          {heroImage.alt && <figcaption>{heroImage.alt}</figcaption>}
        </figure>
      );
    }

    return null;
  };

  return (
    <div className="preview-wrapper" style={{ marginTop: 16 }}>
      <div dir="rtl" className="preview">
        <div className={`hero${(heroVideo?.url || heroImage?.url) ? " with-image" : ""}`}>
          <div className="hero-copy" style={heroStyleVars}>
            <h1>{doc?.hero?.headline}</h1>
            {doc?.hero?.subheadline && <p>{doc.hero.subheadline}</p>}
            {doc?.hero?.bulletPoints?.length ? (
              <ul>{doc.hero.bulletPoints.map((b, i) => (<li key={i}>{b}</li>))}</ul>
            ) : null}
            <a className="cta" href="#checkout">{doc?.hero?.ctaText || "اطلب الآن"}</a>
          </div>
          {renderHeroMedia()}
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
