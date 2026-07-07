import Link from "next/link";
import { getTranslations } from "next-intl/server";
import {
  Shield,
  Zap,
  Sparkles,
  Star,
  ArrowRight,
  Upload,
  Sliders,
  Download,
  CheckCircle,
  Server,
  Globe,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { WebSiteSchema, OrganizationSchema } from "@/components/seo/schema";
import { categories } from "@/lib/tools/registry";
import { InteractiveToolsGrid } from "@/components/tools/interactive-tools-grid";

type Props = {
  params: Promise<{ locale: string }>;
};

const features = [
  { icon: Shield, titleKey: "secure", descKey: "secureDesc", color: "text-green-500", bg: "bg-green-50 dark:bg-green-950/30" },
  { icon: Zap, titleKey: "fast", descKey: "fastDesc", color: "text-amber-500", bg: "bg-amber-50 dark:bg-amber-950/30" },
  { icon: Sparkles, titleKey: "free", descKey: "freeDesc", color: "text-purple-500", bg: "bg-purple-50 dark:bg-purple-950/30" },
  { icon: Star, titleKey: "quality", descKey: "qualityDesc", color: "text-blue-500", bg: "bg-blue-50 dark:bg-blue-950/30" },
];

const howItWorks = [
  { icon: Upload, titleKey: "step1Title", descKey: "step1Desc", step: "01" },
  { icon: Sliders, titleKey: "step2Title", descKey: "step2Desc", step: "02" },
  { icon: Download, titleKey: "step3Title", descKey: "step3Desc", step: "03" },
];

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "common.seo" });

  return {
    title: t("homeTitle"),
    description: t("homeDescription"),
  };
}

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale });

  return (
    <>
      <WebSiteSchema />
      <OrganizationSchema />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-white dark:bg-surface-950 pt-16 md:pt-20 pb-10">
        <div className="container-nova relative z-10">
          <div className="max-w-4xl mx-auto text-center animate-fade-in space-y-5">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-surface-900 dark:text-surface-50">
              {t("home.hero.title")}
            </h1>
            <p className="text-base sm:text-lg text-surface-500 dark:text-surface-400 max-w-3xl mx-auto leading-relaxed">
              {t("home.hero.subtitle")}
            </p>
          </div>
        </div>
      </section>

      {/* Interactive Tool Grid Section */}
      <section className="pb-16 bg-white dark:bg-surface-950">
        <div className="container-nova">
          <InteractiveToolsGrid categories={categories} locale={locale} />
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 md:py-20 bg-surface-100/50 dark:bg-surface-900/30 border-y border-surface-200 dark:border-surface-800/80">
        <div className="container-nova">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-surface-900 dark:text-surface-50">
              {t("home.howItWorks.title")}
            </h2>
            <p className="mt-3 text-lg text-surface-500 dark:text-surface-400">
              {t("home.howItWorks.subtitle")}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {howItWorks.map((step) => {
              const Icon = step.icon;
              return (
                <div key={step.step} className="text-center relative">
                  <div className="flex items-center justify-center">
                    <div className="relative">
                      <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-brand-50 dark:bg-brand-950/50 border border-brand-200 dark:border-brand-800">
                        <Icon className="h-8 w-8 text-brand-500" />
                      </div>
                      <span className="absolute -top-2 -right-2 flex h-7 w-7 items-center justify-center rounded-full bg-brand-500 text-white text-xs font-bold">
                        {step.step}
                      </span>
                    </div>
                  </div>
                  <h3 className="mt-4 font-semibold text-surface-900 dark:text-surface-100">
                    {t(`home.howItWorks.${step.titleKey}`)}
                  </h3>
                  <p className="mt-2 text-sm text-surface-500 dark:text-surface-400">
                    {t(`home.howItWorks.${step.descKey}`)}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 md:py-20">
        <div className="container-nova">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-surface-900 dark:text-surface-50">
              {t("home.features.title") || "Why WorldPDF?"}
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <div key={feature.titleKey} className="text-center p-6 rounded-2xl border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-900 hover:shadow-lg transition-all hover:-translate-y-0.5">
                  <div className={`flex h-14 w-14 items-center justify-center rounded-2xl ${feature.bg} mx-auto mb-4`}>
                    <Icon className={`h-7 w-7 ${feature.color}`} />
                  </div>
                  <h3 className="font-semibold text-surface-900 dark:text-surface-100">{t(`home.features.${feature.titleKey}`)}</h3>
                  <p className="mt-2 text-sm text-surface-500 dark:text-surface-400">{t(`home.features.${feature.descKey}`)}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-20">
        <div className="container-nova">
          <div className="max-w-2xl mx-auto text-center bg-gradient-to-br from-brand-500 to-brand-700 rounded-3xl p-10 md:p-14">
            <h2 className="text-3xl md:text-4xl font-bold text-white">
              {t("home.premium.title")}
            </h2>
            <p className="mt-4 text-lg text-white/80">
              {t("home.premium.desc")}
            </p>
            <div className="mt-8">
              <Link href={`/${locale}/pricing`}>
                <Button variant="secondary" size="lg" className="bg-white text-brand-600 hover:bg-white/90 text-base px-8">
                  {t("home.premium.cta")}
                  <ArrowRight className="h-4 w-4 rtl:rotate-180" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
