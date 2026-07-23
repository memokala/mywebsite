/**
 * Snippet-bait content for Featured Snippet hijacking.
 * Each tool gets a direct-answer paragraph designed to capture Position Zero.
 * 
 * Structure: <strong>Question restatement</strong> + immediate 1-2 sentence answer + 3 trust signals
 */

export type SnippetBaitContent = {
  en: string;
  ar: string;
};

export const snippetBaitData: Record<string, SnippetBaitContent> = {
  "merge-pdf": {
    en: `<strong>To merge PDF files without uploading:</strong> Drop your files into the tool below — all merging happens instantly in your browser using client-side JavaScript. No file ever leaves your device. Works offline. No sign-up required. Unlimited merges, forever free.`,
    ar: `<strong>لدمج ملفات PDF بدون رفعها:</strong> اسحب ملفاتك إلى الأداة أدناه — يتم الدمج فورياً في متصفحك باستخدام تقنية JavaScript المحلية. لا يغادر أي ملف جهازك أبداً. يعمل بدون إنترنت. لا يتطلب تسجيل. دمج غير محدود، مجاني للأبد.`,
  },
  "compress-pdf": {
    en: `<strong>To compress a PDF without uploading:</strong> Add your PDF below and choose your compression level — the entire compression happens locally in your browser. Your file never touches our servers. Reduce PDF size by up to 80% in under 2 seconds. Free, unlimited, no email required.`,
    ar: `<strong>لضغط ملف PDF بدون رفعه:</strong> أضف ملفك أدناه واختر مستوى الضغط — يتم الضغط بالكامل محلياً في متصفحك. ملفك لا يلمس خوادمنا أبداً. تقليل حجم PDF بنسبة تصل إلى 80% في أقل من ثانيتين. مجاني، غير محدود، بدون بريد إلكتروني.`,
  },
  "split-pdf": {
    en: `<strong>To split a PDF without uploading:</strong> Add your PDF and select the page range to extract — splitting happens entirely in your browser with zero server contact. Your documents stay private on your device. No sign-up, no watermarks, no limits.`,
    ar: `<strong>لتقسيم ملف PDF بدون رفعه:</strong> أضف ملفك وحدد نطاق الصفحات المراد استخراجها — يتم التقسيم بالكامل في متصفحك بدون أي اتصال بالسيرفر. مستنداتك تبقى خاصة على جهازك. بدون تسجيل، بدون علامات مائية، بدون حدود.`,
  },
  "rotate-pdf": {
    en: `<strong>To rotate PDF pages without uploading:</strong> Add your PDF and select the rotation angle — pages are rotated instantly in your browser. No file upload, no server processing. Fix page orientation in seconds. Free and unlimited.`,
    ar: `<strong>لتدوير صفحات PDF بدون رفع الملف:</strong> أضف ملفك واختر زاوية التدوير — يتم تدوير الصفحات فوراً في متصفحك. بدون رفع ملفات، بدون معالجة سيرفر. إصلاح اتجاه الصفحات في ثوانٍ. مجاني وغير محدود.`,
  },
  "protect-pdf": {
    en: `<strong>To password-protect a PDF without uploading:</strong> Add your PDF and set a password — encryption happens 100% in your browser using AES-256. Your sensitive document never leaves your device. The most secure way to protect PDFs online. Free, no limits.`,
    ar: `<strong>لحماية ملف PDF بكلمة مرور بدون رفعه:</strong> أضف ملفك وعيّن كلمة المرور — يتم التشفير بنسبة 100% في متصفحك باستخدام AES-256. مستندك الحساس لا يغادر جهازك أبداً. الطريقة الأكثر أماناً لحماية ملفات PDF أونلاين. مجاني، بدون حدود.`,
  },
  "unlock-pdf": {
    en: `<strong>To remove a password from a PDF without uploading:</strong> Add your protected PDF and enter the password — unlocking happens locally in your browser. Your document is never sent to any server. The safest way to unlock PDFs online. Free and instant.`,
    ar: `<strong>لإزالة كلمة المرور من ملف PDF بدون رفعه:</strong> أضف ملفك المحمي وأدخل كلمة المرور — يتم فك القفل محلياً في متصفحك. مستندك لا يُرسل لأي سيرفر أبداً. الطريقة الأكثر أماناً لفك قفل ملفات PDF أونلاين. مجاني وفوري.`,
  },
  "add-watermark-pdf": {
    en: `<strong>To add a watermark to PDF without uploading:</strong> Add your PDF and type your watermark text — the watermark is applied instantly in your browser. Your file stays on your device throughout. Protect your documents with custom watermarks. Free, no limits.`,
    ar: `<strong>لإضافة علامة مائية لملف PDF بدون رفعه:</strong> أضف ملفك واكتب نص العلامة المائية — يتم تطبيق العلامة فوراً في متصفحك. ملفك يبقى على جهازك طوال العملية. احمِ مستنداتك بعلامات مائية مخصصة. مجاني، بدون حدود.`,
  },
  "add-page-numbers-pdf": {
    en: `<strong>To add page numbers to a PDF without uploading:</strong> Add your PDF and choose the position — page numbers are inserted locally in your browser in seconds. No upload, no server processing. Customize font, position, and format. Free, unlimited.`,
    ar: `<strong>لإضافة أرقام صفحات لملف PDF بدون رفعه:</strong> أضف ملفك واختر الموضع — يتم إدراج أرقام الصفحات محلياً في متصفحك خلال ثوانٍ. بدون رفع، بدون معالجة سيرفر. خصّص الخط والموضع والتنسيق. مجاني، غير محدود.`,
  },
  "edit-pdf": {
    en: `<strong>To edit a PDF without uploading:</strong> Add your PDF below — add text, images, annotations, and signatures entirely in your browser. Your file never leaves your device. No software to install, no account needed. Free PDF editing with zero privacy risk.`,
    ar: `<strong>لتعديل ملف PDF بدون رفعه:</strong> أضف ملفك أدناه — أضف نصوصاً وصوراً وتعليقات وتوقيعات بالكامل في متصفحك. ملفك لا يغادر جهازك أبداً. لا برامج لتثبيتها، لا حاجة لحساب. تعديل PDF مجاني بدون أي مخاطر خصوصية.`,
  },
  "crop-pdf": {
    en: `<strong>To crop PDF pages without uploading:</strong> Add your PDF and adjust the crop margins — cropping is processed entirely in your browser. No file upload required. Remove unwanted margins and white space instantly. Free and unlimited.`,
    ar: `<strong>لقص صفحات PDF بدون رفع الملف:</strong> أضف ملفك واضبط هوامش القص — تتم المعالجة بالكامل في متصفحك. لا يتطلب رفع الملف. إزالة الهوامش والمساحات البيضاء غير المرغوبة فوراً. مجاني وغير محدود.`,
  },
  "organize-pdf": {
    en: `<strong>To organize PDF pages without uploading:</strong> Add your PDF to reorder, delete, or insert pages — all processing happens in your browser. Your document stays on your device. Drag and drop to rearrange pages. Free, no sign-up required.`,
    ar: `<strong>لتنظيم صفحات PDF بدون رفع الملف:</strong> أضف ملفك لإعادة ترتيب أو حذف أو إدراج الصفحات — جميع المعالجة تتم في متصفحك. مستندك يبقى على جهازك. اسحب وأفلت لإعادة ترتيب الصفحات. مجاني، بدون تسجيل.`,
  },
  "sign-pdf": {
    en: `<strong>To sign a PDF without uploading:</strong> Add your PDF and draw or type your signature — signing happens 100% in your browser. Your document never touches any server. Add electronic signatures to contracts and forms instantly. Free, private, and secure.`,
    ar: `<strong>لتوقيع ملف PDF بدون رفعه:</strong> أضف ملفك وارسم أو اكتب توقيعك — يتم التوقيع بنسبة 100% في متصفحك. مستندك لا يلمس أي سيرفر. أضف توقيعات إلكترونية للعقود والنماذج فوراً. مجاني، خاص، وآمن.`,
  },
  "convert-pdf": {
    en: `<strong>To convert PDF files without uploading:</strong> Add your PDF and choose the output format — conversion happens locally in your browser. No file upload, no cloud processing. Convert PDF to Word, JPG, PNG and more. Free, instant, and private.`,
    ar: `<strong>لتحويل ملفات PDF بدون رفعها:</strong> أضف ملفك واختر صيغة الإخراج — يتم التحويل محلياً في متصفحك. بدون رفع ملفات، بدون معالجة سحابية. تحويل PDF إلى Word و JPG و PNG والمزيد. مجاني، فوري، وخاص.`,
  },
  "ocr-pdf": {
    en: `<strong>To OCR a scanned PDF without uploading:</strong> Add your scanned PDF — text recognition runs entirely in your browser using advanced OCR technology. Your scanned documents stay private on your device. Convert scanned PDFs to searchable text. Free, no limits.`,
    ar: `<strong>للتعرف على النص في ملف PDF ممسوح بدون رفعه:</strong> أضف ملفك الممسوح — يعمل التعرف على النص بالكامل في متصفحك باستخدام تقنية OCR المتقدمة. مستنداتك الممسوحة تبقى خاصة على جهازك. تحويل PDF الممسوح لنص قابل للبحث. مجاني، بدون حدود.`,
  },
  "compare-pdf": {
    en: `<strong>To compare two PDFs without uploading:</strong> Add both PDFs and view differences side by side — comparison runs entirely in your browser. Your documents never leave your device. Find changes between PDF versions instantly. Free and secure.`,
    ar: `<strong>لمقارنة ملفين PDF بدون رفعهما:</strong> أضف كلا الملفين وشاهد الفروقات جنباً إلى جنب — تتم المقارنة بالكامل في متصفحك. مستنداتك لا تغادر جهازك أبداً. اعثر على التغييرات بين نسخ PDF فوراً. مجاني وآمن.`,
  },
  "redact-pdf": {
    en: `<strong>To redact sensitive information from a PDF without uploading:</strong> Add your PDF and select areas to redact — redaction is permanent and happens locally in your browser. The most secure way to remove sensitive data from documents. Your files never leave your device.`,
    ar: `<strong>لحجب المعلومات الحساسة من ملف PDF بدون رفعه:</strong> أضف ملفك وحدد المناطق المراد حجبها — الحجب دائم ويتم محلياً في متصفحك. الطريقة الأكثر أماناً لإزالة البيانات الحساسة من المستندات. ملفاتك لا تغادر جهازك أبداً.`,
  },
};

