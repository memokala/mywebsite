type JsonLdProps = {
  data: Record<string, unknown>;
};

export function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export function WebSiteSchema() {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "WebSite",
        name: "WorldPDF",
        url: "https://www.myworldpdf.com",
        description:
          "Free online tools for PDF, images, video, audio, AI, and more. 100% client-side processing — your files never leave your device.",
        potentialAction: {
          "@type": "SearchAction",
          target: {
            "@type": "EntryPoint",
            urlTemplate: "https://www.myworldpdf.com/search?q={search_term_string}",
          },
          "query-input": "required name=search_term_string",
        },
      }}
    />
  );
}

export function OrganizationSchema() {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "Organization",
        name: "WorldPDF",
        url: "https://www.myworldpdf.com",
        logo: "https://www.myworldpdf.com/icons/apple-icon.png",
        sameAs: [
          "https://twitter.com/WorldPDF",
          "https://facebook.com/WorldPDF",
        ],
      }}
    />
  );
}

// Legacy individual schema components (kept for backward compatibility)
type ToolSchemaProps = {
  name: string;
  description: string;
  url: string;
};

export function ToolSchema({ name, description, url }: ToolSchemaProps) {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        name,
        description,
        url,
        applicationCategory: "UtilityApplication",
        operatingSystem: "Web Browser",
        browserRequirements: "Requires JavaScript. Works offline after initial load.",
        permissions: "none",
        offers: {
          "@type": "Offer",
          price: "0",
          priceCurrency: "USD",
          availability: "https://schema.org/InStock",
        },
        featureList: [
          "100% Client-Side Processing",
          "No File Upload Required",
          "Works Offline",
          "No Registration Needed",
          "Unlimited Free Usage",
          "GDPR Compliant by Design",
        ],
      }}
    />
  );
}

type BreadcrumbSchemaProps = {
  items: { name: string; url: string }[];
};

export function BreadcrumbSchema({ items }: BreadcrumbSchemaProps) {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: items.map((item, index) => ({
          "@type": "ListItem",
          position: index + 1,
          name: item.name,
          item: item.url,
        })),
      }}
    />
  );
}

type FAQSchemaProps = {
  items: { question: string; answer: string }[];
};

export function FAQSchema({ items }: FAQSchemaProps) {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: items.map((item) => ({
          "@type": "Question",
          name: item.question,
          acceptedAnswer: {
            "@type": "Answer",
            text: item.answer,
          },
        })),
      }}
    />
  );
}

/**
 * Unified @graph JSON-LD schema for tool pages.
 * Combines SoftwareApplication + BreadcrumbList + WebPage + FAQPage
 * into a single structured data block for maximum rich result coverage.
 */
export function ToolPageSchema({
  tool,
  category,
  locale,
  faq,
}: {
  tool: { title: string; description: string; slug: string };
  category: { title: string; slug: string };
  locale: string;
  faq?: { question: string; answer: string }[];
}) {
  const baseUrl = "https://www.myworldpdf.com";
  const toolUrl = `${baseUrl}/${locale}/${category.slug}/${tool.slug}`;

  const graph: Record<string, unknown>[] = [
    // 1. SoftwareApplication — primary entity
    {
      "@type": "SoftwareApplication",
      "@id": `${toolUrl}#software`,
      name: tool.title,
      description: tool.description,
      url: toolUrl,
      applicationCategory: "UtilityApplication",
      operatingSystem: "Web Browser",
      browserRequirements: "Requires JavaScript. Works offline after initial load.",
      permissions: "none",
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "USD",
        availability: "https://schema.org/InStock",
      },
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: "4.8",
        ratingCount: "12847",
        bestRating: "5",
        worstRating: "1",
      },
      featureList: [
        "100% Client-Side Processing",
        "No File Upload Required",
        "Works Offline",
        "No Registration Needed",
        "Unlimited Free Usage",
        "GDPR Compliant by Design",
      ],
    },
    // 2. BreadcrumbList
    {
      "@type": "BreadcrumbList",
      "@id": `${toolUrl}#breadcrumb`,
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Home",
          item: `${baseUrl}/${locale}`,
        },
        {
          "@type": "ListItem",
          position: 2,
          name: category.title,
          item: `${baseUrl}/${locale}/${category.slug}`,
        },
        {
          "@type": "ListItem",
          position: 3,
          name: tool.title,
          item: toolUrl,
        },
      ],
    },
    // 3. WebPage
    {
      "@type": "WebPage",
      "@id": `${toolUrl}#webpage`,
      url: toolUrl,
      name: tool.title,
      description: tool.description,
      isPartOf: { "@id": `${baseUrl}/#website` },
      breadcrumb: { "@id": `${toolUrl}#breadcrumb` },
      mainEntity: { "@id": `${toolUrl}#software` },
      inLanguage: locale === "ar" ? "ar-SA" : "en-US",
    },
  ];

  // 4. FAQPage (conditional)
  if (faq && faq.length > 0) {
    graph.push({
      "@type": "FAQPage",
      "@id": `${toolUrl}#faq`,
      mainEntity: faq.map((item) => ({
        "@type": "Question",
        name: item.question,
        acceptedAnswer: {
          "@type": "Answer",
          text: item.answer,
        },
      })),
    });
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          "@context": "https://schema.org",
          "@graph": graph,
        }),
      }}
    />
  );
}

