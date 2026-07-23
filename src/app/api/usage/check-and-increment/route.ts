import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";

function getStartOfDay() {
  const d = new Date();
  d.setUTCHours(0, 0, 0, 0);
  return d;
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth();

    if (!session || !session.user) {
      const isAr = req.headers.get("referer")?.includes("/ar") || false;
      return NextResponse.json(
        {
          error: "UNAUTHENTICATED",
          message: isAr
            ? "يرجى تسجيل الدخول أو إنشاء حساب مجاني لتتمكن من معالجة الملفات."
            : "Please log in or register a free account to process files.",
        },
        { status: 401 }
      );
    }

    const userId = (session.user as any).id;

    // Retrieve payload
    const body = await req.json();
    const { fileCount, fileSizes, toolSlug, locale } = body as {
      fileCount: number;
      fileSizes: number[]; // Sizes in bytes
      toolSlug?: string;
      locale?: "ar" | "en";
    };

    if (!fileCount || !fileSizes || fileSizes.length !== fileCount) {
      return NextResponse.json(
        { error: "BAD_REQUEST", message: "Invalid files parameters." },
        { status: 400 }
      );
    }

    const isAr = locale === "ar";

    // Retrieve user's subscription and plan
    let subscription = await db.subscription.findUnique({
      where: { userId },
      include: { plan: true },
    });

    // Default configuration for Free plan if no DB plan is linked
    let planId = "free";
    let planName = "Free";
    let maxFileSizeMB: number | null = 10;
    let dailyFileLimit: number | null = 10;

    if (subscription && subscription.status === "ACTIVE") {
      planId = subscription.planId;
      planName = subscription.plan.name;
      maxFileSizeMB = subscription.plan.maxFileSizeMB;
      dailyFileLimit = subscription.plan.dailyFileLimit;
    }

    // 0. Enforce Free plan restrictions (no batch processing, basic tools only)
    if (planId === "free") {
      const BASIC_TOOLS = [
        "merge-pdf",
        "split-pdf",
        "compress-pdf",
        "rotate-pdf",
        "organize-pdf",
        "crop-pdf",
        "add-page-numbers-pdf",
        "add-watermark-pdf"
      ];

      // A. Check premium tools access
      if (toolSlug && !BASIC_TOOLS.includes(toolSlug)) {
        return NextResponse.json(
          {
            error: "LIMIT_EXCEEDED",
            message: isAr
              ? "هذه الأداة متوفرة فقط في الخطط المدفوعة (برو / الأعمال). يرجى الترقية للاستفادة منها."
              : "This tool is only available on premium plans (Pro / Business). Please upgrade your plan to access it."
          },
          { status: 403 }
        );
      }

      // B. Check batch processing (free only processes 1 file at a time)
      if (fileCount > 1) {
        return NextResponse.json(
          {
            error: "LIMIT_EXCEEDED",
            message: isAr
              ? "المعالجة الجماعية لعدة ملفات معاً متوفرة فقط في الخطط المدفوعة (برو / الأعمال). يرجى ترقية حسابك."
              : "Batch processing is only available on premium plans (Pro / Business). Please upgrade your plan."
          },
          { status: 403 }
        );
      }
    }

    // 1. Enforce Max File Size Limits
    if (maxFileSizeMB !== null) {
      const maxSizeBytes = maxFileSizeMB * 1024 * 1024;
      for (const size of fileSizes) {
        if (size > maxSizeBytes) {
          return NextResponse.json(
            {
              error: "LIMIT_EXCEEDED",
              message: isAr
                ? `حجم الملف يتجاوز الحد المسموح به لخطتك وهو ${maxFileSizeMB} ميجابايت. يرجى ترقية الخطة.`
                : `File size exceeds the limit of ${maxFileSizeMB}MB for the ${planName} plan. Please upgrade your plan.`,
            },
            { status: 403 }
          );
        }
      }
    }

    // 2. Enforce Daily File Processing Limits (Only for limited plans)
    if (dailyFileLimit !== null) {
      const startOfDay = getStartOfDay();
      
      const usage = await db.dailyUsage.findUnique({
        where: {
          userId_date: {
            userId,
            date: startOfDay,
          },
        },
      });

      const currentUsed = usage ? usage.filesUsed : 0;

      if (currentUsed + fileCount > dailyFileLimit) {
        return NextResponse.json(
          {
            error: "LIMIT_EXCEEDED",
            message: isAr
              ? `لقد وصلت إلى الحد اليومي الأقصى لمعالجة الملفات وهو ${dailyFileLimit} ملفات لخطة الاشتراك المجانية. يرجى الترقية للخطة المدفوعة لفتح الاستخدام غير المحدود.`
              : `You have reached your daily limit of ${dailyFileLimit} files for the ${planName} plan. Please upgrade to a premium plan for unlimited usage.`,
          },
          { status: 403 }
        );
      }

      // Increment Usage
      await db.dailyUsage.upsert({
        where: {
          userId_date: {
            userId,
            date: startOfDay,
          },
        },
        update: {
          filesUsed: {
            increment: fileCount,
          },
        },
        create: {
          userId,
          date: startOfDay,
          filesUsed: fileCount,
        },
      });
    }

    return NextResponse.json({ success: true, plan: planId });
  } catch (error) {
    console.error("Usage limit check error:", error);
    return NextResponse.json(
      { error: "INTERNAL_ERROR", message: "Failed to enforce tier limits." },
      { status: 500 }
    );
  }
}
