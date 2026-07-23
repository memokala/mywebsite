import { Container } from "@/components/ui/container";
import { Card, CardContent } from "@/components/ui/card";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const isAr = locale === "ar";
  const title = isAr ? "سياسة ملفات تعريف الارتباط — WorldPDF" : "Cookie Policy - WorldPDF";
  const description = isAr
    ? "سياسة ملفات تعريف الارتباط (الكوكيز) على موقع WorldPDF. كيف نستخدم الملفات لتحسين الأداء والخصوصية."
    : "WorldPDF Cookie Policy. Learn about how we use cookies.";

  return {
    title,
    description,
    alternates: {
      canonical: `https://www.myworldpdf.com/${locale}/cookies`,
      languages: {
        en: "https://www.myworldpdf.com/en/cookies",
        ar: "https://www.myworldpdf.com/ar/cookies",
        "x-default": "https://www.myworldpdf.com/en/cookies",
      },
    },
    openGraph: {
      title,
      description,
      url: `https://www.myworldpdf.com/${locale}/cookies`,
      siteName: "WorldPDF",
      type: "website",
    },
  };
}

export default async function CookiesPage({ params }: Props) {
  await params;

  const cookieTypes = [
    {
      name: "Essential Cookies",
      description: "These cookies are necessary for the website to function properly. They enable core functionality such as security, network management, and account access.",
      required: true,
    },
    {
      name: "Analytics Cookies",
      description: "These cookies help us understand how visitors interact with our website by collecting and reporting information anonymously.",
      required: false,
    },
    {
      name: "Preference Cookies",
      description: "These cookies allow the website to remember choices you make such as your theme preference or language selection.",
      required: false,
    },
  ];

  return (
    <Container className="py-16 md:py-24">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold tracking-tight text-surface-900 dark:text-surface-50 mb-8">
          Cookie Policy
        </h1>
        <p className="text-sm text-surface-400 mb-8">Last updated: January 2025</p>

        <div className="prose-nova space-y-8">
          <section>
            <h2>What Are Cookies</h2>
            <p>
              Cookies are small text files that are placed on your computer or mobile device when you visit a website. They are widely used to make websites work more efficiently and provide information to website owners.
            </p>
          </section>

          <section>
            <h2>How We Use Cookies</h2>
            <p>
              We use cookies to improve your experience on WorldPDF, remember your preferences, and understand how you use our website.
            </p>
          </section>

          <section>
            <h2>Types of Cookies We Use</h2>
            <div className="space-y-4 not-prose mt-4">
              {cookieTypes.map((cookie) => (
                <Card key={cookie.name}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-surface-900 dark:text-surface-100">{cookie.name}</h3>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${cookie.required ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" : "bg-surface-100 text-surface-600 dark:bg-surface-800 dark:text-surface-400"}`}>
                        {cookie.required ? "Required" : "Optional"}
                      </span>
                    </div>
                    <p className="text-sm text-surface-500 dark:text-surface-400">{cookie.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          <section>
            <h2>Managing Cookies</h2>
            <p>
              You can control and/or delete cookies as you wish. You can delete all cookies that are already on your computer and you can set most browsers to prevent them from being placed.
            </p>
          </section>

          <section>
            <h2>Contact Us</h2>
            <p>
              If you have any questions about our Cookie Policy, please contact us at support@myworldpdf.com.
            </p>
          </section>
        </div>
      </div>
    </Container>
  );
}
