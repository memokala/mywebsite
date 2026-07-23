import { notFound } from "next/navigation";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { blogPosts, getBlogPostBySlug } from "@/lib/blog/posts";
import { locales } from "@/lib/i18n/config";
import { JsonLd } from "@/components/seo/schema";
import {
  Calendar,
  Clock,
  ArrowRight,
  ArrowLeft,
  Shield,
  Zap,
  CheckCircle2,
} from "lucide-react";

type Props = {
  params: Promise<{ locale: string; slug: string }>;
};

export async function generateStaticParams() {
  const paths: { locale: string; slug: string }[] = [];
  for (const locale of locales) {
    for (const post of blogPosts) {
      paths.push({ locale, slug: post.slug });
    }
  }
  return paths;
}

export async function generateMetadata({ params }: Props) {
  const { locale, slug } = await params;
  const post = getBlogPostBySlug(slug);
  if (!post) return {};

  const isAr = locale === "ar";
  const title = isAr ? post.titleAr : post.title;
  const description = isAr ? post.descriptionAr : post.description;

  return {
    title: `${title} | WorldPDF`,
    description,
    alternates: {
      canonical: `https://www.myworldpdf.com/${locale}/blog/${slug}`,
      languages: {
        en: `https://www.myworldpdf.com/en/blog/${slug}`,
        ar: `https://www.myworldpdf.com/ar/blog/${slug}`,
        "x-default": `https://www.myworldpdf.com/en/blog/${slug}`,
      },
    },
    openGraph: {
      title,
      description,
      url: `https://www.myworldpdf.com/${locale}/blog/${slug}`,
      type: "article",
      siteName: "WorldPDF",
      publishedTime: post.date,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { locale, slug } = await params;
  const post = getBlogPostBySlug(slug);
  if (!post) notFound();

  const isAr = locale === "ar";
  const title = isAr ? post.titleAr : post.title;
  const description = isAr ? post.descriptionAr : post.description;
  const content = isAr ? post.contentAr : post.content;
  const howToSteps = isAr ? post.howToStepsAr : post.howToSteps;
  const category = isAr ? post.categoryAr : post.category;

  // Find current post index for prev/next navigation
  const currentIndex = blogPosts.findIndex((p) => p.slug === slug);
  const prevPost = currentIndex > 0 ? blogPosts[currentIndex - 1] : null;
  const nextPost = currentIndex < blogPosts.length - 1 ? blogPosts[currentIndex + 1] : null;

  // Determine the tool's category slug for the CTA link
  const toolCategorySlug = "pdf"; // All current blog posts link to PDF tools

  return (
    <>
      {/* Article + HowTo JSON-LD Schema */}
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "Article",
              headline: title,
              description,
              datePublished: post.date,
              dateModified: post.date,
              author: {
                "@type": "Organization",
                name: "WorldPDF",
                url: "https://www.myworldpdf.com",
              },
              publisher: {
                "@type": "Organization",
                name: "WorldPDF",
                url: "https://www.myworldpdf.com",
                logo: {
                  "@type": "ImageObject",
                  url: "https://www.myworldpdf.com/icons/apple-icon.png",
                },
              },
              mainEntityOfPage: {
                "@type": "WebPage",
                "@id": `https://www.myworldpdf.com/${locale}/blog/${slug}`,
              },
              inLanguage: isAr ? "ar-SA" : "en-US",
            },
            {
              "@type": "HowTo",
              name: title,
              description,
              step: howToSteps.map((step, i) => ({
                "@type": "HowToStep",
                position: i + 1,
                name: step.name,
                text: step.text,
              })),
              tool: {
                "@type": "HowToTool",
                name: "WorldPDF Online Tool",
              },
              supply: [],
              totalTime: "PT1M",
            },
            {
              "@type": "BreadcrumbList",
              itemListElement: [
                {
                  "@type": "ListItem",
                  position: 1,
                  name: isAr ? "الرئيسية" : "Home",
                  item: `https://www.myworldpdf.com/${locale}`,
                },
                {
                  "@type": "ListItem",
                  position: 2,
                  name: isAr ? "المدونة" : "Blog",
                  item: `https://www.myworldpdf.com/${locale}/blog`,
                },
                {
                  "@type": "ListItem",
                  position: 3,
                  name: title,
                  item: `https://www.myworldpdf.com/${locale}/blog/${slug}`,
                },
              ],
            },
          ],
        }}
      />

      {/* Article Header */}
      <section className="bg-gradient-to-b from-brand-50/20 to-white dark:from-surface-950 dark:to-surface-900 pt-12 md:pt-16 pb-8">
        <Container>
          <div className="max-w-3xl mx-auto">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-sm text-surface-400 mb-6">
              <Link
                href={`/${locale}`}
                className="hover:text-brand-500 transition-colors"
              >
                {isAr ? "الرئيسية" : "Home"}
              </Link>
              <span>/</span>
              <Link
                href={`/${locale}/blog`}
                className="hover:text-brand-500 transition-colors"
              >
                {isAr ? "المدونة" : "Blog"}
              </Link>
              <span>/</span>
              <span className="text-surface-600 dark:text-surface-300 truncate">
                {title}
              </span>
            </nav>

            {/* Category Badge */}
            <span className="inline-block px-3 py-1 rounded-full bg-brand-50 dark:bg-brand-950/40 text-brand-600 dark:text-brand-400 text-xs font-bold uppercase tracking-wider mb-4">
              {category}
            </span>

            {/* Title */}
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight text-surface-900 dark:text-surface-50 leading-tight mb-6">
              {title}
            </h1>

            {/* Meta */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-surface-400">
              <span className="inline-flex items-center gap-1.5">
                <Calendar className="h-4 w-4" />
                {new Date(post.date).toLocaleDateString(
                  isAr ? "ar-EG" : "en-US",
                  { year: "numeric", month: "long", day: "numeric" }
                )}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Clock className="h-4 w-4" />
                {post.readTime}
              </span>
            </div>
          </div>
        </Container>
      </section>

      {/* Article Content */}
      <section className="py-8 md:py-12">
        <Container>
          <div className="max-w-3xl mx-auto">
            {/* Main content */}
            <div
              className="prose prose-lg dark:prose-invert prose-headings:font-bold prose-headings:tracking-tight prose-a:text-brand-500 prose-a:no-underline hover:prose-a:underline prose-li:marker:text-brand-500 max-w-none"
              dir={isAr ? "rtl" : "ltr"}
              dangerouslySetInnerHTML={{ __html: content }}
            />

            {/* HowTo Steps — Visual cards */}
            <div className="mt-10 mb-10">
              <h2 className="text-2xl font-bold text-surface-900 dark:text-surface-50 mb-6">
                {isAr ? "الخطوات" : "Step-by-Step Guide"}
              </h2>
              <div className="space-y-4">
                {howToSteps.map((step, index) => (
                  <div
                    key={index}
                    className="flex gap-4 p-4 rounded-2xl border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-900 hover:shadow-md transition-shadow"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 dark:bg-brand-950/40 text-brand-500 font-bold text-sm shrink-0">
                      {String(index + 1).padStart(2, "0")}
                    </div>
                    <div>
                      <h3 className="font-semibold text-surface-900 dark:text-surface-100 text-sm">
                        {step.name}
                      </h3>
                      <p className="text-sm text-surface-500 dark:text-surface-400 mt-1 leading-relaxed">
                        {step.text}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA — Try the tool */}
            <div className="my-10 p-6 md:p-8 rounded-3xl bg-gradient-to-br from-brand-500 to-brand-700 text-white text-center">
              <h2 className="text-2xl md:text-3xl font-bold mb-3">
                {isAr ? "جرب الأداة الآن — مجاناً!" : "Try the Tool Now — It's Free!"}
              </h2>
              <p className="text-white/80 mb-6 max-w-lg mx-auto">
                {isAr
                  ? "بدون تسجيل، بدون رفع ملفات، بدون علامات مائية. ابدأ الآن مجاناً."
                  : "No sign-up, no file uploads, no watermarks. Start for free right now."}
              </p>
              <div className="flex flex-wrap items-center justify-center gap-3 mb-4">
                <div className="inline-flex items-center gap-1.5 text-white/70 text-xs">
                  <Shield className="h-3.5 w-3.5" />
                  {isAr ? "خصوصية 100%" : "100% Private"}
                </div>
                <div className="inline-flex items-center gap-1.5 text-white/70 text-xs">
                  <Zap className="h-3.5 w-3.5" />
                  {isAr ? "نتائج فورية" : "Instant Results"}
                </div>
                <div className="inline-flex items-center gap-1.5 text-white/70 text-xs">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  {isAr ? "مجاني للأبد" : "Free Forever"}
                </div>
              </div>
              <Link href={`/${locale}/${toolCategorySlug}/${post.toolSlug}`}>
                <Button
                  variant="secondary"
                  size="lg"
                  className="bg-white text-brand-600 hover:bg-white/90 text-base px-8"
                >
                  {isAr ? "استخدم الأداة الآن" : "Use the Tool Now"}
                  <ArrowRight className={`h-4 w-4 ${isAr ? "rotate-180" : ""}`} />
                </Button>
              </Link>
            </div>

            {/* Prev/Next Navigation */}
            <div className="flex flex-col sm:flex-row gap-4 mt-12 pt-8 border-t border-surface-200 dark:border-surface-800">
              {prevPost ? (
                <Link
                  href={`/${locale}/blog/${prevPost.slug}`}
                  className="flex-1 group p-4 rounded-2xl border border-surface-200 dark:border-surface-700 hover:border-brand-300 dark:hover:border-brand-700 transition-colors"
                >
                  <span className="text-xs text-surface-400 flex items-center gap-1 mb-1">
                    <ArrowLeft className={`h-3 w-3 ${isAr ? "rotate-180" : ""}`} />
                    {isAr ? "المقال السابق" : "Previous"}
                  </span>
                  <span className="text-sm font-semibold text-surface-800 dark:text-surface-200 group-hover:text-brand-500 transition-colors line-clamp-2">
                    {isAr ? prevPost.titleAr : prevPost.title}
                  </span>
                </Link>
              ) : (
                <div className="flex-1" />
              )}
              {nextPost ? (
                <Link
                  href={`/${locale}/blog/${nextPost.slug}`}
                  className="flex-1 group p-4 rounded-2xl border border-surface-200 dark:border-surface-700 hover:border-brand-300 dark:hover:border-brand-700 transition-colors text-right"
                >
                  <span className="text-xs text-surface-400 flex items-center justify-end gap-1 mb-1">
                    {isAr ? "المقال التالي" : "Next"}
                    <ArrowRight className={`h-3 w-3 ${isAr ? "rotate-180" : ""}`} />
                  </span>
                  <span className="text-sm font-semibold text-surface-800 dark:text-surface-200 group-hover:text-brand-500 transition-colors line-clamp-2">
                    {isAr ? nextPost.titleAr : nextPost.title}
                  </span>
                </Link>
              ) : (
                <div className="flex-1" />
              )}
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
