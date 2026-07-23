import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, getLocale } from "next-intl/server";
import { ThemeProvider } from "@/components/theme-provider";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
  preload: true,
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
  preload: true,
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.myworldpdf.com"),
  title: {
    default: "WorldPDF - Free Online PDF Tools | Merge, Compress, Convert & More",
    template: "%s | WorldPDF",
  },
  description:
    "Free online PDF tools. Merge, compress, convert, edit, and organize PDFs securely in your browser. No uploads required. 100% free.",
  keywords: [
    "PDF tools",
    "merge PDF",
    "compress PDF",
    "convert PDF",
    "edit PDF",
    "split PDF",
    "online PDF tools",
  ],
  authors: [{ name: "WorldPDF" }],
  creator: "WorldPDF",
  publisher: "WorldPDF",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "WorldPDF",
    title: "WorldPDF - Free Online PDF Tools | Merge, Compress, Convert & More",
    description:
      "Free online PDF tools. Merge, compress, convert, edit, and organize PDFs securely in your browser. No uploads required. 100% free.",
    url: "https://www.myworldpdf.com",
    images: [
      {
        url: "/images/og-image.png",
        width: 1200,
        height: 630,
        alt: "WorldPDF",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "WorldPDF - Free Online PDF Tools",
    description:
      "Free online PDF tools. Merge, compress, convert, edit, and organize PDFs securely in your browser.",
    images: ["/images/twitter-image.png"],
    creator: "@worldpdf",
  },
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/icons/icon-16.png", sizes: "16x16", type: "image/png" },
      { url: "/icons/icon-32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [
      { url: "/icons/apple-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  manifest: "/manifest.webmanifest",
  alternates: {
    languages: {
      en: "/en",
      ar: "/ar",
    },
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const messages = await getMessages();
  const locale = await getLocale();
  const direction = locale === "ar" ? "rtl" : "ltr";

  return (
    <html lang={locale} dir={direction} suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} min-h-screen flex flex-col font-sans antialiased`}
      >
        <NextIntlClientProvider messages={messages}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {children}
            <Analytics />
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}

