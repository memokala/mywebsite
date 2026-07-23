import { Container } from "@/components/ui/container";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const isAr = locale === "ar";
  const title = isAr ? "سياسة الخصوصية — WorldPDF" : "Privacy Policy - WorldPDF";
  const description = isAr
    ? "سياسة الخصوصية لموقع WorldPDF. تعرّف على كيفية حماية بياناتك وملفاتك بأمان 100% داخل متصفحك."
    : "WorldPDF Privacy Policy. Learn how we protect your data and privacy.";

  return {
    title,
    description,
    alternates: {
      canonical: `https://www.myworldpdf.com/${locale}/privacy`,
      languages: {
        en: "https://www.myworldpdf.com/en/privacy",
        ar: "https://www.myworldpdf.com/ar/privacy",
        "x-default": "https://www.myworldpdf.com/en/privacy",
      },
    },
    openGraph: {
      title,
      description,
      url: `https://www.myworldpdf.com/${locale}/privacy`,
      siteName: "WorldPDF",
      type: "website",
    },
  };
}

export default async function PrivacyPage({ params }: Props) {
  await params;

  return (
    <Container className="py-16 md:py-24">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold tracking-tight text-surface-900 dark:text-surface-50 mb-8">
          Privacy Policy
        </h1>
        <p className="text-sm text-surface-400 mb-8">Last updated: January 2025</p>

        <div className="prose-nova space-y-8">
          <section>
            <h2>1. Introduction</h2>
            <p>
              WorldPDF (&quot;we&quot;, &quot;our&quot;, or &quot;us&quot;) is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website myworldpdf.com.
            </p>
          </section>

          <section>
            <h2>2. Information We Collect</h2>
            <p>
              We collect minimal information to provide our services. This may include usage data such as pages visited, tools used, and browser type for analytics purposes.
            </p>
          </section>

          <section>
            <h2>3. File Processing</h2>
            <p>
              All file processing on WorldPDF happens directly in your browser using client-side technology. Your files are never uploaded to our servers. We have no access to the files you process using our tools.
            </p>
          </section>

          <section>
            <h2>4. Cookies</h2>
            <p>
              We use essential cookies to ensure the website functions properly. We may also use analytics cookies to understand how visitors interact with our website. You can control cookie settings through your browser preferences.
            </p>
          </section>

          <section>
            <h2>5. Data Security</h2>
            <p>
              We implement industry-standard security measures including HTTPS encryption, Content Security Policy, and other security headers to protect your information.
            </p>
          </section>

          <section>
            <h2>6. Third-Party Services</h2>
            <p>
              We may use third-party analytics services to help us understand how our website is used. These services may collect information sent by your browser as part of a web page request.
            </p>
          </section>

          <section>
            <h2>7. Children&apos;s Privacy</h2>
            <p>
              Our services are not directed to individuals under 13. We do not knowingly collect personal information from children under 13.
            </p>
          </section>

          <section>
            <h2>8. Changes to This Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page.
            </p>
          </section>

          <section>
            <h2>9. Contact Us</h2>
            <p>
              If you have questions about this Privacy Policy, please contact us at support@myworldpdf.com.
            </p>
          </section>
        </div>
      </div>
    </Container>
  );
}
