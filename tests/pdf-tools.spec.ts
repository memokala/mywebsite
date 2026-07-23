import { test, expect } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

// Define fixture paths
const fixturesDir = path.join(__dirname, 'fixtures');
const pdfPath1 = path.join(fixturesDir, 'sample1.pdf');
const pdfPath2 = path.join(fixturesDir, 'sample2.pdf');
const txtPath = path.join(fixturesDir, 'sample.txt');

test.beforeAll(() => {
  // Create fixtures directory if it doesn't exist
  if (!fs.existsSync(fixturesDir)) {
    fs.mkdirSync(fixturesDir, { recursive: true });
  }

  // Minimal valid 1-page PDF content
  const minimalPdfContent = `%PDF-1.4
1 0 obj
<< /Type /Catalog /Pages 2 0 R >>
endobj
2 0 obj
<< /Type /Pages /Kids [3 0 R] /Count 1 >>
endobj
3 0 obj
<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << >> /Contents 4 0 R >>
endobj
4 0 obj
<< /Length 44 >>
stream
BT /F1 12 Tf 72 712 Td (Hello World) Tj ET
endstream
endobj
xref
0 5
0000000000 65535 f 
0000000009 00000 n 
0000000058 00000 n 
0000000115 00000 n 
0000000216 00000 n 
trailer
<< /Size 5 /Root 1 0 R >>
startxref
311
%%EOF`;

  // Write temporary test files
  fs.writeFileSync(pdfPath1, minimalPdfContent);
  fs.writeFileSync(pdfPath2, minimalPdfContent);
  fs.writeFileSync(txtPath, 'This is a plain text file, not a PDF.');
});

test.afterAll(() => {
  // Clean up fixtures
  try {
    if (fs.existsSync(pdfPath1)) fs.unlinkSync(pdfPath1);
    if (fs.existsSync(pdfPath2)) fs.unlinkSync(pdfPath2);
    if (fs.existsSync(txtPath)) fs.unlinkSync(txtPath);
    if (fs.existsSync(fixturesDir)) fs.rmdirSync(fixturesDir);
  } catch (err) {
    console.error('Error during cleanup:', err);
  }
});

test.describe('PDF Tools Functionality - Merge PDF', () => {
  test('should load merge-pdf page and have active dropzone', async ({ page }) => {
    await page.goto('/ar/pdf/merge-pdf');

    // Verify upload zone is present
    const dropzone = page.locator('#tool-upload-zone');
    await expect(dropzone).toBeVisible();
    await expect(dropzone).toContainText(/اسحب وأفلت/);
  });

  test('should upload, reorder, and merge two valid PDF files', async ({ page }) => {
    await page.goto('/ar/pdf/merge-pdf');
    
    // Find the file input (it is hidden inside the dropzone)
    const fileInput = page.locator('input[type="file"]');
    
    // Upload both PDF files
    await fileInput.setInputFiles([pdfPath1, pdfPath2]);
    
    // Verify files are uploaded and displayed
    await expect(page.locator('text=الملفات المختارة')).toBeVisible();
    await expect(page.locator('text=sample1.pdf')).toBeVisible();
    await expect(page.locator('text=sample2.pdf')).toBeVisible();

    // Verify the "Start Processing" button is enabled
    const processBtn = page.locator('button:has-text("بدء المعالجة")');
    await expect(processBtn).toBeEnabled();

    // Click starting process
    await processBtn.click();

    // Verify processing state
    const processingIndicator = page.locator('text=جاري المعالجة...').first();
    await expect(processingIndicator).toBeVisible();

    // Verify success state (using client-side pdf-lib)
    const successHeader = page.locator('text=تمت معالجة ملفك بنجاح!');
    await expect(successHeader).toBeVisible({ timeout: 15000 });

    // Verify download button is present
    const downloadBtn = page.locator('button:has-text("تحميل الملف")');
    await expect(downloadBtn).toBeVisible();
  });
});
