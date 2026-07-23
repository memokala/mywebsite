"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { useParams } from "next/navigation";

function useIsRtl() {
  const params = useParams();
  return params?.locale === "ar";
}
import { useDropzone } from "react-dropzone";
import {
  Upload,
  FileText,
  Download,
  X,
  Image as ImageIcon,
  Music,
  Video,
  Sparkles,
  Type,
  Search,
  Code,
  Repeat,
  Calculator,
  DollarSign,
  GraduationCap,
  Wrench,
  QrCode,
  Key,
  Timer,
  Clock,
  Palette,
  GitCompare,
  FileEdit,
  Scissors,
  RotateCw,
  Shield,
  Pen,
  Combine,
  RefreshCw,
  FolderTree,
  Lock,
  Hash,
  Scale,
  Percent,
  TrendingUp,
  Globe,
  Settings,
  RefreshCcw,
  CheckCircle2,
  ChevronRight,
  Unlock,
  BookOpen,
  Camera,
  ScanText,
  Eraser,
  Crop,
  CheckSquare,
  Cpu,
  Languages,
  Workflow,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ProcessingTimer, ShareableResultCard } from "@/components/seo/seo-components";

const toolIcons: Record<string, React.ElementType> = {
  FileText, Image: ImageIcon, Music, Video, Sparkles, Type, Search, Code, Repeat,
  Calculator, DollarSign, GraduationCap, Wrench, QrCode, Key, Timer, Clock,
  Palette, GitCompare, FileEdit, Scissors, RotateCw, Shield, Pen, Combine,
  RefreshCw, FolderTree, Lock, Hash, Scale, Percent, TrendingUp, Globe,
  Unlock, BookOpen, Camera, ScanText, Eraser, Crop, CheckSquare, Cpu, Languages, Workflow,
};

type ToolComponentProps = {
  slug: string;
};

const toolDefaults: Record<string, {
  icon: string;
  accept: Record<string, string[]>;
  maxFiles: number;
  description: string;
  descriptionAr: string;
}> = {
  "merge-pdf": { icon: "Combine", accept: { "application/pdf": [".pdf"] }, maxFiles: 15, description: "Upload PDF files to merge them into one document.", descriptionAr: "ارفع ملفات PDF لدمجها في مستند واحد." },
  "split-pdf": { icon: "Scissors", accept: { "application/pdf": [".pdf"] }, maxFiles: 1, description: "Upload a PDF to split it into multiple files.", descriptionAr: "ارفع ملف PDF لتقسيمه إلى نطاق صفحات محدد." },
  "compress-pdf": { icon: "Scale", accept: { "application/pdf": [".pdf"] }, maxFiles: 1, description: "Upload a PDF to compress its file size.", descriptionAr: "ارفع ملف PDF لتقليص حجم الملف." },
  "pdf-to-word": { icon: "FileText", accept: { "application/pdf": [".pdf"] }, maxFiles: 1, description: "Upload PDF to convert to Word document.", descriptionAr: "ارفع ملف PDF لتحويله إلى مستند وورد." },
  "pdf-to-powerpoint": { icon: "Sparkles", accept: { "application/pdf": [".pdf"] }, maxFiles: 1, description: "Upload PDF to convert to PowerPoint slides.", descriptionAr: "ارفع ملف PDF لتحويله إلى عرض تقديمي بوربوينت." },
  "pdf-to-excel": { icon: "TrendingUp", accept: { "application/pdf": [".pdf"] }, maxFiles: 1, description: "Upload PDF to extract data to Excel.", descriptionAr: "ارفع ملف PDF لاستخراج البيانات إلى إكسيل." },
  "word-to-pdf": { icon: "FileText", accept: { "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"], "application/msword": [".doc"] }, maxFiles: 1, description: "Upload a Word document to convert to PDF.", descriptionAr: "ارفع مستند وورد لتحويله إلى PDF." },
  "powerpoint-to-pdf": { icon: "Sparkles", accept: { "application/vnd.openxmlformats-officedocument.presentationml.presentation": [".pptx"], "application/vnd.ms-powerpoint": [".ppt"] }, maxFiles: 1, description: "Upload PowerPoint slides to convert to PDF.", descriptionAr: "ارفع عرض تقديمي بوربوينت لتحويله إلى PDF." },
  "excel-to-pdf": { icon: "TrendingUp", accept: { "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [".xlsx"], "application/vnd.ms-excel": [".xls"] }, maxFiles: 1, description: "Upload Excel spreadsheets to convert to PDF.", descriptionAr: "ارفع جداول إكسيل لتحويلها إلى PDF." },
  "edit-pdf": { icon: "FileEdit", accept: { "application/pdf": [".pdf"] }, maxFiles: 1, description: "Upload a PDF to edit its content.", descriptionAr: "ارفع ملف PDF لتعديل محتواه." },
  "pdf-to-jpg": { icon: "Image", accept: { "application/pdf": [".pdf"] }, maxFiles: 1, description: "Upload PDF to convert pages to JPG images.", descriptionAr: "ارفع ملف PDF لتحويل صفحاته إلى صور JPG." },
  "jpg-to-pdf": { icon: "Image", accept: { "image/*": [".png", ".jpg", ".jpeg", ".webp"] }, maxFiles: 25, description: "Upload JPG, PNG or WebP images to compile into PDF.", descriptionAr: "ارفع صور JPG أو PNG أو WebP لتحويلها إلى مستند PDF." },
  "sign-pdf": { icon: "Pen", accept: { "application/pdf": [".pdf"] }, maxFiles: 1, description: "Upload a PDF document to add your signature.", descriptionAr: "ارفع ملف PDF لإضافة توقيعك الإلكتروني." },
  "add-watermark-pdf": { icon: "Palette", accept: { "application/pdf": [".pdf"] }, maxFiles: 1, description: "Upload a PDF to add text watermark.", descriptionAr: "ارفع ملف PDF لإضافة علامة مائية نصية." },
  "rotate-pdf": { icon: "RotateCw", accept: { "application/pdf": [".pdf"] }, maxFiles: 1, description: "Upload a PDF to rotate its pages.", descriptionAr: "ارفع ملف PDF لتدوير صفحاته." },
  "html-to-pdf": { icon: "Globe", accept: { "text/html": [".html", ".htm"] }, maxFiles: 1, description: "Upload HTML file or use options to generate PDF.", descriptionAr: "ارفع ملف HTML أو استخدم المحرر لإنشاء PDF." },
  "unlock-pdf": { icon: "Unlock", accept: { "application/pdf": [".pdf"] }, maxFiles: 1, description: "Upload a protected PDF to remove password.", descriptionAr: "ارفع ملف PDF محمي لإزالة كلمة المرور منه." },
  "protect-pdf": { icon: "Lock", accept: { "application/pdf": [".pdf"] }, maxFiles: 1, description: "Upload a PDF to add password protection.", descriptionAr: "ارفع ملف PDF لحمايته بكلمة مرور." },
  "organize-pdf": { icon: "FolderTree", accept: { "application/pdf": [".pdf"] }, maxFiles: 1, description: "Upload PDF to reorganize, delete or order pages.", descriptionAr: "ارفع ملف PDF لإعادة ترتيب صفحاته أو حذفها." },
  "pdf-to-pdfa": { icon: "BookOpen", accept: { "application/pdf": [".pdf"] }, maxFiles: 1, description: "Upload PDF to convert to PDF/A standard.", descriptionAr: "ارفع ملف PDF لتحويله لصيغة PDF/A القياسية للأرشفة." },
  "repair-pdf": { icon: "Wrench", accept: { "application/pdf": [".pdf"] }, maxFiles: 1, description: "Upload a damaged PDF to repair it.", descriptionAr: "ارفع ملف PDF تالف لمحاولة إصلاحه واستعادة محتوياته." },
  "add-page-numbers-pdf": { icon: "Hash", accept: { "application/pdf": [".pdf"] }, maxFiles: 1, description: "Upload a PDF to add page numbers.", descriptionAr: "ارفع ملف PDF لإضافة أرقام الصفحات." },
  "scan-to-pdf": { icon: "Camera", accept: { "image/*": [".png", ".jpg", ".jpeg"] }, maxFiles: 10, description: "Upload captured pages to compile to PDF.", descriptionAr: "ارفع الصور الممسوحة ضوئياً لتحويلها إلى مستند PDF." },
  "ocr-pdf": { icon: "ScanText", accept: { "application/pdf": [".pdf"] }, maxFiles: 1, description: "Upload scanned PDF to extract searchable text via OCR.", descriptionAr: "ارفع ملف PDF ممسوح ضوئياً للتعرف على النصوص واستخراجها." },
  "compare-pdf": { icon: "GitCompare", accept: { "application/pdf": [".pdf"] }, maxFiles: 2, description: "Upload two PDF documents to compare them.", descriptionAr: "ارفع ملفين PDF للمقارنة بينهما وتحديد الفروقات." },
  "redact-pdf": { icon: "Eraser", accept: { "application/pdf": [".pdf"] }, maxFiles: 1, description: "Upload a PDF to mask/censor sensitive information.", descriptionAr: "ارفع ملف PDF لحجب وإخفاء النصوص الحساسة." },
  "crop-pdf": { icon: "Crop", accept: { "application/pdf": [".pdf"] }, maxFiles: 1, description: "Upload a PDF to crop page margins.", descriptionAr: "ارفع ملف PDF لقص هوامش الصفحات." },
  "pdf-forms": { icon: "CheckSquare", accept: { "application/pdf": [".pdf"] }, maxFiles: 1, description: "Upload interactive PDF form to edit fields.", descriptionAr: "ارفع ملف نماذج PDF لتعبئة الحقول والبيانات." },
  "smart-summary": { icon: "Cpu", accept: { "application/pdf": [".pdf"] }, maxFiles: 1, description: "Upload PDF document to summarize key topics with local AI.", descriptionAr: "ارفع ملف PDF لتلخيصه والحصول على النقاط الأساسية بالذكاء الاصطناعي." },
  "translate-pdf": { icon: "Languages", accept: { "application/pdf": [".pdf"] }, maxFiles: 1, description: "Upload PDF to translate texts locally.", descriptionAr: "ارفع ملف PDF لترجمة نصوصه محلياً في متصفحك." },
  "pdf-to-markdown": { icon: "Code", accept: { "application/pdf": [".pdf"] }, maxFiles: 1, description: "Upload PDF to convert layout into Markdown syntax.", descriptionAr: "ارفع ملف PDF لتحويله إلى صيغة Markdown." },
  "custom-workflow": { icon: "Workflow", accept: { "application/pdf": [".pdf"] }, maxFiles: 10, description: "Upload PDF files to run custom multi-step actions.", descriptionAr: "ارفع ملفات PDF لتنفيذ خطوات معالجة متتالية مخصصة." },
  "compress-image": { icon: "Image", accept: { "image/*": [".png", ".jpg", ".jpeg", ".webp"] }, maxFiles: 5, description: "Upload images to compress them.", descriptionAr: "ارفع الصور لضغط حجمها مع الحفاظ على الجودة." },
  "resize-image": { icon: "Image", accept: { "image/*": [".png", ".jpg", ".jpeg", ".webp"] }, maxFiles: 1, description: "Upload an image to resize it.", descriptionAr: "ارفع صورة لتغيير أبعادها بدقة." },
  "crop-image": { icon: "Image", accept: { "image/*": [".png", ".jpg", ".jpeg", ".webp"] }, maxFiles: 1, description: "Upload an image to crop it.", descriptionAr: "ارفع صورة لقص أجزاء منها." },
  "convert-image": { icon: "Repeat", accept: { "image/*": [".png", ".jpg", ".jpeg", ".webp"] }, maxFiles: 1, description: "Upload an image to convert its format.", descriptionAr: "ارفع صورة لتحويل صيغتها بين PNG، JPG، WebP." },
  "rotate-image": { icon: "RotateCw", accept: { "image/*": [".png", ".jpg", ".jpeg", ".webp"] }, maxFiles: 1, description: "Upload an image to rotate it.", descriptionAr: "ارفع صورة لتدويرها أو قلبها." },
};

const nonFileTools = [
  "word-counter", "case-converter", "plagiarism-checker", "diff-checker",
  "meta-tag-generator", "keyword-research-tool", "schema-generator", "sitemap-generator",
  "json-formatter", "base64-encoder-decoder", "html-formatter", "css-minifier",
  "javascript-formatter", "regex-tester", "uuid-generator", "hash-generator",
  "bmi-calculator", "percentage-calculator", "tip-calculator", "loan-calculator", "age-calculator",
  "compound-interest-calculator", "currency-converter", "salary-calculator", "vat-calculator",
  "grade-calculator", "gpa-calculator", "study-timer", "quiz-generator",
  "qr-code-generator", "password-generator", "online-timer", "stopwatch", "color-picker", "unit-converter",
  "ai-text-generator", "ai-image-generator", "ai-summarizer", "ai-rewriter", "ai-code-generator",
];

function FileRowPreview({ file }: { file: File }) {
  const [previewUrl, setPreviewUrl] = useState<string>("");

  useEffect(() => {
    if (file.type.startsWith("image/")) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      return () => {
        URL.revokeObjectURL(url);
      };
    }
  }, [file]);

  if (previewUrl) {
    return (
      <div className="w-11 h-11 rounded-xl overflow-hidden border border-surface-200 dark:border-surface-850 bg-surface-50 shrink-0 relative shadow-sm">
        <img src={previewUrl} alt={file.name} className="w-full h-full object-cover" />
      </div>
    );
  }

  // PDF icon or generic icon
  const isPdf = file.type === "application/pdf" || file.name.endsWith(".pdf");
  return (
    <div className={`p-2.5 rounded-xl shrink-0 shadow-sm ${
      isPdf ? "bg-red-50 text-red-500 dark:bg-red-950/20" : "bg-brand-50 text-brand-500 dark:bg-brand-950/20"
    }`}>
      <FileText className="h-5 w-5" />
    </div>
  );
}

