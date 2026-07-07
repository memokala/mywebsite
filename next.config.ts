import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,
  productionBrowserSourceMaps: false,

  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 31536000,
    remotePatterns: [
      { protocol: "https", hostname: "worldpdf.com" },
      { protocol: "https", hostname: "cdn.worldpdf.com" },
      { protocol: "https", hostname: "api.qrserver.com" },
    ],
  },

  experimental: {
    optimizePackageImports: [
      "lucide-react",
      "recharts",
      "@radix-ui/react-dialog",
      "@radix-ui/react-dropdown-menu",
      "@radix-ui/react-tabs",
    ],
    scrollRestoration: true,
  },

  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Force pdf-lib and pdfjs-dist into separate lazy-loaded chunks
      // Keeps initial JS bundle < 100KB for optimal LCP
      config.optimization = {
        ...config.optimization,
        splitChunks: {
          ...config.optimization?.splitChunks,
          cacheGroups: {
            ...(typeof config.optimization?.splitChunks === 'object'
              ? config.optimization.splitChunks.cacheGroups
              : {}),
            pdfLib: {
              test: /[\\/]node_modules[\\/](pdf-lib)[\\/]/,
              name: 'pdf-lib',
              chunks: 'async' as const,
              priority: 20,
              enforce: true,
            },
            pdfjs: {
              test: /[\\/]node_modules[\\/](pdfjs-dist)[\\/]/,
              name: 'pdfjs-dist',
              chunks: 'async' as const,
              priority: 20,
              enforce: true,
            },
            cryptoJs: {
              test: /[\\/]node_modules[\\/](crypto-js)[\\/]/,
              name: 'crypto-js',
              chunks: 'async' as const,
              priority: 15,
              enforce: true,
            },
          },
        },
      };
    }
    return config;
  },

  headers: async () => [
    {
      source: "/(.*)",
      headers: [
        { key: "X-DNS-Prefetch-Control", value: "on" },
        { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
        { key: "X-Content-Type-Options", value: "nosniff" },
        { key: "X-Frame-Options", value: "DENY" },
        { key: "X-XSS-Protection", value: "1; mode=block" },
        { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), interest-cohort=()" },
      ],
    },
    {
      source: "/:path*.(jpg|jpeg|gif|png|svg|ico|webp|avif|woff|woff2|ttf|eot)",
      headers: [
        { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
      ],
    },
    {
      source: "/:path*.(js|css)",
      headers: [
        { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
      ],
    },
  ],
};

export default withNextIntl(nextConfig);
