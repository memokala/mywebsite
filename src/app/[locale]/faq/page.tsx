import { Container } from "@/components/ui/container";
import { ChevronDown } from "lucide-react";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const isAr = locale === "ar";
  const title = isAr ? "الأسئلة الشائعة — WorldPDF" : "FAQ - WorldPDF";
  const description = isAr
    ? "الأسئلة الشائعة والإجابات حول أدوات WorldPDF المجانية لدمج وتحويل وضغط ملفات PDF بأمان في متصفحك."
    : "Frequently asked questions about WorldPDF. Find answers to common questions about our free online tools.";

  return {
    title,
    description,
    alternates: {
      canonical: `https://www.myworldpdf.com/${locale}/faq`,
      languages: {
        en: "https://www.myworldpdf.com/en/faq",
        ar: "https://www.myworldpdf.com/ar/faq",
        "x-default": "https://www.myworldpdf.com/en/faq",
      },
    },
    openGraph: {
      title,
      description,
      url: `https://www.myworldpdf.com/${locale}/faq`,
      siteName: "WorldPDF",
      type: "website",
    },
  };
}

const faqs = [
  {
    category: "General",
    items: [
      { question: "What is WorldPDF?", answer: "WorldPDF is a free online tools platform that provides 50+ tools for processing PDFs, images, videos, audio, and more. All processing happens directly in your browser for maximum privacy and speed." },
      { question: "Is WorldPDF really free?", answer: "Yes! All tools on WorldPDF are completely free to use with no hidden limits. No account or credit card required." },
      { question: "Do I need to create an account?", answer: "No, you can use all WorldPDF tools without creating an account. Simply visit any tool and start using it immediately." },
    ],
  },
  {
    category: "Privacy & Security",
    items: [
      { question: "Are my files secure?", answer: "Absolutely. All file processing happens directly in your browser using client-side technology. Your files are never uploaded to our servers, ensuring complete privacy." },
      { question: "Do you store my files?", answer: "No. We never store, view, or have access to your files. Everything is processed locally in your browser." },
      { question: "Is my data encrypted?", answer: "Yes. All data transmitted between your browser and our servers is encrypted using TLS 1.3 (HTTPS)." },
    ],
  },
  {
    category: "Technical",
    items: [
      { question: "What browsers are supported?", answer: "WorldPDF works on all modern browsers including Chrome, Firefox, Safari, Edge, and Opera. We recommend keeping your browser up to date for the best experience." },
      { question: "Can I use WorldPDF on mobile?", answer: "Yes! WorldPDF is fully responsive and works great on smartphones and tablets. You can access all tools from your mobile browser." },
      { question: "Why are some tools client-side only?", answer: "Client-side processing ensures your files never leave your device, providing maximum privacy and security. It also means faster processing as there's no upload/download step." },
    ],
  },
  {
    category: "Tools & Features",
    items: [
      { question: "What file formats are supported?", answer: "We support a wide range of formats including PDF, Word (DOC/DOCX), Excel (XLS/XLSX), PowerPoint (PPT/PPTX), JPG, PNG, WebP, SVG, MP4, AVI, MOV, MP3, WAV, FLAC, and many more." },
      { question: "Is there a file size limit?", answer: "Free users can process files up to 10MB. Pro users can process files up to 100MB, and Business users have no file size limits." },
      { question: "Can I process multiple files at once?", answer: "Yes! Many of our tools support batch processing. You can upload and process multiple files simultaneously." },
    ],
  },
];

export default async function FAQPage({ params }: Props) {
  await params;

  return (
    <Container className="py-16 md:py-24">
      <div className="max-w-3xl mx-auto text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-surface-900 dark:text-surface-50">
          Frequently Asked Questions
        </h1>
        <p className="mt-6 text-lg text-surface-500 dark:text-surface-400">
          Find answers to common questions about WorldPDF
        </p>
      </div>

      <div className="max-w-3xl mx-auto space-y-12">
        {faqs.map((section) => (
          <div key={section.category}>
            <h2 className="text-xl font-semibold text-surface-900 dark:text-surface-100 mb-4">
              {section.category}
            </h2>
            <div className="space-y-3">
              {section.items.map((faq, index) => (
                <details
                  key={index}
                  className="group rounded-2xl border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-900 overflow-hidden"
                >
                  <summary className="flex items-center justify-between px-6 py-4 cursor-pointer text-sm font-medium text-surface-900 dark:text-surface-100 hover:bg-surface-50 dark:hover:bg-surface-800 transition-colors">
                    {faq.question}
                    <ChevronDown className="h-4 w-4 text-surface-400 group-open:rotate-180 transition-transform shrink-0 ml-4" />
                  </summary>
                  <div className="px-6 pb-4 text-sm text-surface-600 dark:text-surface-400 leading-relaxed">
                    {faq.answer}
                  </div>
                </details>
              ))}
            </div>
          </div>
        ))}
      </div>
    </Container>
  );
}
