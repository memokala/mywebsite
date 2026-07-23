import { notFound } from "next/navigation";
import Link from "next/link";
import * as Icons from "lucide-react";
import { getToolBySlug, categories, getCategoryBySlug, getTranslationKeys } from "@/lib/tools/registry";
import { locales } from "@/lib/i18n/config";
import { Container } from "@/components/ui/container";
import { ToolCard } from "@/components/tools/tool-card";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import {
  ToolPageSchema,
} from "@/components/seo/schema";
import { LazyPdfToolWrapper } from "@/components/tools/pdf-tool-lazy";
import { getTranslations } from "next-intl/server";
import { snippetBaitData } from "@/lib/seo/snippet-bait";

type Props = {
  params: Promise<{ locale: string; category: string; tool: string }>;
};

export async function generateStaticParams() {
  const paths: { locale: string; category: string; tool: string }[] = [];
  for (const locale of locales) {
    for (const cat of categories) {
      for (const t of cat.tools) {
        paths.push({ locale, category: cat.slug, tool: t.slug });
      }
    }
  }
  return paths;
}

const arabicLongTailSEO: Record<string, { title: string; desc: string }> = {
  "merge-pdf": {
    title: "دمج ملفات PDF بدون رفعها أونلاين - دمج PDF مجاناً | WorldPDF",
    desc: "كيفية دمج عدة ملفات PDF في ملف واحد مجاناً. دمج ملفات PDF بدون رفعها أونلاين وبأمان 100% مباشرة في متصفحك دون استهلاك خوادم.",
  },
  "compress-pdf": {
    title: "تقليل حجم ملف PDF مع الحفاظ على الجودة في المتصفح | WorldPDF",
    desc: "تقليل حجم ملف PDF مع الحفاظ على الجودة مجاناً أونلاين. ضغط ملفات PDF بأمان تام دون رفعها إلى السيرفر لسرعة فائقة وخصوصية تامة.",
  },
  "edit-pdf": {
    title: "تعديل PDF مجانا في المتصفح - تعديل ملفات PDF أونلاين | WorldPDF",
    desc: "تعديل ملفات PDF مجاناً أونلاين في متصفحك. إضافة نصوص وصور وأشكال وتوقيعات لملفات PDF دون رفع الملفات وبسرعة عالية.",
  },
  "protect-pdf": {
    title: "حماية ملف PDF بكلمة مرور أونلاين مجانا وبأمان | WorldPDF",
    desc: "حماية ملف PDF بكلمة مرور أونلاين مجاناً. تشفير وتأمين مستندات PDF محلياً في متصفحك لحماية خصوصيتك 100% دون رفع مستنداتك.",
  },
  "crop-pdf": {
    title: "قص هوامش صفحات PDF بدون برامج أونلاين | WorldPDF",
    desc: "قص هوامش صفحات PDF وقص صفحات PDF أونلاين مجاناً بدون برامج. معالجة سريعة وآمنة في متصفحك مباشرة لقص الأجزاء غير المرغوبة.",
  },
  "unlock-pdf": {
    title: "إزالة كلمة المرور من ملف PDF بدون رفع الملف أونلاين | WorldPDF",
    desc: "إزالة كلمة المرور والحماية من ملفات PDF مجاناً أونلاين بدون رفع الملف. فك قفل ملف PDF بأمان تام في متصفحك محلياً.",
  },
  "add-watermark-pdf": {
    title: "إضافة علامة مائية لملفات PDF أونلاين مجاناً | WorldPDF",
    desc: "إضافة علامة مائية (نصية أو صورة) لملفات PDF أونلاين لحماية حقوقك. معالجة محلية سريعة وآمنة 100% في المتصفح دون رفع.",
  },
  "split-pdf": {
    title: "تقسيم صفحات ملف PDF مجانا أونلاين وبسرعة | WorldPDF",
    desc: "تقسيم صفحات ملف PDF مجاناً أونلاين. استخراج صفحات معينة من ملف PDF أو تقسيم الملف محلياً وبأمان تامة داخل المتصفح.",
  },
  "add-page-numbers-pdf": {
    title: "إضافة أرقام الصفحات لملف PDF بالعربي مجاناً | WorldPDF",
    desc: "إضافة أرقام الصفحات لملف PDF بالعربي أونلاين. ترقيم صفحات PDF مجاناً مع اختيار التنسيق والموقع المناسب مباشرة في متصفحك.",
  },
  "rotate-pdf": {
    title: "تدوير صفحات PDF أونلاين مجانا وبأمان | WorldPDF",
    desc: "تدوير صفحات PDF إلى الاتجاه الصحيح أونلاين مجاناً وبأمان تام. إصلاح اتجاه الصفحات محلياً في متصفحك بدون رفع الملف.",
  },
  "organize-pdf": {
    title: "ترتيب وتنظيم صفحات PDF أونلاين مجاناً وبأمان | WorldPDF",
    desc: "ترتيب وتنظيم وحذف صفحات PDF أونلاين مجاناً. إعادة ترتيب الصفحات بالسحب والإفلات محلياً في متصفحك بدون رفع الملفات.",
  },
  "sign-pdf": {
    title: "توقيع ملف PDF إلكترونياً أونلاين مجاناً وبأمان | WorldPDF",
    desc: "إضافة توقيع إلكتروني لملفات PDF أونلاين مجاناً. ارسم أو اكتب توقيعك بأمان تام — ملفاتك لا تغادر جهازك أبداً.",
  },
  "convert-pdf": {
    title: "تحويل ملفات PDF مجاناً أونلاين بدون رفع | WorldPDF",
    desc: "تحويل ملفات PDF إلى Word و JPG و PNG والمزيد من الصيغ مجاناً أونلاين. تحويل فوري ومحلي في متصفحك بدون رفع الملفات.",
  },
  "ocr-pdf": {
    title: "تحويل PDF ممسوح إلى نص قابل للبحث مجاناً أونلاين | WorldPDF",
    desc: "تحويل ملفات PDF الممسوحة ضوئياً إلى نص قابل للبحث والتعديل أونلاين مجاناً. تقنية OCR متقدمة تعمل محلياً في متصفحك.",
  },
  "compare-pdf": {
    title: "مقارنة ملفين PDF أونلاين مجاناً وبدون رفع | WorldPDF",
    desc: "مقارنة ملفين PDF جنباً إلى جنب أونلاين مجاناً. اكتشف الفروقات والتغييرات بين نسخ PDF محلياً في متصفحك بدون رفع.",
  },
  "redact-pdf": {
    title: "حجب وإخفاء المعلومات الحساسة في PDF أونلاين مجاناً | WorldPDF",
    desc: "حجب وإخفاء النصوص والصور الحساسة في ملفات PDF نهائياً أونلاين مجاناً. أكثر الطرق أماناً — الملفات لا تغادر جهازك.",
  },
  "compress-image": {
    title: "ضغط الصور أونلاين مجاناً بدون رفعها - تقليل حجم الصور | WorldPDF",
    desc: "ضغط صور JPG و PNG و WebP أونلاين مجاناً بدون رفعها. تقليل حجم الصور بنسبة 90% مع الحفاظ على الجودة. معالجة محلية وآمنة.",
  },
  "resize-image": {
    title: "تغيير حجم الصور أونلاين مجاناً بدون رفع | WorldPDF",
    desc: "تغيير أبعاد الصور أونلاين مجاناً بدون رفعها. تحكم دقيق بالعرض والارتفاع مع الحفاظ على النسب. معالجة فورية في المتصفح.",
  },
  "convert-image": {
    title: "تحويل صيغ الصور أونلاين مجاناً بدون رفع | WorldPDF",
    desc: "تحويل الصور بين JPG و PNG و WebP والمزيد أونلاين مجاناً بدون رفعها. تحويل فوري وآمن في متصفحك مباشرة.",
  },
};

