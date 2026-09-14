# PDFSmart Tools — Deployment & Quality Verification Checklist

**Deployment Target:** Cloudflare Pages (`https://pdfsmart-tools.pages.dev/`)  
**Status:** Verification Completed for Node-Executable Modules  
**Notice:** Google AdSense acceptance cannot be guaranteed. Final approval depends on domain standing, editorial quality, and Google's discretionary review policies.

---

## Part 1: Automated Validation & Pipeline Execution

- [x] **Digit Safeguard Check (`npm run check:digits`)**: Verified zero Arabic-Indic (`٠-٩`) or Persian (`۰-۹`) digits across all application source code, markdown, and public assets.
- [x] **TypeScript Verification (`npm run lint`)**: Verified 0 compiler errors or syntax defects via `tsc --noEmit`.
- [x] **Direct Engine Test Suite (`npm run test:tools`)**: Directly imported and executed 11 core engine functions from `src/lib/pdfEngine.ts` in Node.js (32 test assertions passed, 0 failed).
- [x] **Full SSG Production Build (`npm run build`)**: Generated all 28 static HTML routes with full DOM pre-rendered inside `<div id="root">`.
- [x] **Sitemap & Robots Synchronization**: Generated `sitemap.xml` (28 routes) and `robots.txt` pointing to `https://pdfsmart-tools.pages.dev/sitemap.xml`.
- [x] **Domain Migration Verification**: Zero references to obsolete preview domains in `src/`, `public/`, `dist/`, `scripts/`, or `index.html`.

---

## Part 2: Tool Verification Status

### A. Directly Tested in Node via `src/lib/pdfEngine.ts`
- [x] **Merge PDF (`mergePdfs`)**: Multi-document buffer combination and page count verification.
- [x] **Split PDF (`splitPdf`)**: Single-page and multi-page range splitting with ZIP generation.
- [x] **Rotate PDF (`rotatePdf`)**: Rotation angle manipulation (90°, 180°, 270°).
- [x] **Delete PDF Pages (`deletePdfPages`)**: Safe page removal with empty document prevention.
- [x] **Extract PDF Pages (`extractPdfPages`)**: Extraction of specified page subsets.
- [x] **Protect PDF (`protectPdf`)**: Password encryption and rejection of unauthenticated access.
- [x] **Watermark PDF (`watermarkPdf`)**: Text watermark rendering with custom rotation and opacity.
- [x] **Word to PDF (`wordToPdf`)**: DOCX text extraction via Mammoth and PDF generation via pdf-lib.
- [x] **PDF to Word (`pdfToWord`)**: Multi-page text extraction and DOCX package compilation.
- [x] **Filename Sanitization (`sanitizeFilename`)**: Traversal prevention, reserved name handling, character stripping.
- [x] **Page Range Validation (`parseAndValidatePageRanges`)**: Range syntax parsing and bounds validation.

### B. Browser Integration Tests Still Required
The following 5 tools depend on HTML5 Canvas rendering and browser-only PDF.js Web Worker contexts and require testing in a real browser:
- [ ] **Compress PDF (`compressPdf`)**: Canvas re-encoding & JPEG stream compression.
- [ ] **PDF to JPG (`pdfToJpg`)**: High-DPI canvas rendering and JPEG image generation.
- [ ] **PDF to PNG (`pdfToPng`)**: Canvas rendering with transparency preservation and PNG export.
- [ ] **JPG/PNG to PDF (`imagesToPdf`)**: Browser `HTMLImageElement` loading, dimensions, and orientation handling.
- [ ] **Unlock PDF (`unlockPdf`)**: Standard decryption works via pdf-lib; canvas rasterization fallback for encrypted object streams requires a browser.

---

## Part 3: Canonical Domain & SEO Alignment

- [x] **Domain Hierarchy**: `VITE_SITE_URL` > `SITE_URL` > `window.location.origin` > `https://pdfsmart-tools.pages.dev`.
- [x] **Canonical Tags**: All 28 static HTML files contain `<link rel="canonical">` matching the route URL on `https://pdfsmart-tools.pages.dev`.
- [x] **Open Graph & Metadata**: `<meta property="og:url">` and JSON-LD structured data use the canonical domain.
- [x] **Binary Assets**: Verified valid 512x512 PNG at `public/logo.png` and 1200x630 PNG at `public/og-image.png`.

---

## Part 4: Trust & Transparency Pages

- [x] **Privacy Policy (`/privacy-policy`)**: Clearly explains client-side local memory processing, third-party CDN assets, EmailJS form handling, and notes no active ads or CMP currently run.
- [x] **Terms of Service (`/terms`)**: Service terms, disclaimer of warranties ("as is"), and backup guidance.
- [x] **Cookie Policy (`/cookie-policy`)**: Explains essential, analytics, and advertising cookie categories.
- [x] **Disclaimer (`/disclaimer`)**: Explains utility nature of tools and user backup responsibilities.
- [x] **About Us (`/about`)**: Architectural overview of zero-upload client-side processing.
- [x] **Contact Us (`/contact`)**: Support email address and functional contact form.
