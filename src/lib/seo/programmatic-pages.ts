export type UseCaseContent = {
  title: string;
  metaTitle: string;
  metaDescription: string;
  introParagraph: string;
  howToSteps: { title: string; desc: string }[];
  faq: { q: string; a: string }[];
  useCases: string[];
};

export type AudienceDefinition = {
  slug: string; // English slug used in URL (e.g. for-accountants)
  slugAr: string; // Arabic slug used in URL (e.g. للمحاسبين)
  en: UseCaseContent;
  ar: UseCaseContent;
};

export const useCaseRegistry: Record<string, { audiences: AudienceDefinition[] }> = {
  "merge-pdf": {
    audiences: [
      {
        slug: "for-accountants",
        slugAr: "للمحاسبين",
        en: {
          title: "Merge Invoices & Financial PDFs for Accountants",
          metaTitle: "Merge Invoice PDFs for Accountants - Free & Private | WorldPDF",
          metaDescription: "Combine multiple invoices, receipts, and financial PDFs into one document securely in your browser. No files are uploaded, keeping sensitive data private.",
          introParagraph: "As an accounting or finance professional, you handle sensitive client records, invoices, tax forms, and bank statements daily. Uploading these documents to public cloud servers poses severe data compliance and security risks. WorldPDF solves this by processing all files directly inside your browser. No documents are uploaded to our servers, keeping financial records 100% private. Consolidate your monthly receipts, audit trails, and tax sheets instantly with native WebAssembly speeds.",
          howToSteps: [
            { title: "Select Invoices & Receipts", desc: "Drag and drop your financial PDF files or select them from your device." },
            { title: "Arrange Chronologically", desc: "Sort the files in order by date, client, or transaction sequence." },
            { title: "Merge Securely", desc: "Click Merge to join the pages in less than 2 seconds without any data leaving your browser." },
            { title: "Save & Record", desc: "Download the merged PDF document to your device for local archiving." }
          ],
          faq: [
            { q: "Is it secure to merge sensitive financial files on WorldPDF?", a: "Yes, absolutely. All processing is executed client-side. Your invoices and balance sheets are never uploaded to any cloud server." },
            { q: "Can I merge password-protected tax returns?", a: "Yes. Simply input the file password in the settings sidebar on drop, and you can merge them easily." },
            { q: "Are there size limits for large files?", a: "No file size limitations exist because the compilation runs on your local system resources instead of a shared server." }
          ],
          useCases: [
            "Consolidating monthly invoices for accounts payable",
            "Bundling tax returns with supporting schedules",
            "Merging multiple bank statement pages into one PDF",
            "Compiling financial reports for audit submission"
          ]
        },
        ar: {
          title: "دمج فواتير وملفات PDF المالية للمحاسبين",
          metaTitle: "دمج ملفات PDF للفواتير للمحاسبين - مجاني وآمن 100% | WorldPDF",
          metaDescription: "ادمج الفواتير والإيصالات ومستندات PDF المالية في ملف واحد بأمان تام داخل متصفحك. لا يتم رفع أي ملف، مما يحمي سرية بياناتك المالية.",
          introParagraph: "بصفتك محاسباً أو خبيراً مالياً، فإنك تتعامل مع سجلات العملاء الحساسة والفواتير والنماذج الضريبية يومياً. إن رفع هذه المستندات إلى سيرفرات خارجية يشكل خطراً كبيراً على خصوصية البيانات. يوفر موقع WorldPDF الحل المثالي من خلال معالجة كافة الملفات داخل متصفحك مباشرة. لا يتم رفع أي مستند إلى خوادمنا، مما يضمن سرية السجلات المالية بنسبة 100%. ادمج الإيصالات الشهرية والتقارير المالية فوراً وبسرعة فائقة.",
          howToSteps: [
            { title: "اختر الفواتير والإيصالات", desc: "اسحب وأفلت ملفات PDF المالية أو اخترها مباشرة من جهازك." },
            { title: "ترتيب الملفات زمنياً", desc: "رتب الملفات حسب التاريخ أو العميل أو تسلسل المعاملة قبل الدمج." },
            { title: "دمج الملفات بأمان", desc: "انقر على دمج لربط الصفحات في أقل من ثانيتين دون خروج البيانات من متصفحك." },
            { title: "حفظ وأرشفة النتيجة", desc: "حمّل ملف PDF المدمج إلى جهازك للبدء في أرشفته محلياً." }
          ],
          faq: [
            { q: "هل دمج الملفات المالية الحساسة آمن على WorldPDF؟", a: "نعم، بالتأكيد. تتم المعالجة بالكامل محلياً في متصفحك. لا يتم رفع الفواتير أو الميزانيات إلى خوادم سحابية." },
            { q: "هل يمكنني دمج الإقرارات الضريبية المحمية بكلمة مرور؟", a: "نعم. يمكنك إدخال كلمة مرور الملف في الشريط الجانبي بعد إسقاط الملف لدمجه بسهولة." },
            { q: "هل هناك حد أقصى لحجم الملفات المالية؟", a: "لا توجد أي قيود على الحجم لأن عملية المعالجة تعتمد على موارد جهازك الشخصي وليس على سيرفر مشترك." }
          ],
          useCases: [
            "تجميع الفواتير الشهرية للمدفوعات",
            "ربط الإقرارات الضريبية بالجداول الملحقة بها",
            "دمج كشوفات الحساب البنكية المتعددة في ملف واحد",
            "إعداد التقارير المالية لتقديمها لمدققي الحسابات"
          ]
        }
      },
      {
        slug: "for-lawyers",
        slugAr: "للمحامين",
        en: {
          title: "Merge Confidential Legal Briefs & PDF Exhibits for Lawyers",
          metaTitle: "Merge Legal PDFs for Lawyers - Private Browser Processing | WorldPDF",
          metaDescription: "Combine legal contracts, briefs, case files, and court exhibits into one secure PDF document in your browser. Zero uploads guarantee confidentiality.",
          introParagraph: "Legal professionals are bound by strict attorney-client privilege. Uploading discovery documents, legal briefs, contracts, and court exhibits to third-party conversion servers violates confidentiality agreements and compliance standards. With WorldPDF, you can merge legal files with absolute peace of mind. All processing is restricted to your local machine using client-side JavaScript. Keep client secrets safe and compile case files in seconds without internet exposure.",
          howToSteps: [
            { title: "Drag Legal Documents", desc: "Add contracts, agreements, or affidavits into the local workspace." },
            { title: "Order Case Exhibits", desc: "Reorder pages and files to match the index of your legal pleadings." },
            { title: "Merge Locally", desc: "Compile the documents instantly inside your browser without any network uploads." },
            { title: "Save for Court", desc: "Download the finished legal package ready for electronic filing (e-filing)." }
          ],
          faq: [
            { q: "How is client confidentiality maintained?", a: "WorldPDF is built on client-side technology. All code runs locally in your browser. The files are never transmitted to our servers, assuring client confidentiality." },
            { q: "Can I sign documents after merging them?", a: "Yes, you can use our built-in client-side Sign PDF tool to add your secure electronic signature to the merged contract." },
            { q: "Is there a court size limit?", a: "No, you can compile large court exhibits here, as processing relies on your browser memory, bypassing typical file limit warnings." }
          ],
          useCases: [
            "Compiling multiple exhibits and appendices for court filing",
            "Merging draft agreements with signing schedules",
            "Consolidating depositions and client statements",
            "Bundling real estate closing packages"
          ]
        },
        ar: {
          title: "دمج مذكرات الدفاع والمستندات القانونية للمحامين",
          metaTitle: "دمج ملفات PDF القانونية للمحامين - معالجة محلية وسرية | WorldPDF",
          metaDescription: "ادمج العقود ومذكرات الدفاع وملفات القضايا في مستند PDF واحد آمن بالكامل داخل متصفحك. نضمن سرية موكليك بنسبة 100% دون رفع ملفاتك.",
          introParagraph: "يلتزم المحامون والمهنيون القانونيون بالحفاظ على سرية معلومات الموكلين. إن رفع وثائق القضايا والعقود والملفات القضائية إلى سيرفرات خارجية قد ينتهك معايير السرية المهنية. مع WorldPDF، يمكنك دمج الملفات القانونية براحة بال مطلقة. تتم معالجة كافة البيانات محلياً على جهازك الشخصي باستخدام تقنيات المتصفح الحديثة. حافظ على سرية قضاياك وجهز مذكراتك دون أي مخاطر لتسريب المستندات.",
          howToSteps: [
            { title: "اسحب الوثائق القانونية", desc: "أضف العقود أو الاتفاقيات أو الإقرارات إلى مساحة العمل المحلية." },
            { title: "ترتيب مستندات القضية", desc: "أعد ترتيب الصفحات لتطابق الترتيب المطلوب في ملفات المحكمة." },
            { title: "دمج محلي فوري", desc: "اجمع المستندات فوراً داخل متصفحك دون رفعها لشبكة الإنترنت." },
            { title: "حفظ المستند للمحكمة", desc: "حمّل الملف القانوني الجاهز مباشرة لتقديمه إلكترونياً أو طباعته." }
          ],
          faq: [
            { q: "كيف يتم الحفاظ على سرية معلومات الموكلين؟", a: "WorldPDF يعتمد على معالجة محلية 100%. يتم تشغيل الأداة داخل المتصفح ولا يتم إرسال الملفات إطلاقاً لخوادمنا." },
            { q: "هل يمكنني توقيع المستند بعد الدمج؟", a: "نعم، يمكنك استخدام أداة 'توقيع PDF' المتاحة لدينا لإضافة توقيعك إلكترونياً محلياً وبأمان تام." },
            { q: "هل يدعم دمج الملفات الكبيرة المخصصة للمحكمة؟", a: "نعم، يمكنك جمع مستندات قضائية ضخمة هنا نظراً لعدم وجود قيود الحجم السحابية المعتادة." }
          ],
          useCases: [
            "تجميع المستندات والأدلة القانونية في ملف واحد للمحكمة",
            "دمج مسودات العقود مع ملاحق التوقيع",
            "جمع شهادات الشهود وإقرارات الخصوم",
            "إعداد حزم عقود إغلاق الصفقات العقارية"
          ]
        }
      },
      {
        slug: "for-students",
        slugAr: "للطلاب",
        en: {
          title: "Merge Lecture Slides, Notes & Assignments for Students",
          metaTitle: "Merge Academic PDFs for Students - Free & No Signup | WorldPDF",
          metaDescription: "Combine study slides, lecture notes, textbook chapters, and assignments into a single PDF. Free, fast, and no account or signup required.",
          introParagraph: "Between slides, assignment prompts, study guides, and scanned textbook pages, students handle an overwhelming amount of separate files every semester. WorldPDF offers a free and fast way to combine study materials without registering, signing up, or entering your email. Since processing runs inside your browser, there is no waiting in queues or paying for premium usage. Merge your lecture sheets, project pages, or essays into a single file to keep your study folders clean and organized.",
          howToSteps: [
            { title: "Upload Academic Files", desc: "Add your school PDFs, homework files, or presentation slides." },
            { title: "Order by Topic", desc: "Arrange your pages chronologically or by exam topic syllabus." },
            { title: "Merge Instantly", desc: "Click Merge to compile your files in your browser. No wait times." },
            { title: "Download Study Guide", desc: "Save the unified study file directly to your smartphone or laptop." }
          ],
          faq: [
            { q: "Do I need to sign up or pay to merge PDFs?", a: "No. WorldPDF is completely free, does not require an email or account registration, and has no hidden limitations." },
            { q: "Can I combine image slides with PDFs?", a: "Yes, you can convert your images (JPG/PNG) to PDF first in our image converter, then merge them together seamlessly." },
            { q: "Will it work on my mobile phone?", a: "Absolutely. You can run all PDF mergers directly from Safari, Chrome, or any mobile browser on iOS and Android devices." }
          ],
          useCases: [
            "Merging homework sheets into a single file for submission",
            "Combining separate lecture slides into one revision guide",
            "Consolidating chapters from textbooks for easy reading",
            "Aggregating project resources for group assignments"
          ]
        },
        ar: {
          title: "دمج محاضرات وملخصات وواجبات الطلاب الدراسية",
          metaTitle: "دمج ملفات PDF الدراسية للطلاب - مجاني وبدون تسجيل | WorldPDF",
          metaDescription: "ادمج شرائح المحاضرات، ملخصات المواد، فصول الكتب، والواجبات المدرسية في ملف واحد. مجاني بالكامل، سريع، ولا يتطلب أي تسجيل.",
          introParagraph: "يواجه الطلاب كل فصل دراسي صعوبة في تنظيم عشرات الملفات المنفصلة من ملخصات وشرائح محاضرات وكتب دراسية. يوفر WorldPDF طريقة مجانية وسريعة للغاية لدمج المواد الأكاديمية دون الحاجة لإنشاء حساب أو إدخال بريدك الإلكتروني. ولأن المعالجة تتم محلياً في متصفحك، فلن تضطر للانتظار في طوابير الرفع. ادمج أوراق المحاضرات والواجبات في مستند واحد للحفاظ على تنظيم دراستك.",
          howToSteps: [
            { title: "أضف الملفات الدراسية", desc: "اختر ملفات PDF للملخصات أو الواجبات أو الفصول الدراسية." },
            { title: "رتب حسب الموضوع", desc: "رتب المستندات زمنياً أو حسب ترتيب المنهج الدراسي للمذاكرة." },
            { title: "دمج فوري سريع", desc: "اضغط على دمج لتجميع ملفاتك داخل متصفحك في أقل من ثانية." },
            { title: "تحميل ملف المذاكرة", desc: "احفظ المستند المدمج مباشرة على هاتفك أو حاسوبك الشخصي." }
          ],
          faq: [
            { q: "هل أحتاج إلى الدفع أو التسجيل لدمج ملفاتي؟", a: "لا. WorldPDF مجاني تماماً، ولا يتطلب تسجيلاً أو بريداً إلكترونياً، وخالٍ من أي قيود خفية." },
            { q: "هل يمكنني دمج الصور الممسوحة مع الـ PDF؟", a: "نعم. يمكنك تحويل صور واجباتك (JPG/PNG) إلى PDF أولاً، ثم دمجها بسهولة." },
            { q: "هل تعمل الأداة على الهواتف الذكية؟", a: "نعم بكل تأكيد. يمكنك دمج وقراءة الملفات من متصفحات هواتف آيفون وأندرويد مباشرة." }
          ],
          useCases: [
            "تجميع الواجبات المدرسية والجامعية قبل تسليمها للمدرس",
            "دمج شرائح المحاضرات المتفرقة لملف واحد يسهل البحث فيه",
            "ربط الفصول والملخصات لإنشاء دليل مذاكرة شامل",
            "جمع أوراق الأبحاث والمصادر لمشاريع التخرج الجماعية"
          ]
        }
      },
      {
        slug: "for-teachers",
        slugAr: "للمعلمين",
        en: {
          title: "Merge Worksheets, Lesson Plans & Exams for Teachers",
          metaTitle: "Merge Teaching PDFs for Educators - Free & No Uploads | WorldPDF",
          metaDescription: "Combine lesson plans, student worksheets, exam papers, and report cards into a single PDF. Save time organizing curriculum materials in your browser.",
          introParagraph: "Preparing curriculum bundles and lesson plans takes valuable time out of an educator's day. Organizing separate student feedback papers, homework worksheets, study templates, and exams can quickly lead to digital clutter. WorldPDF helps teachers streamline class preparation by enabling local PDF combining in the browser. Easily pack student portfolios, bundle term worksheets, or compile exam papers into one tidy file. No file limits, and 100% private.",
          howToSteps: [
            { title: "Collect Classroom Files", desc: "Select worksheets, tests, or activity sheets to bundle together." },
            { title: "Structure Class Flow", desc: "Arrange files in the exact sequence they should be distributed to students." },
            { title: "Compile local PDF", desc: "Combine files in seconds. No cloud queues, no page limit warnings." },
            { title: "Print or Share", desc: "Download the consolidated class file for printing or virtual sharing." }
          ],
          faq: [
            { q: "Is it safe to put student grading details in this tool?", a: "Yes. WorldPDF operates entirely in your browser. Student grades, exam papers, and report cards never leave your local device." },
            { q: "Can I extract pages from a textbook PDF?", a: "Yes. You can use our Split PDF tool to extract specific pages, and then merge them with other worksheets using this tool." },
            { q: "Can I use it offline in my classroom?", a: "Yes. Once the page is loaded, the client-side code runs offline. You can merge PDFs even without active internet access." }
          ],
          useCases: [
            "Compiling weekly student worksheets into one homework booklet",
            "Consolidating multiple class test pages for printing",
            "Bundling lesson templates and plans for school inspection reviews",
            "Aggregating report cards or student portfolio documents"
          ]
        },
        ar: {
          title: "دمج أوراق العمل، خطط الدروس والامتحانات للمعلمين",
          metaTitle: "دمج ملفات PDF التعليمية للمعلمين - مجاني وآمن | WorldPDF",
          metaDescription: "ادمج أوراق عمل الطلاب، خطط الدروس، والامتحانات في ملف PDF واحد. وفّر وقتك في تنظيم المناهج التعليمية والأنشطة داخل متصفحك.",
          introParagraph: "يستغرق تحضير وتجميع المناهج الدراسية وأوراق الأنشطة وقتاً طويلاً من المعلم. إن تنظيم أوراق العمل والامتحانات المنفصلة للطلاب يسبب تشتتاً للملفات الرقمية. يساعد WorldPDF المعلمين والتربويين على تسهيل التحضير الدراسي عبر تجميع ملفات PDF محلياً في المتصفح. ادمج ملفات وأنشطة الفصل الدراسي في مستند واحد مرتب وجاهز للطباعة أو التوزيع دون أي حدود للحجم وبأمان تام.",
          howToSteps: [
            { title: "اجمع ملفات الفصل الدراسي", desc: "اختر أوراق العمل أو الامتحانات أو خطط الدرس لتجميعها." },
            { title: "رتب الأوراق للحصة", desc: "رتب الملفات حسب التسلسل الذي تود توزيعه للطلاب." },
            { title: "دمج محلي سريع", desc: "اجمع الأوراق في ثوانٍ. بدون انتظار رفع وبدون حدود لعدد الصفحات." },
            { title: "اطبع أو شارك الملف", desc: "حمّل الملف النهائي لطباعته دفعة واحدة أو إرساله للطلاب رقمياً." }
          ],
          faq: [
            { q: "هل رفع درجات الطلاب وأوراقهم آمن في هذه الأداة؟", a: "نعم. WorldPDF يعمل داخل المتصفح فقط. درجات الطلاب والتقارير لا تُرفع للإنترنت أبداً." },
            { q: "هل يمكنني استخراج أوراق من كتاب دراسي ودمجها؟", a: "نعم، استخدم أداة 'تقسيم PDF' لاستخراج الأوراق المطلوبة، ثم ادمجها هنا بسهولة." },
            { q: "هل تعمل الأداة بدون إنترنت داخل الفصل الدراسي؟", a: "نعم بكل تأكيد. بعد تحميل الصفحة لأول مرة، يمكنك استخدام ميزة الدمج حتى لو انقطع الاتصال بالإنترنت." }
          ],
          useCases: [
            "تجميع أوراق عمل الأسبوع في كتيب واجبات واحد للطلاب",
            "دمج صفحات الامتحانات الشهرية لطباعتها مرة واحدة",
            "ربط خطط تحضير الدروس والوسائل التعليمية لتقديمها للموجه",
            "تجميع تقارير أداء الطلاب وملفات إنجازاتهم السنوية"
          ]
        }
      },
      {
        slug: "for-hr",
        slugAr: "لمسؤولي-الموارد-البشرية",
        en: {
          title: "Merge Resumes, CVs & Recruitment PDFs for HR Professionals",
          metaTitle: "Merge HR & Resume PDFs - Secure In-Browser Processing | WorldPDF",
          metaDescription: "Combine applicant resumes, CVs, recruitment feedback forms, and employee contracts securely inside your browser. Meets GDPR compliance.",
          introParagraph: "Human resources specialists handle highly confidential personal data daily. Under data protection regulations like GDPR, uploading job applicant CVs, salary structures, background check records, and employment contracts to standard cloud file converters is a major compliance risk. WorldPDF protects recruiters and candidates alike. Processing is performed completely in-browser. Merge candidate resumes, performance feedback reports, or onboarding documents instantly while maintaining total compliance.",
          howToSteps: [
            { title: "Add Candidate Files", desc: "Upload multiple candidate CVs, portfolios, or references." },
            { title: "Sort by Preference", desc: "Arrange files by interview rank or applicant score evaluation." },
            { title: "Process locally", desc: "Merge files in-browser. All processing remains on your workstation." },
            { title: "Save for Review", desc: "Download the candidate package to share with department heads." }
          ],
          faq: [
            { q: "Does WorldPDF comply with GDPR data guidelines?", a: "Yes. Because WorldPDF processes files locally in your browser, no personal candidate data is transmitted, making it compliant with strict privacy laws." },
            { q: "Can I combine onboarding PDFs with cover letters?", a: "Yes. You can import cover letters and candidate resumes, rearrange them, and combine them into a single onboarding file." },
            { q: "How many resumes can I merge at the same time?", a: "You can merge up to 15 PDFs at once. Perfect for grouping applicants by department or job opening." }
          ],
          useCases: [
            "Merging applicant resumes and portfolios for hiring managers",
            "Consolidating employee onboarding packets",
            "Bundling annual performance appraisals and reviews",
            "Compiling employment agreements and background reports"
          ]
        },
        ar: {
          title: "دمج السير الذاتية وعقود التوظيف لمسؤولي الموارد البشرية (HR)",
          metaTitle: "دمج السير الذاتية وعقود الموارد البشرية - معالجة متصفح آمنة | WorldPDF",
          metaDescription: "ادمج سير المتقدمين للوظائف، العقود، ونماذج التقييم في ملف PDF واحد متكامل داخل متصفحك. متوافق تماماً مع قوانين حماية الخصوصية.",
          introParagraph: "يتعامل مسؤولو الموارد البشرية (HR) مع بيانات شخصية بالغة السرية يومياً. بموجب قوانين حماية البيانات والخصوصية، فإن رفع السير الذاتية للمتقدمين، سجلات الفحص الأمني، أو تفاصيل الرواتب إلى خوادم خارجية يعتبر مخالفة قانونية. يحمي WorldPDF كلاً من مرشحي الوظائف ومؤسستك. تتم المعالجة محلياً في متصفحك. ادمج السير الذاتية للمرشحين، تقارير التقييم، أو مستندات التعيين فوراً مع الحفاظ على السرية التامة والامتثال الكامل للوائح.",
          howToSteps: [
            { title: "أضف ملفات المتقدمين", desc: "أضف السير الذاتية المتعددة للمرشحين أو خطابات التوصية." },
            { title: "رتب حسب الأفضلية", desc: "رتب الملفات حسب تقييم المقابلة أو ترتيب درجات المرشحين." },
            { title: "ادمج محلياً بالكامل", desc: "اجمع المستندات في متصفحك. تظل جميع البيانات على محطة العمل الخاصة بك." },
            { title: "حفظ ومشاركة النتيجة", desc: "حمّل ملف المرشحين النهائي لمشاركته مع مدراء الأقسام لتقييمه." }
          ],
          faq: [
            { q: "هل يتوافق WorldPDF مع لوائح حماية البيانات والخصوصية؟", a: "نعم. نظراً لأن WorldPDF يعالج الملفات محلياً في متصفحك، فلا يتم نقل أي بيانات مرشحين إلى أي مكان، وهو ما يضمن الامتثال الكامل لقوانين الخصوصية." },
            { q: "هل يمكنني دمج خطابات التغطية مع السير الذاتية؟", a: "نعم. يمكنك إدراج خطابات التغطية والسير الذاتية للمرشحين وإعادة ترتيبها ثم جمعها في ملف واحد." },
            { q: "مع عدد السير الذاتية التي يمكنني دمجها معاً؟", a: "يمكنك دمج ما يصل إلى 15 ملفاً في وقت واحد، وهو ما يسهل فرز المتقدمين لكل وظيفة شاغرة." }
          ],
          useCases: [
            "تجميع السير الذاتية للمرشحين المختارين لعرضها على مدراء الأقسام",
            "ربط مستندات ونماذج مباشرة العمل للموظفين الجدد",
            "جمع تقييمات الأداء ومحاضر الترقيات السنوية",
            "تجميع عقود التوظيف وسجلات كشوف المرتبات الخاصة بالعمل"
          ]
        }
      }
    ]
  }
};

