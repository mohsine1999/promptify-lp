import Link from "next/link";

const workflowSteps = [
  {
    title: "أرسل الرابط",
    description:
      "انسخ رابط المنتج من أي متجر إلكتروني، ودع Promptify يجمع كل المواصفات والصور خلال ثوانٍ.",
    icon: "🔗",
  },
  {
    title: "خصص التجربة",
    description:
      "اختر اللهجة، وحدد شخصية العلامة التجارية، ثم عدل الأقسام الجاهزة بإضافة المزايا والشهادات.",
    icon: "🎛️",
  },
  {
    title: "انشر فوراً",
    description:
      "احصل على معاينة فورية مع نموذج طلب متكامل، وشارك الرابط مع فريق الإعلانات أو عملائك مباشرة.",
    icon: "🚀",
  },
];

const uspHighlights = [
  {
    title: "مكتبة أقسام ذكية",
    description:
      "قوالب جاهزة للمنتجات الفيزيائية والخدمات الرقمية، مع اقتراحات محتوى مترابطة تدعم SEO باللغة العربية.",
  },
  {
    title: "تحليلات في الوقت الحقيقي",
    description: "راقب أداء النسخ المختلفة وتتبع نسب التحويل من داخل لوحة التحكم دون أكواد إضافية.",
  },
  {
    title: "تعاون سلس",
    description: "شارك مسودات الصفحات مع فريقك، حدّد الصلاحيات، وراجع التعديلات باعتماد نظام التعليقات.",
  },
];

const faqs = [
  {
    question: "هل يدعم Promptify أكثر من لهجة عربية؟",
    answer:
      "نعم، يمكنك توليد المحتوى بالفصحى أو لهجات خليجية، مصرية، مغاربية، وحتى تخصيص النبرة لتناسب جمهورك المستهدف.",
  },
  {
    question: "كيف أحافظ على هوية العلامة التجارية؟",
    answer:
      "المحرر يتيح لك حفظ لوحات ألوان وخطوط مفضلة، ويطبقها تلقائياً على الأقسام مع إمكانية التبديل بين الوضعين الداكن والفاتح.",
  },
  {
    question: "هل يمكن التعديل بعد نشر الصفحة؟",
    answer:
      "بالتأكيد، أي تحديث تقوم به في المحرر ينعكس مباشرة على النسخة المنشورة، مع سجل كامل للرجوع للنسخ السابقة.",
  },
];

