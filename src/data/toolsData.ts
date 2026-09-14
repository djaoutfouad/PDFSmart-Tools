import { ToolDefinition } from '../types';

export const TOOL_CATEGORIES: { id: string; name: string; description: string }[] = [
  { id: 'all', name: 'All Tools', description: 'Complete collection of free PDF tools' },
  { id: 'organize', name: 'Organize PDF', description: 'Merge, split, extract, rotate and delete pages' },
  { id: 'optimize', name: 'Optimize PDF', description: 'Compress and streamline document files' },
  { id: 'convert', name: 'Convert to & from PDF', description: 'Transform PDFs into images, Word and back' },
  { id: 'security', name: 'Security & Rights', description: 'Protect, unlock, and watermark documents' },
];

export const TOOLS: ToolDefinition[] = [
  {
    id: 'merge-pdf',
    slug: 'merge-pdf',
    name: 'Merge PDF',
    category: 'organize',
    iconName: 'Combine',
    badge: 'Popular',
    popular: true,
    shortDescription: 'Combine multiple PDF files into one single organized document in your desired order.',
    longDescription: 'Merge PDF lets you combine multiple PDF documents into a unified, clean file. Drag and drop your PDFs, rearrange the sequence seamlessly, and download the combined result immediately without uploading any files to remote servers.',
    inputFormats: ['.pdf'],
    outputFormat: 'PDF',
    acceptMimeTypes: 'application/pdf',
    allowMultiple: true,
    maxFileSizeMb: 100,
    privacyNotice: 'Client-side processing. Your PDF files are merged directly inside your browser memory. No document is uploaded to our servers.',
    features: [
      'Combine multiple PDF documents in your chosen order',
      'Drag and drop reordering of files before merging',
      'Normally preserves original hyperlinks, bookmarks, vector graphics, and embedded fonts in standard cases',
      'Designed for local, fast in-browser processing without server file uploads'
    ],
    howToSteps: [
      { title: 'Upload PDF Files', description: 'Select or drag and drop two or more PDF files you wish to combine into a single document.' },
      { title: 'Arrange Document Order', description: 'Drag files up or down in the file list to set the exact sequence for your combined output.' },
      { title: 'Merge Document Streams', description: 'Click "Merge PDF" to allow our client-side engine to combine the PDF page streams in memory.' },
      { title: 'Download Merged File', description: 'Save your newly consolidated PDF file directly to your device storage.' }
    ],
    useCases: [
      'Combining monthly invoices and receipts into single comprehensive expense reports',
      'Merging individual thesis chapters, cover pages, and appendices into a complete dissertation',
      'Assembling multi-party contract scans into a single standardized legal package'
    ],
    faqs: [
      {
        question: 'Will merging decrease the visual quality of my PDF files?',
        answer: 'No. The merging process combines native PDF page streams without re-rendering or re-compressing images, preserving text and formatting.'
      },
      {
        question: 'Is there a limit on how many PDF files I can merge at once?',
        answer: 'You can merge multiple files at once. Because all processing executes locally in your browser memory, the practical limit is determined by your device available RAM.'
      },
      {
        question: 'Are my confidential documents uploaded to any remote server?',
        answer: 'No. PDFSmart Tools executes operations locally in your browser during standard operation without transmitting document contents to our servers.'
      }
    ],
    metaTitle: 'Merge PDF Online - Combine PDF Files Free & Privately | PDFSmart',
    metaDescription: 'Combine multiple PDF files into one document in seconds. Free to use, browser-based, and private with no file uploads.',
    keywords: ['merge pdf', 'combine pdf', 'join pdfs', 'merge pdf online free', 'pdf combiner']
  },
  {
    id: 'split-pdf',
    slug: 'split-pdf',
    name: 'Split PDF',
    category: 'organize',
    iconName: 'Split',
    popular: true,
    shortDescription: 'Separate one PDF into individual pages or split by custom page ranges.',
    longDescription: 'Extract specific pages or break a multi-page PDF into smaller documents. Specify custom ranges like "1-3, 5, 8-12" or split every single page into separate standalone files with instant ZIP download.',
    inputFormats: ['.pdf'],
    outputFormat: 'PDF / ZIP',
    acceptMimeTypes: 'application/pdf',
    allowMultiple: false,
    maxFileSizeMb: 100,
    privacyNotice: 'Your document is read and split locally in browser memory. No data is transferred to any cloud server.',
    features: [
      'Split by custom page ranges (e.g., 1-5, 8, 11-14)',
      'Visual page selector with instant thumbnail previews',
      'Option to export all pages as individual PDFs inside a ZIP archive',
      'Fast client-side execution without server queue waiting'
    ],
    howToSteps: [
      { title: 'Select Document', description: 'Upload the multi-page PDF document you want to split or extract from.' },
      { title: 'Define Ranges or Pages', description: 'Choose your desired page ranges (e.g. 1-3, 5) or select individual page thumbnails.' },
      { title: 'Process Split Streams', description: 'Click "Split PDF" to extract the selected pages into independent PDF structures.' },
      { title: 'Save Separated Files', description: 'Download your separated PDF files individually or as a single convenient ZIP bundle.' }
    ],
    useCases: [
      'Extracting specific chapters or reference sections from large technical manuals',
      'Isolating a signed contract page from a lengthy multi-page agreement',
      'Dividing bulk scanned receipts into individual receipts for accounting filing'
    ],
    faqs: [
      {
        question: 'How do I specify page ranges for splitting?',
        answer: 'You can enter comma-separated numbers and ranges like "1-3, 5, 7-10". You can also choose to extract each page into a separate individual file.'
      },
      {
        question: 'What format will I receive if I split into multiple files?',
        answer: 'When multiple output files are generated, they are neatly packaged into a standard .zip archive for a convenient single-click download.'
      },
      {
        question: 'Does splitting a PDF damage original links or text searchability?',
        answer: 'In standard cases, pages are extracted with their native vector instructions, normally preserving text searchability, fonts, and internal vector elements.'
      }
    ],
    metaTitle: 'Split PDF Online - Extract Pages Free & Securely | PDFSmart',
    metaDescription: 'Split PDF files into individual pages or custom ranges. Free, instant, and private browser-based PDF splitter designed to process locally.',
    keywords: ['split pdf', 'separate pdf pages', 'extract pdf', 'pdf splitter online free']
  },
  {
    id: 'compress-pdf',
    slug: 'compress-pdf',
    name: 'Compress PDF',
    category: 'optimize',
    iconName: 'Minimize2',
    badge: 'Essential',
    popular: true,
    shortDescription: 'Reduce PDF file size by rendering pages at optimized compression profiles directly in your browser.',
    longDescription: 'Client-side compression optimizes file size by rasterizing document pages into high-efficiency image layers at user-selected DPI profiles. Text is visually sharp but becomes an image layer, making heavy documents lightweight for email attachments and web sharing.',
    inputFormats: ['.pdf'],
    outputFormat: 'PDF',
    acceptMimeTypes: 'application/pdf',
    allowMultiple: false,
    maxFileSizeMb: 100,
    privacyNotice: 'PDF optimization runs on your local machine using intelligent canvas downsampling and stream compression. Processing is performed in-browser during standard operation.',
    features: [
      'Three selectable compression profiles: High, Recommended, and Light',
      'Client-side rasterization downsamples heavy graphics without server uploads',
      'Optimizes document size for email attachments and portal uploads',
      'Live compression analytics showing original vs optimized file size'
    ],
    howToSteps: [
      { title: 'Upload Heavy PDF', description: 'Select the large PDF file you need to compress for email or online uploading.' },
      { title: 'Select Compression Level', description: 'Choose between Maximum compression (72 DPI), Recommended balance (~100 DPI), or High quality (~120 DPI).' },
      { title: 'Optimize Document', description: 'Click "Compress PDF" to let your browser optimize resolution and compress graphic streams.' },
      { title: 'Download Smaller PDF', description: 'Review the file size reduction analytics and download your optimized lightweight PDF.' }
    ],
    useCases: [
      'Reducing job applications and resumes to fit strict 2MB job portal file limits',
      'Compressing scanned documents and forms before sending via email attachments',
      'Optimizing multi-page reports for fast web distribution and reduced mobile data consumption'
    ],
    faqs: [
      {
        question: 'How does client-side compression work?',
        answer: 'Our engine renders each PDF page to an optimized visual canvas at target resolution and recompiles the pages into a compact PDF using high-efficiency image compression directly in your browser.'
      },
      {
        question: 'Will text remain selectable after compression?',
        answer: 'Because client-side compression rasterizes pages into optimized visual images to achieve significant file size reductions without server processing, text is rendered visually as an image and is not searchable or selectable in the compressed output.'
      },
      {
        question: 'Which compression level should I choose?',
        answer: 'For standard text and scanned documents, the Recommended level offers the best balance between small file size and crisp readability.'
      }
    ],
    metaTitle: 'Compress PDF Online - Reduce PDF File Size Free | PDFSmart',
    metaDescription: 'Reduce PDF file size online with client-side compression. Fast, free, browser-based optimization tool with instant download.',
    keywords: ['compress pdf', 'reduce pdf size', 'shrink pdf', 'pdf compressor online free']
  },
  {
    id: 'pdf-to-jpg',
    slug: 'pdf-to-jpg',
    name: 'PDF to JPG',
    category: 'convert',
    iconName: 'Image',
    popular: true,
    shortDescription: 'Convert every PDF page into crisp, high-resolution JPG images in seconds.',
    longDescription: 'Transform PDF documents into crisp JPEG images. Extract every page as a high-density image or download all converted pages neatly packaged into a single ZIP file.',
    inputFormats: ['.pdf'],
    outputFormat: 'JPG / ZIP',
    acceptMimeTypes: 'application/pdf',
    allowMultiple: false,
    maxFileSizeMb: 80,
    privacyNotice: 'Each PDF page is rendered to an HTML5 canvas in your browser and exported as JPEG. No server upload occurs.',
    features: [
      'High-DPI page rendering for ultra-clear text and graphic output',
      'Selectable output quality (Standard, High, Ultra)',
      'Instant preview thumbnails of all converted pages',
      'One-click ZIP download for multi-page documents'
    ],
    howToSteps: [
      { title: 'Upload PDF', description: 'Choose the PDF document you wish to convert into JPEG image files.' },
      { title: 'Select Quality Preset', description: 'Choose your desired image resolution and quality settings for rendering.' },
      { title: 'Render Pages to JPG', description: 'Our HTML5 canvas engine renders each PDF page into high-definition JPEG format.' },
      { title: 'Download Images', description: 'Download individual JPG pages or grab all pages in a single ZIP file.' }
    ],
    useCases: [
      'Extracting graphics or slides from PDF presentations to post on social media and slides',
      'Embedding document previews into website articles, blogs, and marketing newsletters',
      'Importing PDF pages into photo editing or graphic design software'
    ],
    faqs: [
      {
        question: 'What DPI resolution are the converted images?',
        answer: 'By default, pages render at 150-300 DPI equivalent resolution, providing crisp, print-ready JPEG output suitable for displays and printing.'
      },
      {
        question: 'Can I download only a specific page instead of all pages?',
        answer: 'Yes. After conversion, you can click on any individual page thumbnail to download that specific JPG directly to your computer.'
      },
      {
        question: 'Is there any watermark added to the converted JPG images?',
        answer: 'No. PDFSmart Tools does not add watermarks or branding to your converted images. Your files retain their clean appearance.'
      }
    ],
    metaTitle: 'PDF to JPG Converter - Convert PDF to Images Free | PDFSmart',
    metaDescription: 'Convert PDF pages into high-quality JPG images for free. Fast, client-side conversion with zip download option.',
    keywords: ['pdf to jpg', 'convert pdf to image', 'pdf to jpeg', 'save pdf as picture']
  },
  {
    id: 'jpg-to-pdf',
    slug: 'jpg-to-pdf',
    name: 'JPG to PDF',
    category: 'convert',
    iconName: 'FileSpreadsheet',
    popular: true,
    shortDescription: 'Convert JPG, JPEG, and WebP images into a polished, professional PDF document.',
    longDescription: 'Turn your JPG photos, scanned documents, and graphic images into a consolidated PDF. Customize page orientation, margins, and paper sizing (A4, US Letter, or Fit to Image) with ease.',
    inputFormats: ['.jpg', '.jpeg', '.webp'],
    outputFormat: 'PDF',
    acceptMimeTypes: 'image/jpeg,image/jpg,image/webp',
    allowMultiple: true,
    maxFileSizeMb: 80,
    privacyNotice: 'Images are loaded into browser canvas buffers and formatted directly into a standard PDF binary.',
    features: [
      'Batch upload multiple images and arrange sequence with drag & drop',
      'Configurable page orientation (Portrait, Landscape, Auto-Detect)',
      'Adjustable margins (No margin, Small, Large) and page standard sizes (A4, Letter)',
      'Direct image embedding preserves original photograph details'
    ],
    howToSteps: [
      { title: 'Select Image Files', description: 'Upload one or multiple JPG, JPEG, or WebP photo files.' },
      { title: 'Configure Page Layout', description: 'Set page orientation, margin spacing, paper size, and rearrange image order.' },
      { title: 'Compile PDF Document', description: 'Click "Convert to PDF" to embed images into standard PDF page streams.' },
      { title: 'Download New PDF', description: 'Save your newly created multi-page PDF document to your device.' }
    ],
    useCases: [
      'Creating a clean PDF portfolio from high-resolution photograph files and scans',
      'Compiling phone camera photos of documents into official submission files',
      'Converting whiteboard notes and design mockups into shareable PDFs'
    ],
    faqs: [
      {
        question: 'Can I mix portrait and landscape images in the same PDF?',
        answer: 'Yes. Selecting "Auto Orientation" will automatically orient each PDF page to match the natural aspect ratio of each photo.'
      },
      {
        question: 'Will my images be re-compressed or lose sharpness?',
        answer: 'In standard cases, original JPEG streams are embedded directly into the PDF structure, minimizing quality loss and avoiding unnecessary re-encoding.'
      },
      {
        question: 'How many images can I convert at once?',
        answer: 'You can upload dozens of image files simultaneously. The tool compiles them in sequential order directly in your browser.'
      }
    ],
    metaTitle: 'JPG to PDF Converter - Convert Images to PDF Free | PDFSmart',
    metaDescription: 'Convert JPG, JPEG, and WebP images into a single professional PDF document. Free, secure, client-side conversion.',
    keywords: ['jpg to pdf', 'image to pdf', 'convert photo to pdf', 'jpeg to pdf online']
  },
  {
    id: 'pdf-to-word',
    slug: 'pdf-to-word',
    name: 'PDF to Word',
    category: 'convert',
    iconName: 'FileText',
    badge: 'Editable',
    popular: true,
    shortDescription: 'Extract text and layout from PDF files into an editable Microsoft Word (.docx) document.',
    longDescription: 'Convert PDF documents into editable Microsoft Word DOCX files. The browser engine extracts embedded digital text streams, paragraphs, and headings directly in memory. Note: Scanned image PDFs without selectable text require OCR (Optical Character Recognition), which is not performed locally.',
    inputFormats: ['.pdf'],
    outputFormat: 'DOCX',
    acceptMimeTypes: 'application/pdf',
    allowMultiple: false,
    maxFileSizeMb: 50,
    privacyNotice: 'Document text parsing and Word DOCX serialization execute entirely within your browser runtime.',
    features: [
      'Extracts embedded digital text streams into standard DOCX paragraphs and headings',
      'Preserves paragraph breaks, heading structures, and text alignment',
      'Enables full editing in Word, Google Docs, or LibreOffice',
      'No server uploads ensures sensitive contracts stay confidential'
    ],
    howToSteps: [
      { title: 'Upload PDF Document', description: 'Select the PDF file you want to make editable in Microsoft Word.' },
      { title: 'Extract Text & Layout', description: 'Our browser engine extracts text, paragraphs, and font styling coordinates.' },
      { title: 'Reconstruct DOCX File', description: 'The tool structures the extracted text into standard OpenXML Word (.docx) syntax.' },
      { title: 'Download Editable Word', description: 'Download your editable Word document ready for editing in Word or Google Docs.' }
    ],
    useCases: [
      'Updating old resumes or agreements when the original source file was lost',
      'Repurposing published PDF articles or research into editable draft documents',
      'Extracting text tables and reports for reformatting in Word processing tools'
    ],
    faqs: [
      {
        question: 'Can I edit the converted document in Google Docs or Microsoft Word?',
        answer: 'Yes. The output is a standard OpenXML (.docx) file fully compatible with Microsoft Word, Google Docs, Apple Pages, and LibreOffice.'
      },
      {
        question: 'Are scanned image PDFs supported for Word conversion?',
        answer: 'Our tool extracts all embedded digital text streams. For best results, use digital native PDFs rather than pure scanned camera photos.'
      },
      {
        question: 'Is my document privacy protected during Word conversion?',
        answer: 'Yes. All text parsing and DOCX file generation happen inside your browser. No document data is ever sent to external servers.'
      }
    ],
    metaTitle: 'PDF to Word Converter - Convert PDF to DOCX Free | PDFSmart',
    metaDescription: 'Convert PDF files into editable Microsoft Word (.docx) documents. Free, private, and runs entirely in your browser.',
    keywords: ['pdf to word', 'pdf to docx', 'convert pdf to word online', 'editable pdf to word']
  },
  {
    id: 'word-to-pdf',
    slug: 'word-to-pdf',
    name: 'Word to PDF',
    category: 'convert',
    iconName: 'FileCheck',
    popular: true,
    shortDescription: 'Convert Microsoft Word (.docx) documents into clean, widely readable PDF files.',
    longDescription: 'Convert Word documents (.docx) into standardized PDF files. Ensure your layout, fonts, and styling look consistent across operating systems, smartphones, and printers.',
    inputFormats: ['.docx'],
    outputFormat: 'PDF',
    acceptMimeTypes: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    allowMultiple: false,
    maxFileSizeMb: 50,
    privacyNotice: 'Word XML parsing and PDF generation happen locally in your browser during standard operation without server file transfer.',
    features: [
      'Converts modern .docx files to standard PDF format',
      'Preserves typography, headings, bullet lists, and layout spacing',
      'Standardized A4/Letter page output with pagination',
      'Fast, offline-ready client-side execution'
    ],
    howToSteps: [
      { title: 'Upload Word Document', description: 'Select the .docx file you wish to turn into a read-only standardized PDF.' },
      { title: 'Parse Document Hierarchy', description: 'Our parser analyzes XML structure, styles, headings, and paragraph blocks.' },
      { title: 'Render Vector Pages', description: 'The tool compiles the document contents into standardized PDF pages.' },
      { title: 'Download Finished PDF', description: 'Download your formatted PDF document.' }
    ],
    useCases: [
      'Locking resumes and CVs before submitting to employers to prevent format shifts',
      'Converting business proposals into read-only client presentation files',
      'Preparing academic papers, essays, and reports for official archival submission'
    ],
    faqs: [
      {
        question: 'Why should I convert Word documents to PDF?',
        answer: 'PDF helps ensure that fonts, margins, and formatting appear identically on every operating system, mobile phone, and printer without accidental edits.'
      },
      {
        question: 'Does this tool support older .doc files?',
        answer: 'We support standard .docx files (Office 2007 to modern 365). If you have an older .doc file, save it as .docx first in Word before converting.'
      },
      {
        question: 'Will formatting and bullet points be maintained in the PDF?',
        answer: 'Yes. Our converter maps headings, paragraph spacing, and lists into structured PDF text blocks accurately.'
      }
    ],
    metaTitle: 'Word to PDF Converter - Convert DOCX to PDF Free | PDFSmart',
    metaDescription: 'Convert Microsoft Word DOCX documents into clean PDF files online for free. Secure, instant client-side conversion.',
    keywords: ['word to pdf', 'docx to pdf', 'convert docx to pdf online', 'save word as pdf']
  },
  {
    id: 'pdf-to-png',
    slug: 'pdf-to-png',
    name: 'PDF to PNG',
    category: 'convert',
    iconName: 'Sparkles',
    shortDescription: 'Convert PDF pages into high-fidelity PNG images with transparent or crisp white backgrounds.',
    longDescription: 'Convert PDF documents into crisp PNG image files. Ideal for graphic designers, presentations, and digital media where uncompressed image sharpness is paramount.',
    inputFormats: ['.pdf'],
    outputFormat: 'PNG / ZIP',
    acceptMimeTypes: 'application/pdf',
    allowMultiple: false,
    maxFileSizeMb: 80,
    privacyNotice: 'Direct canvas-to-PNG rendering inside your browser sandbox. Processed locally.',
    features: [
      'PNG image compression preserving line art and graphic details',
      'High-resolution rendering for clear text readability',
      'Individual page download or batch ZIP package',
      'Designed for local client-side execution'
    ],
    howToSteps: [
      { title: 'Select PDF Document', description: 'Upload the PDF document you want to convert into PNG format.' },
      { title: 'Render High-DPI Pages', description: 'Our canvas engine renders each page at crisp resolution.' },
      { title: 'Export PNG Images', description: 'Pages are converted into high-fidelity PNG image streams.' },
      { title: 'Download Single or ZIP', description: 'Save specific individual pages or download all converted pages in a ZIP archive.' }
    ],
    useCases: [
      'Extracting diagrams, architectural schematics, and vector art from PDFs without JPEG artifacts',
      'Creating high-clarity web illustrations, manuals, and documentation screenshots',
      'Converting design proofs into clean image assets for digital publications'
    ],
    faqs: [
      {
        question: 'What is the main difference between PDF to JPG and PDF to PNG?',
        answer: 'PNG compression preserves fine text, diagrams, and sharp graphic lines clearly without JPEG compression artifacts or pixel blur.'
      },
      {
        question: 'Can I export multi-page PDFs at once?',
        answer: 'Yes. Every page is rendered sequentially and packaged into a convenient ZIP archive for quick download.'
      },
      {
        question: 'Are there any hidden size limits or subscription fees?',
        answer: 'No. PDFSmart Tools is free to use and client-side with no subscriptions or registration required.'
      }
    ],
    metaTitle: 'PDF to PNG Converter - Convert PDF to PNG Free | PDFSmart',
    metaDescription: 'Convert PDF pages to PNG images for free. Fast, high-resolution rendering processed securely in your browser.',
    keywords: ['pdf to png', 'convert pdf to png', 'export pdf pages as png', 'pdf to picture']
  },
  {
    id: 'png-to-pdf',
    slug: 'png-to-pdf',
    name: 'PNG to PDF',
    category: 'convert',
    iconName: 'Layers',
    shortDescription: 'Convert PNG graphics, scans, and transparent images into a clean PDF document.',
    longDescription: 'Merge and convert multiple PNG images into a clean, formatted PDF. Re-order your images, configure paper size, and choose optimal orientation and margin settings.',
    inputFormats: ['.png'],
    outputFormat: 'PDF',
    acceptMimeTypes: 'image/png',
    allowMultiple: true,
    maxFileSizeMb: 80,
    privacyNotice: 'PNG buffers are assembled directly into standard PDF pages on your client device.',
    features: [
      'Combine multiple PNG files into one seamless PDF',
      'Customizable page margins, page sizes (A4, Letter), and auto-orientation',
      'Preserves crisp typography and sharp graphic details',
      'Private, fast client-side conversion'
    ],
    howToSteps: [
      { title: 'Upload PNG Files', description: 'Select one or more PNG image files from your computer or phone.' },
      { title: 'Customize Document Layout', description: 'Set page order, orientation, paper dimensions, and margin spacing.' },
      { title: 'Generate PDF Pages', description: 'Click "Convert to PDF" to compile the PNG image streams into standard PDF pages.' },
      { title: 'Download Compiled PDF', description: 'Download your newly compiled multi-page PDF document.' }
    ],
    useCases: [
      'Compiling screenshots and UI designs into client-ready presentation packets',
      'Converting transparent logos or certificate graphics into printable PDFs',
      'Grouping scanned ID cards and receipts into a single organized document'
    ],
    faqs: [
      {
        question: 'How are transparent PNG backgrounds handled in PDF output?',
        answer: 'Transparent PNG areas are rendered cleanly onto a neutral white background standard for printed PDF documents.'
      },
      {
        question: 'Can I reorder the PNG images before creating the PDF?',
        answer: 'Yes. You can drag and drop images to set the exact page order before generating the final PDF.'
      },
      {
        question: 'Does this converter preserve image resolution?',
        answer: 'Yes. The full pixel data of each PNG is embedded into the PDF without downsampling, maintaining original quality.'
      }
    ],
    metaTitle: 'PNG to PDF Converter - Convert PNG Images to PDF Free | PDFSmart',
    metaDescription: 'Convert PNG images into a polished PDF document online. Free, fast, and client-side with no uploads.',
    keywords: ['png to pdf', 'convert png to pdf', 'image to pdf online', 'combine pngs into pdf']
  },
  {
    id: 'rotate-pdf',
    slug: 'rotate-pdf',
    name: 'Rotate PDF',
    category: 'organize',
    iconName: 'RotateCw',
    shortDescription: 'Rotate PDF pages 90°, 180°, or 270° clockwise and save permanent orientation changes.',
    longDescription: 'Fix upside-down or sideways PDF scans easily. Rotate all pages together with a single click, or rotate specific individual pages independently with visual thumbnail controls.',
    inputFormats: ['.pdf'],
    outputFormat: 'PDF',
    acceptMimeTypes: 'application/pdf',
    allowMultiple: false,
    maxFileSizeMb: 100,
    privacyNotice: 'Page orientation metadata is updated locally without altering visual document quality.',
    features: [
      'Rotate all pages at once (90°, 180°, 270°)',
      'Rotate individual pages independently via interactive thumbnail controls',
      'Direct metadata transformation without re-compression',
      'Permanent orientation saved for all PDF readers and printers'
    ],
    howToSteps: [
      { title: 'Upload PDF Document', description: 'Select the PDF document containing misoriented or sideways pages.' },
      { title: 'Rotate Specific or All Pages', description: 'Click "Rotate All" or use the rotation arrows on individual page thumbnails.' },
      { title: 'Apply Orientation Tags', description: 'Click "Save Rotated PDF" to update the rotation metadata in the PDF stream.' },
      { title: 'Download Corrected PDF', description: 'Save your permanently oriented PDF file to your computer.' }
    ],
    useCases: [
      'Correcting documents scanned upside down or sideways on an office sheet scanner',
      'Aligning landscape spreadsheets mixed inside a portrait business report',
      'Fixing mobile camera scan orientation prior to official filing'
    ],
    faqs: [
      {
        question: 'Will rotating my PDF reduce document or image quality?',
        answer: 'No. The rotation updates standard page orientation tags without re-encoding, avoiding image re-compression or text degradation.'
      },
      {
        question: 'Is the page rotation permanent in other PDF viewers?',
        answer: 'Yes. The rotation parameters are written directly into the PDF standard dictionary, so the document will appear correctly in Adobe Acrobat, browsers, and printouts.'
      },
      {
        question: 'Can I rotate only page 2 and page 5 without altering the rest?',
        answer: 'Yes. You can rotate individual pages independently using the controls on each page preview thumbnail.'
      }
    ],
    metaTitle: 'Rotate PDF Online - Permanently Rotate PDF Pages Free | PDFSmart',
    metaDescription: 'Rotate PDF pages 90, 180, or 270 degrees online. Free, permanent, and private browser-based PDF page rotator.',
    keywords: ['rotate pdf', 'rotate pdf pages', 'turn pdf upside down', 'fix pdf orientation']
  },
  {
    id: 'delete-pdf-pages',
    slug: 'delete-pdf-pages',
    name: 'Delete PDF Pages',
    category: 'organize',
    iconName: 'Trash2',
    shortDescription: 'Remove unwanted, blank, or duplicate pages from your PDF with visual selection.',
    longDescription: 'Quickly clean up PDF documents by removing unwanted pages. View live page thumbnails, click to select pages to discard, and generate a sanitized, streamlined PDF in seconds.',
    inputFormats: ['.pdf'],
    outputFormat: 'PDF',
    acceptMimeTypes: 'application/pdf',
    allowMultiple: false,
    maxFileSizeMb: 100,
    privacyNotice: 'Page removal is performed strictly in browser memory without sending data over the network.',
    features: [
      'Interactive visual thumbnail grid for easy page selection',
      'Select individual pages or batch select even/odd/ranges',
      'Instant live preview of remaining document structure',
      'Clean page extraction and PDF reconstruction'
    ],
    howToSteps: [
      { title: 'Upload PDF Document', description: 'Select the PDF file from which you want to remove unwanted or blank pages.' },
      { title: 'Select Pages to Remove', description: 'Click the trash icon or check the page thumbnails you wish to delete.' },
      { title: 'Reconstruct Clean PDF', description: 'Click "Apply & Download" to assemble the retained pages into a clean document.' },
      { title: 'Download Trimmed File', description: 'Save your streamlined, sanitized PDF document.' }
    ],
    useCases: [
      'Removing blank trailing pages caused by print drivers or scanner automatic feeders',
      'Omitting confidential appendices before sharing a report with external clients',
      'Deleting duplicate pages from multi-source merged document files'
    ],
    faqs: [
      {
        question: 'Can I undo a page deletion before downloading the final file?',
        answer: 'Yes. You can toggle page selections on and off in the interactive thumbnail grid before clicking the final download button.'
      },
      {
        question: 'Does deleting pages affect bookmarks and page numbering?',
        answer: 'The remaining pages are re-indexed cleanly. Original vector graphics, text formatting, and page assets are preserved.'
      },
      {
        question: 'Is there a limit on how many pages I can delete?',
        answer: 'No limit. You can delete single pages, multiple selected pages, or entire page ranges effortlessly.'
      }
    ],
    metaTitle: 'Delete PDF Pages Online - Remove Pages from PDF Free | PDFSmart',
    metaDescription: 'Delete unwanted pages from PDF files online. Free, visual, and private tool to remove blank or duplicate pages.',
    keywords: ['delete pdf pages', 'remove pages from pdf', 'delete page from pdf online', 'trim pdf']
  },
  {
    id: 'extract-pdf-pages',
    slug: 'extract-pdf-pages',
    name: 'Extract PDF Pages',
    category: 'organize',
    iconName: 'Copy',
    shortDescription: 'Select and extract specific pages from a PDF into a new standalone document.',
    longDescription: 'Create a new, targeted PDF containing only the exact pages you need. Select pages visually from thumbnail cards or enter a page range to produce a clean new document instantly.',
    inputFormats: ['.pdf'],
    outputFormat: 'PDF',
    acceptMimeTypes: 'application/pdf',
    allowMultiple: false,
    maxFileSizeMb: 100,
    privacyNotice: 'Selected pages are copied into a new PDF document strictly inside your browser environment.',
    features: [
      'Visual thumbnail grid selection or textual range input (e.g. 2, 4-7, 10)',
      'Extract pages into a single concise PDF document',
      'In standard cases, preserves original text sharpness, fonts, and vector elements',
      'Fast client-side operation designed for local processing without file uploads'
    ],
    howToSteps: [
      { title: 'Upload Source PDF', description: 'Choose the source PDF document containing the specific pages you need.' },
      { title: 'Select Desired Pages', description: 'Click page thumbnails or type page numbers to select the exact pages to keep.' },
      { title: 'Extract Page Stream', description: 'Click "Extract Pages" to copy the selected page objects into a new PDF container.' },
      { title: 'Download Focused PDF', description: 'Download your new standalone PDF document containing only your chosen pages.' }
    ],
    useCases: [
      'Extracting an executive summary or signature page from a 100-page corporate report',
      'Isolating relevant lecture slides from a full university semester slide deck',
      'Extracting specific financial statements from multi-year tax filings'
    ],
    faqs: [
      {
        question: 'What is the difference between Split PDF and Extract PDF Pages?',
        answer: 'Split PDF can break an entire document into multiple separate files, whereas Extract PDF creates one concise new document containing only your selected pages.'
      },
      {
        question: 'Are extracted pages altered in quality or formatting?',
        answer: 'In standard cases, pages are copied directly as native PDF page dictionaries, maintaining original text, vectors, images, and fonts.'
      },
      {
        question: 'Can I extract non-consecutive pages like 1, 5, and 12?',
        answer: 'Yes! You can choose any combination of non-consecutive pages and they will be assembled in order in your output PDF.'
      }
    ],
    metaTitle: 'Extract PDF Pages Online - Save Selected Pages Free | PDFSmart',
    metaDescription: 'Extract specific pages from a PDF into a new document. Free, easy visual selector, and private browser processing.',
    keywords: ['extract pdf pages', 'save specific pdf pages', 'select pages from pdf', 'pdf extractor']
  },
  {
    id: 'protect-pdf',
    slug: 'protect-pdf',
    name: 'Protect PDF',
    category: 'security',
    iconName: 'Lock',
    badge: 'Security',
    popular: true,
    shortDescription: 'Encrypt your PDF with standard password security directly in your browser.',
    longDescription: 'Protect confidential PDF documents with standard client-side password encryption. Prevent unauthorized viewing, set custom user passwords, and encrypt sensitive documents completely in local browser memory without server uploads.',
    inputFormats: ['.pdf'],
    outputFormat: 'PDF',
    acceptMimeTypes: 'application/pdf',
    allowMultiple: false,
    maxFileSizeMb: 100,
    privacyNotice: 'Standard 128-bit PDF encryption executes in your browser memory during standard operation, without transferring files or passwords to our servers.',
    features: [
      'Standard 128-bit PDF password encryption processed locally',
      'Real-time password validation and security strength indicator',
      'Broad compatibility with Adobe Acrobat, Chrome, and standard PDF readers (compatibility may vary by PDF structure and reader)',
      'Local in-browser processing helps protect your files from external network transmission'
    ],
    howToSteps: [
      { title: 'Upload PDF Document', description: 'Select the PDF file you wish to secure with a password.' },
      { title: 'Set Document Password', description: 'Enter and confirm your chosen password to restrict document access.' },
      { title: 'Encrypt Document', description: 'Click "Protect & Encrypt PDF" to apply standard client-side encryption in browser memory.' },
      { title: 'Download Secure PDF', description: 'Save your newly encrypted, password-protected PDF directly to your device.' }
    ],
    useCases: [
      'Securing payroll slips, tax forms, and financial statements before sending via email',
      'Restricting access to confidential legal agreements, NDAs, and corporate briefs',
      'Protecting personal records, identification scans, and proprietary research files'
    ],
    faqs: [
      {
        question: 'How does client-side PDF encryption work?',
        answer: 'Our engine compiles and encrypts the PDF document binary directly inside your browser memory using standard PDF encryption algorithms. During standard operation, no file or password data is transmitted to our servers.'
      },
      {
        question: 'Will recipients need special software to open the protected PDF?',
        answer: 'No. The output uses standard PDF password specifications and can be opened with any official PDF reader, including Adobe Acrobat, Google Chrome, Apple Preview, and mobile PDF viewers, by entering your password.'
      },
      {
        question: 'What happens if I forget the password I set?',
        answer: 'Because PDFSmart Tools operates locally and does not store your files or passwords on any server, forgotten passwords cannot be recovered. Please ensure you keep a secure record of your password.'
      }
    ],
    metaTitle: 'Protect PDF Online - Password Protect PDF Free & Privately | PDFSmart',
    metaDescription: 'Password protect and encrypt PDF files online for free. Private, browser-based standard PDF encryption with no server uploads.',
    keywords: ['protect pdf', 'password protect pdf', 'encrypt pdf online', 'secure pdf free']
  },
  {
    id: 'unlock-pdf',
    slug: 'unlock-pdf',
    name: 'Unlock PDF',
    category: 'security',
    iconName: 'Unlock',
    badge: 'Security',
    shortDescription: 'Authorized password decryption and restriction removal for PDF documents.',
    longDescription: 'Remove copy restrictions, printing limits, and authorized passwords from your PDF files. Supply your document password to export a clean, unrestricted PDF copy directly in your browser memory.',
    inputFormats: ['.pdf'],
    outputFormat: 'PDF',
    acceptMimeTypes: 'application/pdf',
    allowMultiple: false,
    maxFileSizeMb: 100,
    privacyNotice: 'Authorized PDF decryption and restriction removal execute in local browser memory during standard operation.',
    features: [
      'Removes viewer printing and content-copy restrictions for authorized users',
      'Exports clean, unrestricted PDF copies directly in browser memory',
      'Normally preserves original vector graphics, text formatting, and images depending on document structure and permissions',
      'Client-side processing designed to execute locally without server file uploads'
    ],
    howToSteps: [
      { title: 'Upload Secured PDF', description: 'Select the password-protected or restricted PDF document.' },
      { title: 'Enter Password', description: 'Provide the authorized document password to permit client-side decryption.' },
      { title: 'Decrypt & Strip Limits', description: 'Click "Unlock PDF" to decipher the stream and remove permission restrictions.' },
      { title: 'Download Unrestricted PDF', description: 'Download your clean, unlocked PDF file ready for editing, printing, and sharing.' }
    ],
    useCases: [
      'Removing print and copy locks from invoices or tax documents for business archives',
      'Creating an unencrypted working copy of your own password-protected agreements',
      'Consolidating locked PDF statements into unrestricted master records'
    ],
    faqs: [
      {
        question: 'Do I need to know the document password to unlock it?',
        answer: 'Yes. Authorized decryption requires providing the document password. This allows our client-side engine to decrypt the streams and export a clean, permanently unlocked copy.'
      },
      {
        question: 'Are my passwords or documents sent over the internet?',
        answer: 'No. Passwords and documents are processed entirely within your computer browser memory during standard operation.'
      },
      {
        question: 'Will unlocking affect the document quality?',
        answer: 'In standard cases, vector pages, text layers, and embedded assets are preserved. However, the exact output depends on the PDF internal structure, encryption scheme, and parsing route used.'
      }
    ],
    metaTitle: 'Unlock PDF Online - Remove Password & Restrictions Free | PDFSmart',
    metaDescription: 'Unlock password-protected PDF documents online for free. Remove permissions and restrictions locally in your browser.',
    keywords: ['unlock pdf', 'remove pdf password', 'pdf restriction remover', 'decrypt pdf online']
  },
  {
    id: 'watermark-pdf',
    slug: 'watermark-pdf',
    name: 'Watermark PDF',
    category: 'security',
    iconName: 'Stamp',
    badge: 'Customizable',
    popular: true,
    shortDescription: 'Stamp customized text or image watermarks onto PDF pages with custom position and opacity.',
    longDescription: 'Add customized text or image watermarks to all or selected pages of your PDF document. Stamp "CONFIDENTIAL", "DRAFT", company logos, or custom copyright marks with full control over opacity, rotation, color, and positioning.',
    inputFormats: ['.pdf'],
    outputFormat: 'PDF',
    acceptMimeTypes: 'application/pdf',
    allowMultiple: false,
    maxFileSizeMb: 100,
    privacyNotice: 'Watermark stamping is layered on top of vector page objects in your browser runtime.',
    features: [
      'Custom text watermarks with custom font size, color, opacity, and rotation angle',
      'Pre-configured templates: CONFIDENTIAL, DRAFT, DO NOT COPY, APPROVED',
      'Selectable positioning: Center diagonal, Header, Footer, or Tiled',
      'Live interactive preview before applying watermark'
    ],
    howToSteps: [
      { title: 'Upload PDF Document', description: 'Select the PDF file you wish to stamp with a watermark or copyright tag.' },
      { title: 'Customize Watermark Text & Style', description: 'Type your custom watermark text and adjust angle, opacity, color, and positioning.' },
      { title: 'Render Watermark Vector Layer', description: 'Click "Apply Watermark" to overlay the watermark vector layer onto every page.' },
      { title: 'Download Watermarked PDF', description: 'Save your newly stamped and protected PDF document.' }
    ],
    useCases: [
      'Stamping "CONFIDENTIAL" on trade secret documents, financial statements, and proposals',
      'Marking manuscript drafts or student papers as "DRAFT - DO NOT COPY"',
      'Adding copyright tags and corporate branding to distributable PDF presentations'
    ],
    faqs: [
      {
        question: 'Can the watermark be easily erased or removed by viewers?',
        answer: 'The watermark is permanently embedded as vector graphics into the PDF document stream, making it visible across all PDF viewers, operating systems, and physical prints.'
      },
      {
        question: 'Can I adjust the transparency so text underneath remains readable?',
        answer: 'Yes. You can adjust the opacity slider (e.g. 15% to 40%) so the underlying document text and graphics remain completely legible.'
      },
      {
        question: 'Can I choose between diagonal and horizontal watermark text?',
        answer: 'Yes. You can set diagonal rotation (e.g. 45 degrees) for full-page coverage or 0 degrees for clean horizontal stamps.'
      }
    ],
    metaTitle: 'Watermark PDF Online - Add Text & Stamp to PDF Free | PDFSmart',
    metaDescription: 'Add custom text watermarks, stamps, and copyright marks to PDF documents for free. Private, customizable, client-side tool.',
    keywords: ['watermark pdf', 'add watermark to pdf', 'stamp pdf confidential', 'pdf watermark tool online free']
  }
];

export function getToolBySlug(slug: string): ToolDefinition | undefined {
  return TOOLS.find((t) => t.slug === slug);
}

export function getToolsByCategory(category: string): ToolDefinition[] {
  if (category === 'all') return TOOLS;
  return TOOLS.filter((t) => t.category === category);
}

export function getPopularTools(): ToolDefinition[] {
  return TOOLS.filter((t) => t.popular);
}
