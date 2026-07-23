"use client";

import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { ChevronDown, Globe } from "lucide-react";
import { useState } from "react";

const footerSections = [
  {
    titleKey: "footer.products",
    links: [
      { labelKey: "nav.pdf", href: "/pdf" },
    ],
  },
  {
    titleKey: "footer.solutions",
    links: [
      { labelKey: "footer.desktop", href: "/download" },
      { labelKey: "footer.mobile", href: "/download" },
    ],
  },
  {
    titleKey: "footer.company",
    links: [
      { labelKey: "footer.about", href: "/about" },
      { labelKey: "footer.contact", href: "/contact" },
      { labelKey: "nav.blog", href: "/blog" },
      { labelKey: "footer.privacy", href: "/privacy" },
    ],
  },
  {
    titleKey: "footer.resources",
    links: [
      { labelKey: "footer.faq", href: "/faq" },
      { labelKey: "nav.pricing", href: "/pricing" },
    ],
  },
];

const languages = [
  { code: "en", label: "English" },
  { code: "ar", label: "العربية" },
];

const STORE_BUTTONS = [
  {
    label: "Google Play",
    subtitle: "GET IT ON",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M3.609 1.814a.966.966 0 0 0-.9.638L.18 14.09a1.01 1.01 0 0 0 .416 1.107l12.56 7.25 3.338-3.338-9.884-9.3z" />
        <path d="M14.411 12.217l-3.339 3.339 3.342 3.342c.48.48 1.14.62 1.75.42.37-.12.68-.35.92-.65l.03-.04V5.756c-.09-.35-.34-.64-.68-.79a1.5 1.5 0 0 0-.98-.17c-.34.05-.64.22-.88.47l-4.1 4.066z" />
        <path d="M9.318 16.353L5.213 20.458a1.65 1.65 0 0 1-.76.467 1.68 1.68 0 0 1-1.28-.15 1.66 1.66 0 0 1-.84-1.13 1.68 1.68 0 0 1 .25-1.17l4.599-4.613z" />
        <path d="M19.816 12.998c.08.19.12.39.12.61 0 .51-.21.97-.56 1.3a2.25 2.25 0 0 1-1.47.65 2.4 2.4 0 0 1-1.07-.25l-2.78-1.4L12.148 12.62l3.585-3.585 3.08 1.18c.65.25 1.14.7 1.45 1.27.15.28.24.58.26.89v.01c.01.21 0 .41-.05.61l-.66 4z" />
      </svg>
    ),
  },
  {
    label: "App Store",
    subtitle: "Download on the",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
      </svg>
    ),
  },
  {
    label: "Mac App Store",
    subtitle: "Download on the",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M18.71 19.5c-.83 1.24-1.71 2.35-2.69 3.35-1.41 1.48-2.86 2.54-4.56 2.6-1.63.06-2.17-.99-4.03-.99s-2.49.93-4.1 1.02c-1.57.08-2.94-.78-4.35-2.3C.56 19.56-.07 15.56.47 12.73c.6-3.47 3.26-6.17 6.46-6.25 1.63-.04 3.15 1.1 4.1 1.1.94 0 2.71-1.35 4.58-1.15.78.03 2.97.32 4.36 2.41M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
      </svg>
    ),
  },
  {
    label: "Microsoft Store",
    subtitle: "Download from",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M3,12V6.75L9,5.43V12H3M20,3V11H10V2.56L20,3M10,22V12.75H20V20.44L10,22M3,13H9V20L3,18.47V13Z" />
      </svg>
    ),
  },
];

