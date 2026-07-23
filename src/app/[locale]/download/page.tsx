import Link from "next/link";
import { Container } from "@/components/ui/container";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { Button } from "@/components/ui/button";
import {
  Download,
  Smartphone,
  Laptop,
  Globe,
  Zap,
  Shield,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Monitor,
  Apple,
  Chrome,
} from "lucide-react";
import { WebSiteSchema } from "@/components/seo/schema";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const isAr = locale === "ar";
  const title = isAr
    ? "تحميل وتثبيت تطبيق WorldPDF — أدوات PDF تعمل بدون إنترنت وبأمان | WorldPDF"
    : "Download & Install WorldPDF App — Offline Free PDF Tools | WorldPDF";
  const description = isAr
    ? "حمل وتثبيت تطبيق WorldPDF المباشر على الكمبيوتر والموبايل (PWA). معالجة سريعة وآمنة للملفات 100% داخل جهازك دون الحاجة لرفع أي ملف."
    : "Download and install WorldPDF app for Windows, Mac, Android & iOS (PWA). 100% private, client-side PDF tools running directly on your device.";

  return {
    title,
    description,
    alternates: {
      canonical: `https://www.myworldpdf.com/${locale}/download`,
      languages: {
        en: "https://www.myworldpdf.com/en/download",
        ar: "https://www.myworldpdf.com/ar/download",
        "x-default": "https://www.myworldpdf.com/en/download",
      },
    },
    openGraph: {
      title,
      description,
      url: `https://www.myworldpdf.com/${locale}/download`,
      siteName: "WorldPDF",
      type: "website",
    },
  };
}

