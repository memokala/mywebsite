import { notFound } from "next/navigation";
import Link from "next/link";
import * as Icons from "lucide-react";
import { getToolBySlug, categories, getCategoryBySlug } from "@/lib/tools/registry";
import { Container } from "@/components/ui/container";
import { ToolCard } from "@/components/tools/tool-card";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { ToolPageSchema } from "@/components/seo/schema";
import { getUseCaseData, getAllProgrammaticPages, useCaseRegistry } from "@/lib/seo/programmatic-pages";
import { LazyPdfToolWrapper } from "@/components/tools/pdf-tool-lazy";

type Props = {
  params: Promise<{
    locale: string;
    category: string;
    tool: string;
    usecase: string;
  }>;
};

export async function generateStaticParams() {
  const paths = getAllProgrammaticPages();
  return paths;
}

export async function generateMetadata({ params }: Props) {
  const { locale, category, tool, usecase } = await params;
  const decodedUsecase = decodeURIComponent(usecase);
  const ucData = getUseCaseData(tool, decodedUsecase, locale);

  if (!ucData) return {};

  // Find counterpart slugs for hreflang alternates
  const toolEntry = useCaseRegistry[tool];
  const audience = toolEntry?.audiences.find(
    (aud) => aud.slug === decodedUsecase || aud.slugAr === decodedUsecase || decodeURIComponent(aud.slugAr) === decodedUsecase
  );

  const enSlug = audience?.slug || decodedUsecase;
  const arSlug = audience?.slugAr || decodedUsecase;

  return {
    title: ucData.metaTitle,
    description: ucData.metaDescription,
    alternates: {
      canonical: `https://www.myworldpdf.com/${locale}/${category}/${tool}/${locale === "ar" ? arSlug : enSlug}`,
      languages: {
        "en": `https://www.myworldpdf.com/en/${category}/${tool}/${enSlug}`,
        "ar": `https://www.myworldpdf.com/ar/${category}/${tool}/${arSlug}`,
        "x-default": `https://www.myworldpdf.com/en/${category}/${tool}/${enSlug}`,
      },
    },
    openGraph: {
      title: ucData.metaTitle,
      description: ucData.metaDescription,
      url: `https://www.myworldpdf.com/${locale}/${category}/${tool}/${locale === "ar" ? arSlug : enSlug}`,
      type: "website",
      siteName: "WorldPDF",
    },
    twitter: {
      card: "summary_large_image",
      title: ucData.metaTitle,
      description: ucData.metaDescription,
    },
  };
}