export async function generateMetadata({ params }: Props) {
  const { locale, tool, category } = await params;
  const t = getToolBySlug(tool);
  if (!t) return {};

  // Programmatic Localized SEO
  const translate = await getTranslations({ locale });
  const transKey = getTranslationKeys(t.id);
  const translatedTitle = transKey ? translate(`${transKey}.title`) : t.title;
  const translatedDesc = transKey ? translate(`${transKey}.description`) : t.description;

  let seoTitle = t.metaTitle;
  let seoDesc = t.metaDescription;

  if (locale === "ar") {
    if (arabicLongTailSEO[tool]) {
      seoTitle = arabicLongTailSEO[tool].title;
      seoDesc = arabicLongTailSEO[tool].desc;
    } else {
      seoTitle = `${translatedTitle} مجاناً أونلاين - ${translatedDesc} | WorldPDF`;
      seoDesc = `${translatedDesc} مجاناً وبأمان تام أونلاين. معالجة سريعة وآمنة للملفات مباشرة في متصفحك بدون رفع.`;
    }
  } else if (locale !== "en") {
    seoTitle = `${translatedTitle} Online Free - ${translatedDesc} | WorldPDF`;
    seoDesc = `${translatedDesc} online for free and securely. Fast client-side processing directly in your browser without uploads.`;
  }

  return {
    title: seoTitle,
    description: seoDesc,
    alternates: {
      canonical: `https://www.myworldpdf.com/${locale}/${category}/${t.slug}`,
      languages: {
        "en": `https://www.myworldpdf.com/en/${category}/${t.slug}`,
        "ar": `https://www.myworldpdf.com/ar/${category}/${t.slug}`,
        "x-default": `https://www.myworldpdf.com/en/${category}/${t.slug}`,
      },
    },
    openGraph: {
      title: seoTitle,
      description: seoDesc,
      url: `https://www.myworldpdf.com/${locale}/${category}/${t.slug}`,
      type: "website",
      siteName: "WorldPDF",
    },
    twitter: {
      card: "summary_large_image",
      title: seoTitle,
      description: seoDesc,
    },
  };
}

