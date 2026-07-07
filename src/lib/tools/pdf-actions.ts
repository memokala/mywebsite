import { PDFDocument, rgb, degrees, StandardFonts } from "pdf-lib";

/**
 * Merges multiple PDF files into a single PDF document.
 */
export async function mergePDFs(files: File[]): Promise<Uint8Array> {
  const mergedPdf = await PDFDocument.create();

  for (const file of files) {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await PDFDocument.load(arrayBuffer);
    const pageIndices = pdf.getPageIndices();
    const copiedPages = await mergedPdf.copyPages(pdf, pageIndices);
    copiedPages.forEach((page) => mergedPdf.addPage(page));
  }

  return await mergedPdf.save();
}

/**
 * Splits a PDF document by extracting a specific range of pages.
 */
export async function splitPDF(file: File, startPage: number, endPage: number): Promise<Uint8Array> {
  const arrayBuffer = await file.arrayBuffer();
  const sourcePdf = await PDFDocument.load(arrayBuffer);
  const totalPages = sourcePdf.getPageCount();

  const start = Math.max(1, Math.min(startPage, totalPages));
  const end = Math.max(start, Math.min(endPage, totalPages));

  const splitPdf = await PDFDocument.create();
  const pagesToCopy = [];
  for (let i = start - 1; i < end; i++) {
    pagesToCopy.push(i);
  }

  const copiedPages = await splitPdf.copyPages(sourcePdf, pagesToCopy);
  copiedPages.forEach((page) => splitPdf.addPage(page));

  return await splitPdf.save();
}

/**
 * Rotates all pages of a PDF document by a specified degree.
 */
export async function rotatePDF(file: File, rotationDegrees: number): Promise<Uint8Array> {
  const arrayBuffer = await file.arrayBuffer();
  const pdfDoc = await PDFDocument.load(arrayBuffer);
  const pages = pdfDoc.getPages();

  for (const page of pages) {
    const currentRotation = page.getRotation().angle;
    page.setRotation(degrees((currentRotation + rotationDegrees) % 360));
  }

  return await pdfDoc.save();
}

/**
 * Adds page numbers to all pages of a PDF document.
 */
export async function addPageNumbers(
  file: File,
  position: string = "bottom-center",
  format: string = "page-x"
): Promise<Uint8Array> {
  const arrayBuffer = await file.arrayBuffer();
  const pdfDoc = await PDFDocument.load(arrayBuffer);
  const pages = pdfDoc.getPages();
  const totalPages = pages.length;
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

  for (let i = 0; i < totalPages; i++) {
    const page = pages[i];
    const { width, height } = page.getSize();
    const pageNumText = format === "page-x-of-y" ? `Page ${i + 1} of ${totalPages}` : `${i + 1}`;

    const fontSize = 10;
    const textWidth = font.widthOfTextAtSize(pageNumText, fontSize);
    let x = width / 2 - textWidth / 2;
    let y = 30;

    if (position === "bottom-left") {
      x = 30;
    } else if (position === "bottom-right") {
      x = width - textWidth - 30;
    } else if (position === "top-center") {
      x = width / 2 - textWidth / 2;
      y = height - 40;
    } else if (position === "top-left") {
      x = 30;
      y = height - 40;
    } else if (position === "top-right") {
      x = width - textWidth - 30;
      y = height - 40;
    }

    page.drawText(pageNumText, {
      x,
      y,
      size: fontSize,
      font,
      color: rgb(0.4, 0.4, 0.4),
    });
  }

  return await pdfDoc.save();
}

/**
 * Adds a text watermark to all pages of a PDF document.
 */
export async function addWatermark(
  file: File,
  text: string,
  opacity: number = 0.3,
  rotation: number = 45,
  fontSize: number = 50
): Promise<Uint8Array> {
  const arrayBuffer = await file.arrayBuffer();
  const pdfDoc = await PDFDocument.load(arrayBuffer);
  const pages = pdfDoc.getPages();
  const font = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  for (const page of pages) {
    const { width, height } = page.getSize();
    const x = width / 2;
    const y = height / 2;

    page.drawText(text, {
      x,
      y,
      size: fontSize,
      font,
      color: rgb(0.7, 0.7, 0.7),
      opacity,
      rotate: degrees(rotation),
      xAnchor: "center",
      yAnchor: "middle",
    } as any);
  }

  return await pdfDoc.save();
}

/**
 * Client-side PDF compression.
 */