export default async function DownloadPage({ params }: Props) {
  const { locale } = await params;
  const isAr = locale === "ar";

  const breadcrumbs = [
    {
      label: isAr ? "الرئيسية" : "Home",
      href: `/${locale}`,
    },
    {
      label: isAr ? "تحميل التطبيق" : "Download App",
      href: `/${locale}/download`,
    },
  ];

  const features = [
    {
      icon: Shield,
      title: isAr ? "خصوصية وأمان 100%" : "100% Private & Secure",
      desc: isAr
        ? "جميع عمليات الدمج والضغط والتحويل تتم محلياً في ذاكرة جهازك بدون رفع الملفات إلى أي خادم."
        : "All PDF operations run locally inside your browser memory with zero server file uploads.",
    },
    {
      icon: Zap,
      title: isAr ? "سرعةائقة بدعم WebAssembly" : "Ultra-Fast WASM Performance",
      desc: isAr
        ? "معالجة فورية للملفات الضخمة مستفيدة من كامل قوة معالج جهازك."
        : "Process multi-gigabyte documents instantly utilizing WebAssembly client-side technology.",
    },
    {
      icon: Globe,
      title: isAr ? "يعمل بدون اتصال بالإنترنت" : "Works Offline",
      desc: isAr
        ? "بمجرد تثبيت التطبيق يمكنك معالجة ملفاتك في أي مكان وبدون الحاجة لشبكة إنترنت."
        : "Once installed, use all PDF tools anywhere without an active internet connection.",
    },
  ];

  const steps = [
    {
      step: "01",
      title: isAr ? "افتَح المتصفح" : "Open Browser",
      desc: isAr
        ? "زر موقع WorldPDF من متصفح Chrome أو Edge أو Safari."
        : "Visit WorldPDF using Chrome, Edge, or Safari on desktop or mobile.",
    },
    {
      step: "02",
      title: isAr ? "انقر على 'تثبيت التطبيق'" : "Click 'Install App'",
      desc: isAr
        ? "انقر على أيقونة التثبيت في شريط العنوان أو شريط خيارات المتصفح (Install App)."
        : "Click the Install icon in your browser address bar or menu.",
    },
    {
      step: "03",
      title: isAr ? "استمتع بالسرعة والأمان" : "Enjoy Offline Speed",
      desc: isAr
        ? "افتح WorldPDF مباشرة كـ تطبيق مخصص على شريط المهام أو الشاشة الرئيسية."
        : "Launch WorldPDF as a native desktop or mobile home-screen application.",
    },
  ];

  return (
    <>
      <WebSiteSchema />

      <div className="bg-surface-50/50 dark:bg-surface-950 min-h-screen py-12 md:py-20">
        <Container>
          <Breadcrumbs items={breadcrumbs} className="mb-8" />

          {/* Hero Banner */}
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-600 via-brand-700 to-purple-800 text-white p-8 md:p-14 shadow-2xl mb-16">
            <div className="absolute top-0 right-0 -mt-12 -mr-12 w-96 h-96 bg-white/10 rounded-full blur-3xl pointer-events-none" />
            
            <div className="relative z-10 max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/15 text-white text-xs font-semibold backdrop-blur-md mb-6">
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>{isAr ? "تطبيق Progressive Web App (PWA)" : "Progressive Web App (PWA)"}</span>
              </div>

              <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight mb-6 leading-tight">
                {isAr
                  ? "حمل WorldPDF واستخدم الأدوات مباشرة وبدون إنترنت"
                  : "Download WorldPDF & Process PDFs Fast & Offline"}
              </h1>

              <p className="text-brand-100 text-base md:text-lg mb-8 leading-relaxed">
                {isAr
                  ? "احصل على أفضل تجربة لدمج وضغط وتعديل ملفات PDF على أجهزة الكمبيوتر والموبايل. تطبيق خفيف للغاية، لا يحتاج مساحة، ويضمن خصوصيتك 100%."
                  : "Get the ultimate PDF experience on Desktop, Mac, Android, and iOS. Lightweight, zero installation friction, and 100% private."}
              </p>

              <div className="flex flex-wrap items-center gap-4">
                <Button
                  asChild
                  size="lg"
                  className="bg-white text-brand-700 hover:bg-brand-50 shadow-lg font-bold text-base px-8 h-14 rounded-2xl"
                >
                  <Link href={`/${locale}/pdf`}>
                    <Download className="w-5 h-5 me-2" />
                    <span>{isAr ? "افتح المنصة الآن" : "Launch Platform Now"}</span>
                  </Link>
                </Button>

                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="border-white/30 text-white hover:bg-white/10 font-semibold h-14 rounded-2xl"
                >
                  <Link href={`/${locale}/how-it-works`}>
                    <span>{isAr ? "كيف يعمل؟" : "How it Works"}</span>
                    <ArrowRight className="w-4 h-4 ms-2 rtl:rotate-180" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>

          {/* Device Compatibility */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {features.map((feat, idx) => {
              const IconComp = feat.icon;
              return (
                <div
                  key={idx}
                  className="bg-white dark:bg-surface-900 border border-surface-200/80 dark:border-surface-800 rounded-2xl p-8 shadow-sm hover:shadow-md transition-all"
                >
                  <div className="w-12 h-12 rounded-xl bg-brand-50 dark:bg-brand-950/40 text-brand-600 dark:text-brand-400 flex items-center justify-center mb-6">
                    <IconComp className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold text-surface-900 dark:text-surface-50 mb-3">
                    {feat.title}
                  </h3>
                  <p className="text-surface-600 dark:text-surface-400 text-sm leading-relaxed">
                    {feat.desc}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Installation Guide */}
          <div className="bg-white dark:bg-surface-900 border border-surface-200/80 dark:border-surface-800 rounded-3xl p-8 md:p-12 mb-16">
            <div className="max-w-2xl mx-auto text-center mb-12">
              <h2 className="text-2xl sm:text-3xl font-bold text-surface-900 dark:text-surface-50 mb-4">
                {isAr ? "خطوات تثبيت التطبيق في 3 ثوانٍ" : "3-Step Installation Guide"}
              </h2>
              <p className="text-surface-600 dark:text-surface-400 text-sm md:text-base">
                {isAr
                  ? "تطبيق PWA يتيح لك التشغيل المباشر من سطح المكتب أو الشاشة الرئيسية دون المرور بمتاجر التطبيقات."
                  : "Install directly from your browser toolbar without store downloads."}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {steps.map((s, idx) => (
                <div
                  key={idx}
                  className="relative p-6 rounded-2xl bg-surface-50 dark:bg-surface-800/40 border border-surface-100 dark:border-surface-700/50"
                >
                  <span className="text-3xl font-black text-brand-500/30 dark:text-brand-400/20 mb-4 block">
                    {s.step}
                  </span>
                  <h4 className="text-lg font-bold text-surface-900 dark:text-surface-100 mb-2">
                    {s.title}
                  </h4>
                  <p className="text-sm text-surface-600 dark:text-surface-400 leading-relaxed">
                    {s.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Supported Systems */}
          <div className="text-center py-6">
            <h4 className="text-xs font-bold uppercase tracking-wider text-surface-400 mb-6">
              {isAr ? "متوافق بالكامل مع جميع الأنظمة والمتصفحات" : "Supported Across All Platforms"}
            </h4>
            <div className="flex flex-wrap items-center justify-center gap-8 text-surface-500 dark:text-surface-400">
              <div className="flex items-center gap-2">
                <Laptop className="w-5 h-5 text-brand-500" />
                <span className="text-sm font-semibold">Windows / Mac / Linux</span>
              </div>
              <div className="flex items-center gap-2">
                <Smartphone className="w-5 h-5 text-brand-500" />
                <span className="text-sm font-semibold">Android & iOS</span>
              </div>
              <div className="flex items-center gap-2">
                <Chrome className="w-5 h-5 text-brand-500" />
                <span className="text-sm font-semibold">Chrome, Edge & Safari</span>
              </div>
            </div>
          </div>
        </Container>
      </div>
    </>
  );
}