// Look up use case definition by tool slug, usecase slug and locale
export function getUseCaseData(toolSlug: string, usecaseSlug: string, locale: string): UseCaseContent | null {
  const toolEntry = useCaseRegistry[toolSlug];
  if (!toolEntry) return null;

  // Find audience by slug or slugAr
  const audience = toolEntry.audiences.find(
    (aud) => aud.slug === usecaseSlug || aud.slugAr === usecaseSlug || decodeURIComponent(aud.slugAr) === usecaseSlug
  );
  if (!audience) return null;

  return locale === "ar" ? audience.ar : audience.en;
}

// Helper to pre-render all static paths for programmatic use case pages
export function getAllProgrammaticPages() {
  const paths: { locale: string; category: string; tool: string; usecase: string }[] = [];
  
  // Currently, we only have programmatic pages for merge-pdf under the pdf category
  const locales = ["en", "ar"];
  const category = "pdf";
  const tool = "merge-pdf";
  
  const toolEntry = useCaseRegistry[tool];
  if (toolEntry) {
    for (const locale of locales) {
      for (const aud of toolEntry.audiences) {
        // Use English slug for english locale, Arabic slug for arabic locale
        const usecaseSlug = locale === "ar" ? aud.slugAr : aud.slug;
        paths.push({
          locale,
          category,
          tool,
          usecase: usecaseSlug,
        });
      }
    }
  }
  
  return paths;
}

