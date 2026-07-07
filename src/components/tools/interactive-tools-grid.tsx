"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import * as Icons from "lucide-react";
import { Card } from "@/components/ui/card";
import type { ToolCategory_ } from "@/types/tool";
import { getTranslationKeys } from "@/lib/tools/registry";
import { useTranslations } from "next-intl";

type Props = {
  categories: ToolCategory_[];
  locale: string;
};

const subCategories = [
  { id: "all", titleAr: "الجميع", titleEn: "All" },
  { id: "organize", titleAr: "تنظيم ملف PDF", titleEn: "Organize PDF", tools: ["merge-pdf", "split-pdf", "organize-pdf", "rotate-pdf", "custom-workflow"] },
  { id: "optimize", titleAr: "تحسين مستند", titleEn: "Optimize PDF", tools: ["compress-pdf", "repair-pdf", "ocr-pdf", "compare-pdf", "smart-summary"] },
  { id: "to-pdf", titleAr: "تحويل إلى PDF", titleEn: "Convert to PDF", tools: ["jpg-to-pdf", "word-to-pdf", "powerpoint-to-pdf", "excel-to-pdf", "html-to-pdf", "scan-to-pdf"] },
  { id: "from-pdf", titleAr: "تحويل من PDF", titleEn: "Convert from PDF", tools: ["pdf-to-jpg", "pdf-to-word", "pdf-to-powerpoint", "pdf-to-excel", "pdf-to-pdfa", "pdf-to-markdown"] },
  { id: "edit", titleAr: "تعديل ملف PDF", titleEn: "Edit PDF", tools: ["edit-pdf", "add-page-numbers-pdf", "add-watermark-pdf", "crop-pdf", "redact-pdf", "pdf-forms", "translate-pdf"] },
  { id: "security", titleAr: "حماية ملفات PDF", titleEn: "Protect PDF", tools: ["unlock-pdf", "protect-pdf", "sign-pdf"] }
];

export function InteractiveToolsGrid({ categories, locale }: Props) {
  const t = useTranslations();
  const [activeCategory, setActiveCategory] = useState<string>("all");

  const categoriesWithTranslations = useMemo(() => {
    return categories.map((cat) => {
      const toolsWithTranslations = cat.tools.map((tool) => {
        const transKey = getTranslationKeys(tool.id);
        const title = transKey ? t(`${transKey}.title`) : tool.title;
        const description = transKey ? t(`${transKey}.description`) : tool.description;

        return {
          ...tool,
          translatedTitle: title,
          translatedDescription: description,
          categorySlug: cat.slug,
        };
      });

      return {
        ...cat,
        tools: toolsWithTranslations,
      };
    });
  }, [categories, t]);

  const allTools = useMemo(() => {
    return categoriesWithTranslations.flatMap((cat) => cat.tools);
  }, [categoriesWithTranslations]);

  const filteredTools = useMemo(() => {
    let tools = allTools;

    if (activeCategory !== "all") {
      const sub = subCategories.find((s) => s.id === activeCategory);
      if (sub) {
        tools = allTools.filter((tool) => sub.tools.includes(tool.id));
      }
    }

    return tools;
  }, [activeCategory, allTools]);

  return (
    <div className="space-y-10 animate-fade-in">
      {/* Categories Tabs Filter */}
      <div className="border-b border-surface-200/60 dark:border-surface-800/80 pb-2">
        <div className="flex flex-wrap gap-2 justify-start md:justify-center pb-3 pt-1 text-surface-700">
          {subCategories.map((sub) => {
            const title = locale === "ar" ? sub.titleAr : sub.titleEn;
            return (
              <button
                key={sub.id}
                onClick={() => setActiveCategory(sub.id)}
                className={`px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-all duration-200 cursor-pointer ${
                  activeCategory === sub.id
                    ? "bg-[#252f3f] text-white shadow-sm dark:bg-white dark:text-slate-900 font-bold"
                    : "text-surface-600 hover:text-surface-900 hover:bg-surface-50 dark:text-surface-400 dark:hover:text-surface-150 dark:hover:bg-surface-900"
                }`}
              >
                {title}
              </button>
            );
          })}
        </div>
      </div>

      {/* Grid List of Tools */}
      {filteredTools.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-5">
          {filteredTools.map((tool) => {
            const IconComponent = (Icons as any)[tool.icon] || Icons.Wrench;

            return (
              <Link
                key={tool.id}
                href={`/${locale}/${tool.categorySlug}/${tool.slug}`}
                className="group"
              >
                <Card className="h-full border border-surface-200 bg-white dark:bg-surface-900 dark:border-surface-800 transition-all duration-300 relative overflow-hidden flex flex-col hover:shadow-lg hover:border-surface-300 dark:hover:border-surface-700 hover:-translate-y-1 rounded-2xl p-6 pt-14 min-h-[190px]">
                  {/* Floating Icon in Top Right Corner */}
                  <div
                    className={`absolute top-4 right-4 flex h-8 w-8 items-center justify-center rounded-lg ${tool.bgColor} shadow-sm`}
                  >
                    <IconComponent className={`h-4.5 w-4.5 ${tool.color}`} />
                  </div>

                  <div className="flex flex-col h-full justify-center gap-2 flex-1">
                    {/* Centered Title */}
                    <h3 className="font-bold text-base text-surface-800 dark:text-surface-100 text-center leading-snug group-hover:text-brand-500 transition-colors duration-300 mt-2">
                      {tool.translatedTitle}
                    </h3>

                    {/* Centered Description */}
                    <p className="text-xs text-surface-400 dark:text-surface-500 text-center leading-relaxed line-clamp-3">
                      {tool.translatedDescription}
                    </p>
                  </div>
                </Card>
              </Link>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-2xl border border-surface-200 dark:bg-surface-900 dark:border-surface-800">
          <Icons.AlertTriangle className="h-10 w-10 mx-auto text-surface-300 mb-3" />
          <h3 className="text-base font-semibold text-surface-900 dark:text-surface-100 mb-1">
            {locale === "ar" ? "لا توجد أدوات متاحة" : "No tools available"}
          </h3>
        </div>
      )}
    </div>
  );
}

