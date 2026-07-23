"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";
import { Upload } from "lucide-react";

// Skeleton component matching exact height to prevent Cumulative Layout Shift (CLS)
function ToolSkeleton() {
  return (
    <div className="w-full max-w-3xl mx-auto h-[400px] rounded-2xl bg-surface-50 dark:bg-surface-900 border border-dashed border-surface-200 dark:border-surface-800 animate-pulse flex flex-col items-center justify-center p-8 space-y-4">
      <div className="h-12 w-12 rounded-xl bg-surface-200 dark:bg-surface-800" />
      <div className="h-4 w-48 rounded bg-surface-200 dark:bg-surface-800" />
      <div className="h-3 w-64 rounded bg-surface-200 dark:bg-surface-800" />
    </div>
  );
}

// Lazy load the heavy tool with no SSR (client-side library reliant)
const LazyPdfToolComponent = dynamic(
  () => import("./tool-tool").then((mod) => mod.ToolTool),
  {
    ssr: false,
    loading: () => <ToolSkeleton />,
  }
);

interface LazyPdfToolWrapperProps {
  slug: string;
  locale: string;
}

export function LazyPdfToolWrapper({ slug, locale }: LazyPdfToolWrapperProps) {
  const [interacted, setInteracted] = useState(false);

  const handleStartInteraction = () => {
    setInteracted(true);
  };

  if (interacted) {
    return <LazyPdfToolComponent slug={slug} />;
  }

  const isAr = locale === "ar";

  // Light initial placeholder state (renders in <10ms, perfect LCP)
  return (
    <div
      onClick={handleStartInteraction}
      onDragOver={(e) => {
        e.preventDefault();
        handleStartInteraction();
      }}
      className="w-full max-w-3xl mx-auto h-[400px] rounded-2xl border-2 border-dashed border-surface-200 hover:border-brand-500 dark:border-surface-800 dark:hover:border-brand-400 bg-white dark:bg-surface-950 flex flex-col items-center justify-center p-8 text-center cursor-pointer transition-all duration-300 shadow-sm"
    >
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-50/80 dark:bg-brand-950/30 text-brand-500 mb-6">
        <Upload className="h-8 w-8" />
      </div>
      <h3 className="text-xl font-bold text-surface-900 dark:text-surface-50 mb-2">
        {isAr ? "اسحب وأفلت ملفاتك هنا للبدء" : "Drag and drop your files here to start"}
      </h3>
      <p className="text-sm text-surface-500 dark:text-surface-400 max-w-md leading-relaxed mb-6">
        {isAr 
          ? "تتم معالجة الملفات بالكامل محلياً داخل متصفحك. لا نقوم برفع ملفاتك لأي خادم لضمان حمايتها."
          : "Processing happens entirely locally in your browser. We never upload your files to keep them safe."}
      </p>
      <button className="px-6 py-3 rounded-xl bg-brand-500 text-white font-bold hover:bg-brand-600 transition-colors shadow-md shadow-brand-500/10">
        {isAr ? "اختر الملفات" : "Choose Files"}
      </button>
    </div>
  );
}
