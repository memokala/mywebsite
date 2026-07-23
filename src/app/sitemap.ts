import { MetadataRoute } from "next";
import { locales } from "@/lib/i18n/config";
import { categories } from "@/lib/tools/registry";
import { useCaseRegistry } from "@/lib/seo/programmatic-pages";
import { blogPosts } from "@/lib/blog/posts";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://www.myworldpdf.com";
  const entries: MetadataRoute.Sitemap = [];

  for (const locale of locales) {
    // Home page
    entries.push({
      url: `${baseUrl}/${locale}`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
      alternates: {
        languages: Object.fromEntries(
          locales.map((l) => [l, `${baseUrl}/${l}`])
        ),
      },
    });

    // Category pages
    for (const cat of categories) {
      entries.push({
        url: `${baseUrl}/${locale}/${cat.slug}`,
        lastModified: new Date(),
        changeFrequency: "weekly",
        priority: 0.8,
        alternates: {
          languages: Object.fromEntries(
            locales.map((l) => [l, `${baseUrl}/${l}/${cat.slug}`])
          ),
        },
      });

      // Tool pages (high priority — these are our money pages)
      for (const tool of cat.tools) {
        entries.push({
          url: `${baseUrl}/${locale}/${cat.slug}/${tool.slug}`,
          lastModified: new Date(),
          changeFrequency: "weekly",
          priority: 0.9,
          alternates: {
            languages: Object.fromEntries(
              locales.map((l) => [l, `${baseUrl}/${l}/${cat.slug}/${tool.slug}`])
            ),
          },
        });

        // Add programmatic use-case landing pages
        const pgData = useCaseRegistry[tool.slug];
        if (pgData) {
          for (const aud of pgData.audiences) {
            const usecaseSlug = locale === "ar" ? aud.slugAr : aud.slug;
            const enSlug = aud.slug;
            const arSlug = aud.slugAr;

            entries.push({
              url: `${baseUrl}/${locale}/${cat.slug}/${tool.slug}/${usecaseSlug}`,
              lastModified: new Date(),
              changeFrequency: "weekly",
              priority: 0.75,
              alternates: {
                languages: Object.fromEntries([
                  ...locales.map((l) => [
                    l,
                    `${baseUrl}/${l}/${cat.slug}/${tool.slug}/${l === "ar" ? arSlug : enSlug}`,
                  ]),
                  ["x-default", `${baseUrl}/en/${cat.slug}/${tool.slug}/${enSlug}`],
                ]),
              },
            });
          }
        }
      }
    }

    // Static pages (including new how-it-works)
    const staticPages = [
      "about",
      "contact",
      "faq",
      "blog",
      "privacy",
      "terms",
      "cookies",
      "pricing",
      "how-it-works",
      "download",
    ];
    for (const page of staticPages) {
      entries.push({
        url: `${baseUrl}/${locale}/${page}`,
        lastModified: new Date(),
        changeFrequency: "monthly",
        priority: page === "how-it-works" ? 0.7 : 0.5,
        alternates: {
          languages: Object.fromEntries([
            ...locales.map((l) => [l, `${baseUrl}/${l}/${page}`]),
            ["x-default", `${baseUrl}/en/${page}`],
          ]),
        },
      });
    }

    // Blog posts (high-value SEO content pages)
    for (const post of blogPosts) {
      entries.push({
        url: `${baseUrl}/${locale}/blog/${post.slug}`,
        lastModified: new Date(post.date),
        changeFrequency: "monthly",
        priority: 0.7,
        alternates: {
          languages: Object.fromEntries([
            ...locales.map((l) => [l, `${baseUrl}/${l}/blog/${post.slug}`]),
            ["x-default", `${baseUrl}/en/blog/${post.slug}`],
          ]),
        },
      });
    }
  }

  return entries;
}

