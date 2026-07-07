"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { useTheme } from "@/components/theme-provider";
import { useState, useSyncExternalStore } from "react";
import {
  Menu, X, Sun, Moon, Monitor, ChevronDown, FileText,
  Globe, LogIn, UserPlus, Heart, Image as ImageIcon,
  FileSpreadsheet, Presentation, FileCode, BookOpen,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { categories, getTranslationKeys } from "@/lib/tools/registry";

const toolCategories = [
  { key: "pdf", href: "/pdf", icon: FileText, color: "text-red-500", bgColor: "bg-red-50 dark:bg-red-950/30" },
];

const languages = [
  { code: "en", label: "English" },
  { code: "ar", label: "العربية" },
];

export function Header() {
  const t = useTranslations();
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [allPdfOpen, setAllPdfOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);

  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );

  const locale = pathname.split("/")[1] || "en";
  const isRtl = locale === "ar";

  const themeIcon = () => {
    if (!mounted) return <Sun className="h-4 w-4" />;
    if (theme === "dark") return <Moon className="h-4 w-4" />;
    if (theme === "light") return <Sun className="h-4 w-4" />;
    return <Monitor className="h-4 w-4" />;
  };

  const cycleTheme = () => {
    if (theme === "light") setTheme("dark");
    else if (theme === "dark") setTheme("system");
    else setTheme("light");
  };

  const currentLang = languages.find(l => l.code === locale) || languages[0];

  const pdfTools = categories.find(c => c.id === "pdf")?.tools || [];

  const featuredTools = ["merge-pdf", "split-pdf", "compress-pdf", "pdf-to-word"];

  return (
    <header className="sticky top-0 z-50 border-b border-surface-200/50 bg-white/95 dark:bg-surface-950/95 backdrop-blur-xl">
      <div className="container-nova">
        <div className="flex h-16 items-center justify-between gap-2">
          {/* Logo */}
          <Link href={`/${locale}`} className="flex items-center gap-2 shrink-0">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-500 text-white text-sm font-bold">
              <Heart className="h-4.5 w-4.5 fill-current" />
            </span>
            <span className="font-bold text-xl tracking-tight text-surface-900 dark:text-surface-50 hidden sm:inline">
              World<span className="text-brand-500">PDF</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-0.5">
            {featuredTools.map((toolId) => {
              const transKey = getTranslationKeys(toolId);
              const title = transKey ? t(`${transKey}.title`) : toolId;
              const tool = pdfTools.find(p => p.id === toolId || p.slug === toolId);
              return (
                <Link
                  key={toolId}
                  href={`/${locale}/pdf/${tool?.slug || toolId}`}
                  className="px-3 py-2 rounded-lg text-sm font-semibold text-surface-600 hover:text-surface-900 dark:text-surface-400 dark:hover:text-surface-100 hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors"
                >
                  {title}
                </Link>
              );
            })}

            {/* All PDF Tools Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setAllPdfOpen(true)}
              onMouseLeave={() => setAllPdfOpen(false)}
            >
              <button className="flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-semibold text-surface-600 hover:text-surface-900 dark:text-surface-400 dark:hover:text-surface-100 hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors cursor-pointer">
                {t("pdf.title")}
                <ChevronDown className="h-3.5 w-3.5 opacity-60" />
              </button>
              {allPdfOpen && (
                <div
                  className={`absolute top-full mt-1 rounded-2xl border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-900 shadow-xl animate-scale-in origin-top-left z-50 ${isRtl ? "right-0" : "left-0"}`}
                  style={{ width: 560, padding: 20 }}
                >
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 28px" }}>

                    {/* Column 1: Convert to PDF */}
                    <div>
                      <div className="text-xs font-bold text-surface-400 mb-3 pb-2 border-b border-surface-100 dark:border-surface-800 uppercase tracking-wider">
                        {isRtl ? "تحويل إلى" : "Convert to"} PDF
                      </div>
                      {[
                        { label: "JPG", color: "text-amber-500 dark:text-amber-400", bg: "bg-amber-50 dark:bg-amber-950/20", slug: "jpg-to-pdf", icon: ImageIcon },
                        { label: "WORD", color: "text-blue-500 dark:text-blue-400", bg: "bg-blue-50 dark:bg-blue-950/20", slug: "word-to-pdf", icon: FileText },
                        { label: "PPT", color: "text-red-500 dark:text-red-400", bg: "bg-red-50 dark:bg-red-950/20", slug: "powerpoint-to-pdf", icon: Presentation },
                        { label: "XLS", color: "text-green-500 dark:text-green-400", bg: "bg-green-50 dark:bg-green-950/20", slug: "excel-to-pdf", icon: FileSpreadsheet },
                        { label: "HTML", color: "text-orange-500 dark:text-orange-400", bg: "bg-orange-50 dark:bg-orange-950/20", slug: "html-to-pdf", icon: FileCode },
                      ].map((item) => {
                        const IconComponent = item.icon;
                        return (
                          <Link
                            key={item.label}
                            href={`/${locale}/pdf/${item.slug}`}
                            className="flex items-center justify-between p-2 rounded-xl mb-1 text-surface-700 dark:text-surface-300 hover:bg-surface-50 dark:hover:bg-surface-800/50 transition-colors group/item"
                          >
                            <span className="text-sm font-semibold text-surface-700 dark:text-surface-300">{item.label} → PDF</span>
                            <span
                              className={`w-8 h-8 rounded-lg ${item.bg} flex items-center justify-center flex-shrink-0 transition-transform duration-200 group-hover/item:scale-110 shadow-sm`}
                            >
                              <IconComponent className={`h-4.5 w-4.5 ${item.color}`} />
                            </span>
                          </Link>
                        );
                      })}
                    </div>

                    {/* Column 2: Convert from PDF */}
                    <div>
                      <div className="text-xs font-bold text-surface-400 mb-3 pb-2 border-b border-surface-100 dark:border-surface-800 uppercase tracking-wider">
                        PDF → {isRtl ? "تحويل إلى" : "Convert to"}
                      </div>
                      {[
                        { label: "JPG", color: "text-amber-500 dark:text-amber-400", bg: "bg-amber-50 dark:bg-amber-950/20", slug: "pdf-to-jpg", icon: ImageIcon },
                        { label: "WORD", color: "text-blue-500 dark:text-blue-400", bg: "bg-blue-50 dark:bg-blue-950/20", slug: "pdf-to-word", icon: FileText },
                        { label: "PPT", color: "text-red-500 dark:text-red-400", bg: "bg-red-50 dark:bg-red-950/20", slug: "pdf-to-powerpoint", icon: Presentation },
                        { label: "XLS", color: "text-green-500 dark:text-green-400", bg: "bg-green-50 dark:bg-green-950/20", slug: "pdf-to-excel", icon: FileSpreadsheet },
                        { label: "PDF/A", color: "text-purple-500 dark:text-purple-400", bg: "bg-purple-50 dark:bg-purple-950/20", slug: "pdf-to-pdfa", icon: BookOpen },
                      ].map((item) => {
                        const IconComponent = item.icon;
                        return (
                          <Link
                            key={item.label}
                            href={`/${locale}/pdf/${item.slug}`}
                            className="flex items-center justify-between p-2 rounded-xl mb-1 text-surface-700 dark:text-surface-300 hover:bg-surface-50 dark:hover:bg-surface-800/50 transition-colors group/item"
                          >
                            <span className="text-sm font-semibold text-surface-700 dark:text-surface-300">PDF → {item.label}</span>
                            <span
                              className={`w-8 h-8 rounded-lg ${item.bg} flex items-center justify-center flex-shrink-0 transition-transform duration-200 group-hover/item:scale-110 shadow-sm`}
                            >
                              <IconComponent className={`h-4.5 w-4.5 ${item.color}`} />
                            </span>
                          </Link>
                        );
                      })}
                    </div>
                  </div>

                  {/* Divider */}
                  <div style={{ borderTop: "1px solid #eef1f6", margin: "16px 0 12px" }} />

                  {/* All Other Tools */}
                  <div style={{ fontSize: 11, fontWeight: 600, color: "#9aa4b2", marginBottom: 10, textTransform: "uppercase", letterSpacing: "0.06em" }}>
                    {t("common.nav.tools")}
                  </div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                    {pdfTools.filter(tool => tool.id !== "convert-pdf").map((tool) => {
                      const transKey = getTranslationKeys(tool.id);
                      const title = transKey ? t(`${transKey}.title`) : tool.title;
                      return (
                        <a
                          key={tool.id}
                          href={`/${locale}/pdf/${tool.slug}`}
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            padding: "6px 14px",
                            borderRadius: 8,
                            fontSize: 12,
                            fontWeight: 600,
                            color: "#4d5765",
                            textDecoration: "none",
                            border: "1px solid #e2e6ed",
                            transition: "all 0.15s",
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = "#f4f6f9";
                            e.currentTarget.style.borderColor = "#cbd2dc";
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = "transparent";
                            e.currentTarget.style.borderColor = "#e2e6ed";
                          }}
                        >
                          {title}
                        </a>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            <Link href={`/${locale}/pricing`} className="px-3 py-2 rounded-lg text-sm font-semibold text-surface-600 hover:text-surface-900 dark:text-surface-400 dark:hover:text-surface-100 hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors">
              {t("common.nav.pricing")}
            </Link>
            <Link href={`/${locale}/blog`} className="px-3 py-2 rounded-lg text-sm font-semibold text-surface-600 hover:text-surface-900 dark:text-surface-400 dark:hover:text-surface-100 hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors">
              {t("common.nav.blog")}
            </Link>

            {/* Language Switcher */}
            <div className="relative" onMouseEnter={() => setLangOpen(true)} onMouseLeave={() => setLangOpen(false)}>
              <button className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-surface-600 hover:text-surface-900 dark:text-surface-400 dark:hover:text-surface-100 hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors">
                <Globe className="h-4 w-4" />
                <span className="hidden xl:inline">{currentLang.label}</span>
                <ChevronDown className="h-3.5 w-3.5 opacity-50" />
              </button>
              {langOpen && (
                <div className={`absolute top-full mt-1 w-48 p-2 rounded-2xl border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-900 shadow-xl animate-scale-in ${isRtl ? "right-0" : "left-0"}`}>
                  <div className="max-h-64 overflow-y-auto space-y-0.5">
                    {languages.map((lang) => (
                      <Link
                        key={lang.code}
                        href={pathname.replace(`/${locale}`, `/${lang.code}`)}
                        className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm transition-colors ${lang.code === locale ? "bg-brand-50 dark:bg-brand-950/30 text-brand-600 font-medium" : "text-surface-600 dark:text-surface-400 hover:bg-surface-50 dark:hover:bg-surface-800"}`}
                      >
                        <Globe className="h-3.5 w-3.5 shrink-0" />
                        {lang.label}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-1.5">
            {mounted && (
              <button onClick={cycleTheme} className="flex h-9 w-9 items-center justify-center rounded-lg text-surface-500 hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors" aria-label="Toggle theme">
                {themeIcon()}
              </button>
            )}

            <div className="hidden sm:flex items-center gap-1.5">
              <Link href={`/${locale}/login`}>
                <Button variant="ghost" size="sm" className="gap-1.5">
                  <LogIn className="h-4 w-4" />
                  {t("common.nav.login")}
                </Button>
              </Link>
              <Link href={`/${locale}/register`}>
                <Button size="sm" className="gap-1.5">
                  <UserPlus className="h-4 w-4" />
                  {t("common.nav.register")}
                </Button>
              </Link>
            </div>

            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="lg:hidden flex h-9 w-9 items-center justify-center rounded-lg text-surface-500 hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors" aria-label="Toggle menu">
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-900 animate-slide-down max-h-[80vh] overflow-y-auto">
          <div className="container-nova py-4 space-y-1">
            <div className="px-3 py-2 text-xs font-semibold uppercase tracking-wider text-surface-400">{t("common.nav.tools")}</div>
            {toolCategories.map((cat) => (
              <Link key={cat.key} href={`/${locale}${cat.href}`} onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-surface-50 dark:hover:bg-surface-800 transition-colors">
                <cat.icon className={`h-4 w-4 ${cat.color}`} />
                <span className="text-sm font-medium text-surface-700 dark:text-surface-300">{t(`common.nav.${cat.key}`)}</span>
              </Link>
            ))}
            <div className="border-t border-surface-200 dark:border-surface-700 pt-3 mt-3 space-y-1">
              <Link href={`/${locale}/pricing`} onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-surface-600 dark:text-surface-400 hover:bg-surface-50 dark:hover:bg-surface-800">
                {t("common.nav.pricing")}
              </Link>
              <Link href={`/${locale}/blog`} onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-surface-600 dark:text-surface-400 hover:bg-surface-50 dark:hover:bg-surface-800">
                {t("common.nav.blog")}
              </Link>
              <div className="flex gap-2 pt-2">
                <Link href={`/${locale}/login`} onClick={() => setMobileMenuOpen(false)} className="flex-1">
                  <Button variant="outline" size="sm" className="w-full">{t("common.nav.login")}</Button>
                </Link>
                <Link href={`/${locale}/register`} onClick={() => setMobileMenuOpen(false)} className="flex-1">
                  <Button size="sm" className="w-full">{t("common.nav.register")}</Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
