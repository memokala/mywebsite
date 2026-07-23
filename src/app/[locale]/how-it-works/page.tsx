import { Container } from "@/components/ui/container";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import {
  Shield,
  Server,
  Globe,
  Zap,
  Lock,
  Eye,
  CheckCircle2,
  XCircle,
  ArrowRight,
  Code2,
  Cpu,
  MonitorSmartphone,
} from "lucide-react";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const isAr = locale === "ar";

  return {
    title: isAr
      ? "كيف تعمل أدوات WorldPDF — شفافية كاملة | WorldPDF"
      : "How WorldPDF Works — Full Transparency | WorldPDF",
    description: isAr
      ? "تعرف على كيفية عمل أدوات WorldPDF. معالجة 100% في متصفحك. ملفاتك لا تغادر جهازك أبداً. شفافية تقنية كاملة."
      : "Learn how WorldPDF tools work. 100% client-side processing. Your files never leave your device. Full technical transparency.",
    alternates: {
      canonical: `https://www.myworldpdf.com/${locale}/how-it-works`,
      languages: {
        en: "https://www.myworldpdf.com/en/how-it-works",
        ar: "https://www.myworldpdf.com/ar/how-it-works",
        "x-default": "https://www.myworldpdf.com/en/how-it-works",
      },
    },
  };
}

