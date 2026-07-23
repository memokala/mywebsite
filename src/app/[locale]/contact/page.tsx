import { Container } from "@/components/ui/container";
import { Card, CardContent } from "@/components/ui/card";
import { Mail, MessageSquare, Clock, Globe } from "lucide-react";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const isAr = locale === "ar";
  const title = isAr ? "تواصل معنا — WorldPDF" : "Contact Us - WorldPDF";
  const description = isAr
    ? "تواصل مع فريق الدعم الفني لموقع WorldPDF. نحن هنا لمساعدتك والإجابة عن استفساراتك 24/7."
    : "Get in touch with the WorldPDF team. We'd love to hear from you.";

  return {
    title,
    description,
    alternates: {
      canonical: `https://www.myworldpdf.com/${locale}/contact`,
      languages: {
        en: "https://www.myworldpdf.com/en/contact",
        ar: "https://www.myworldpdf.com/ar/contact",
        "x-default": "https://www.myworldpdf.com/en/contact",
      },
    },
    openGraph: {
      title,
      description,
      url: `https://www.myworldpdf.com/${locale}/contact`,
      siteName: "WorldPDF",
      type: "website",
    },
  };
}

export default async function ContactPage({ params }: Props) {
  await params;

  const contactMethods = [
    { icon: Mail, title: "Email Us", description: "support@myworldpdf.com", detail: "We respond within 24 hours" },
    { icon: MessageSquare, title: "Live Chat", description: "Available 24/7", detail: "Get instant help" },
    { icon: Clock, title: "Response Time", description: "Within 24 hours", detail: "For all inquiries" },
    { icon: Globe, title: "Global Support", description: "11 Languages", detail: "Multilingual team" },
  ];

  return (
    <Container className="py-16 md:py-24">
      <div className="max-w-3xl mx-auto text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-surface-900 dark:text-surface-50">
          Contact Us
        </h1>
        <p className="mt-6 text-lg text-surface-500 dark:text-surface-400">
          Have a question, suggestion, or just want to say hello? We&apos;d love to hear from you.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
        {contactMethods.map((method) => {
          const Icon = method.icon;
          return (
            <Card key={method.title}>
              <CardContent className="p-6 text-center">
                <Icon className="h-8 w-8 text-brand-500 mx-auto mb-3" />
                <h3 className="font-semibold text-surface-900 dark:text-surface-100 mb-1">{method.title}</h3>
                <p className="text-sm text-surface-700 dark:text-surface-300">{method.description}</p>
                <p className="text-xs text-surface-400 mt-1">{method.detail}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="max-w-2xl mx-auto">
        <Card>
          <CardContent className="p-8">
            <form className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1.5">Name</label>
                  <input type="text" className="w-full h-10 px-3 rounded-lg border border-surface-300 dark:border-surface-600 bg-white dark:bg-surface-800 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" placeholder="Your name" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1.5">Email</label>
                  <input type="email" className="w-full h-10 px-3 rounded-lg border border-surface-300 dark:border-surface-600 bg-white dark:bg-surface-800 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" placeholder="you@example.com" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1.5">Subject</label>
                <input type="text" className="w-full h-10 px-3 rounded-lg border border-surface-300 dark:border-surface-600 bg-white dark:bg-surface-800 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" placeholder="How can we help?" />
              </div>
              <div>
                <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1.5">Message</label>
                <textarea rows={5} className="w-full px-3 py-2 rounded-lg border border-surface-300 dark:border-surface-600 bg-white dark:bg-surface-800 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 resize-y" placeholder="Tell us more..." />
              </div>
              <button type="submit" className="inline-flex items-center justify-center font-medium rounded-lg transition-all duration-150 bg-brand-500 text-white hover:bg-brand-600 active:bg-brand-700 shadow-sm h-10 px-4 text-sm gap-2">
                Send Message
              </button>
            </form>
          </CardContent>
        </Card>
      </div>
    </Container>
  );
}