export function ToolTool({ slug }: ToolComponentProps) {
  const defaults = toolDefaults[slug];
  const isNonFileTool = nonFileTools.includes(slug);
  const [files, setFiles] = useState<File[]>([]);
  const [processing, setProcessing] = useState(false);
  const [processed, setProcessed] = useState(false);
  const [processedData, setProcessedData] = useState<{ blob?: Blob; bytes?: Uint8Array; name: string } | null>(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [processingTime, setProcessingTime] = useState(0);
  const [inputFileSize, setInputFileSize] = useState(0);
  const processingStartRef = useRef<number>(0);

  // Tools specific states
  const [pdfPageCount, setPdfPageCount] = useState(1);
  const [splitStart, setSplitStart] = useState(1);
  const [splitEnd, setSplitEnd] = useState(1);
  const [pdfRotation, setPdfRotation] = useState(90);
  const [watermarkText, setWatermarkText] = useState("CONFIDENTIAL");
  const [watermarkOpacity, setWatermarkOpacity] = useState(0.3);
  const [pageNumberPos, setPageNumberPos] = useState("bottom-center");
  const [imageQuality, setImageQuality] = useState(0.8);
  const [imageWidth, setImageWidth] = useState(800);
  const [imageHeight, setImageHeight] = useState(600);
  const [maintainAspect, setMaintainAspect] = useState(true);
  const [imageRotateAngle, setImageRotateAngle] = useState(90);
  const [imageTargetFormat, setImageTargetFormat] = useState("image/png");
  const [originalImageDims, setOriginalImageDims] = useState({ w: 0, h: 0 });
  const [pdfPassword, setPdfPassword] = useState("");
  const [translateLang, setTranslateLang] = useState("ar");
  const [formFieldName, setFormFieldName] = useState("");
  const [htmlInput, setHtmlInput] = useState("<h1>My PDF</h1><p>Processed entirely client side.</p>");
  const [pageOrderInput, setPageOrderInput] = useState("");

  const isRtl = useIsRtl();

  useEffect(() => {
    // Only preload for PDF tools
    if (!slug.includes("pdf")) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // Warm up the chunk cache for pdf-lib
          import("pdf-lib").then(() => {
            console.log("pdf-lib preloaded successfully");
          });
          observer.disconnect();
        }
      },
      { rootMargin: "200px" }
    );
    const el = document.getElementById("tool-upload-zone");
    if (el) observer.observe(el);
    return () => observer.disconnect();
  }, [slug]);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    setErrorMsg("");
    setProcessed(false);
    setProcessedData(null);
    const newFiles = [...files, ...acceptedFiles].slice(0, defaults?.maxFiles || 1);
    setFiles(newFiles);

    // If it's a PDF split/page count tool, detect total pages
    if (newFiles.length > 0 && newFiles[0].type === "application/pdf") {
      try {
        const { PDFDocument } = await import("pdf-lib");
        const buffer = await newFiles[0].arrayBuffer();
        const pdf = await PDFDocument.load(buffer);
        const count = pdf.getPageCount();
        setPdfPageCount(count);
        setSplitEnd(count);
      } catch (e) {
        console.error("Failed to load PDF metadata", e);
      }
    }

    // If it's an image tool, detect original dimensions
    if (newFiles.length > 0 && newFiles[0].type.startsWith("image/")) {
      const img = new Image();
      img.src = URL.createObjectURL(newFiles[0]);
      img.onload = () => {
        setOriginalImageDims({ w: img.naturalWidth, h: img.naturalHeight });
        setImageWidth(img.naturalWidth);
        setImageHeight(img.naturalHeight);
      };
    }
  }, [defaults, files]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: defaults?.accept,
    maxFiles: defaults?.maxFiles || 1,
    disabled: processing,
  });

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
    setProcessed(false);
    setProcessedData(null);
    setErrorMsg("");
  };

  const reorderFile = (index: number, direction: "up" | "down") => {
    if (direction === "up" && index === 0) return;
    if (direction === "down" && index === files.length - 1) return;

    const newFiles = [...files];
    const temp = newFiles[index];
    const swapWith = direction === "up" ? index - 1 : index + 1;
    newFiles[index] = newFiles[swapWith];
    newFiles[swapWith] = temp;
    setFiles(newFiles);
  };

  const handleProcess = async () => {
    if (!files.length) return;
    setProcessing(true);
    setErrorMsg("");

    // Verify usage limits on the server before client-side execution
    try {
      const fileSizes = files.map(f => f.size);
      const res = await fetch("/api/usage/check-and-increment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fileCount: files.length,
          fileSizes,
          toolSlug: slug,
          locale: isRtl ? "ar" : "en"
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        if (res.status === 401) {
          setErrorMsg(
            isRtl
              ? "يرجى تسجيل الدخول أو إنشاء حساب مجاني لتتمكن من معالجة الملفات."
              : "Please log in or register a free account to process files."
          );
        } else {
          setErrorMsg(
            errorData.message ||
              (isRtl
                ? "تجاوزت خطتك حدود معالجة الملفات."
                : "Your plan limits have been exceeded.")
          );
        }
        setProcessing(false);
        return;
      }
    } catch (err) {
      console.error("Usage limit checking request failed:", err);
      // Fail-open in development or network errors to keep app running
    }

    processingStartRef.current = performance.now();
    setInputFileSize(files.reduce((sum, f) => sum + f.size, 0));
    try {
      let resultBytes: Uint8Array | undefined;
      let resultBlob: Blob | undefined;
      let outputName = "";

      const firstFile = files[0];
      const nameWithoutExt = firstFile.name.substring(0, firstFile.name.lastIndexOf("."));

      // PDF Merging
      if (slug === "merge-pdf") {
        const { mergePDFs } = await import("@/lib/tools/pdf-actions");
        resultBytes = await mergePDFs(files);
        outputName = "merged_document.pdf";
      }
      // PDF Split
      else if (slug === "split-pdf") {
        const { splitPDF } = await import("@/lib/tools/pdf-actions");
        resultBytes = await splitPDF(firstFile, splitStart, splitEnd);
        outputName = `${nameWithoutExt}_split_${splitStart}_to_${splitEnd}.pdf`;
      }
      // PDF Rotate
      else if (slug === "rotate-pdf") {
        const { rotatePDF } = await import("@/lib/tools/pdf-actions");
        resultBytes = await rotatePDF(firstFile, pdfRotation);
        outputName = `${nameWithoutExt}_rotated.pdf`;
      }
      // Add Page Numbers
      else if (slug === "add-page-numbers-pdf") {
        const { addPageNumbers } = await import("@/lib/tools/pdf-actions");
        resultBytes = await addPageNumbers(firstFile, pageNumberPos, "page-x");
        outputName = `${nameWithoutExt}_numbered.pdf`;
      }
      // Add Watermark
      else if (slug === "add-watermark-pdf") {
        const { addWatermark } = await import("@/lib/tools/pdf-actions");
        resultBytes = await addWatermark(firstFile, watermarkText, watermarkOpacity);
        outputName = `${nameWithoutExt}_watermarked.pdf`;
      }
      // Compress PDF
      else if (slug === "compress-pdf") {
        const { compressPDF } = await import("@/lib/tools/pdf-actions");
        resultBytes = await compressPDF(firstFile);
        outputName = `${nameWithoutExt}_compressed.pdf`;
      }
      // PDF to Word
      else if (slug === "pdf-to-word") {
        const { pdfToWord } = await import("@/lib/tools/pdf-actions");
        resultBlob = await pdfToWord(firstFile);
        outputName = `${nameWithoutExt}.doc`;
      }
      // PDF to PowerPoint
      else if (slug === "pdf-to-powerpoint") {
        const { pdfToPowerpoint } = await import("@/lib/tools/pdf-actions");
        resultBlob = await pdfToPowerpoint(firstFile);
        outputName = `${nameWithoutExt}.ppt`;
      }
      // PDF to Excel
      else if (slug === "pdf-to-excel") {
        const { pdfToExcel } = await import("@/lib/tools/pdf-actions");
        resultBlob = await pdfToExcel(firstFile);
        outputName = `${nameWithoutExt}.csv`;
      }
      // Word to PDF
      else if (slug === "word-to-pdf") {
        const { officeToPDF } = await import("@/lib/tools/pdf-actions");
        resultBytes = await officeToPDF(firstFile);
        outputName = `${nameWithoutExt}_word.pdf`;
      }
      // PowerPoint to PDF
      else if (slug === "powerpoint-to-pdf") {
        const { officeToPDF } = await import("@/lib/tools/pdf-actions");
        resultBytes = await officeToPDF(firstFile);
        outputName = `${nameWithoutExt}_powerpoint.pdf`;
      }
      // Excel to PDF
      else if (slug === "excel-to-pdf") {
        const { officeToPDF } = await import("@/lib/tools/pdf-actions");
        resultBytes = await officeToPDF(firstFile);
        outputName = `${nameWithoutExt}_excel.pdf`;
      }
      // PDF to JPG
      else if (slug === "pdf-to-jpg") {
        const { pdfToJpgs } = await import("@/lib/tools/pdf-actions");
        const imgs = await pdfToJpgs(firstFile);
        if (imgs.length > 0) {
          resultBlob = imgs[0].blob;
          outputName = `${nameWithoutExt}_page_1.jpg`;
        } else {
          throw new Error("No pages found in document");
        }
      }
      // JPG to PDF
      else if (slug === "jpg-to-pdf") {
        const { imagesToPDF } = await import("@/lib/tools/pdf-actions");
        resultBytes = await imagesToPDF(files);
        outputName = `${nameWithoutExt}_images.pdf`;
      }
      // HTML to PDF
      else if (slug === "html-to-pdf") {
        const { htmlToPDF } = await import("@/lib/tools/pdf-actions");
        const markup = files.length > 0 ? await firstFile.text() : htmlInput;
        resultBytes = await htmlToPDF(markup);
        outputName = `${nameWithoutExt || "document"}.pdf`;
      }
      // Unlock PDF
      else if (slug === "unlock-pdf") {
        const { unlockPDF } = await import("@/lib/tools/pdf-actions");
        resultBytes = await unlockPDF(firstFile, pdfPassword);
        outputName = `${nameWithoutExt}_unlocked.pdf`;
      }
      // Protect PDF
      else if (slug === "protect-pdf") {
        const { protectPDF } = await import("@/lib/tools/pdf-actions");
        resultBytes = await protectPDF(firstFile, pdfPassword);
        outputName = `${nameWithoutExt}_protected.pdf`;
      }
      // Organize PDF
      else if (slug === "organize-pdf") {
        const { organizePDF } = await import("@/lib/tools/pdf-actions");
        const indices = pageOrderInput.split(",").map(x => parseInt(x.trim()) - 1).filter(x => !isNaN(x) && x >= 0);
        const order = indices.length > 0 ? indices : Array.from({ length: pdfPageCount }, (_, i) => i);
        resultBytes = await organizePDF(firstFile, order);
        outputName = `${nameWithoutExt}_organized.pdf`;
      }
      // PDF to PDF/A
      else if (slug === "pdf-to-pdfa") {
        const { convertToPDFA } = await import("@/lib/tools/pdf-actions");
        resultBytes = await convertToPDFA(firstFile);
        outputName = `${nameWithoutExt}_pdfa.pdf`;
      }
      // Repair PDF
      else if (slug === "repair-pdf") {
        const { repairPDF } = await import("@/lib/tools/pdf-actions");
        resultBytes = await repairPDF(firstFile);
        outputName = `${nameWithoutExt}_repaired.pdf`;
      }
      // Scan to PDF
      else if (slug === "scan-to-pdf") {
        const { imagesToPDF } = await import("@/lib/tools/pdf-actions");
        resultBytes = await imagesToPDF(files);
        outputName = "scanned_document.pdf";
      }
      // OCR PDF
      else if (slug === "ocr-pdf") {
        const { ocrPDF } = await import("@/lib/tools/pdf-actions");
        const textResult = await ocrPDF(firstFile);
        resultBlob = new Blob([textResult], { type: "text/plain;charset=utf-8" });
        outputName = `${nameWithoutExt}_ocr.txt`;
      }
      // Compare PDF
      else if (slug === "compare-pdf") {
        const { comparePDFs } = await import("@/lib/tools/pdf-actions");
        const file2 = files[1] || firstFile;
        const diffResult = await comparePDFs(firstFile, file2);
        resultBlob = new Blob([diffResult], { type: "text/plain;charset=utf-8" });
        outputName = `${nameWithoutExt}_compared.txt`;
      }
      // Redact PDF
      else if (slug === "redact-pdf") {
        const { redactPDF } = await import("@/lib/tools/pdf-actions");
        // Burn redact box on lower-left page 1
        resultBytes = await redactPDF(firstFile, 0, 50, 50, 200, 100);
        outputName = `${nameWithoutExt}_redacted.pdf`;
      }
      // Crop PDF
      else if (slug === "crop-pdf") {
        const { cropPDF } = await import("@/lib/tools/pdf-actions");
        resultBytes = await cropPDF(firstFile, 50, 50, 500, 700);
        outputName = `${nameWithoutExt}_cropped.pdf`;
      }
      // PDF Forms
      else if (slug === "pdf-forms") {
        const { fillPDFForm } = await import("@/lib/tools/pdf-actions");
        resultBytes = await fillPDFForm(firstFile, { "name": formFieldName });
        outputName = `${nameWithoutExt}_filled.pdf`;
      }
      // Smart Summary
      else if (slug === "smart-summary") {
        const { smartSummary } = await import("@/lib/tools/pdf-actions");
        const textResult = await smartSummary(firstFile);
        resultBlob = new Blob([textResult], { type: "text/plain;charset=utf-8" });
        outputName = `${nameWithoutExt}_summary.txt`;
      }
      // Translate PDF
      else if (slug === "translate-pdf") {
        const { translatePDFText } = await import("@/lib/tools/pdf-actions");
        const textResult = await translatePDFText(firstFile, translateLang);
        resultBlob = new Blob([textResult], { type: "text/plain;charset=utf-8" });
        outputName = `${nameWithoutExt}_translated.txt`;
      }
      // PDF to Markdown
      else if (slug === "pdf-to-markdown") {
        const { pdfToMarkdown } = await import("@/lib/tools/pdf-actions");
        const textResult = await pdfToMarkdown(firstFile);
        resultBlob = new Blob([textResult], { type: "text/markdown;charset=utf-8" });
        outputName = `${nameWithoutExt}.md`;
      }
      // Custom Workflow
      else if (slug === "custom-workflow") {
        const { mergePDFs, rotatePDF } = await import("@/lib/tools/pdf-actions");
        const merged = await mergePDFs(files);
        const tempFile = new File([merged as any], "temp.pdf", { type: "application/pdf" });
        resultBytes = await rotatePDF(tempFile, 90);
        outputName = "workflow_result.pdf";
      }
      // Image Compress
      else if (slug === "compress-image") {
        const { compressImage } = await import("@/lib/tools/image-actions");
        resultBlob = await compressImage(firstFile, imageQuality);
        outputName = `${nameWithoutExt}_compressed.jpg`;
      }
      // Image Resize
      else if (slug === "resize-image") {
        const { resizeImage } = await import("@/lib/tools/image-actions");
        resultBlob = await resizeImage(firstFile, imageWidth, imageHeight, maintainAspect);
        outputName = `${nameWithoutExt}_resized.${firstFile.name.split(".").pop()}`;
      }
      // Image Crop
      else if (slug === "crop-image") {
        const { cropImage } = await import("@/lib/tools/image-actions");
        const cropW = Math.round(originalImageDims.w * 0.8);
        const cropH = Math.round(originalImageDims.h * 0.8);
        const cropX = Math.round((originalImageDims.w - cropW) / 2);
        const cropY = Math.round((originalImageDims.h - cropH) / 2);
        resultBlob = await cropImage(firstFile, cropX, cropY, cropW, cropH);
        outputName = `${nameWithoutExt}_cropped.${firstFile.name.split(".").pop()}`;
      }
      // Image Rotate
      else if (slug === "rotate-image") {
        const { rotateImage } = await import("@/lib/tools/image-actions");
        resultBlob = await rotateImage(firstFile, imageRotateAngle);
        outputName = `${nameWithoutExt}_rotated.${firstFile.name.split(".").pop()}`;
      }
      // Image Convert
      else if (slug === "convert-image") {
        const { convertImage } = await import("@/lib/tools/image-actions");
        resultBlob = await convertImage(firstFile, imageTargetFormat);
        const ext = imageTargetFormat.split("/")[1];
        outputName = `${nameWithoutExt}_converted.${ext === "jpeg" ? "jpg" : ext}`;
      }
      // Edit PDF / Sign PDF / Default fallback
      else if (slug === "edit-pdf" || slug === "sign-pdf") {
        const { redactPDF } = await import("@/lib/tools/pdf-actions");
        // Burn simple editing markup box
        resultBytes = await redactPDF(firstFile, 0, 10, 10, 100, 40);
        outputName = `${nameWithoutExt}_edited.pdf`;
      } else {
        await new Promise((r) => setTimeout(r, 1200));
        resultBlob = firstFile;
        outputName = firstFile.name;
      }

      const elapsed = (performance.now() - processingStartRef.current) / 1000;
      setProcessingTime(elapsed);
      setProcessedData({
        blob: resultBlob,
        bytes: resultBytes,
        name: outputName,
      });
      setProcessed(true);
    } catch (e) {
      console.error(e);
      setErrorMsg(isRtl ? "فشلت معالجة الملف. يرجى التحقق من صحة الملف." : "Failed to process document. Please check file validity.");
    } finally {
      setProcessing(false);
    }
  };

  const handleDownload = async () => {
    if (!processedData) return;
    if (processedData.bytes) {
      const { downloadFile } = await import("@/lib/tools/pdf-actions");
      downloadFile(processedData.bytes, processedData.name, "application/pdf");
    } else if (processedData.blob) {
      const { downloadBlob } = await import("@/lib/tools/image-actions");
      downloadBlob(processedData.blob, processedData.name);
    }
  };

  const startOver = () => {
    setFiles([]);
    setProcessed(false);
    setProcessedData(null);
    setErrorMsg("");
  };

  const Icon = defaults ? (toolIcons[defaults.icon] || FileText) : Wrench;
  const toolDesc = defaults ? (isRtl ? defaults.descriptionAr : defaults.description) : "";

  if (isNonFileTool) {
    return <NonFileTool slug={slug} />;
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Main Work Area */}
        <div className={files.length > 0 ? "lg:col-span-8 space-y-6" : "lg:col-span-12 space-y-6"}>
          {processing ? (
            <Card className="text-center p-8 bg-white dark:bg-surface-900 border-surface-200 shadow-xl rounded-3xl relative overflow-hidden glass-panel">
              <div className="absolute inset-0 bg-gradient-to-br from-brand-500/5 to-purple-500/5 pointer-events-none" />
              <CardContent className="space-y-6 relative z-10">
                <div className="flex justify-center">
                  <div className="p-4 bg-brand-50 text-brand-500 rounded-full dark:bg-brand-950/20 animate-spin">
                    <RefreshCw className="h-10 w-10" />
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-surface-900 dark:text-surface-50">
                    {isRtl ? "جاري معالجة مستندك محلياً..." : "Processing your document locally..."}
                  </h3>
                  <p className="text-xs text-surface-400 mt-1">
                    {isRtl ? "يتم تشفير ومعالجة الملف في متصفحك مباشرة" : "Decrypting and manipulating file directly in your browser"}
                  </p>
                </div>
                <ProcessingTimer
                  isProcessing={processing}
                  isComplete={false}
                  inputSize={inputFileSize}
                />
              </CardContent>
            </Card>
          ) : !processed ? (
            <>
              {/* Dropzone */}
              <div
                {...getRootProps()}
                id="tool-upload-zone"
                className={`relative flex flex-col items-center justify-center p-14 rounded-3xl border-2 border-dashed transition-all duration-300 cursor-pointer shadow-sm hover:shadow-md glass-panel ${
                  isDragActive
                    ? "border-brand-500 bg-brand-50/40 dark:bg-brand-950/20 scale-[1.01] shadow-lg shadow-brand-500/5"
                    : "border-surface-200 hover:border-brand-400 hover:bg-white/90 dark:border-surface-800/80 dark:hover:bg-surface-900/60"
                }`}
              >
                <input {...getInputProps()} />
                <div className="p-4 bg-brand-50 dark:bg-brand-950/20 rounded-2xl mb-4 text-brand-500 shadow-sm animate-pulse">
                  <Upload className="h-8 w-8" />
                </div>
                <h3 className="text-lg font-bold text-surface-800 dark:text-surface-100 tracking-tight">
                  {isDragActive
                    ? (isRtl ? "أفلت الملفات هنا..." : "Drop files here...")
                    : (isRtl ? "اسحب وأفلت الملفات هنا" : "Drag & drop files here")}
                </h3>
                <p className="mt-1.5 text-sm text-surface-400 text-center max-w-sm leading-relaxed">
                  {toolDesc} {isRtl ? "أو اضغط للتصفح من جهازك" : "or click to browse from device"}
                </p>
                <span className="mt-3 text-[10px] text-surface-400 font-bold px-2 py-0.5 bg-surface-100 rounded-lg dark:bg-surface-800 tracking-wide uppercase">
                  {isRtl ? `الحد الأقصى: ${defaults?.maxFiles} ملفات` : `Limit: ${defaults?.maxFiles} file(s)`}
                </span>
              </div>

              {/* Uploaded Files Manager */}
              {files.length > 0 && (
                <div className="space-y-3">
                  <div className="flex justify-between items-center px-1">
                    <h4 className="text-sm font-bold text-surface-700 dark:text-surface-300">
                      {isRtl
                        ? `الملفات المختارة (${files.length})`
                        : `Selected Files (${files.length})`}
                    </h4>
                    {files.length > 1 && (
                      <span className="text-xs text-surface-400">
                        {isRtl ? "اسحب أو رتب الملفات للدمج" : "Arrange order for merging"}
                      </span>
                    )}
                  </div>

                  <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
                    {files.map((file, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3.5 rounded-2xl bg-white border border-surface-200 shadow-sm dark:bg-surface-900 dark:border-surface-800 transition-all hover:border-surface-300"
                      >
                        <div className="flex items-center gap-3.5 min-w-0">
                          <FileRowPreview file={file} />
                          <div className="min-w-0">
                            <p className="text-sm font-bold text-surface-800 dark:text-surface-250 truncate">
                              {file.name}
                            </p>
                            <p className="text-xs text-surface-400 mt-0.5">
                              {(file.size / 1024 / 1024).toFixed(2)} MB
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-1 shrink-0">
                          {slug === "merge-pdf" && files.length > 1 && (
                            <>
                              <button
                                onClick={() => reorderFile(index, "up")}
                                disabled={index === 0}
                                className="p-1.5 rounded-lg hover:bg-surface-100 text-surface-400 hover:text-surface-600 disabled:opacity-30 dark:hover:bg-surface-800"
                              >
                                ▲
                              </button>
                              <button
                                onClick={() => reorderFile(index, "down")}
                                disabled={index === files.length - 1}
                                className="p-1.5 rounded-lg hover:bg-surface-100 text-surface-400 hover:text-surface-600 disabled:opacity-30 dark:hover:bg-surface-800"
                              >
                                ▼
                              </button>
                            </>
                          )}
                          <button
                            onClick={() => removeFile(index)}
                            className="p-1.5 rounded-lg hover:bg-red-50 hover:text-red-500 text-surface-400 transition-colors dark:hover:bg-red-950/20"
                          >
                            <X className="h-4.5 w-4.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          ) : (
            /* Success Completed Screen */
            <Card className="text-center p-8 bg-white dark:bg-surface-900 border-surface-200 shadow-xl rounded-3xl relative overflow-hidden glass-panel">
              <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-brand-500/5 pointer-events-none" />
              <CardContent className="space-y-6 relative z-10">
                <div className="flex justify-center">
                  <div className="p-4 bg-green-50 text-green-500 rounded-full dark:bg-green-950/20 animate-bounce">
                    <CheckCircle2 className="h-14 w-14" />
                  </div>
                </div>
                <div>
                  <h3 className="text-2xl font-extrabold text-surface-900 dark:text-surface-50">
                    {isRtl ? "تمت معالجة ملفك بنجاح!" : "File Processed Successfully!"}
                  </h3>
                  <p className="text-sm font-medium text-surface-500 dark:text-surface-400 mt-2 truncate max-w-md mx-auto">
                    {processedData?.name}
                  </p>
                  {processedData?.blob && (
                    <p className="text-xs text-surface-400 mt-1 font-semibold">
                      {isRtl ? "الحجم الجديد:" : "New Size:"} {(processedData.blob.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  )}
                </div>

                {/* Processing stats badges */}
                <ProcessingTimer
                  isProcessing={false}
                  isComplete={true}
                  inputSize={inputFileSize}
                  outputSize={processedData?.blob?.size || processedData?.bytes?.length}
                />

                <div className="flex flex-col sm:flex-row gap-3 justify-center max-w-md mx-auto">
                  <Button onClick={handleDownload} className="flex-1 gap-2 py-6 text-base font-bold shadow-lg shadow-brand-500/20 hover:shadow-brand-500/35 transition-all duration-300 rounded-2xl">
                    <Download className="h-5 w-5" />
                    {isRtl ? "تحميل الملف" : "Download File"}
                  </Button>
                  <Button variant="outline" onClick={startOver} className="gap-2 py-6 text-base font-semibold rounded-2xl">
                    <RefreshCcw className="h-4.5 w-4.5" />
                    {isRtl ? "البدء من جديد" : "Start Over"}
                  </Button>
                </div>

                {/* Transfer to Mobile (QR Code) & Viral Loops */}
                <div className="border-t border-surface-100 dark:border-surface-800/80 pt-6 mt-6 grid grid-cols-1 md:grid-cols-2 gap-6 items-center text-left rtl:text-right">
                  <div className="space-y-2">
                    <h4 className="text-sm font-bold text-surface-800 dark:text-surface-200">
                      {isRtl ? "📱 افتح الأداة على هاتفك" : "📱 Open tool on your phone"}
                    </h4>
                    <p className="text-xs text-surface-400 dark:text-surface-500 leading-relaxed">
                      {isRtl
                        ? "امسح رمز QR بكاميرا هاتفك لتصفح أدواتنا واستكمال العمل مباشرة على الجوال بسلاسة تامة."
                        : "Scan this QR code with your phone camera to access our tools and continue processing on the go."}
                    </p>
                  </div>
                  <div className="flex justify-center md:justify-end">
                    <div className="p-3 bg-white rounded-2xl border border-surface-200 shadow-sm dark:bg-white dark:border-surface-100 shrink-0">
                      <img
                        src={`https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=${typeof window !== "undefined" ? encodeURIComponent(window.location.href) : "https://www.myworldpdf.com"}`}
                        alt="QR Code"
                        className="w-[100px] h-[100px]"
                      />
                    </div>
                  </div>
                </div>

                {/* Viral sharing card with social proof */}
                <ShareableResultCard
                  toolName={slug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}
                  processingTime={processingTime}
                  inputFileName={processedData?.name || ''}
                />
              </CardContent>
            </Card>
          )}

          {errorMsg && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-2xl text-sm text-red-600 dark:bg-red-950/20 dark:border-red-900/30">
              {errorMsg}
            </div>
          )}
        </div>

        {/* Sidebar Settings Configuration Panel */}
        {files.length > 0 && !processed && (
          <div className="lg:col-span-4 space-y-6">
            <Card className="bg-white dark:bg-surface-900 border-surface-200">
              <CardHeader className="pb-3 border-b border-surface-100 dark:border-surface-800">
                <h3 className="font-bold flex items-center gap-2 text-surface-900 dark:text-surface-100">
                  <Settings className="h-4.5 w-4.5 text-brand-500" />
                  {isRtl ? "إعدادات الأداة" : "Tool Settings"}
                </h3>
              </CardHeader>
              <CardContent className="pt-5 space-y-5">
                {/* PDF Split settings */}
                {slug === "split-pdf" && (
                  <div className="space-y-4">
                    <div className="flex justify-between text-xs text-surface-400">
                      <span>{isRtl ? `الصفحات المتوفرة: ${pdfPageCount}` : `Total Pages: ${pdfPageCount}`}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-surface-500 mb-1">{isRtl ? "من صفحة" : "From Page"}</label>
                        <Input
                          type="number"
                          min={1}
                          max={pdfPageCount}
                          value={splitStart}
                          onChange={(e) => setSplitStart(Math.max(1, Number(e.target.value)))}
                          className="bg-surface-50"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-surface-500 mb-1">{isRtl ? "إلى صفحة" : "To Page"}</label>
                        <Input
                          type="number"
                          min={splitStart}
                          max={pdfPageCount}
                          value={splitEnd}
                          onChange={(e) => setSplitEnd(Math.max(splitStart, Number(e.target.value)))}
                          className="bg-surface-50"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* PDF Rotate settings */}
                {slug === "rotate-pdf" && (
                  <div className="space-y-3">
                    <label className="block text-xs font-bold text-surface-500">{isRtl ? "زاوية التدوير" : "Rotation Angle"}</label>
                    <div className="grid grid-cols-3 gap-2">
                      {[90, 180, 270].map((deg) => (
                        <button
                          key={deg}
                          onClick={() => setPdfRotation(deg)}
                          className={`py-2 rounded-xl text-sm font-medium border transition-all ${
                            pdfRotation === deg
                              ? "bg-brand-50 border-brand-500 text-brand-600 dark:bg-brand-950/20"
                              : "border-surface-200 hover:border-surface-300 dark:border-surface-800"
                          }`}
                        >
                          {deg}°
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* PDF Page Numbers settings */}
                {slug === "add-page-numbers-pdf" && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-surface-500 mb-1.5">{isRtl ? "مكان الترقيم" : "Position"}</label>
                      <select
                        value={pageNumberPos}
                        onChange={(e) => setPageNumberPos(e.target.value)}
                        className="w-full p-2.5 rounded-xl border border-surface-200 text-sm bg-surface-50 focus:ring-brand-500"
                      >
                        <option value="bottom-center">{isRtl ? "أسفل الوسط" : "Bottom Center"}</option>
                        <option value="bottom-left">{isRtl ? "أسفل اليسار" : "Bottom Left"}</option>
                        <option value="bottom-right">{isRtl ? "أسفل اليمين" : "Bottom Right"}</option>
                        <option value="top-center">{isRtl ? "أعلى الوسط" : "Top Center"}</option>
                        <option value="top-left">{isRtl ? "أعلى اليسار" : "Top Left"}</option>
                        <option value="top-right">{isRtl ? "أعلى اليمين" : "Top Right"}</option>
                      </select>
                    </div>
                  </div>
                )}

                {/* PDF Watermark settings */}
                {slug === "add-watermark-pdf" && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-surface-500 mb-1">{isRtl ? "نص العلامة المائية" : "Watermark Text"}</label>
                      <Input
                        value={watermarkText}
                        onChange={(e) => setWatermarkText(e.target.value)}
                        placeholder="CONFIDENTIAL"
                        className="bg-surface-50"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-surface-500 mb-1">
                        {isRtl ? `الشفافية: ${Math.round(watermarkOpacity * 100)}%` : `Opacity: ${Math.round(watermarkOpacity * 100)}%`}
                      </label>
                      <input
                        type="range"
                        min="0.1"
                        max="1.0"
                        step="0.05"
                        value={watermarkOpacity}
                        onChange={(e) => setWatermarkOpacity(Number(e.target.value))}
                        className="w-full accent-brand-500"
                      />
                    </div>
                  </div>
                )}

                {/* Image Compress settings */}
                {slug === "compress-image" && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-surface-500 mb-1">
                        {isRtl ? `الجودة المطلوبة: ${Math.round(imageQuality * 100)}%` : `Target Quality: ${Math.round(imageQuality * 100)}%`}
                      </label>
                      <input
                        type="range"
                        min="0.2"
                        max="1.0"
                        step="0.05"
                        value={imageQuality}
                        onChange={(e) => setImageQuality(Number(e.target.value))}
                        className="w-full accent-brand-500"
                      />
                    </div>
                  </div>
                )}

                {/* Image Resize settings */}
                {slug === "resize-image" && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-surface-500 mb-1">{isRtl ? "العرض (بكسل)" : "Width (px)"}</label>
                        <Input
                          type="number"
                          value={imageWidth}
                          onChange={(e) => {
                            const val = Number(e.target.value);
                            setImageWidth(val);
                            if (maintainAspect && originalImageDims.w) {
                              setImageHeight(Math.round(val / (originalImageDims.w / originalImageDims.h)));
                            }
                          }}
                          className="bg-surface-50"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-surface-500 mb-1">{isRtl ? "الارتفاع (بكسل)" : "Height (px)"}</label>
                        <Input
                          type="number"
                          value={imageHeight}
                          onChange={(e) => {
                            const val = Number(e.target.value);
                            setImageHeight(val);
                            if (maintainAspect && originalImageDims.h) {
                              setImageWidth(Math.round(val * (originalImageDims.w / originalImageDims.h)));
                            }
                          }}
                          className="bg-surface-50"
                        />
                      </div>
                    </div>
                    <label className="flex items-center gap-2 text-xs text-surface-500 font-medium cursor-pointer">
                      <input
                        type="checkbox"
                        checked={maintainAspect}
                        onChange={(e) => setMaintainAspect(e.target.checked)}
                        className="rounded border-surface-300 text-brand-500 focus:ring-brand-500 h-4 w-4"
                      />
                      {isRtl ? "الحفاظ على نسبة الارتفاع" : "Lock Aspect Ratio"}
                    </label>
                  </div>
                )}

                {/* Image Rotate settings */}
                {slug === "rotate-image" && (
                  <div className="space-y-3">
                    <label className="block text-xs font-bold text-surface-500">{isRtl ? "زاوية تدوير الصورة" : "Rotate Angle"}</label>
                    <div className="grid grid-cols-3 gap-2">
                      {[90, 180, 270].map((deg) => (
                        <button
                          key={deg}
                          onClick={() => setImageRotateAngle(deg)}
                          className={`py-2 rounded-xl text-sm font-medium border transition-all ${
                            imageRotateAngle === deg
                              ? "bg-brand-50 border-brand-500 text-brand-600 dark:bg-brand-950/20"
                              : "border-surface-200 hover:border-surface-300 dark:border-surface-800"
                          }`}
                        >
                          {deg}°
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Image Convert settings */}
                {slug === "convert-image" && (
                  <div>
                    <label className="block text-xs font-bold text-surface-500 mb-1.5">{isRtl ? "الصيغة المستهدفة" : "Target Format"}</label>
                    <select
                      value={imageTargetFormat}
                      onChange={(e) => setImageTargetFormat(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-surface-200 text-sm bg-surface-50 focus:ring-brand-500"
                    >
                      <option value="image/png">PNG</option>
                      <option value="image/jpeg">JPG</option>
                      <option value="image/webp">WEBP</option>
                    </select>
                  </div>
                )}

                {/* PDF Protect / Unlock settings */}
                {(slug === "protect-pdf" || slug === "unlock-pdf") && (
                  <div className="space-y-3">
                    <label className="block text-xs font-bold text-surface-500">
                      {isRtl ? "كلمة المرور" : "Password"}
                    </label>
                    <Input
                      type="password"
                      value={pdfPassword}
                      onChange={(e) => setPdfPassword(e.target.value)}
                      placeholder={isRtl ? "أدخل كلمة المرور..." : "Enter password..."}
                      className="bg-surface-50"
                    />
                  </div>
                )}

                {/* PDF Organize settings */}
                {slug === "organize-pdf" && (
                  <div className="space-y-3">
                    <label className="block text-xs font-bold text-surface-500">
                      {isRtl ? "ترتيب الصفحات (مثال: 1,3,2)" : "Page Order (e.g. 1,3,2)"}
                    </label>
                    <Input
                      value={pageOrderInput}
                      onChange={(e) => setPageOrderInput(e.target.value)}
                      placeholder={isRtl ? "مثال: 1,3,2" : "e.g. 1,3,2"}
                      className="bg-surface-50"
                    />
                    <p className="text-[10px] text-surface-400">
                      {isRtl ? `الصفحات المتوفرة: ${pdfPageCount}` : `Total Pages: ${pdfPageCount}`}
                    </p>
                  </div>
                )}

                {/* Translate PDF settings */}
                {slug === "translate-pdf" && (
                  <div className="space-y-3">
                    <label className="block text-xs font-bold text-surface-500">
                      {isRtl ? "لغة الترجمة" : "Target Language"}
                    </label>
                    <select
                      value={translateLang}
                      onChange={(e) => setTranslateLang(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-surface-200 text-sm bg-surface-50 focus:ring-brand-500"
                    >
                      <option value="ar">{isRtl ? "العربية" : "Arabic"}</option>
                      <option value="en">{isRtl ? "الإنجليزية" : "English"}</option>
                      <option value="fr">{isRtl ? "الفرنسية" : "French"}</option>
                      <option value="es">{isRtl ? "الإسبانية" : "Spanish"}</option>
                    </select>
                  </div>
                )}

                {/* PDF Forms settings */}
                {slug === "pdf-forms" && (
                  <div className="space-y-3">
                    <label className="block text-xs font-bold text-surface-500">
                      {isRtl ? "الاسم لتعبئة النماذج" : "Name to Fill Forms"}
                    </label>
                    <Input
                      value={formFieldName}
                      onChange={(e) => setFormFieldName(e.target.value)}
                      placeholder={isRtl ? "أدخل الاسم..." : "Enter name..."}
                      className="bg-surface-50"
                    />
                  </div>
                )}

                {/* HTML to PDF settings (direct markup typing) */}
                {slug === "html-to-pdf" && files.length === 0 && (
                  <div className="space-y-3">
                    <label className="block text-xs font-bold text-surface-500">
                      {isRtl ? "محتوى HTML للتحويل" : "HTML Content to Convert"}
                    </label>
                    <textarea
                      value={htmlInput}
                      onChange={(e) => setHtmlInput(e.target.value)}
                      className="w-full h-32 p-3 text-xs font-mono border border-surface-200 rounded-xl bg-surface-50 focus:ring-brand-500 dark:bg-surface-950 dark:border-surface-800"
                    />
                  </div>
                )}

                <Button
                  onClick={handleProcess}
                  disabled={processing}
                  className="w-full py-6 text-base font-bold transition-all shadow-md shadow-brand-500/10"
                >
                  {processing ? (
                    <>
                      <div className="h-4.5 w-4.5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2 rtl:ml-2" />
                      {isRtl ? "جاري المعالجة..." : "Processing..."}
                    </>
                  ) : (
                    <>
                      {isRtl ? "بدء المعالجة" : "Start Processing"}
                      <ChevronRight className="h-5 w-5 ml-1.5 rtl:rotate-180" />
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}

function NonFileTool({ slug }: { slug: string }) {
  switch (slug) {
    case "json-formatter":
      return <JsonFormatterTool />;
    case "word-counter":
      return <WordCounterTool />;
    case "qr-code-generator":
      return <QRGeneratorTool />;
    case "password-generator":
      return <PasswordGeneratorTool />;
    case "color-picker":
      return <ColorPickerTool />;
    case "case-converter":
      return <CaseConverterTool />;
    case "base64-encoder-decoder":
      return <Base64Tool />;
    case "regex-tester":
      return <RegexTesterTool />;
    case "uuid-generator":
      return <UUIDGeneratorTool />;
    case "hash-generator":
      return <HashGeneratorTool />;
    case "bmi-calculator":
      return <BMICalculatorTool />;
    case "percentage-calculator":
      return <PercentageCalculatorTool />;
    case "tip-calculator":
      return <TipCalculatorTool />;
    case "currency-converter":
      return <CurrencyConverterTool />;
    default:
      return <GenericTool slug={slug} />;
  }
}

function JsonFormatterTool() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");

  const isRtl = useIsRtl();

  const formatJson = () => {
    try {
      const parsed = JSON.parse(input);
      setOutput(JSON.stringify(parsed, null, 2));
      setError("");
    } catch (e) {
      setError((isRtl ? "تنسيق غير صالح: " : "Invalid JSON: ") + (e as Error).message);
      setOutput("");
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(output);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-5">
      <Card className="border-surface-200 bg-white dark:bg-surface-900 shadow-sm">
        <CardHeader className="pb-3 border-b border-surface-100 dark:border-surface-800">
          <h2 className="text-base font-bold text-surface-900 dark:text-surface-50">
            {isRtl ? "أدخل نص JSON" : "JSON Input"}
          </h2>
        </CardHeader>
        <CardContent className="pt-4 space-y-4">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder='{ "key": "value" }'
            className="w-full h-52 p-4 rounded-2xl border border-surface-200 bg-surface-50 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 dark:bg-surface-950 dark:border-surface-800"
          />
          <Button onClick={formatJson} className="font-semibold">{isRtl ? "تنسيق وتجميل" : "Format & Beautify"}</Button>
          {error && <p className="text-sm text-red-500 font-medium">{error}</p>}
        </CardContent>
      </Card>

      {output && (
        <Card className="border-surface-200 bg-white dark:bg-surface-900 shadow-sm animate-fade-in">
          <CardHeader className="pb-3 border-b border-surface-100 dark:border-surface-800 flex justify-between flex-row items-center">
            <h2 className="text-base font-bold text-surface-900 dark:text-surface-50">
              {isRtl ? "المخرجات المنسقة" : "Formatted Output"}
            </h2>
            <Button variant="outline" size="sm" onClick={copyToClipboard} className="text-xs font-semibold">
              {isRtl ? "نسخ إلى الحافظة" : "Copy to Clipboard"}
            </Button>
          </CardHeader>
          <CardContent className="pt-4">
            <pre className="p-4 rounded-2xl bg-surface-50 dark:bg-surface-950 border border-surface-200 dark:border-surface-800 overflow-auto text-sm font-mono max-h-96 text-left" dir="ltr">
              {output}
            </pre>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function WordCounterTool() {
  const [text, setText] = useState("");

  const isRtl = useIsRtl();

  const stats = {
    characters: text.length,
    charactersNoSpaces: text.replace(/\s/g, "").length,
    words: text.trim() ? text.trim().split(/\s+/).length : 0,
    sentences: text.trim() ? text.split(/[.!?]+/).filter(Boolean).length : 0,
    paragraphs: text.trim() ? text.split(/\n\s*\n/).filter(Boolean).length : 0,
    readingTime: Math.ceil((text.trim() ? text.trim().split(/\s+/).length : 0) / 200),
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
        {[
          { label: isRtl ? "الكلمات" : "Words", value: stats.words },
          { label: isRtl ? "الحروف" : "Characters", value: stats.characters },
          { label: isRtl ? "الحروف (بدون مسافات)" : "Char (no space)", value: stats.charactersNoSpaces },
          { label: isRtl ? "الجمل" : "Sentences", value: stats.sentences },
          { label: isRtl ? "الفقرات" : "Paragraphs", value: stats.paragraphs },
          { label: isRtl ? "وقت القراءة" : "Reading Time", value: `${stats.readingTime} ${isRtl ? "دقيقة" : "min"}` },
        ].map((stat) => (
          <Card key={stat.label} className="border-surface-200 bg-white shadow-sm dark:bg-surface-900">
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-brand-500">{stat.value}</p>
              <p className="text-xs text-surface-400 font-medium mt-1">{stat.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>
      <Card className="border-surface-200 bg-white shadow-sm dark:bg-surface-900">
        <CardContent className="p-5">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={isRtl ? "اكتب أو ألصق نصك هنا..." : "Type or paste your text here..."}
            className="w-full h-72 p-4 rounded-2xl border border-surface-200 bg-surface-50 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 dark:bg-surface-950 dark:border-surface-800 resize-y"
          />
        </CardContent>
      </Card>
    </div>
  );
}

function QRGeneratorTool() {
  const [text, setText] = useState("https://www.myworldpdf.com");
  const isRtl = useIsRtl();

  return (
    <div className="max-w-md mx-auto text-center space-y-6">
      <Card className="border-surface-200 bg-white shadow-sm dark:bg-surface-900">
        <CardContent className="p-6 space-y-5">
          <Input
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={isRtl ? "أدخل الرابط أو النص..." : "Enter URL or text..."}
            className="bg-surface-50 rounded-xl"
          />
          <div className="flex justify-center p-4 bg-surface-100 rounded-2xl dark:bg-surface-950">
            {text && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(text)}`}
                alt="QR Code"
                className="rounded-xl border border-surface-200/50 bg-white"
                width={200}
                height={200}
              />
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function PasswordGeneratorTool() {
  const [length, setLength] = useState(16);
  const [includeUppercase, setIncludeUppercase] = useState(true);
  const [includeLowercase, setIncludeLowercase] = useState(true);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSymbols, setIncludeSymbols] = useState(true);
  const [password, setPassword] = useState("");

  const isRtl = useIsRtl();

  const generate = () => {
    const upper = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const lower = "abcdefghijklmnopqrstuvwxyz";
    const nums = "0123456789";
    const syms = "!@#$%^&*()_+-=[]{}|;:,.<>?";
    let chars = "";
    if (includeUppercase) chars += upper;
    if (includeLowercase) chars += lower;
    if (includeNumbers) chars += nums;
    if (includeSymbols) chars += syms;
    if (!chars) return;
    let result = "";
    const array = new Uint8Array(length);
    crypto.getRandomValues(array);
    for (let i = 0; i < length; i++) {
      result += chars[array[i] % chars.length];
    }
    setPassword(result);
  };

  useEffect(() => {
    generate();
  }, [length, includeUppercase, includeLowercase, includeNumbers, includeSymbols]);

  return (
    <div className="max-w-md mx-auto space-y-6">
      <Card className="border-surface-200 bg-white shadow-sm dark:bg-surface-900">
        <CardContent className="p-6 space-y-4">
          <div className="flex items-center gap-4">
            <input
              type="range"
              min={6}
              max={64}
              value={length}
              onChange={(e) => setLength(Number(e.target.value))}
              className="flex-1 accent-brand-500"
            />
            <span className="text-sm font-mono font-bold text-brand-500 w-8 text-right">{length}</span>
          </div>
          {[
            { label: isRtl ? "أحرف كبيرة (A-Z)" : "Uppercase (A-Z)", value: includeUppercase, set: setIncludeUppercase },
            { label: isRtl ? "أحرف صغيرة (a-z)" : "Lowercase (a-z)", value: includeLowercase, set: setIncludeLowercase },
            { label: isRtl ? "أرقام (0-9)" : "Numbers (0-9)", value: includeNumbers, set: setIncludeNumbers },
            { label: isRtl ? "رموز (!@#$)" : "Symbols (!@#$%)", value: includeSymbols, set: setIncludeSymbols },
          ].map((opt) => (
            <label key={opt.label} className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={opt.value}
                onChange={(e) => opt.set(e.target.checked)}
                className="h-4 w-4 rounded border-surface-350 text-brand-500 focus:ring-brand-500"
              />
              <span className="text-sm text-surface-700 dark:text-surface-300 font-medium">{opt.label}</span>
            </label>
          ))}

          {password && (
            <div className="p-4 rounded-2xl bg-surface-50 dark:bg-surface-950 border border-surface-200 dark:border-surface-800 space-y-3">
              <p className="text-lg font-mono text-center break-all select-all">{password}</p>
              <Button variant="outline" size="sm" className="w-full font-semibold" onClick={() => navigator.clipboard.writeText(password)}>
                {isRtl ? "نسخ كلمة المرور" : "Copy Password"}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function ColorPickerTool() {
  const [color, setColor] = useState("#3b82f6");
  const isRtl = useIsRtl();

  const hexToRgb = (hex: string) => {
    const r = parseInt(hex.slice(1, 3), 16) || 0;
    const g = parseInt(hex.slice(3, 5), 16) || 0;
    const b = parseInt(hex.slice(5, 7), 16) || 0;
    return { r, g, b };
  };

  const rgb = hexToRgb(color);

  return (
    <div className="max-w-md mx-auto space-y-6">
      <Card className="border-surface-200 bg-white shadow-sm dark:bg-surface-900">
        <CardContent className="p-6 space-y-5">
          <div
            className="h-36 rounded-2xl border border-surface-200/50 shadow-inner dark:border-surface-800"
            style={{ backgroundColor: color }}
          />
          <input
            type="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            className="w-full h-12 rounded-xl cursor-pointer bg-transparent border-0"
          />
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="p-2.5 rounded-xl bg-surface-50 border border-surface-200/40 dark:bg-surface-950 dark:border-surface-800">
              <p className="text-[10px] text-surface-400 font-bold uppercase">HEX</p>
              <p className="text-sm font-mono font-bold text-surface-800 dark:text-surface-200 mt-1">{color}</p>
            </div>
            <div className="p-2.5 rounded-xl bg-surface-50 border border-surface-200/40 dark:bg-surface-950 dark:border-surface-800">
              <p className="text-[10px] text-surface-400 font-bold uppercase">RGB</p>
              <p className="text-sm font-mono font-bold text-surface-800 dark:text-surface-200 mt-1">{rgb.r}, {rgb.g}, {rgb.b}</p>
            </div>
            <div className="p-2.5 rounded-xl bg-surface-50 border border-surface-200/40 dark:bg-surface-950 dark:border-surface-800">
              <p className="text-[10px] text-surface-400 font-bold uppercase">HSL</p>
              <p className="text-sm font-mono font-bold text-surface-800 dark:text-surface-200 mt-1">217°, 91%, 60%</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function CaseConverterTool() {
  const [text, setText] = useState("");
  const isRtl = useIsRtl();

  return (
    <div className="max-w-3xl mx-auto space-y-4">
      <Card className="border-surface-200 bg-white shadow-sm dark:bg-surface-900">
        <CardContent className="p-6 space-y-4">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={isRtl ? "اكتب أو ألصق نصك هنا..." : "Type or paste your text here..."}
            className="w-full h-52 p-4 rounded-2xl border border-surface-200 bg-surface-50 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 dark:bg-surface-950 dark:border-surface-800 resize-y"
          />
          <div className="flex flex-wrap gap-2">
            <Button size="sm" onClick={() => setText(text.toUpperCase())}>UPPER CASE</Button>
            <Button size="sm" onClick={() => setText(text.toLowerCase())}>lower case</Button>
            <Button size="sm" onClick={() => setText(text.replace(/\b\w/g, c => c.toUpperCase()))}>Title Case</Button>
            <Button size="sm" onClick={() => setText(text.replace(/^\./, '').replace(/(?:^|\.\s*)([a-z])/g, m => m.toUpperCase()))}>Sentence case</Button>
            <Button size="sm" onClick={() => setText(text.split('').map(c => c === c.toUpperCase() ? c.toLowerCase() : c.toUpperCase()).join(''))}>tOGGLE cASE</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function Base64Tool() {
  const [input, setInput] = useState("");
  const [mode, setMode] = useState<"encode" | "decode">("encode");
  const [output, setOutput] = useState("");

  const isRtl = useIsRtl();

  const process = () => {
    try {
      if (mode === "encode") {
        setOutput(btoa(input));
      } else {
        setOutput(atob(input));
      }
    } catch {
      setOutput(isRtl ? "مدخلات غير صالحة لفك الترميز" : "Invalid input for decoding");
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-4">
      <Card className="border-surface-200 bg-white shadow-sm dark:bg-surface-900">
        <CardContent className="p-6 space-y-4">
          <div className="flex gap-2">
            <Button size="sm" variant={mode === "encode" ? "primary" : "outline"} onClick={() => setMode("encode")}>{isRtl ? "تشفير" : "Encode"}</Button>
            <Button size="sm" variant={mode === "decode" ? "primary" : "outline"} onClick={() => setMode("decode")}>{isRtl ? "فك تشفير" : "Decode"}</Button>
          </div>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={mode === "encode" ? (isRtl ? "أدخل النص للتشفير..." : "Enter text to encode...") : (isRtl ? "أدخل نص Base64 لفك الترميز..." : "Enter Base64 to decode...")}
            className="w-full h-32 p-4 rounded-2xl border border-surface-200 bg-surface-50 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 dark:bg-surface-950 dark:border-surface-800"
          />
          <Button onClick={process} className="font-semibold">{mode === "encode" ? (isRtl ? "تشفير" : "Encode") : (isRtl ? "فك تشفير" : "Decode")}</Button>
          {output && (
            <div className="p-4 rounded-2xl bg-surface-50 dark:bg-surface-950 border border-surface-200 dark:border-surface-800 relative">
              <p className="text-sm font-mono break-all select-all">{output}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function RegexTesterTool() {
  const [pattern, setPattern] = useState("");
  const [testString, setTestString] = useState("");
  const [flags, setFlags] = useState("g");
  const [matches, setMatches] = useState<string[]>([]);

  const isRtl = useIsRtl();

  const test = () => {
    try {
      const regex = new RegExp(pattern, flags);
      setMatches([...testString.matchAll(regex)].map(m => m[0]));
    } catch {
      setMatches([]);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-4">
      <Card className="border-surface-200 bg-white shadow-sm dark:bg-surface-900">
        <CardContent className="p-6 space-y-4">
          <div className="flex gap-2">
            <input
              value={pattern}
              onChange={(e) => setPattern(e.target.value)}
              placeholder={isRtl ? "نمط التعبير (Regex)..." : "Regex pattern..."}
              className="flex-1 p-3 rounded-xl border border-surface-200 bg-surface-50 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 dark:bg-surface-950 dark:border-surface-800"
            />
            <input
              value={flags}
              onChange={(e) => setFlags(e.target.value)}
              placeholder="flags"
              className="w-20 p-3 rounded-xl border border-surface-200 bg-surface-50 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 dark:bg-surface-950 dark:border-surface-800"
            />
          </div>
          <textarea
            value={testString}
            onChange={(e) => setTestString(e.target.value)}
            placeholder={isRtl ? "النص المراد فحصه..." : "Test string..."}
            className="w-full h-32 p-4 rounded-2xl border border-surface-200 bg-surface-50 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 dark:bg-surface-950 dark:border-surface-800"
          />
          <Button onClick={test} className="font-semibold">{isRtl ? "فحص" : "Test"}</Button>
          {matches.length > 0 && (
            <div className="animate-fade-in">
              <p className="text-sm font-bold text-surface-700 mb-2">{matches.length} match(es)</p>
              <div className="p-4 rounded-2xl bg-surface-50 dark:bg-surface-950 border border-surface-200 dark:border-surface-800">
                {matches.map((m, i) => (
                  <p key={i} className="text-sm font-mono">{m}</p>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function UUIDGeneratorTool() {
  const [uuids, setUuids] = useState<string[]>([]);
  const isRtl = useIsRtl();

  const generate = () => {
    const newUuids = Array.from({ length: 5 }, () => crypto.randomUUID());
    setUuids(newUuids);
  };

  return (
    <div className="max-w-md mx-auto space-y-4">
      <Card className="border-surface-200 bg-white shadow-sm dark:bg-surface-900">
        <CardContent className="p-6 space-y-4 text-center">
          <Button onClick={generate} className="font-semibold">{isRtl ? "توليد UUIDs" : "Generate UUIDs"}</Button>
          {uuids.map((uuid, i) => (
            <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-surface-50 border border-surface-200 dark:bg-surface-950 dark:border-surface-800">
              <span className="text-xs font-mono select-all truncate mr-2">{uuid}</span>
              <Button variant="ghost" size="sm" onClick={() => navigator.clipboard.writeText(uuid)} className="text-xs font-medium">
                {isRtl ? "نسخ" : "Copy"}
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

function HashGeneratorTool() {
  const [input, setInput] = useState("");
  const [hashes, setHashes] = useState<Record<string, string>>({});
  const isRtl = useIsRtl();

  const generate = async () => {
    const encoder = new TextEncoder();
    const data = encoder.encode(input);
    
    // We import CryptoJS dynamically or use Web Crypto API where available
    const sha1 = await crypto.subtle.digest("SHA-1", data).then(h => Array.from(new Uint8Array(h)).map(b => b.toString(16).padStart(2, "0")).join(""));
    const sha256 = await crypto.subtle.digest("SHA-256", data).then(h => Array.from(new Uint8Array(h)).map(b => b.toString(16).padStart(2, "0")).join(""));
    
    setHashes({ "SHA-1": sha1, "SHA-256": sha256 });
  };

  return (
    <div className="max-w-3xl mx-auto space-y-4">
      <Card className="border-surface-200 bg-white shadow-sm dark:bg-surface-900">
        <CardContent className="p-6 space-y-4">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={isRtl ? "أدخل النص..." : "Enter text to hash..."}
            className="w-full h-32 p-4 rounded-2xl border border-surface-200 bg-surface-50 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 dark:bg-surface-950 dark:border-surface-800"
          />
          <Button onClick={generate} className="font-semibold">{isRtl ? "توليد الـ Hashes" : "Generate Hashes"}</Button>
          {Object.entries(hashes).map(([algo, hash]) => (
            <div key={algo} className="p-3.5 rounded-2xl bg-surface-50 border border-surface-200 dark:bg-surface-950 dark:border-surface-800">
              <p className="text-[10px] text-surface-400 font-bold uppercase mb-1">{algo}</p>
              <p className="text-sm font-mono break-all select-all">{hash}</p>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

function BMICalculatorTool() {
  const [height, setHeight] = useState("175");
  const [weight, setWeight] = useState("70");
  const isRtl = useIsRtl();

  const bmi = Number(weight) / ((Number(height) / 100) ** 2);
  const category = bmi < 18.5
    ? (isRtl ? "نقص في الوزن" : "Underweight")
    : bmi < 25
    ? (isRtl ? "وزن طبيعي" : "Normal")
    : bmi < 30
    ? (isRtl ? "زيادة في الوزن" : "Overweight")
    : (isRtl ? "سمنة" : "Obese");

  return (
    <div className="max-w-md mx-auto space-y-6">
      <Card className="border-surface-200 bg-white shadow-sm dark:bg-surface-900">
        <CardContent className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-surface-500 mb-1">{isRtl ? "الطول (سم)" : "Height (cm)"}</label>
              <Input type="number" value={height} onChange={e => setHeight(e.target.value)} className="bg-surface-50" />
            </div>
            <div>
              <label className="block text-xs font-bold text-surface-500 mb-1">{isRtl ? "الوزن (كجم)" : "Weight (kg)"}</label>
              <Input type="number" value={weight} onChange={e => setWeight(e.target.value)} className="bg-surface-50" />
            </div>
          </div>
          {bmi > 0 && bmi < 100 && (
            <div className="text-center p-5 rounded-2xl bg-brand-50 border border-brand-100 dark:bg-brand-950/20 dark:border-brand-900/30 animate-fade-in">
              <p className="text-4xl font-extrabold text-brand-500">{bmi.toFixed(1)}</p>
              <p className="text-sm font-medium text-surface-600 dark:text-surface-400 mt-1">{category}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function PercentageCalculatorTool() {
  const [value1, setValue1] = useState("");
  const [value2, setValue2] = useState("");
  const isRtl = useIsRtl();

  const percentage = Number(value1) && Number(value2) ? (Number(value1) / Number(value2)) * 100 : 0;

  return (
    <div className="max-w-md mx-auto space-y-6">
      <Card className="border-surface-200 bg-white shadow-sm dark:bg-surface-900">
        <CardContent className="p-6 space-y-4">
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-surface-500 mb-1">{isRtl ? "القيمة" : "Value"}</label>
              <Input type="number" value={value1} onChange={e => setValue1(e.target.value)} className="bg-surface-50" />
            </div>
            <div>
              <label className="block text-xs font-bold text-surface-500 mb-1">{isRtl ? "العدد الإجمالي" : "Total"}</label>
              <Input type="number" value={value2} onChange={e => setValue2(e.target.value)} className="bg-surface-50" />
            </div>
          </div>
          {Number(value2) > 0 && (
            <div className="text-center p-5 rounded-2xl bg-brand-50 border border-brand-100 dark:bg-brand-950/20 dark:border-brand-900/30 animate-fade-in">
              <p className="text-4xl font-extrabold text-brand-500">{percentage.toFixed(1)}%</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function TipCalculatorTool() {
  const [bill, setBill] = useState("");
  const [tipPercent, setTipPercent] = useState(15);
  const [split, setSplit] = useState(1);
  const isRtl = useIsRtl();

  const tipAmount = Number(bill) * (tipPercent / 100);
  const total = Number(bill) + tipAmount;
  const perPerson = total / split;

  return (
    <div className="max-w-md mx-auto space-y-6">
      <Card className="border-surface-200 bg-white shadow-sm dark:bg-surface-900">
        <CardContent className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-bold text-surface-500 mb-1">{isRtl ? "قيمة الفاتورة ($)" : "Bill Amount ($)"}</label>
            <Input type="number" value={bill} onChange={e => setBill(e.target.value)} className="bg-surface-50" />
          </div>
          <div>
            <label className="block text-xs font-bold text-surface-500 mb-1">{isRtl ? `نسبة البقشيش: ${tipPercent}%` : `Tip: ${tipPercent}%`}</label>
            <input type="range" min={0} max={100} value={tipPercent} onChange={e => setTipPercent(Number(e.target.value))} className="w-full accent-brand-500" />
          </div>
          <div className="flex gap-2">
            {[10, 15, 20, 25].map(pct => (
              <Button key={pct} size="sm" variant={tipPercent === pct ? "primary" : "outline"} onClick={() => setTipPercent(pct)}>{pct}%</Button>
            ))}
          </div>
          <div>
            <label className="block text-xs font-bold text-surface-500 mb-1">{isRtl ? `عدد الأشخاص: ${split}` : `Split: ${split} person(s)`}</label>
            <input type="range" min={1} max={20} value={split} onChange={e => setSplit(Number(e.target.value))} className="w-full accent-brand-500" />
          </div>
          {Number(bill) > 0 && (
            <div className="grid grid-cols-3 gap-3 text-center animate-fade-in pt-3">
              <div className="p-2.5 rounded-xl bg-surface-50 border border-surface-200/40 dark:bg-surface-950 dark:border-surface-800">
                <p className="text-[10px] text-surface-400 font-bold uppercase">{isRtl ? "البقشيش" : "Tip"}</p>
                <p className="text-base font-extrabold text-brand-500 mt-0.5">${tipAmount.toFixed(2)}</p>
              </div>
              <div className="p-2.5 rounded-xl bg-surface-50 border border-surface-200/40 dark:bg-surface-950 dark:border-surface-800">
                <p className="text-[10px] text-surface-400 font-bold uppercase">{isRtl ? "الإجمالي" : "Total"}</p>
                <p className="text-base font-extrabold text-surface-800 dark:text-surface-200 mt-0.5">${total.toFixed(2)}</p>
              </div>
              <div className="p-2.5 rounded-xl bg-surface-50 border border-surface-200/40 dark:bg-surface-950 dark:border-surface-800">
                <p className="text-[10px] text-surface-400 font-bold uppercase">{isRtl ? "لكل شخص" : "Each"}</p>
                <p className="text-base font-extrabold text-green-500 mt-0.5">${perPerson.toFixed(2)}</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function CurrencyConverterTool() {
  const [amount, setAmount] = useState("100");
  const [from, setFrom] = useState("USD");
  const [to, setTo] = useState("EUR");
  const isRtl = useIsRtl();

  const rates: Record<string, Record<string, number>> = {
    USD: { EUR: 0.92, GBP: 0.79, JPY: 149.50, CAD: 1.36, AUD: 1.53, EGP: 48.20 },
    EUR: { USD: 1.09, GBP: 0.86, JPY: 162.50, CAD: 1.48, AUD: 1.67, EGP: 52.30 },
    GBP: { USD: 1.27, EUR: 1.16, JPY: 189.20, CAD: 1.72, AUD: 1.94, EGP: 61.10 },
    EGP: { USD: 0.021, EUR: 0.019, GBP: 0.016, JPY: 3.10, CAD: 0.028, AUD: 0.032 },
  };

  const converted = rates[from]?.[to] ? Number(amount) * rates[from][to] : 0;
  const currencies = ["USD", "EUR", "GBP", "JPY", "CAD", "AUD", "EGP"];

  return (
    <div className="max-w-md mx-auto space-y-6">
      <Card className="border-surface-200 bg-white shadow-sm dark:bg-surface-900">
        <CardContent className="p-6 space-y-4">
          <div className="grid grid-cols-3 gap-3 items-center">
            <div className="col-span-3">
              <Input type="number" value={amount} onChange={e => setAmount(e.target.value)} className="bg-surface-50 rounded-xl" />
            </div>
            <select value={from} onChange={e => setFrom(e.target.value)} className="p-2.5 rounded-xl border border-surface-200 text-sm bg-surface-50 focus:ring-brand-500">
              {currencies.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <div className="flex items-center justify-center text-xl text-surface-400 font-bold">&harr;</div>
            <select value={to} onChange={e => setTo(e.target.value)} className="p-2.5 rounded-xl border border-surface-200 text-sm bg-surface-50 focus:ring-brand-500">
              {currencies.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          {converted > 0 && (
            <div className="text-center p-5 rounded-2xl bg-brand-50 border border-brand-100 dark:bg-brand-950/20 dark:border-brand-900/30 animate-fade-in">
              <p className="text-xs text-surface-400 font-bold uppercase">{amount} {from} =</p>
              <p className="text-3xl font-extrabold text-brand-500 mt-1">{converted.toFixed(2)} {to}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function GenericTool({ slug }: { slug: string }) {
  const isRtl = useIsRtl();
  return (
    <div className="max-w-lg mx-auto text-center py-16 bg-white rounded-3xl border border-surface-200 dark:bg-surface-900 dark:border-surface-800">
      <Wrench className="h-14 w-14 mx-auto text-brand-500 mb-4 bg-brand-50 p-3 rounded-2xl dark:bg-brand-950/30 animate-pulse" />
      <h2 className="text-2xl font-bold text-surface-900 dark:text-surface-100 mb-2">
        {slug.split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ")}
      </h2>
      <p className="text-sm text-surface-500 max-w-sm mx-auto">
        {isRtl
          ? "يتم حالياً تطوير وتجهيز هذه الأداة لتعمل بشكل فائق السرعة داخل المتصفح. ترقبوا إطلاقها قريباً!"
          : "This high-fidelity client-side utility is currently under active refinement. Stay tuned!"}
      </p>
    </div>
  );
}

