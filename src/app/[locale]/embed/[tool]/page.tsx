import { notFound } from "next/navigation";
import { getToolBySlug, categories } from "@/lib/tools/registry";
import { locales } from "@/lib/i18n/config";
import { LazyPdfToolWrapper } from "@/components/tools/pdf-tool-lazy";

type Props = {
  params: Promise<{ locale: string; tool: string }>;
};

export async function generateStaticParams() {
  const paths: { locale: string; tool: string }[] = [];
  for (const locale of locales) {
    for (const cat of categories) {
      for (const t of cat.tools) {
        paths.push({ locale, tool: t.slug });
      }
    }
  }
  return paths;
}

export async function generateMetadata({ params }: Props) {
  const { tool, locale } = await params;
  const t = getToolBySlug(tool);
  if (!t) return {};

  return {
    title: `${t.title} Widget | WorldPDF`,
    description: `Embeddable client-side ${t.title} tool widget. Process files privately in your browser.`,
    robots: {
      index: false, // Do not index the embed pages directly to avoid duplicate content penalty
      follow: true,
    },
  };
}

export default async function EmbedToolPage({ params }: Props) {
  const { locale, tool } = await params;
  const toolData = getToolBySlug(tool);

  if (!toolData) notFound();

  const isRtl = locale === "ar";

  // Find category for the backlink URL
  let catSlug = "pdf";
  for (const cat of categories) {
    if (cat.tools.some((t) => t.slug === tool)) {
      catSlug = cat.slug;
      break;
    }
  }

  return (
    <div className="min-h-screen bg-surface-50/30 dark:bg-surface-950 p-4 flex flex-col justify-between">
      <div className="flex-1 w-full max-w-4xl mx-auto flex items-center justify-center">
        <div className="w-full">
          <LazyPdfToolWrapper slug={toolData.slug} locale={locale} />
        </div>
      </div>
      
      {/* Embed footer with organic backlink hook */}
      <footer className="text-center py-4 border-t border-surface-100 dark:border-surface-850 mt-6 text-xs text-surface-400 font-medium">
        <p className="flex items-center justify-center gap-1 flex-wrap">
          <span>
            {isRtl
              ? "تعمل هذه الأداة محلياً 100% في متصفحك بواسطة"
              : "This tool runs 100% locally in your browser via"}
          </span>
          <a
            href={`https://www.myworldpdf.com/${locale}/${catSlug}/${toolData.slug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-brand-500 hover:text-brand-600 font-bold underline transition-colors"
          >
            myworldpdf.com
          </a>
          <span>—</span>
          <span>
            {isRtl
              ? "جميع الحقوق محفوظة."
              : "Free & secure online tools."}
          </span>
        </p>
      </footer>
    </div>
  );
}
