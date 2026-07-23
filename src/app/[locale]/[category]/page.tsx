import { notFound } from "next/navigation";
import Link from "next/link";
import * as Icons from "lucide-react";
import { categories, getCategoryBySlug } from "@/lib/tools/registry";
import { locales } from "@/lib/i18n/config";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { ToolCard } from "@/components/tools/tool-card";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import {
  WebSiteSchema,
  BreadcrumbSchema,
} from "@/components/seo/schema";

type Props = {
  params: Promise<{ locale: string; category: string }>;
};

export async function generateStaticParams() {
  const paths: { locale: string; category: string }[] = [];
  for (const locale of locales) {
    for (const cat of categories) {
      paths.push({ locale, category: cat.slug });
    }
  }
  return paths;
}

export async function generateMetadata({ params }: Props) {
  const { locale, category } = await params;
  const cat = getCategoryBySlug(category);
  if (!cat) return {};

  return {
    title: cat.metaTitle,
    description: cat.metaDescription,
    alternates: {
      canonical: `https://www.myworldpdf.com/${locale}/${cat.slug}`,
      languages: {
        en: `https://www.myworldpdf.com/en/${cat.slug}`,
        ar: `https://www.myworldpdf.com/ar/${cat.slug}`,
        "x-default": `https://www.myworldpdf.com/en/${cat.slug}`,
      },
    },
    openGraph: {
      title: cat.metaTitle,
      description: cat.metaDescription,
      url: `https://www.myworldpdf.com/${locale}/${cat.slug}`,
      siteName: "WorldPDF",
      type: "website",
    },
  };
}

export default async function CategoryPage({ params }: Props) {
  const { locale, category } = await params;
  const cat = getCategoryBySlug(category);

  if (!cat) notFound();

  const breadcrumbItems = [
    { label: cat.title, href: `/${locale}/${cat.slug}` },
  ];

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const IconComponent = (Icons as any)[cat.icon] || Icons.Wrench;

  return (
    <>
      <WebSiteSchema />
      <BreadcrumbSchema
        items={[
          { name: "Home", url: `https://www.myworldpdf.com/${locale}` },
          { name: cat.title, url: `https://www.myworldpdf.com/${locale}/${cat.slug}` },
        ]}
      />

      <div className="bg-gradient-to-b from-brand-50/50 to-white dark:from-surface-950 dark:to-surface-900 border-b border-surface-200 dark:border-surface-800">
        <Container className="py-12 md:py-16">
          <Breadcrumbs items={breadcrumbItems} />

          <div className="flex items-center gap-4 mb-4">
            <div
              className={`flex h-14 w-14 items-center justify-center rounded-2xl ${cat.tools[0]?.bgColor || "bg-surface-100 dark:bg-surface-800"}`}
            >
              <IconComponent
                className={`h-7 w-7 ${cat.tools[0]?.color || "text-surface-500"}`}
              />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-surface-900 dark:text-surface-50">
                {cat.title}
              </h1>
              <p className="mt-2 text-lg text-surface-500 dark:text-surface-400 max-w-2xl">
                {cat.description}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-sm text-surface-500 dark:text-surface-400">
            <span className="font-medium text-surface-700 dark:text-surface-300">
              {cat.tools.length}
            </span>
            tools available
          </div>
        </Container>
      </div>

      <Section>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {cat.tools.map((tool) => (
            <ToolCard
              key={tool.id}
              tool={tool}
              locale={locale}
              categorySlug={cat.slug}
            />
          ))}
        </div>
      </Section>

      <section className="py-12 border-t border-surface-200 dark:border-surface-800">
        <Container>
          <h2 className="text-2xl font-bold text-surface-900 dark:text-surface-50 mb-6">
            Other Categories
          </h2>
          <div className="flex flex-wrap gap-3">
            {categories
              .filter((c) => c.id !== cat.id)
              .map((otherCat) => {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const OtherIcon = (Icons as any)[otherCat.icon] || Icons.Wrench;
                return (
                  <Link
                    key={otherCat.id}
                    href={`/${locale}/${otherCat.slug}`}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-surface-200 dark:border-surface-700 hover:bg-surface-50 dark:hover:bg-surface-800 transition-colors text-sm font-medium text-surface-600 dark:text-surface-400"
                  >
                    <OtherIcon className="h-4 w-4" />
                    {otherCat.title}
                  </Link>
                );
              })}
          </div>
        </Container>
      </section>
    </>
  );
}