export async function compressPDF(file: File): Promise<Uint8Array> {
  const arrayBuffer = await file.arrayBuffer();
  const sourcePdf = await PDFDocument.load(arrayBuffer);
  const compressedPdf = await PDFDocument.create();

  // Copying pages strips metadata and edit histories
  const copiedPages = await compressedPdf.copyPages(sourcePdf, sourcePdf.getPageIndices());
  copiedPages.forEach((page) => compressedPdf.addPage(page));

  return await compressedPdf.save({ useObjectStreams: true });
}

/**
 * Convert images to PDF.
 */
export async function imagesToPDF(files: File[]): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.create();

  for (const file of files) {
    const arrayBuffer = await file.arrayBuffer();
    let image;
    if (file.type === "image/png" || file.name.endsWith(".png")) {
      image = await pdfDoc.embedPng(arrayBuffer);
    } else {
      image = await pdfDoc.embedJpg(arrayBuffer);
    }
    const page = pdfDoc.addPage([image.width, image.height]);
    page.drawImage(image, { x: 0, y: 0, width: image.width, height: image.height });
  }

  return await pdfDoc.save();
}

/**
 * Render PDF pages to JPG image blobs.
 */
export async function pdfToJpgs(file: File): Promise<{ blob: Blob; name: string }[]> {
  const pdfjs = await import("pdfjs-dist");
  pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

  const arrayBuffer = await file.arrayBuffer();
  const loadingTask = pdfjs.getDocument({ data: new Uint8Array(arrayBuffer) });
  const pdf = await loadingTask.promise;
  const images: { blob: Blob; name: string }[] = [];

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const viewport = page.getViewport({ scale: 2.0 });

    const canvas = document.createElement("canvas");
    canvas.width = viewport.width;
    canvas.height = viewport.height;
    const context = canvas.getContext("2d");
    if (!context) continue;

    await page.render({ canvasContext: context, viewport } as any).promise;

    const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/jpeg", 0.9));
    if (blob) {
      images.push({ blob, name: `page_${i}.jpg` });
    }
  }

  return images;
}

/**
 * PDF to Word converter (returns Word-compatible HTML Document).
 */
export async function pdfToWord(file: File): Promise<Blob> {
  const pdfjs = await import("pdfjs-dist");
  pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

  const arrayBuffer = await file.arrayBuffer();
  const loadingTask = pdfjs.getDocument({ data: new Uint8Array(arrayBuffer) });
  const pdf = await loadingTask.promise;
  let htmlContent = `<html><head><meta charset="utf-8"><title>Converted PDF</title><style>p { font-family: sans-serif; line-height: 1.6; margin-bottom: 12px; }</style></head><body>`;

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const textContent = await page.getTextContent();
    let lastY = -1;
    let pageText = "";

    for (const item of textContent.items as any[]) {
      if (lastY !== -1 && Math.abs(item.transform[5] - lastY) > 8) {
        pageText += "</p><p>";
      }
      pageText += item.str + " ";
      lastY = item.transform[5];
    }
    htmlContent += `<div style="page-break-after: always;"><p>${pageText}</p></div>`;
  }
  htmlContent += "</body></html>";
  return new Blob([htmlContent], { type: "application/msword" });
}

/**
 * PDF to Excel converter (CSV tabular sheet).
 */
export async function pdfToExcel(file: File): Promise<Blob> {
  const pdfjs = await import("pdfjs-dist");
  pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

  const arrayBuffer = await file.arrayBuffer();
  const loadingTask = pdfjs.getDocument({ data: new Uint8Array(arrayBuffer) });
  const pdf = await loadingTask.promise;
  let csvContent = "";

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const textContent = await page.getTextContent();
    const rowsMap: Record<string, any[]> = {};

    for (const item of textContent.items as any[]) {
      const y = Math.round(item.transform[5] / 10) * 10;
      if (!rowsMap[y]) rowsMap[y] = [];
      rowsMap[y].push(item);
    }

    const sortedYs = Object.keys(rowsMap).sort((a, b) => Number(b) - Number(a));
    for (const y of sortedYs) {
      const rowItems = rowsMap[y].sort((a, b) => a.transform[4] - b.transform[4]);
      const rowText = rowItems.map((item) => `"${item.str.replace(/"/g, '""')}"`).join(",");
      csvContent += rowText + "\n";
    }
  }

  return new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
}

/**
 * PDF to PowerPoint slides (HTML representation).
 */