export default async function UseCasePage({ params }: Props) {
  const { locale, category, tool, usecase } = await params;
  const decodedUsecase = decodeURIComponent(usecase);
  const toolData = getToolBySlug(tool);
  const cat = getCategoryBySlug(category);
  const ucData = getUseCaseData(tool, decodedUsecase, locale);

  if (!toolData || !cat || !ucData) notFound();

  const relatedTools = cat.tools.filter((ct) => ct.id !== toolData.id);
  const otherCategories = categories.filter((c) => c.id !== category);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const IconComponent = (Icons as any)[toolData.icon] || Icons.Wrench;

  return (
    <>
      {/* Schema Markup for the specialized tool page */}
      <ToolPageSchema
        tool={{
          title: ucData.title,
          description: ucData.metaDescription,
          slug: `${toolData.slug}/${locale === "ar" ? usecase : usecase}`,
        }}
        category={{
          title: cat.title,
          slug: cat.slug,
        }}
        locale={locale}
        faq={ucData.faq.map((f) => ({ question: f.q, answer: f.a }))}
      />

      <div className="bg-gradient-to-b from-brand-50/50 to-white dark:from-surface-950 dark:to-surface-900 border-b border-surface-200 dark:border-surface-800">
        <Container className="py-8 md:py-12">
          <Breadcrumbs
            items={[
              { label: cat.title, href: `/${locale}/${cat.slug}` },
              { label: toolData.title, href: `/${locale}/${cat.slug}/${toolData.slug}` },
              { label: ucData.title },
            ]}
          />

          <div className="flex items-center gap-4 mb-4">
            <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${toolData.bgColor}`}>
              <IconComponent className={`h-6 w-6 ${toolData.color}`} />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-surface-900 dark:text-surface-50">
                {ucData.title}
              </h1>
              <p className="mt-1 text-surface-500 dark:text-surface-400">
                {ucData.metaDescription}
              </p>
            </div>
          </div>

          {/* Snippet-bait paragraph for target audience Position Zero capture */}
          <div
            className="text-sm sm:text-base text-surface-600 dark:text-surface-400 leading-relaxed max-w-3xl border-l-2 border-brand-500 pl-4 rtl:border-l-0 rtl:border-r-2 rtl:pl-0 rtl:pr-4 py-1"
            dir={locale === "ar" ? "rtl" : "ltr"}
          >
            <p>
              <strong>{locale === "ar" ? "معالجة محلية بالكامل:" : "100% Local processing:"}</strong> {ucData.introParagraph}
            </p>
          </div>

          {/* Trust badge */}
          <div className="mt-4 inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-green-50/80 dark:bg-green-950/20 border border-green-200/60 dark:border-green-800/40 text-xs font-semibold text-green-700 dark:text-green-300">
            <Icons.Shield className="h-3.5 w-3.5 text-green-500 shrink-0" />
            <span>
              {locale === "ar"
                ? "🔒 المعالجة تتم محلياً — ملفاتك لا تغادر جهازك"
                : "🔒 Client-side processing — your files never leave your device"}
            </span>
          </div>
        </Container>
      </div>

      <Container className="py-8 md:py-12">
        <LazyPdfToolWrapper slug={toolData.slug} locale={locale} />
      </Container>

      {/* How This Tool Works — Specific to the target audience */}
      <section className="py-12 bg-surface-50/50 dark:bg-surface-900/50 border-y border-surface-200 dark:border-surface-800">
        <Container>
          <h2 className="text-2xl font-bold text-surface-900 dark:text-surface-50 mb-6">
            {locale === "ar" ? "خطوات العمل بالتفصيل" : "Step-by-Step Instructions"}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-5xl">
            {ucData.howToSteps.map((step, idx) => (
              <div key={idx} className="flex gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 dark:bg-brand-950/40 text-brand-500 font-bold text-sm shrink-0">
                  0{idx + 1}
                </div>
                <div>
                  <h3 className="font-semibold text-surface-900 dark:text-surface-100 text-sm">
                    {step.title}
                  </h3>
                  <p className="text-xs text-surface-500 dark:text-surface-400 mt-1 leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Target Audience Use Cases List */}
      <section className="py-12 bg-white dark:bg-surface-950/20">
        <Container>
          <h2 className="text-2xl font-bold text-surface-900 dark:text-surface-50 mb-6">
            {locale === "ar" ? "حالات استخدام شائعة في هذا المجال" : "Key Applications in this Industry"}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl">
            {ucData.useCases.map((useCase, index) => (
              <div key={index} className="flex items-start gap-3 p-4 rounded-xl border border-surface-100 dark:border-surface-800 bg-surface-50/30">
                <Icons.CheckCircle2 className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                <p className="text-sm font-medium text-surface-700 dark:text-surface-300">
                  {useCase}
                </p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Custom FAQ for the audience */}
      {ucData.faq && ucData.faq.length > 0 && (
        <section className="py-12 bg-surface-50/20 dark:bg-surface-950/50 border-t border-surface-200 dark:border-surface-800">
          <Container>
            <h2 className="text-2xl font-bold text-surface-900 dark:text-surface-50 mb-8">
              {locale === "ar" ? "الأسئلة الشائعة ذات الصلة" : "Frequently Asked Questions"}
            </h2>
            <div className="max-w-3xl space-y-4">
              {ucData.faq.map((faq, index) => (
                <details
                  key={index}
                  className="group rounded-2xl border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-900 overflow-hidden"
                >
                  <summary className="flex items-center justify-between px-6 py-4 cursor-pointer text-sm font-medium text-surface-900 dark:text-surface-100 hover:bg-surface-50 dark:hover:bg-surface-800 transition-colors">
                    {faq.q}
                    <Icons.ChevronDown className="h-4 w-4 text-surface-400 group-open:rotate-180 transition-transform" />
                  </summary>
                  <div className="px-6 pb-4 text-sm text-surface-600 dark:text-surface-400 leading-relaxed">
                    {faq.a}
                  </div>
                </details>
              ))}
            </div>
          </Container>
        </section>
      )}

      {/* Why WorldPDF — USP reinforcement */}
      <section className="py-12 border-t border-surface-200 dark:border-surface-800">
        <Container>
          <h2 className="text-2xl font-bold text-surface-900 dark:text-surface-50 mb-6">
            {locale === "ar" ? "لماذا WorldPDF؟" : "Why WorldPDF?"}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-4xl">
            <div className="p-4 rounded-2xl border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-900">
              <Icons.Shield className="h-5 w-5 text-green-500 mb-2" />
              <h3 className="text-sm font-semibold text-surface-900 dark:text-surface-100">
                {locale === "ar" ? "خصوصية 100%" : "100% Private"}
              </h3>
              <p className="text-xs text-surface-500 dark:text-surface-400 mt-1">
                {locale === "ar"
                  ? "ملفاتك لا تغادر جهازك أبداً. معالجة محلية بالكامل."
                  : "Your files never leave your device. Fully local processing."}
              </p>
            </div>
            <div className="p-4 rounded-2xl border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-900">
              <Icons.Zap className="h-5 w-5 text-amber-500 mb-2" />
              <h3 className="text-sm font-semibold text-surface-900 dark:text-surface-100">
                {locale === "ar" ? "سرعة فائقة" : "Lightning Fast"}
              </h3>
              <p className="text-xs text-surface-500 dark:text-surface-400 mt-1">
                {locale === "ar"
                  ? "لا انتظار للرفع. المعالجة تتم في ثوانٍ محلياً."
                  : "No upload wait time. Processing completes in seconds locally."}
              </p>
            </div>
            <div className="p-4 rounded-2xl border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-900">
              <Icons.Infinity className="h-5 w-5 text-purple-500 mb-2" />
              <h3 className="text-sm font-semibold text-surface-900 dark:text-surface-100">
                {locale === "ar" ? "بدون حدود" : "Unlimited Usage"}
              </h3>
              <p className="text-xs text-surface-500 dark:text-surface-400 mt-1">
                {locale === "ar"
                  ? "لا تسجيل، لا بريد إلكتروني، لا حدود للملفات. مجاني للأبد."
                  : "No sign-up, no email, no file limits. Free forever."}
              </p>
            </div>
            <div className="p-4 rounded-2xl border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-900">
              <Icons.Globe className="h-5 w-5 text-blue-500 mb-2" />
              <h3 className="text-sm font-semibold text-surface-900 dark:text-surface-100">
                {locale === "ar" ? "يعمل بدون إنترنت" : "Works Offline"}
              </h3>
              <p className="text-xs text-surface-500 dark:text-surface-400 mt-1">
                {locale === "ar"
                  ? "بعد التحميل الأول، تعمل الأدوات حتى بدون اتصال بالإنترنت."
                  : "After initial load, tools work even without internet connection."}
              </p>
            </div>
          </div>
        </Container>
      </section>

      <section className="py-12">
        <Container>
          {relatedTools.length > 0 && (
            <>
              <h2 className="text-2xl font-bold text-surface-900 dark:text-surface-50 mb-6">
                {locale === "ar" ? `المزيد من ${cat.title}` : `More ${cat.title}`}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-12">
                {relatedTools.map((rt) => (
                  <ToolCard
                    key={rt.id}
                    tool={rt}
                    locale={locale}
                    categorySlug={cat.slug}
                  />
                ))}
              </div>
            </>
          )}

          <h2 className="text-2xl font-bold text-surface-900 dark:text-surface-50 mb-6">
            {locale === "ar" ? "تصفح أدوات أخرى" : "Browse Other Tools"}
          </h2>
          <div className="flex flex-wrap gap-3">
            {otherCategories.map((oc) => {
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              const OCIcon = (Icons as any)[oc.icon] || Icons.Wrench;
              return (
                <Link
                  key={oc.id}
                  href={`/${locale}/${oc.slug}`}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-surface-200 dark:border-surface-700 hover:bg-surface-50 dark:hover:bg-surface-800 transition-colors text-sm font-medium text-surface-600 dark:text-surface-400"
                >
                  <OCIcon className="h-4 w-4" />
                  {oc.title}
                </Link>
              );
            })}
          </div>
        </Container>
      </section>
    </>
  );
}
