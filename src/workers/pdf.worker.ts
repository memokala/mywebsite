import { PDFDocument } from "pdf-lib";

const ctx: Worker = self as any;

ctx.addEventListener("message", async (event: MessageEvent) => {
  const { type, payload } = event.data;

  if (type === "MERGE_PDFS") {
    try {
      const arrayBuffers = payload.buffers as ArrayBuffer[];
      if (!arrayBuffers || arrayBuffers.length === 0) {
        throw new Error("No PDF buffers provided for merging.");
      }

      const mergedPdf = await PDFDocument.create();

      for (const buffer of arrayBuffers) {
        const doc = await PDFDocument.load(buffer);
        const pages = await mergedPdf.copyPages(doc, doc.getPageIndices());
        pages.forEach((page) => mergedPdf.addPage(page));
      }

      const mergedBytes = await mergedPdf.save();

      ctx.postMessage(
        {
          type: "MERGE_SUCCESS",
          payload: { bytes: mergedBytes.buffer },
        },
        [mergedBytes.buffer]
      );
    } catch (error: any) {
      ctx.postMessage({
        type: "MERGE_FAILURE",
        payload: { error: error.message || "An unknown error occurred during merging." },
      });
    }
  }
});