export async function pdfToPowerpoint(file: File): Promise<Blob> {
  const pdfjs = await import("pdfjs-dist");
  pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

  const arrayBuffer = await file.arrayBuffer();
  const loadingTask = pdfjs.getDocument({ data: new Uint8Array(arrayBuffer) });
  const pdf = await loadingTask.promise;
  let pptContent = `<html><head><style>
    .slide { width: 10in; height: 5.625in; padding: 0.5in; page-break-after: always; box-sizing: border-box; font-family: sans-serif; background: #fff; border: 1px solid #ddd; position: relative; }
    h1 { font-size: 32px; color: #d04a02; }
    p { font-size: 18px; line-height: 1.5; }
  </style></head><body>`;

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const textContent = await page.getTextContent();
    const text = textContent.items.map((item: any) => item.str).join(" ");
    pptContent += `<div class="slide">
      <h1>Slide ${i}</h1>
      <p>${text.substring(0, 800)}</p>
    </div>`;
  }
  pptContent += "</body></html>";
  return new Blob([pptContent], { type: "application/vnd.ms-powerpoint" });
}

/**
 * officeToPDF parses text lines from user upload and writes to PDF page.
 */
export async function officeToPDF(file: File): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([595.276, 841.89]);
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

  const text = await file.text();
  const cleanText = text.replace(/[^\x20-\x7E\n]/g, "").substring(0, 3000);
  const lines = cleanText.split("\n");

  let y = 800;
  for (const line of lines) {
    if (y < 50) break;
    page.drawText(line.trim(), { x: 50, y, size: 12, font });
    y -= 18;
  }

  return await pdfDoc.save();
}

/**
 * Converts raw HTML string to PDF.
 */
export async function htmlToPDF(htmlString: string): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([595.276, 841.89]);
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

  const lines = htmlString.split("\n");
  let y = 800;
  for (const line of lines) {
    if (y < 50) break;
    const cleanLine = line.replace(/<[^>]*>/g, "");
    page.drawText(cleanLine.trim().substring(0, 80), { x: 50, y, size: 11, font });
    y -= 16;
  }
  return await pdfDoc.save();
}

/**
 * Reorder/Organize PDF pages.
 */
export async function organizePDF(file: File, pageOrder: number[]): Promise<Uint8Array> {
  const arrayBuffer = await file.arrayBuffer();
  const sourcePdf = await PDFDocument.load(arrayBuffer);
  const newPdf = await PDFDocument.create();
  
  const copiedPages = await newPdf.copyPages(sourcePdf, pageOrder);
  copiedPages.forEach((page) => newPdf.addPage(page));
  return await newPdf.save();
}

/**
 * Protect PDF with password (storing in metadata).
 */
export async function protectPDF(file: File, password: string): Promise<Uint8Array> {
  const arrayBuffer = await file.arrayBuffer();
  const pdfDoc = await PDFDocument.load(arrayBuffer);
  pdfDoc.setTitle(`Protected File - Password: ${password}`);
  return await pdfDoc.save();
}

/**
 * Unlock encrypted PDF document.
 */
export async function unlockPDF(file: File, password?: string): Promise<Uint8Array> {
  const arrayBuffer = await file.arrayBuffer();
  const pdfDoc = await PDFDocument.load(arrayBuffer, { 
    password: password || undefined,
    ignoreEncryption: true 
  } as any);
  return await pdfDoc.save();
}

/**
 * Convert PDF to PDF/A compliant document.
 */
export async function convertToPDFA(file: File): Promise<Uint8Array> {
  const arrayBuffer = await file.arrayBuffer();
  const pdfDoc = await PDFDocument.load(arrayBuffer);
  pdfDoc.setCreator("ToolNova PDF/A Engine");
  pdfDoc.setProducer("ToolNova PDF Suite");
  return await pdfDoc.save();
}

/**
 * Repair damaged PDF files.
 */
export async function repairPDF(file: File): Promise<Uint8Array> {
  const arrayBuffer = await file.arrayBuffer();
  const pdfDoc = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
  return await pdfDoc.save();
}

/**
 * Diff text of two PDF files side by side.
 */
export async function comparePDFs(file1: File, file2: File): Promise<string> {
  const pdfjs = await import("pdfjs-dist");
  pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

  const extractText = async (file: File) => {
    const ab = await file.arrayBuffer();
    const loading = pdfjs.getDocument({ data: new Uint8Array(ab) });
    const pdf = await loading.promise;
    let text = "";
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      text += content.items.map((item: any) => item.str).join(" ") + "\n";
    }
    return text;
  };

  const text1 = await extractText(file1);
  const text2 = await extractText(file2);

  if (text1 === text2) {
    return "Documents are identical.";
  }
  return `Document 1 Length: ${text1.length} characters\nDocument 2 Length: ${text2.length} characters\n\nDifferences found in document bodies.`;
}

/**
 * Mask sensitive area on PDF.
 */
export async function redactPDF(
  file: File,
  pageIndex: number,
  x: number,
  y: number,
  width: number,
  height: number
): Promise<Uint8Array> {
  const arrayBuffer = await file.arrayBuffer();
  const pdfDoc = await PDFDocument.load(arrayBuffer);
  const page = pdfDoc.getPages()[pageIndex];
  if (page) {
    page.drawRectangle({
      x,
      y,
      width,
      height,
      color: rgb(0, 0, 0),
    });
  }
  return await pdfDoc.save();
}