export default async function HowItWorksPage({ params }: Props) {
  const { locale } = await params;
  const isAr = locale === "ar";

  return (
    <>
      {/* Hero */}
      <section className="relative bg-gradient-to-b from-brand-50/50 to-white dark:from-surface-950 dark:to-surface-900 border-b border-surface-200 dark:border-surface-800">
        <Container className="py-12 md:py-20">
          <Breadcrumbs
            items={[
              {
                label: isAr ? "كيف تعمل" : "How It Works",
              },
            ]}
          />
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-green-50 dark:bg-green-950/30 border border-green-200/60 dark:border-green-800/50 text-xs font-semibold text-green-700 dark:text-green-300 mb-4">
              <Shield className="h-3.5 w-3.5 text-green-500" />
              {isAr ? "شفافية تقنية كاملة" : "Full Technical Transparency"}
            </div>
            <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-surface-900 dark:text-surface-50">
              {isAr
                ? "كيف تعمل أدوات WorldPDF"
                : "How WorldPDF Tools Work"}
            </h1>
            <p className="mt-4 text-lg text-surface-500 dark:text-surface-400 leading-relaxed">
              {isAr
                ? "نؤمن بالشفافية الكاملة. إليك بالضبط ما يحدث عندما تستخدم أدواتنا — ولماذا ملفاتك آمنة بنسبة 100%."
                : "We believe in full transparency. Here's exactly what happens when you use our tools — and why your files are 100% safe."}
            </p>
          </div>
        </Container>
      </section>

      {/* The Problem */}
      <section className="py-12 md:py-16">
        <Container>
          <div className="max-w-4xl">
            <h2 className="text-2xl md:text-3xl font-bold text-surface-900 dark:text-surface-50 mb-8">
              {isAr
                ? "المشكلة مع أدوات PDF التقليدية"
                : "The Problem With Traditional PDF Tools"}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Competitor way */}
              <div className="p-6 rounded-2xl border-2 border-red-200 dark:border-red-900/50 bg-red-50/30 dark:bg-red-950/10">
                <div className="flex items-center gap-2 mb-4">
                  <XCircle className="h-5 w-5 text-red-500" />
                  <h3 className="font-bold text-surface-900 dark:text-surface-100">
                    {isAr ? "كيف يعمل iLovePDF و SmallPDF" : "How iLovePDF & SmallPDF Work"}
                  </h3>
                </div>
                <ol className="space-y-3 text-sm text-surface-600 dark:text-surface-400">
                  <li className="flex gap-3">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-red-100 dark:bg-red-950/30 text-red-600 text-xs font-bold shrink-0">1</span>
                    <span>{isAr ? "تقوم برفع ملفك إلى خوادمهم" : "Your file is uploaded to THEIR server"}</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-red-100 dark:bg-red-950/30 text-red-600 text-xs font-bold shrink-0">2</span>
                    <span>{isAr ? "خادمهم يعالج الملف (3-8 ثوانٍ انتظار)" : "Their server processes it (3-8 second wait)"}</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-red-100 dark:bg-red-950/30 text-red-600 text-xs font-bold shrink-0">3</span>
                    <span>{isAr ? "تقوم بتحميل النتيجة" : "You download the result"}</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-red-100 dark:bg-red-950/30 text-red-600 text-xs font-bold shrink-0">4</span>
                    <span className="font-medium text-red-600 dark:text-red-400">
                      {isAr ? "⚠️ ملفك يبقى على خادمهم — لكم من الوقت؟ من يعلم!" : "⚠️ Your file sits on their server — for how long? Who knows!"}
                    </span>
                  </li>
                </ol>
              </div>

              {/* Our way */}
              <div className="p-6 rounded-2xl border-2 border-green-200 dark:border-green-900/50 bg-green-50/30 dark:bg-green-950/10">
                <div className="flex items-center gap-2 mb-4">
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                  <h3 className="font-bold text-surface-900 dark:text-surface-100">
                    {isAr ? "كيف يعمل WorldPDF" : "How WorldPDF Works"}
                  </h3>
                </div>
                <ol className="space-y-3 text-sm text-surface-600 dark:text-surface-400">
                  <li className="flex gap-3">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-green-100 dark:bg-green-950/30 text-green-600 text-xs font-bold shrink-0">1</span>
                    <span>{isAr ? "تسحب ملفك إلى الأداة" : "You drop your file into the tool"}</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-green-100 dark:bg-green-950/30 text-green-600 text-xs font-bold shrink-0">2</span>
                    <span>{isAr ? "JavaScript (pdf-lib) يعالجه في متصفحك" : "JavaScript (pdf-lib) processes it IN YOUR BROWSER"}</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-green-100 dark:bg-green-950/30 text-green-600 text-xs font-bold shrink-0">3</span>
                    <span>{isAr ? "النتيجة تُنشأ في متصفحك" : "The result is generated IN YOUR BROWSER"}</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-green-100 dark:bg-green-950/30 text-green-600 text-xs font-bold shrink-0">4</span>
                    <span className="font-medium text-green-600 dark:text-green-400">
                      {isAr ? "✅ نحن حرفياً لا نستطيع رؤية ملفاتك — خادمنا يقدم فقط HTML/JS" : "✅ We literally CANNOT see your files — our server only delivers HTML/JS"}
                    </span>
                  </li>
                </ol>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Technical Deep Dive */}
      <section className="py-12 md:py-16 bg-surface-50/50 dark:bg-surface-900/50 border-y border-surface-200 dark:border-surface-800">
        <Container>
          <div className="max-w-4xl">
            <h2 className="text-2xl md:text-3xl font-bold text-surface-900 dark:text-surface-50 mb-8">
              {isAr ? "التفاصيل التقنية" : "Technical Deep Dive"}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-6 rounded-2xl bg-white dark:bg-surface-900 border border-surface-200 dark:border-surface-700">
                <Code2 className="h-8 w-8 text-brand-500 mb-4" />
                <h3 className="font-bold text-surface-900 dark:text-surface-100 mb-2">
                  {isAr ? "مكتبة pdf-lib" : "pdf-lib Library"}
                </h3>
                <p className="text-sm text-surface-500 dark:text-surface-400 leading-relaxed">
                  {isAr
                    ? "مكتبة JavaScript مفتوحة المصدر (MIT License) تعمل بالكامل في المتصفح. تقوم بإنشاء وتعديل ودمج ملفات PDF بدون أي اتصال بالسيرفر."
                    : "Open-source JavaScript library (MIT License) that runs entirely in the browser. Creates, modifies, and merges PDFs with zero server communication."}
                </p>
              </div>
              <div className="p-6 rounded-2xl bg-white dark:bg-surface-900 border border-surface-200 dark:border-surface-700">
                <Cpu className="h-8 w-8 text-purple-500 mb-4" />
                <h3 className="font-bold text-surface-900 dark:text-surface-100 mb-2">
                  {isAr ? "معالجة محلية" : "Local Processing"}
                </h3>
                <p className="text-sm text-surface-500 dark:text-surface-400 leading-relaxed">
                  {isAr
                    ? "جميع العمليات تتم على جهازك باستخدام موارد معالجك المحلي. لا يتم إرسال أي بيانات عبر الشبكة. حتى أنها تعمل بدون إنترنت بعد التحميل الأول."
                    : "All operations run on your device using your local processor resources. No data is sent over the network. It even works offline after initial page load."}
                </p>
              </div>
              <div className="p-6 rounded-2xl bg-white dark:bg-surface-900 border border-surface-200 dark:border-surface-700">
                <MonitorSmartphone className="h-8 w-8 text-green-500 mb-4" />
                <h3 className="font-bold text-surface-900 dark:text-surface-100 mb-2">
                  {isAr ? "استضافة على الحافة" : "Edge Hosting"}
                </h3>
                <p className="text-sm text-surface-500 dark:text-surface-400 leading-relaxed">
                  {isAr
                    ? "مستضاف على شبكة Cloudflare في أكثر من 300 موقع حول العالم. الخادم يقدم فقط ملفات HTML و JavaScript الثابتة — لا توجد معالجة على الخادم مطلقاً."
                    : "Hosted on Cloudflare's network across 300+ locations worldwide. The server only delivers static HTML and JavaScript files — zero server-side processing ever."}
                </p>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Verify It Yourself */}
      <section className="py-12 md:py-16">
        <Container>
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200/60 dark:border-amber-800/50 text-xs font-semibold text-amber-700 dark:text-amber-300 mb-4">
              <Eye className="h-3.5 w-3.5 text-amber-500" />
              {isAr ? "تحقق بنفسك" : "Verify It Yourself"}
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-surface-900 dark:text-surface-50 mb-6">
              {isAr
                ? "لا تثق بكلامنا — تحقق بنفسك"
                : "Don't Trust Our Words — Verify It Yourself"}
            </h2>
            <div className="p-6 rounded-2xl bg-surface-900 dark:bg-surface-950 text-white">
              <h3 className="font-bold mb-4 text-green-400">
                {isAr ? "📋 خطوات التحقق:" : "📋 Verification Steps:"}
              </h3>
              <ol className="space-y-4 text-sm">
                <li className="flex gap-3">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-green-500/20 text-green-400 text-xs font-bold shrink-0">1</span>
                  <span className="text-surface-300">
                    {isAr ? "افتح أي أداة على WorldPDF" : "Open any tool on WorldPDF"}
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-green-500/20 text-green-400 text-xs font-bold shrink-0">2</span>
                  <span className="text-surface-300">
                    {isAr
                      ? "اضغط F12 → انتقل إلى تبويب Network (الشبكة)"
                      : "Press F12 → Go to the Network tab"}
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-green-500/20 text-green-400 text-xs font-bold shrink-0">3</span>
                  <span className="text-surface-300">
                    {isAr ? "أضف ملفاً وقم بمعالجته" : "Add a file and process it"}
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-green-500/20 text-green-400 text-xs font-bold shrink-0">4</span>
                  <span className="text-surface-300">
                    {isAr
                      ? "راقب طلبات الشبكة — ستجد صفر طلبات رفع ملفات ✅"
                      : "Watch the network requests — you'll see ZERO file upload requests ✅"}
                  </span>
                </li>
              </ol>

              <div className="mt-6 p-4 rounded-xl bg-surface-800 border border-surface-700 font-mono text-xs text-green-400">
                <div className="text-surface-500 mb-1">{isAr ? "// لوحة الشبكة ستظهر:" : "// Network panel will show:"}</div>
                <div>GET /en/pdf/merge-pdf ........... <span className="text-surface-400">200 OK (HTML)</span></div>
                <div>GET /_next/static/chunks/*.js ... <span className="text-surface-400">200 OK (JS)</span></div>
                <div>GET /_next/static/css/*.css ..... <span className="text-surface-400">200 OK (CSS)</span></div>
                <div className="mt-2 text-amber-400">
                  {isAr ? "// لا يوجد POST أو PUT لأي ملف — صفر رفع ✅" : "// No POST or PUT for any file — zero uploads ✅"}
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Security Features */}
      <section className="py-12 md:py-16 bg-surface-50/50 dark:bg-surface-900/50 border-y border-surface-200 dark:border-surface-800">
        <Container>
          <div className="max-w-4xl">
            <h2 className="text-2xl md:text-3xl font-bold text-surface-900 dark:text-surface-50 mb-8">
              {isAr ? "ميزات الأمان" : "Security Features"}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                {
                  icon: Shield,
                  color: "text-green-500",
                  bg: "bg-green-50 dark:bg-green-950/30",
                  en: { title: "Zero Server Upload", desc: "Files never leave your device. Period." },
                  ar: { title: "صفر رفع للسيرفر", desc: "ملفاتك لا تغادر جهازك. نقطة." },
                },
                {
                  icon: Lock,
                  color: "text-blue-500",
                  bg: "bg-blue-50 dark:bg-blue-950/30",
                  en: { title: "HTTPS Everywhere", desc: "All connections encrypted with TLS 1.3 / HSTS preloaded." },
                  ar: { title: "HTTPS في كل مكان", desc: "جميع الاتصالات مشفرة بـ TLS 1.3 / HSTS محمّل مسبقاً." },
                },
                {
                  icon: Zap,
                  color: "text-amber-500",
                  bg: "bg-amber-50 dark:bg-amber-950/30",
                  en: { title: "No Cookies for Files", desc: "We don't track which files you process. Zero analytics on file content." },
                  ar: { title: "لا كوكيز للملفات", desc: "لا نتتبع الملفات التي تعالجها. صفر تحليلات على محتوى الملفات." },
                },
                {
                  icon: Globe,
                  color: "text-purple-500",
                  bg: "bg-purple-50 dark:bg-purple-950/30",
                  en: { title: "GDPR Compliant by Design", desc: "No personal file data is collected, so there's nothing to comply with. The safest compliance: not collecting data at all." },
                  ar: { title: "متوافق مع GDPR بالتصميم", desc: "لا يتم جمع أي بيانات ملفات شخصية. الامتثال الأكثر أماناً: عدم جمع البيانات أصلاً." },
                },
              ].map((feature, i) => {
                const Icon = feature.icon;
                const content = isAr ? feature.ar : feature.en;
                return (
                  <div key={i} className="p-5 rounded-2xl border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-900">
                    <div className={`inline-flex p-2.5 rounded-xl ${feature.bg} mb-3`}>
                      <Icon className={`h-5 w-5 ${feature.color}`} />
                    </div>
                    <h3 className="font-bold text-surface-900 dark:text-surface-100 text-sm">
                      {content.title}
                    </h3>
                    <p className="mt-1.5 text-xs text-surface-500 dark:text-surface-400 leading-relaxed">
                      {content.desc}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </Container>
      </section>

      {/* CTA */}
      <section className="py-12 md:py-16">
        <Container>
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-surface-900 dark:text-surface-50 mb-4">
              {isAr
                ? "جرب بنفسك — مجاناً وبدون تسجيل"
                : "Try It Yourself — Free, No Sign-Up"}
            </h2>
            <p className="text-surface-500 dark:text-surface-400 mb-8">
              {isAr
                ? "كل الأدوات مجانية، بدون حدود، وملفاتك تبقى على جهازك دائماً."
                : "All tools are free, unlimited, and your files always stay on your device."}
            </p>
            <a
              href={`/${locale}/pdf`}
              className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-brand-500 text-white font-bold text-base hover:bg-brand-600 transition-colors shadow-lg shadow-brand-500/20"
            >
              {isAr ? "تصفح أدوات PDF" : "Browse PDF Tools"}
              <ArrowRight className="h-5 w-5 rtl:rotate-180" />
            </a>
          </div>
        </Container>
      </section>
    </>
  );
}