export default function Home() {
  return (
    <main className="landing-page" dir="rtl">
      <section className="card hero-card">
        <div className="hero-glow" aria-hidden />
        <div className="badge-row">
          <span className="badge">⚡ توليد فوري</span>
          <span className="badge">🤖 ذكاء اصطناعي متعدد المزودين</span>
          <span className="badge">🎨 هوية بصرية مخصصة</span>
        </div>
        <div className="hero-text">
          <h1 className="hero-title">Promptify – أنشئ صفحات هبوط عربية متكاملة في دقائق</h1>
          <p className="hero-subtitle">
            منصة متكاملة تجمع بين توليد المحتوى العربي، تصميم متوافق مع الهوية، وأدوات تعاون في الوقت الحقيقي. صُممت
            خصيصاً لفرق التسويق العربية التي تحتاج لإطلاق حملات بسرعة وثبات في الأداء.
          </p>
        </div>
        <div className="hero-actions">
          <Link className="btn primary" href="/generate">
            ابدأ توليد صفحة جديدة
          </Link>
          <Link className="btn ghost" href="/dashboard">
            تصفح الصفحات المحفوظة
          </Link>
          <Link className="btn success" href="/editor">
            جرّب المحرر مباشرة
          </Link>
        </div>
        <div className="hero-metrics">
          <div className="hero-metric">
            <span className="hero-metric__value">+120</span>
            <span className="hero-metric__label">صفحات منجزة أسبوعياً بفضل الأتمتة</span>
          </div>
          <div className="hero-metric">
            <span className="hero-metric__value">5 دقائق</span>
            <span className="hero-metric__label">متوسط الوقت من الرابط إلى المعاينة الجاهزة</span>
          </div>
          <div className="hero-metric">
            <span className="hero-metric__value">98٪</span>
            <span className="hero-metric__label">تناسق في الهوية البصرية بين الوضعين الداكن والفاتح</span>
          </div>
        </div>
        <div className="hero-trust">
          <div className="hero-trust__avatars">
            <span className="avatar">SA</span>
            <span className="avatar">AE</span>
            <span className="avatar">QA</span>
            <span className="avatar">EG</span>
          </div>
          <p className="hero-trust__copy">
            يعتمد أكثر من <strong>40 فريق تسويق</strong> في الخليج وشمال أفريقيا على Promptify لتسريع إطلاق الصفحات.
          </p>
        </div>
      </section>

      <section className="card highlight-card">
        <div className="highlight-card__header">
          <span className="badge badge-soft">💡 لماذا Promptify</span>
          <h2>تجربة مصممة للغة العربية منذ السطر الأول</h2>
          <p className="section-subtitle">
            واجهة RTL بالكامل، مع محرر يضبط الهوية البصرية تلقائياً ويمنح فريقك سيطرة كاملة على المحتوى دون أي مجهود
            هندسي.
          </p>
        </div>
        <div className="highlight-grid">
          {uspHighlights.map((highlight) => (
            <div className="highlight-card__item" key={highlight.title}>
              <h3>{highlight.title}</h3>
              <p>{highlight.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="card workflow-card">
        <div className="workflow-header">
          <span className="badge badge-soft">🔁 رحلة العمل</span>
          <h2>من رابط المنتج إلى صفحة جاهزة للنشر خلال ثلاث خطوات</h2>
        </div>
        <div className="workflow-timeline">
          {workflowSteps.map((step, index) => (
            <div className="workflow-step" key={step.title}>
              <div className="workflow-step__icon" aria-hidden>
                {step.icon}
              </div>
              <div className="workflow-step__body">
                <div className="workflow-step__heading">
                  <span className="workflow-step__index">{index + 1}</span>
                  <h3>{step.title}</h3>
                </div>
                <p>{step.description}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="info-banner">
          <strong>تكامل تام مع الذكاء الاصطناعي</strong>
          <span className="small">
            ألصق رابط المنتج، اختر اللهجة ومزوّد الذكاء الاصطناعي المفضل لديك (OpenAI، Gemini، أو الاثنين معاً). يقوم
            Promptify بجلب البيانات، تحرير الصور، توليد النصوص، ويمنحك صفحة متكاملة مع إمكانية التعديل في أي لحظة.
          </span>
        </div>
      </section>

      <section className="experience-card">
        <div className="experience-card__visual" aria-hidden>
          <div className="experience-glow" />
          <div className="experience-screenshot">
            <div className="screenshot-toolbar">
              <span className="dot" />
              <span className="dot" />
              <span className="dot" />
              <span className="toolbar-label">معاينة الصفحة</span>
            </div>
            <div className="screenshot-content">
              <h3>"منتجك جاهز للعرض"</h3>
              <p>
                تصميم متجاوب بالكامل مع نموذج طلب محسّن للأجهزة المحمولة، يدعم تغيير الثيم ولغات متعددة في الوقت
                نفسه.
              </p>
              <div className="screenshot-tags">
                <span>وضع داكن</span>
                <span>RTL أصيل</span>
                <span>تحليل التحويلات</span>
              </div>
            </div>
          </div>
        </div>
        <div className="experience-card__copy">
          <span className="badge badge-soft">🎯 تجربة التحرير</span>
          <h2>واجهة تحرير بصرية تعكس الهوية وتدعم فريقك</h2>
          <ul className="experience-list">
            <li>إدارة ألوان وخطوط العلامة التجارية مع معاينة مباشرة للوضعين الداكن والفاتح.</li>
            <li>محرر أقسام سحب وإفلات مع اقتراحات جاهزة باللغة العربية واللهجات المحلية.</li>
            <li>نظام تعليقات لمشاركة الملاحظات بين كتاب المحتوى ومديري الحملات.</li>
          </ul>
        </div>
      </section>

      <section className="card testimonials-card">
        <div className="testimonials-header">
          <span className="badge badge-soft">💬 ماذا يقول عملاؤنا</span>
          <h2>صُمم لفرق النمو العربية التي تحتاج سرعة وثباتاً</h2>
        </div>
        <div className="testimonial-grid">
          <article className="testimonial">
            <p>
              "استخدمنا Promptify لإطلاق 6 صفحات خلال أسبوع واحد مع لهجات مختلفة لنفس المنتج. التناسق البصري والقدرة
              على تحرير النصوص بالعربية اختصرا علينا أياماً من العمل اليدوي."<br />
              <strong>نورة – قائدة فريق التسويق في Startup Gulf</strong>
            </p>
          </article>
          <article className="testimonial">
            <p>
              "المحرر المباشر والتكامل مع الذكاء الاصطناعي ساهما في تحسين معدل التحويل بنسبة 27٪ في أول شهر فقط."<br />
              <strong>أحمد – مدير النمو في متجر إلكتروني سعودي</strong>
            </p>
          </article>
        </div>
      </section>

      <section className="card faq-card">
        <div className="faq-header">
          <span className="badge badge-soft">❓ أسئلة شائعة</span>
          <h2>كل ما تحتاج معرفته قبل أن تبدأ</h2>
        </div>
        <div className="faq-grid">
          {faqs.map((faq) => (
            <div className="faq-item" key={faq.question}>
              <h3>{faq.question}</h3>
              <p>{faq.answer}</p>
            </div>
          ))}
        </div>
        <div className="faq-cta">
          <p>هل لديك أسئلة إضافية؟ تحدث مع فريق المبيعات لتصميم تجربة تناسب علامتك.</p>
          <Link className="btn ghost" href="/dashboard">
            احجز استشارة سريعة
          </Link>
        </div>
      </section>

      <section className="cta-section">
        <div className="cta-card">
          <div className="cta-copy">
            <h2>ابدأ اليوم، وولّد أول صفحة هبوط بالعربية خلال دقائق</h2>
            <p>
              جرب Promptify مجاناً، واستفد من مكتبة الأقسام العربية، ومعاينة فورية متوافقة مع هوية علامتك التجارية.
            </p>
          </div>
          <div className="cta-actions">
            <Link className="btn primary" href="/generate">
              أنشئ صفحة الآن
            </Link>
            <Link className="btn ghost" href="/dashboard">
              استكشف القوالب الجاهزة
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
