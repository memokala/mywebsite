import Link from "next/link";
import { Container } from "@/components/ui/container";
import { Card, CardContent } from "@/components/ui/card";
import { Shield, Zap, Sparkles, Users, Globe, Award } from "lucide-react";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const isAr = locale === "ar";
  const title = isAr ? "عن WorldPDF — أدوات PDF مجانية وآمنة" : "About Us - WorldPDF";
  const description = isAr
    ? "تعرف على منصة WorldPDF لأدوات PDF المجانية والآمنة. هدفنا تقديم أدوات سريعة وتعمل محلياً في متصفحك لحماية الخصوصية 100%."
    : "Learn about WorldPDF, the most advanced online tools platform. Our mission is to provide free, fast, and secure tools for everyone.";

  return {
    title,
    description,
    alternates: {
      canonical: `https://www.myworldpdf.com/${locale}/about`,
      languages: {
        en: "https://www.myworldpdf.com/en/about",
        ar: "https://www.myworldpdf.com/ar/about",
        "x-default": "https://www.myworldpdf.com/en/about",
      },
    },
    openGraph: {
      title,
      description,
      url: `https://www.myworldpdf.com/${locale}/about`,
      siteName: "WorldPDF",
      type: "website",
    },
  };
}

export default async function AboutPage({ params }: Props) {
  const { locale } = await params;

  const stats = [
    { icon: Users, value: "10M+", label: "Active Users" },
    { icon: Globe, value: "190+", label: "Countries" },
    { icon: Zap, value: "500M+", label: "Files Processed" },
    { icon: Award, value: "99.9%", label: "Uptime" },
  ];

  const values = [
    { icon: Shield, title: "Privacy First", description: "All processing happens in your browser. Files are never uploaded to our servers." },
    { icon: Zap, title: "Lightning Fast", description: "Powered by WebAssembly for near-native processing speeds directly in your browser." },
    { icon: Sparkles, title: "Always Free", description: "All tools are completely free with no hidden limits. No account required." },
    { icon: Globe, title: "Global Access", description: "Available in 11 languages and accessible from any device, anywhere in the world." },
  ];

  return (
    <Container className="py-16 md:py-24">
      <div className="max-w-3xl mx-auto text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-surface-900 dark:text-surface-50">
          About WorldPDF
        </h1>
        <p className="mt-6 text-lg text-surface-500 dark:text-surface-400 leading-relaxed">
          WorldPDF was built with a simple mission: provide the most powerful, free, and secure online tools platform in the world. We believe everyone deserves access to professional-grade tools without paying a dime.
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label} className="text-center">
              <CardContent className="p-6">
                <Icon className="h-8 w-8 text-brand-500 mx-auto mb-3" />
                <p className="text-3xl font-bold text-surface-900 dark:text-surface-50">{stat.value}</p>
                <p className="text-sm text-surface-500 dark:text-surface-400 mt-1">{stat.label}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="max-w-3xl mx-auto mb-16">
        <h2 className="text-3xl font-bold tracking-tight text-surface-900 dark:text-surface-50 mb-8 text-center">
          Our Values
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {values.map((value) => {
            const Icon = value.icon;
            return (
              <Card key={value.title}>
                <CardContent className="p-6">
                  <Icon className="h-8 w-8 text-brand-500 mb-4" />
                  <h3 className="text-lg font-semibold text-surface-900 dark:text-surface-100 mb-2">{value.title}</h3>
                  <p className="text-sm text-surface-500 dark:text-surface-400">{value.description}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      <div className="max-w-3xl mx-auto text-center">
        <h2 className="text-3xl font-bold tracking-tight text-surface-900 dark:text-surface-50 mb-4">
          Our Technology
        </h2>
        <p className="text-surface-500 dark:text-surface-400 leading-relaxed mb-8">
          We leverage cutting-edge technologies like WebAssembly, Web Workers, and modern browser APIs to deliver near-native processing speeds. All file processing happens client-side in your browser, ensuring your data never leaves your device.
        </p>
        <Link href={`/${locale}`} className="inline-flex items-center gap-2 text-brand-500 hover:text-brand-600 font-medium">
          Explore Our Tools &rarr;
        </Link>
      </div>
    </Container>
  );
}
