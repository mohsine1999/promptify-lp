import Link from "next/link";

export default function Home() {
  return (
    <div className="grid" style={{ marginTop: 24 }}>
      <div className="card home-hero-card">
        <div className="badge-row">
          <span className="badge">⚡ توليد فوري</span>
          <span className="badge">🤖 مدعوم بالذكاء الاصطناعي</span>
          <span className="badge">🎨 تصميم متوافق مع الهوية</span>
        </div>
        <h1 className="hero-title">Promptify – صفحات هبوط عربية متكاملة خلال دقائق</h1>
        <p className="hero-subtitle">
          اجمع كل ما تحتاجه للتسويق: نصوص جذابة، مزايا مقنعة، وأقسام جاهزة للطلب بالدفع عند الاستلام. كل ذلك مصمم
          خصيصاً للّغة العربية ولهجاتها، مع محرّر متطور يعكس هوية علامتك التجارية في ثيمات داكنة ومضيئة أنيقة.
        </p>
        <div className="hero-actions">
          <Link className="btn primary" href="/generate">
            ابدأ توليد صفحة جديدة
          </Link>
          <Link className="btn ghost" href="/dashboard">
            تصفح الصفحات المحفوظة
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
        <div className="info-banner" style={{ marginTop: 28 }}>
          <strong>كيف يعمل؟</strong>
          <span className="small">
            ألصق رابط المنتج من AliExpress أو مصدر مشابه، اختر اللهجة ومزوّد الذكاء الاصطناعي. سنتكفل بجلب البيانات،
            وتوليد صفحة كاملة، ثم يمكنك تعديلها ومشاركتها فوراً.
          </span>
        </div>
      </div>

      <div className="card subtle-card">
        <h2 style={{ marginTop: 0 }}>لماذا سيحب فريقك Promptify؟</h2>
        <div className="feature-grid">
          <div className="feature-card">
            <h3>تجربة عربية مهيأة</h3>
            <p>واجهة مصممة RTL بالكامل مع دعم للهجات متعددة، كي لا تضطر لإعادة صياغة النصوص يدوياً.</p>
          </div>
          <div className="feature-card">
            <h3>تحكم كامل في المحتوى</h3>
            <p>عدّل كل قسم في المحرّر، أضف المزايا أو الأسئلة الشائعة، واحفظ نسخاً مختلفة لفرق التسويق.</p>
          </div>
          <div className="feature-card">
            <h3>معاينة فورية</h3>
            <p>معاينة أنيقة لصفحتك كما ستظهر للعميل، مع نموذج طلب متجاوب جاهز للدفع عند الاستلام.</p>
          </div>
          <div className="feature-card">
            <h3>أداء موثوق</h3>
            <p>نظام ذكي للتبديل بين OpenAI وGemini يضمن الحصول على أفضل نتيجة بدون انقطاع.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
