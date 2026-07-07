"use client";

import { useState, useEffect } from "react";
import { Shield, Zap, Clock, Share2, Copy, CheckCircle2 } from "lucide-react";

// Custom inline SVG components for Twitter and LinkedIn to avoid version incompatibility
const TwitterIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" width="1em" height="1em" fill="currentColor" {...props}>
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const LinkedinIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" width="1em" height="1em" fill="currentColor" {...props}>
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
);

/**
 * ProcessingTimer — Shows real-time processing duration and "0 bytes uploaded" badge.
 * Displayed during and after file processing to reinforce the client-side USP.
 */
export function ProcessingTimer({
  isProcessing,
  isComplete,
  inputSize,
  outputSize,
}: {
  isProcessing: boolean;
  isComplete: boolean;
  inputSize?: number;
  outputSize?: number;
}) {
  const [elapsed, setElapsed] = useState(0);
  const [finalTime, setFinalTime] = useState(0);

  useEffect(() => {
    if (!isProcessing) {
      if (isComplete && elapsed > 0) {
        setFinalTime(elapsed);
      }
      return;
    }
    setElapsed(0);
    setFinalTime(0);
    const start = performance.now();
    const interval = setInterval(() => {
      setElapsed((performance.now() - start) / 1000);
    }, 50);
    return () => clearInterval(interval);
  }, [isProcessing, isComplete, elapsed]);

  const displayTime = isComplete ? finalTime : elapsed;
  const isRtl = typeof window !== "undefined" && document.documentElement.dir === "rtl";

  if (!isProcessing && !isComplete) return null;

  return (
    <div className="flex flex-wrap items-center justify-center gap-3 mt-4 animate-fade-in">
      {/* Processing time badge */}
      <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-brand-50/80 dark:bg-brand-950/30 border border-brand-200/60 dark:border-brand-800/50 text-xs font-semibold">
        <Clock className="h-3.5 w-3.5 text-brand-500" />
        <span className="text-brand-700 dark:text-brand-300">
          {isProcessing ? (
            isRtl ? `جاري المعالجة... ${displayTime.toFixed(1)}s` : `Processing... ${displayTime.toFixed(1)}s`
          ) : (
            isRtl ? `تمت المعالجة محلياً في ${displayTime.toFixed(1)} ثانية` : `Processed locally in ${displayTime.toFixed(1)}s`
          )}
        </span>
      </div>

      {/* Zero bytes uploaded badge */}
      <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-green-50/80 dark:bg-green-950/30 border border-green-200/60 dark:border-green-800/50 text-xs font-semibold">
        <Shield className="h-3.5 w-3.5 text-green-500" />
        <span className="text-green-700 dark:text-green-300">
          {isRtl ? "0 بايت تم رفعها" : "0 bytes uploaded"}
        </span>
      </div>

      {/* Compression ratio badge (shown when applicable) */}
      {isComplete && inputSize && outputSize && outputSize < inputSize && (
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-purple-50/80 dark:bg-purple-950/30 border border-purple-200/60 dark:border-purple-800/50 text-xs font-semibold">
          <Zap className="h-3.5 w-3.5 text-purple-500" />
          <span className="text-purple-700 dark:text-purple-300">
            {Math.round((1 - outputSize / inputSize) * 100)}% {isRtl ? "أصغر" : "smaller"}
          </span>
        </div>
      )}
    </div>
  );
}

/**
 * ShareableResultCard — Post-download viral loop component.
 * Generates a shareable card with processing stats that links back to WorldPDF.
 */
