import Link from "next/link";
import { Container } from "@/components/ui/container";
import { blogPosts } from "@/lib/blog/posts";
import { FileText, Calendar, Clock, ArrowRight, Sparkles } from "lucide-react";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  return {
    title: locale === "ar"
      ? "مدونة WorldPDF — نصائح وشروحات أدوات PDF المجانية"
      : "WorldPDF Blog — Free PDF Tools Tips, Tutorials & Guides",
    description: locale === "ar"
      ? "اكتشف نصائح وشروحات حول دمج وضغط وتعديل ملفات PDF مجاناً. تعلم كيف تستخدم أدوات WorldPDF بأقصى فعالية."
      : "Discover tips and tutorials on merging, compressing, and editing PDF files for free. Learn how to use WorldPDF tools most effectively.",
    alternates: {
      canonical: `https://www.myworldpdf.com/${locale}/blog`,
      languages: {
        en: "https://www.myworldpdf.com/en/blog",
        ar: "https://www.myworldpdf.com/ar/blog",
        "x-default": "https://www.myworldpdf.com/en/blog",
      },
    },
  };
}

export default async function BlogPage({ params }: Props) {
  const { locale } = await params;
  const isAr = locale === "ar";

  return (
    <>
      {/* Blog Hero */}
      <section className="relative overflow-hidden bg-gradient-to-b from-brand-50/30 to-white dark:from-surface-950 dark:to-surface-900 pt-16 md:pt-24 pb-12">
        <div className="absolute inset-0 -z-10 flex justify-center overflow-hidden pointer-events-none">
          <div className="w-[80rem] flex-none translate-y-[-8rem] opacity-15 dark:opacity-10">
            <div className="aspect-[1155/678] w-[60rem] bg-gradient-to-tr from-brand-400 to-purple-500 [clip-path:polygon(74.1%_44.1%,_100%_61.6%,_97.5%_26.9%,_85.5%_0.1%,_80.7%_2%,_72.5%_32.5%,_60.2%_62.4%,_52.4%_68.1%,_47.5%_58.3%,_45.2%_34.5%,_27.5%_76.7%,_0.1%_64.9%,_17.9%_100%,_27.7%_76.8%,_76.1%_97.7%,_74.1%_44.1%)]"></div>
          </div>
        </div>

        <Container>
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 rounded-full bg-brand-50 dark:bg-brand-950/50 px-4 py-1.5 text-sm font-semibold text-brand-600 dark:text-brand-400 ring-1 ring-inset ring-brand-500/10 mb-6">
              <Sparkles className="h-4 w-4 text-brand-500" />
              <span>{isAr ? "نصائح وشروحات" : "Tips & Tutorials"}</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-surface-900 dark:text-surface-50">
              {isAr ? "مدونة WorldPDF" : "WorldPDF Blog"}
            </h1>
            <p className="mt-6 text-lg text-surface-500 dark:text-surface-400 max-w-2xl mx-auto">
              {isAr
                ? "تعلم كيف تستخدم أدوات PDF المجانية بأقصى فعالية. نصائح عملية، شروحات خطوة بخطوة، ومقارنات مع الأدوات الأخرى."
                : "Learn how to use free PDF tools most effectively. Practical tips, step-by-step guides, and comparisons with other tools."}
            </p>
          </div>
        </Container>
      </section>

      {/* Blog Posts Grid */}
      <section className="py-12 md:py-16 bg-white dark:bg-surface-950">
        <Container>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {blogPosts.map((post, index) => (
              <Link
                key={post.slug}
                href={`/${locale}/blog/${post.slug}`}
                className="group"
              >
                <article className="h-full flex flex-col rounded-2xl border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-900 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                  {/* Gradient Header */}
                  <div className={`h-36 flex items-center justify-center relative overflow-hidden ${
                    index === 0 ? "bg-gradient-to-br from-red-500 to-orange-500" :
                    index === 1 ? "bg-gradient-to-br from-blue-500 to-cyan-500" :
                    index === 2 ? "bg-gradient-to-br from-purple-500 to-pink-500" :
                    index === 3 ? "bg-gradient-to-br from-emerald-500 to-teal-500" :
                    index === 4 ? "bg-gradient-to-br from-amber-500 to-yellow-500" :
                    "bg-gradient-to-br from-indigo-500 to-violet-500"
                  }`}>
                    <div className="absolute inset-0 bg-black/10"></div>
                    <FileText className="h-12 w-12 text-white/90 relative z-10 group-hover:scale-110 transition-transform duration-300" />
                  </div>

                  {/* Content */}
                  <div className="flex-1 p-6 flex flex-col">
                    {/* Meta */}
                    <div className="flex items-center gap-3 text-xs text-surface-400 mb-3">
                      <span className="inline-flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {new Date(post.date).toLocaleDateString(locale === "ar" ? "ar-EG" : "en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </span>
                      <span>&middot;</span>
                      <span className="inline-flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {post.readTime}
                      </span>
                    </div>

                    {/* Category */}
                    <span className="inline-block px-2.5 py-0.5 rounded-full bg-brand-50 dark:bg-brand-950/40 text-brand-600 dark:text-brand-400 text-[10px] font-bold uppercase tracking-wider mb-3 w-fit">
                      {isAr ? post.categoryAr : post.category}
                    </span>

                    {/* Title */}
                    <h2 className="font-bold text-surface-900 dark:text-surface-100 group-hover:text-brand-500 transition-colors mb-3 text-base leading-snug">
                      {isAr ? post.titleAr : post.title}
                    </h2>

                    {/* Description */}
                    <p className="text-sm text-surface-500 dark:text-surface-400 line-clamp-3 flex-1">
                      {isAr ? post.descriptionAr : post.description}
                    </p>

                    {/* Read More */}
                    <div className="mt-4 flex items-center gap-1.5 text-brand-500 text-sm font-semibold group-hover:gap-3 transition-all">
                      <span>{isAr ? "اقرأ المزيد" : "Read More"}</span>
                      <ArrowRight className={`h-4 w-4 ${isAr ? "rotate-180" : ""}`} />
                    </div>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}