export default async function ToolPage({ params }: Props) {
  const { locale, category, tool } = await params;
  const toolData = getToolBySlug(tool);
  const cat = getCategoryBySlug(category);

  if (!toolData || !cat) notFound();

  const relatedTools = cat.tools.filter((ct) => ct.id !== toolData.id);
  const otherCategories = categories.filter((c) => c.id !== category);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const IconComponent = (Icons as any)[toolData.icon] || Icons.Wrench;

  // Get snippet-bait content for this tool + locale
  const snippetBait = snippetBaitData[toolData.slug];
  const snippetContent = snippetBait
    ? locale === "ar"
      ? snippetBait.ar
      : snippetBait.en
    : null;

  // Get translations for localized FAQ
  const t = await getTranslations({ locale });

  return (
    <>
      {/* Unified @graph JSON-LD Schema */}
      <ToolPageSchema
        tool={{
          title: toolData.title,
          description: toolData.description,
          slug: toolData.slug,
        }}
        category={{
          title: cat.title,
          slug: cat.slug,
        }}
        locale={locale}
        faq={toolData.faq}
      />

      <div className="bg-gradient-to-b from-brand-50/50 to-white dark:from-surface-950 dark:to-surface-900 border-b border-surface-200 dark:border-surface-800">
        <Container className="py-8 md:py-12">
          <Breadcrumbs
            items={[
              { label: cat.title, href: `/${locale}/${cat.slug}` },
              { label: toolData.title },
            ]}
          />

          <div className="flex items-center gap-4 mb-4">
            <div
              className={`flex h-12 w-12 items-center justify-center rounded-2xl ${toolData.bgColor}`}
            >
              <IconComponent className={`h-6 w-6 ${toolData.color}`} />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-surface-900 dark:text-surface-50">
                {toolData.title}
              </h1>
              <p className="mt-1 text-surface-500 dark:text-surface-400">
                {toolData.description}
              </p>
            </div>
          </div>

          {/* Snippet-bait paragraph for Featured Snippet capture */}
          {snippetContent && (
            <div
              className="text-sm sm:text-base text-surface-600 dark:text-surface-400 leading-relaxed max-w-3xl"
              dir={locale === "ar" ? "rtl" : "ltr"}
              dangerouslySetInnerHTML={{ __html: snippetContent }}
            />
          )}

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

      {/* How This Tool Works — SEO content section */}
      <section className="py-12 bg-surface-50/50 dark:bg-surface-900/50 border-y border-surface-200 dark:border-surface-800">
        <Container>
          <h2 className="text-2xl font-bold text-surface-900 dark:text-surface-50 mb-6">
            {locale === "ar" ? "كيف تعمل هذه الأداة" : "How This Tool Works"}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl">
            <div className="flex gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 dark:bg-brand-950/40 text-brand-500 font-bold text-sm shrink-0">
                01
              </div>
              <div>
                <h3 className="font-semibold text-surface-900 dark:text-surface-100 text-sm">
                  {locale === "ar" ? "أضف ملفك" : "Add Your File"}
                </h3>
                <p className="text-xs text-surface-500 dark:text-surface-400 mt-1 leading-relaxed">
                  {locale === "ar"
                    ? "اسحب وأفلت ملفك أو اضغط للاختيار من جهازك. لا يتم رفع أي شيء."
                    : "Drag & drop your file or click to browse. Nothing gets uploaded."}
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 dark:bg-brand-950/40 text-brand-500 font-bold text-sm shrink-0">
                02
              </div>
              <div>
                <h3 className="font-semibold text-surface-900 dark:text-surface-100 text-sm">
                  {locale === "ar" ? "المعالجة في متصفحك" : "Processing In Your Browser"}
                </h3>
                <p className="text-xs text-surface-500 dark:text-surface-400 mt-1 leading-relaxed">
                  {locale === "ar"
                    ? "تتم المعالجة بالكامل محلياً في متصفحك باستخدام JavaScript. صفر اتصال بالسيرفر."
                    : "Processing happens entirely in your browser using JavaScript. Zero server contact."}
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 dark:bg-brand-950/40 text-brand-500 font-bold text-sm shrink-0">
                03
              </div>
              <div>
                <h3 className="font-semibold text-surface-900 dark:text-surface-100 text-sm">
                  {locale === "ar" ? "حمّل النتيجة" : "Download Result"}
                </h3>
                <p className="text-xs text-surface-500 dark:text-surface-400 mt-1 leading-relaxed">
                  {locale === "ar"
                    ? "حمّل ملفك المعالج فوراً. تم إنشاؤه على جهازك — لم يلمس أي سيرفر."
                    : "Download your processed file instantly. It was created on your device — never touched a server."}
                </p>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {toolData.faq && toolData.faq.length > 0 && (
        <section className="py-12 bg-white dark:bg-surface-950/50">
          <Container>
            <h2 className="text-2xl font-bold text-surface-900 dark:text-surface-50 mb-8">
              {locale === "ar" ? "الأسئلة الشائعة" : "Frequently Asked Questions"}
            </h2>
            <div className="max-w-3xl space-y-4">
              {toolData.faq.map((faq, index) => (
                <details
                  key={index}
                  className="group rounded-2xl border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-900 overflow-hidden"
                >
                  <summary className="flex items-center justify-between px-6 py-4 cursor-pointer text-sm font-medium text-surface-900 dark:text-surface-100 hover:bg-surface-50 dark:hover:bg-surface-800 transition-colors">
                    {faq.question}
                    <Icons.ChevronDown className="h-4 w-4 text-surface-400 group-open:rotate-180 transition-transform" />
                  </summary>
                  <div className="px-6 pb-4 text-sm text-surface-600 dark:text-surface-400 leading-relaxed">
                    {faq.answer}
                  </div>
                </details>
              ))}
            </div>
          </Container>
        </section>
      )}

      {/* Why WorldPDF — USP reinforcement for dwell time */}
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
