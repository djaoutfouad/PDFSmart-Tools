# PDFSmart Tools — Technical Audit & Quality Remediation

**Deployment Target:** Cloudflare Pages (`https://pdfsmart-tools.pages.dev/`)  
**Architecture:** Vite React Static Site Generation (SSG), Client-Side WebAssembly & Web APIs  
**Audit Date:** Updated September 2026  
**Auditor:** Senior Software & Quality Engineer  
**Status:** Audit & Remediation Applied (Under Continuous Review; AdSense Acceptance Cannot Be Guaranteed)

---

## 1. Important Disclaimers & Scope of Verification

1. **Deployment Environment:** The production deployment target is Cloudflare Pages at `https://pdfsmart-tools.pages.dev/`. Cloudflare Workers preview deployments are obsolete and not used as canonical fallbacks.
2. **Google AdSense Disclaimer:** AdSense acceptance cannot be guaranteed by any code audit or checklist. Google's review process evaluates domain history, organic search footprint, editorial uniqueness, traffic metrics, and discretionary editorial policies. This audit ensures technical hygiene, policy alignment, and honest presentation, but does not guarantee ad network approval.
3. **Scope of Automated Node Testing:** The Node.js test suite directly imports and invokes pure-logic functions from `src/lib/pdfEngine.ts`. However, tools relying on HTML5 Canvas rasterization and browser-specific PDF.js worker execution cannot be fully validated in headless Node.js without real browser integration tests.

---

## 2. Testing Framework & Tool Verification Breakdown

The automated test runner in `scripts/test-tools-suite.ts` directly imports and executes core functions from `src/lib/pdfEngine.ts`. The testing matrix distinguishes between what is directly verified in Node and what requires browser-level integration testing:

### A. Direct Node Engine Tests (Imported from `src/lib/pdfEngine.ts`)
The following routines are directly tested and verified in Node.js via `npm run test:tools`:
- **`mergePdfs`:** Validates combining multiple independent PDF buffers, verifies merged page count, and validates PDF binary structure.
- **`splitPdf`:** Validates splitting multi-page PDFs into individual documents packaged into a `.zip` archive via JSZip.
- **`rotatePdf`:** Validates applying 90°, 180°, and 270° orientation adjustments to PDF page dictionaries.
- **`deletePdfPages`:** Validates removing specified page indices (1-based) while preserving document integrity and remaining pages.
- **`extractPdfPages`:** Validates extracting selected pages into a new clean PDF document.
- **`protectPdf`:** Validates 128-bit encryption with user and owner passwords (`@pdfsmaller/pdf-encrypt-lite`) and verifies rejection of unauthenticated access.
- **`watermarkPdf`:** Validates stamping text watermarks with custom opacity, rotation, and positioning onto PDF pages.
- **`wordToPdf`:** Validates DOCX text parsing via Mammoth and PDF generation via pdf-lib.
- **`pdfToWord`:** Validates text stream extraction via PDF.js and DOCX package compilation (`word/document.xml`) via docx.
- **`sanitizeFilename`:** Validates stripping directory traversal (`../`), null bytes, reserved Windows device names (`CON`, `AUX`, `NUL`), and illegal characters.
- **`parseAndValidatePageRanges`:** Validates parsing comma and hyphen ranges (e.g., `1-3, 5`), bounds checking, and non-numeric rejection.

### B. Browser Integration Tests Still Required
The following 5 tools rely on HTML5 Canvas rendering contexts (`getContext('2d')`), browser `Image` elements, or browser-only PDF.js Web Worker contexts and cannot be validated in Node without synthetic approximations:
1. **`compressPdf`:** Re-encodes rendered canvas frames to JPEG byte streams with variable quality. Requires real browser execution for verification.
2. **`pdfToJpg`:** Renders PDF pages to high-DPI HTML5 Canvas elements and extracts JPEG images. Requires real browser execution.
3. **`pdfToPng`:** Renders PDF pages to canvas preserving transparency and exports PNG data URLs. Requires real browser execution.
4. **`imagesToPdf`:** Loads image files into HTMLImageElement/Canvas for dimensions, rotation, and formatting before PDF assembly. Requires real browser execution.
5. **`unlockPdf`:** Password removal for standard encryption is handled via pdf-lib; however, encrypted object stream fallbacks rely on canvas rendering. Requires real browser integration verification.

---

## 3. Canonical Domain Configuration & Precedence

All site URLs, metadata, sitemaps, and robots directives are governed by a strict four-tier precedence model implemented in `src/config/siteConfig.ts` and build scripts:

1. `VITE_SITE_URL` (Environment variable)
2. `SITE_URL` (Environment variable)
3. `window.location.origin` (Client runtime browser detection)
4. `https://pdfsmart-tools.pages.dev` (Final canonical fallback)

The old Cloudflare Workers preview domain has been completely removed from all fallbacks, meta tags, sitemaps, robots.txt, and build scripts.

---

## 4. Arabic and Persian Digit Safeguard

To ensure consistent digit representation across English-language content, a permanent validator (`scripts/verify-digits.js`) is integrated into `npm run check:digits` and the pre-build pipeline. It recursively verifies that zero Eastern Arabic-Indic (`٠-٩`) or Persian (`۰-۹`) characters exist in user-facing routes and metadata.

---

## 5. Marketing Claims & Technical Accuracy

All user-facing copy was audited to eliminate exaggerated marketing claims:
- Replaced unqualified terms ("100% secure," "military grade") with precise descriptions of local client-side processing in device RAM.
- Accurately documented that canvas-based compression renders pages visually to reduce file size.
- Documented encryption algorithms and noted that forgotten passwords cannot be recovered by the website due to zero-knowledge client-side execution.

---

## 6. Static Site Generation (SSG) & SEO Output

The production build pipeline generates 28 fully pre-rendered static HTML routes using `vite-react-ssg`:
- `dist/index.html` (Homepage)
- `dist/tools/index.html` (Tools directory)
- 15 dedicated tool routes (`dist/tools/*/index.html`)
- 1 guide directory and 4 in-depth guides (`dist/guides/*/index.html`)
- 6 regulatory and company pages (`about`, `contact`, `privacy-policy`, `terms`, `cookie-policy`, `disclaimer`)

Post-build validation (`prerender.js` and `scripts/generate-sitemap.js`) verifies that:
- Every HTML file contains full pre-rendered static DOM inside `<div id="root">`.
- `<link rel="canonical">` and `<meta property="og:url">` use the configured canonical domain (`https://pdfsmart-tools.pages.dev`).
- `public/sitemap.xml` and `public/robots.txt` contain all 28 valid routes bound to `https://pdfsmart-tools.pages.dev/sitemap.xml`.
- Zero references to obsolete preview domains exist in the generated build artifacts.