export function Footer() {
  const t = useTranslations("common");
  const params = useParams();
  const pathname = usePathname();
  const locale = params?.locale || "en";
  const [langOpen, setLangOpen] = useState(false);

  const currentLang = languages.find(l => l.code === locale) || languages[0];

  const socialLinks = [
    { label: "Reddit", href: "https://reddit.com/r/WorldPDF", path: "M22 12.075a2.422 2.422 0 00-4.13-1.538 11.83 11.83 0 00-6.39-2.028l1.085-4.817 3.742.826a1.733 1.733 0 103.432-.532 1.733 1.733 0 00-2.158-1.306l-4.255-.938a.424.424 0 00-.5.3l-1.242 5.516a11.825 11.825 0 00-6.273 2.03A2.422 2.422 0 002 12.075a2.42 2.42 0 00.784 1.77 2.39 2.39 0 00-.072.54c0 3.452 4.157 6.252 9.288 6.252s9.288-2.8 9.288-6.251a2.39 2.39 0 00-.072-.541 2.42 2.42 0 00.784-1.77zm-16.102.694a1.466 1.466 0 111.466 1.466 1.466 1.466 0 01-1.466-1.466zm7.22 4.653c-1.48 1.48-4.654 1.48-4.654 0a.373.373 0 01.528-.528 2.866 2.866 0 003.598 0 .373.373 0 01.528.528zm-.482-3.187a1.466 1.466 0 111.466-1.466 1.466 1.466 0 01-1.466 1.466z" },
    { label: "TikTok", href: "https://tiktok.com/@WorldPDF", path: "M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9a6.27 6.27 0 00-.79-.05A6.34 6.34 0 003.15 15.3a6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.34-6.34V8.75a8.18 8.18 0 004.76 1.52V6.81a4.83 4.83 0 01-1-.12z" },
    { label: "Instagram", href: "https://instagram.com/WorldPDF", path: "M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" },
    { label: "LinkedIn", href: "https://linkedin.com/company/WorldPDF", path: "M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" },
    { label: "Facebook", href: "https://facebook.com/WorldPDF", path: "M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c4.56-.93 8-4.96 8-9.85z" },
    { label: "X", href: "https://x.com/WorldPDF", path: "M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" },
  ];

  return (
    <footer dir="ltr" style={{ backgroundColor: "#1a1a24", color: "#cbd2dc", width: "100%" }}>
      <style>{`
        .fl-store-btn:hover { border-color: rgba(255,255,255,0.4) !important; }
        .fl-link a:hover { color: #ffffff !important; }
        .fl-social a:hover { color: #ffffff !important; border-color: rgba(255,255,255,0.5) !important; }
        .fl-lang-btn:hover { border-color: rgba(255,255,255,0.5) !important; }
        .fl-dd-item:hover { background-color: rgba(255,255,255,0.05) !important; color: #ffffff !important; }
        .fl-dd-active { background-color: rgba(255,62,62,0.1) !important; color: #ff3e3e !important; }
      `}</style>
      <div style={{ width: "100%", padding: "40px 40px 40px 40px" }}>

        {/* Top Row */}
        <div style={{ display: "flex", flexDirection: "row", flexWrap: "wrap", gap: "40px", alignItems: "flex-start" }}>

          {/* Store Buttons Column */}
          <div style={{ width: "220px", flexShrink: 0 }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {STORE_BUTTONS.map((btn) => (
                <a
                  key={btn.label}
                  href="#"
                  className="fl-store-btn"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    padding: "0 16px",
                    height: "55px",
                    borderRadius: "12px",
                    border: "1px solid rgba(255,255,255,0.2)",
                    textDecoration: "none",
                    color: "inherit",
                    transition: "border-color 0.2s",
                    width: "100%",
                    boxSizing: "border-box",
                  }}
                >
                  <span style={{ color: "rgba(255,255,255,0.8)", flexShrink: 0, display: "flex" }}>{btn.icon}</span>
                  <span style={{ display: "flex", flexDirection: "column", lineHeight: 1.2, minWidth: 0 }}>
                    <span style={{ fontSize: "9px", color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.05em" }}>{btn.subtitle}</span>
                    <span style={{ fontSize: "13px", fontWeight: 700, color: "#ffffff" }}>{btn.label}</span>
                  </span>
                </a>
              ))}
            </div>
          </div>

          {/* Link Columns */}
          <div style={{ flex: 1, display: "flex", flexDirection: "row", flexWrap: "wrap", gap: "40px", minWidth: 0 }}>
            {footerSections.map((section) => (
              <div key={section.titleKey} className="fl-link" style={{ flex: "1 1 140px", minWidth: "140px" }}>
                <h4 style={{ fontSize: "14px", fontWeight: 700, color: "#ffffff", marginBottom: "16px", marginTop: 0 }}>{t(section.titleKey)}</h4>
                <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                  {section.links.map((link, i) => (
                    <li key={`${link.href}-${i}`} style={{ marginBottom: "12px" }}>
                      <Link
                        href={`/${locale}${link.href}`}
                        style={{ fontSize: "13px", color: "#9ca3af", textDecoration: "none", transition: "color 0.2s" }}
                      >
                        {t(link.labelKey)}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Divider */}
        <hr style={{ border: "none", borderTop: "1px solid rgba(255,255,255,0.1)", margin: "48px 0" }} />

        {/* Bottom Row */}
        <div style={{ display: "flex", flexDirection: "row", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: "24px" }}>
          {/* Copyright */}
          <p style={{ fontSize: "13px", color: "#9ca3af", margin: 0, flexShrink: 0 }}>
            &copy; {new Date().getFullYear()} WorldPDF. {t("footer.allRightsReserved")}
          </p>

          {/* Social Icons */}
          <div className="fl-social" style={{ display: "flex", alignItems: "center", gap: "12px", flexShrink: 0 }}>
            {socialLinks.map((social) => (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={social.label}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "36px",
                  height: "36px",
                  borderRadius: "9999px",
                  border: "1px solid rgba(255,255,255,0.2)",
                  color: "#9ca3af",
                  textDecoration: "none",
                  transition: "color 0.2s, border-color 0.2s",
                }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d={social.path} />
                </svg>
              </a>
            ))}
          </div>

          {/* Language Selector */}
          <div style={{ position: "relative", flexShrink: 0 }}>
            <button
              onClick={() => setLangOpen(!langOpen)}
              className="fl-lang-btn"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                padding: "8px 16px",
                borderRadius: "9999px",
                border: "1px solid rgba(255,255,255,0.2)",
                backgroundColor: "transparent",
                color: "#d1d5db",
                fontSize: "13px",
                cursor: "pointer",
                transition: "border-color 0.2s",
              }}
            >
              <Globe width="16" height="16" />
              <span>{currentLang.label}</span>
              <ChevronDown
                width="14"
                height="14"
                style={{
                  transition: "transform 0.2s",
                  transform: langOpen ? "rotate(180deg)" : "rotate(0deg)",
                }}
              />
            </button>
            {langOpen && (
              <div style={{
                position: "absolute",
                bottom: "100%",
                marginBottom: "8px",
                right: 0,
                width: "176px",
                padding: "6px",
                borderRadius: "12px",
                border: "1px solid rgba(255,255,255,0.1)",
                backgroundColor: "#1a1a24",
                boxShadow: "0 20px 25px -5px rgba(0,0,0,0.5)",
                zIndex: 50,
              }}>
                {languages.map((lang) => (
                  <Link
                    key={lang.code}
                    href={pathname.replace(`/${locale}`, `/${lang.code}`)}
                    onClick={() => setLangOpen(false)}
                    className={lang.code === locale ? "fl-dd-active" : "fl-dd-item"}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      padding: "6px 12px",
                      borderRadius: "8px",
                      fontSize: "13px",
                      textDecoration: "none",
                      color: lang.code === locale ? "#ff3e3e" : "#9ca3af",
                      backgroundColor: lang.code === locale ? "rgba(255,62,62,0.1)" : "transparent",
                      transition: "background-color 0.2s, color 0.2s",
                    }}
                  >
                    <Globe width="12" height="12" style={{ flexShrink: 0 }} />
                    {lang.label}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
}