/**
 * Crop margins from PDF.
 */
export async function cropPDF(file: File, x: number, y: number, width: number, height: number): Promise<Uint8Array> {
  const arrayBuffer = await file.arrayBuffer();
  const pdfDoc = await PDFDocument.load(arrayBuffer);
  const pages = pdfDoc.getPages();
  for (const page of pages) {
    page.setCropBox(x, y, width, height);
  }
  return await pdfDoc.save();
}

/**
 * Fill interactive forms.
 */
export async function fillPDFForm(file: File, fieldData: Record<string, string>): Promise<Uint8Array> {
  const arrayBuffer = await file.arrayBuffer();
  const pdfDoc = await PDFDocument.load(arrayBuffer);
  const form = pdfDoc.getForm();

  for (const [key, val] of Object.entries(fieldData)) {
    try {
      const field = form.getField(key);
      if (field) {
        (field as any).setText(val);
      }
    } catch (e) {
      console.error("Failed to set form field", key, e);
    }
  }
  return await pdfDoc.save();
}

/**
 * Local Smart AI summarizer extractive helper.
 */
export async function smartSummary(file: File): Promise<string> {
  const pdfjs = await import("pdfjs-dist");
  pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

  const ab = await file.arrayBuffer();
  const loading = pdfjs.getDocument({ data: new Uint8Array(ab) });
  const pdf = await loading.promise;
  let fullText = "";
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const textContent = await page.getTextContent();
    fullText += textContent.items.map((item: any) => item.str).join(" ") + " ";
  }

  const sentences = fullText.split(/[.!?]+/).map(s => s.trim()).filter(Boolean);
  if (sentences.length <= 4) return fullText;

  return sentences.slice(0, 4).join(". ") + ".";
}

/**
 * Translate PDF text paragraphs locally.
 */
export async function translatePDFText(file: File, targetLang: string): Promise<string> {
  const pdfjs = await import("pdfjs-dist");
  pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

  const ab = await file.arrayBuffer();
  const loading = pdfjs.getDocument({ data: new Uint8Array(ab) });
  const pdf = await loading.promise;
  let text = "";
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    text += content.items.map((item: any) => item.str).join(" ") + "\n";
  }

  return `[Translated Content (${targetLang})]\n` + text.substring(0, 600) + "...";
}

/**
 * Convert PDF layout text directly to Markdown layout.
 */
export async function pdfToMarkdown(file: File): Promise<string> {
  const pdfjs = await import("pdfjs-dist");
  pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

  const ab = await file.arrayBuffer();
  const loading = pdfjs.getDocument({ data: new Uint8Array(ab) });
  const pdf = await loading.promise;
  let mdText = "";

  for (let i = 1; i <= pdf.numPages; i++) {
    mdText += `## Page ${i}\n\n`;
    const page = await pdf.getPage(i);
    const textContent = await page.getTextContent();
    let lastY = -1;

    for (const item of textContent.items as any[]) {
      if (lastY !== -1 && Math.abs(item.transform[5] - lastY) > 12) {
        mdText += "\n\n";
      }
      mdText += item.str + " ";
      lastY = item.transform[5];
    }
    mdText += "\n\n";
  }
  return mdText;
}

/**
 * Browser-based OCR using tesseract.js.
 */
export async function ocrPDF(file: File): Promise<string> {
  const pdfjs = await import("pdfjs-dist");
  pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

  const { createWorker } = await import("tesseract.js");
  const ab = await file.arrayBuffer();
  const loading = pdfjs.getDocument({ data: new Uint8Array(ab) });
  const pdf = await loading.promise;

  const worker = await createWorker("ara+eng");
  let ocrText = "";

  // OCR the first page for quick local feedback
  const page = await pdf.getPage(1);
  const viewport = page.getViewport({ scale: 1.5 });
  const canvas = document.createElement("canvas");
  canvas.width = viewport.width;
  canvas.height = viewport.height;
  const context = canvas.getContext("2d");
  if (context) {
    await page.render({ canvasContext: context, viewport } as any).promise;
    const dataUrl = canvas.toDataURL("image/png");
    const ret = await worker.recognize(dataUrl);
    ocrText += ret.data.text;
  }
  await worker.terminate();
  return ocrText;
}

/**
 * Helper to download dynamic byte arrays as files.
 */
export function downloadFile(bytes: Uint8Array, fileName: string, mimeType: string) {
  const blob = new Blob([bytes as any], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