export function ShareableResultCard({
  toolName,
  processingTime,
  inputFileName,
}: {
  toolName: string;
  processingTime: number;
  inputFileName: string;
}) {
  const [copied, setCopied] = useState(false);
  const isRtl = typeof window !== "undefined" && document.documentElement.dir === "rtl";

  const shareText = isRtl
    ? `قمت بـ ${toolName} في ${processingTime.toFixed(1)} ثانية — بالكامل في متصفحي! 🔒 صفر رفع، 100% خاص. جربه مجاناً: worldpdf.com`
    : `Just ${toolName.toLowerCase()}ed my PDF in ${processingTime.toFixed(1)}s — entirely in my browser! 🔒 Zero uploads, 100% private. Try it free: worldpdf.com`;

  const shareUrl = typeof window !== "undefined" ? window.location.href : "https://worldpdf.com";

  const shareToTwitter = () => {
    window.open(
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`,
      "_blank",
      "noopener,noreferrer"
    );
  };

  const shareToLinkedIn = () => {
    window.open(
      `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`,
      "_blank",
      "noopener,noreferrer"
    );
  };

  const copyShareText = () => {
    navigator.clipboard.writeText(shareText).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="mt-6 p-5 rounded-2xl bg-gradient-to-br from-surface-50 to-surface-100/50 dark:from-surface-800/50 dark:to-surface-900/50 border border-surface-200/80 dark:border-surface-700/50">
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <Share2 className="h-4 w-4 text-brand-500" />
        <h4 className="text-sm font-bold text-surface-800 dark:text-surface-200">
          {isRtl ? "شارك نتائجك" : "Share Your Results"}
        </h4>
      </div>

      {/* Stats summary */}
      <div className="flex flex-wrap gap-3 mb-4 text-xs">
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white dark:bg-surface-800 border border-surface-200 dark:border-surface-700 font-medium text-surface-600 dark:text-surface-400">
          <CheckCircle2 className="h-3 w-3 text-green-500" />
          {isRtl ? `${processingTime.toFixed(1)} ثانية` : `${processingTime.toFixed(1)}s`}
        </span>
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white dark:bg-surface-800 border border-surface-200 dark:border-surface-700 font-medium text-surface-600 dark:text-surface-400">
          <Shield className="h-3 w-3 text-green-500" />
          {isRtl ? "0 بايت رُفعت" : "0 bytes uploaded"}
        </span>
      </div>

      {/* Team sharing nudge */}
      <p className="text-xs text-surface-500 dark:text-surface-400 mb-4 leading-relaxed">
        {isRtl
          ? "💡 زملاؤك ربما لا يزالون يرفعون ملفاتهم إلى خوادم خارجية. شارك WorldPDF معهم — الملفات تبقى على الجهاز، دائماً."
          : "💡 Your coworkers might still be uploading files to external servers. Share WorldPDF with them — files stay on device, always."}
      </p>

      {/* Share buttons */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={shareToTwitter}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#1DA1F2]/10 text-[#1DA1F2] hover:bg-[#1DA1F2]/20 transition-colors text-xs font-semibold"
        >
          <TwitterIcon className="h-3.5 w-3.5" />
          {isRtl ? "تويتر" : "Twitter"}
        </button>
        <button
          onClick={shareToLinkedIn}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#0077B5]/10 text-[#0077B5] hover:bg-[#0077B5]/20 transition-colors text-xs font-semibold"
        >
          <LinkedinIcon className="h-3.5 w-3.5" />
          LinkedIn
        </button>
        <button
          onClick={copyShareText}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-surface-100 dark:bg-surface-800 text-surface-600 dark:text-surface-400 hover:bg-surface-200 dark:hover:bg-surface-700 transition-colors text-xs font-semibold"
        >
          {copied ? <CheckCircle2 className="h-3.5 w-3.5 text-green-500" /> : <Copy className="h-3.5 w-3.5" />}
          {copied ? (isRtl ? "تم النسخ!" : "Copied!") : (isRtl ? "نسخ النص" : "Copy Text")}
        </button>
      </div>
    </div>
  );
}

/**
 * SnippetBaitParagraph — Renders the SEO snippet-bait content for Featured Snippet capture.
 * This is a visible paragraph styled to be the first meaningful content block on the page.
 */
export function SnippetBaitParagraph({
  content,
  locale,
}: {
  content: string;
  locale: string;
}) {
  return (
    <p
      className="text-sm sm:text-base text-surface-600 dark:text-surface-400 leading-relaxed mb-6 max-w-3xl"
      dir={locale === "ar" ? "rtl" : "ltr"}
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
}

/**
 * ZeroBytesUploadedBadge — Persistent trust indicator shown near the tool.
 */
export function ZeroBytesUploadedBadge() {
  const isRtl = typeof window !== "undefined" && document.documentElement.dir === "rtl";
  
  return (
    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-green-50/80 dark:bg-green-950/20 border border-green-200/60 dark:border-green-800/40 text-xs font-semibold text-green-700 dark:text-green-300 mb-4">
      <Shield className="h-3.5 w-3.5 text-green-500 shrink-0" />
      <span>
        {isRtl ? "🔒 المعالجة تتم محلياً — ملفاتك لا تغادر جهازك" : "🔒 Client-side processing — your files never leave your device"}
      </span>
    </div>
  );
}

