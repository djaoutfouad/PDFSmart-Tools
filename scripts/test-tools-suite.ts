/**
 * scripts/test-tools-suite.ts
 * 
 * DIRECT ENGINE TEST SUITE FOR PDFSMART TOOLS
 * 
 * Imports and directly tests the real core functions exported by:
 *   src/lib/pdfEngine.ts
 * 
 * Tests the following core engine modules directly in Node.js:
 *   1. mergePdfs
 *   2. splitPdf
 *   3. rotatePdf
 *   4. deletePdfPages
 *   5. extractPdfPages
 *   6. protectPdf
 *   7. watermarkPdf
 *   8. wordToPdf
 *   9. pdfToWord
 *   10. sanitizeFilename
 *   11. parseAndValidatePageRanges
 * 
 * NOTE: Tools relying on HTML5 Canvas rasterization and browser-only PDF.js worker
 * contexts (compressPdf, pdfToJpg, pdfToPng, imagesToPdf, and unlockPdf canvas fallback)
 * cannot be genuinely executed in headless Node without synthetic approximations.
 * They are explicitly categorized as requiring real browser integration tests.
 */

import './polyfill-dom';
import { PDFDocument, StandardFonts } from 'pdf-lib';
import { Document, Packer, Paragraph, TextRun } from 'docx';
import JSZip from 'jszip';

// DIRECT IMPORTS from real pdfEngine.ts
import {
  mergePdfs,
  splitPdf,
  rotatePdf,
  deletePdfPages,
  extractPdfPages,
  protectPdf,
  watermarkPdf,
  wordToPdf,
  pdfToWord,
  sanitizeFilename,
  parseAndValidatePageRanges,
} from '../src/lib/pdfEngine';

let passedCount = 0;
let failedCount = 0;

function assert(condition: boolean, message: string) {
  if (condition) {
    console.log(`  ✅ [PASS] ${message}`);
    passedCount++;
  } else {
    console.error(`  ❌ [FAIL] ${message}`);
    failedCount++;
  }
}

/**
 * Helper to generate a real sample multi-page PDF in memory using pdf-lib
 */
async function generateSamplePdf(pageCount = 3, prefix = 'Page'): Promise<ArrayBuffer> {
  const doc = await PDFDocument.create();
  const font = await doc.embedFont(StandardFonts.Helvetica);

  for (let i = 1; i <= pageCount; i++) {
    const page = doc.addPage([595, 842]); // A4
    page.drawText(`${prefix} ${i} - PDFSmart Tools Engine Test Document`, {
      x: 50,
      y: 780,
      size: 16,
      font,
    });
    page.drawText(`This page contains verifiable text for testing extraction and conversion routines.`, {
      x: 50,
      y: 750,
      size: 11,
      font,
    });
  }

  const bytes = await doc.save();
  return bytes.buffer as ArrayBuffer;
}

/**
 * Helper to generate a real DOCX file buffer in memory using docx
 */
async function generateSampleDocx(paragraphs: string[]): Promise<ArrayBuffer> {
  const doc = new Document({
    sections: [
      {
        children: paragraphs.map(
          (text) =>
            new Paragraph({
              children: [new TextRun(text)],
            })
        ),
      },
    ],
  });

  const buffer = await Packer.toBuffer(doc);
  return buffer.buffer as ArrayBuffer;
}

async function runDirectEngineTests() {
  console.log('\n===============================================================');
  console.log('  PDFSMART TOOLS — DIRECT ENGINE TEST SUITE (Node.js)');
  console.log('  Testing functions directly imported from src/lib/pdfEngine.ts');
  console.log('===============================================================\n');

  // 1. Direct mergePdfs Test
  console.log('--- 1. Direct Test: mergePdfs ---');
  try {
    const pdfA = await generateSamplePdf(2, 'Doc A Page');
    const pdfB = await generateSamplePdf(3, 'Doc B Page');
    const mergeResult = await mergePdfs([
      { buffer: pdfA, name: 'document_alpha.pdf' },
      { buffer: pdfB, name: 'document_beta.pdf' },
    ]);

    assert(mergeResult.processedSize > 0, 'mergePdfs produced valid output bytes');
    assert(mergeResult.filename.includes('_merged.pdf'), `mergePdfs output filename correct: ${mergeResult.filename}`);

    const resultDoc = await PDFDocument.load(await mergeResult.blob.arrayBuffer(), { ignoreEncryption: true });
    assert(resultDoc.getPageCount() === 5, `mergePdfs combined 2 + 3 = ${resultDoc.getPageCount()} pages`);
  } catch (err: any) {
    assert(false, `mergePdfs threw unexpected error: ${err.message}`);
  }

  // 2. Direct splitPdf Test
  console.log('\n--- 2. Direct Test: splitPdf ---');
  try {
    const sample = await generateSamplePdf(4, 'Split Test Page');
    const splitResult = await splitPdf(sample, 'multipage_report.pdf', 'all');

    assert(splitResult.processedSize > 0, 'splitPdf produced non-empty buffer');
    assert(splitResult.filename.endsWith('.zip'), `splitPdf generated ZIP archive: ${splitResult.filename}`);

    const zipData = await JSZip.loadAsync(await splitResult.blob.arrayBuffer());
    const zipFiles = Object.keys(zipData.files).filter((f) => !zipData.files[f].dir && f.endsWith('.pdf'));
    assert(zipFiles.length === 4, `splitPdf zip contains exactly 4 split page PDFs (found ${zipFiles.length})`);
  } catch (err: any) {
    assert(false, `splitPdf threw unexpected error: ${err.message}`);
  }

  // 3. Direct rotatePdf Test
  console.log('\n--- 3. Direct Test: rotatePdf ---');
  try {
    const sample = await generateSamplePdf(2, 'Rotate Page');
    const rotateResult = await rotatePdf(sample, 'plan.pdf', 90);

    assert(rotateResult.processedSize > 0, 'rotatePdf generated non-empty buffer');
    const rotatedDoc = await PDFDocument.load(await rotateResult.blob.arrayBuffer(), { ignoreEncryption: true });
    const p1Angle = rotatedDoc.getPage(0).getRotation().angle;
    assert(p1Angle === 90, `rotatePdf set page rotation angle to 90 degrees (actual: ${p1Angle})`);
  } catch (err: any) {
    assert(false, `rotatePdf threw unexpected error: ${err.message}`);
  }

  // 4. Direct deletePdfPages Test
  console.log('\n--- 4. Direct Test: deletePdfPages ---');
  try {
    const sample = await generateSamplePdf(5, 'Delete Test Page');
    // Delete page 2 and page 4 (1-based indices)
    const deleteResult = await deletePdfPages(sample, 'catalog.pdf', [2, 4]);

    assert(deleteResult.processedSize > 0, 'deletePdfPages generated non-empty buffer');
    const trimmedDoc = await PDFDocument.load(await deleteResult.blob.arrayBuffer(), { ignoreEncryption: true });
    assert(trimmedDoc.getPageCount() === 3, `deletePdfPages reduced 5 pages to 3 pages (actual: ${trimmedDoc.getPageCount()})`);
  } catch (err: any) {
    assert(false, `deletePdfPages threw unexpected error: ${err.message}`);
  }

  // 5. Direct extractPdfPages Test
  console.log('\n--- 5. Direct Test: extractPdfPages ---');
  try {
    const sample = await generateSamplePdf(6, 'Extract Test Page');
    // Extract pages 1, 3, 5
    const extractResult = await extractPdfPages(sample, 'large_contract.pdf', [1, 3, 5]);

    assert(extractResult.processedSize > 0, 'extractPdfPages generated non-empty buffer');
    const extractedDoc = await PDFDocument.load(await extractResult.blob.arrayBuffer(), { ignoreEncryption: true });
    assert(extractedDoc.getPageCount() === 3, `extractPdfPages extracted exactly 3 pages (actual: ${extractedDoc.getPageCount()})`);
  } catch (err: any) {
    assert(false, `extractPdfPages threw unexpected error: ${err.message}`);
  }

  // 6. Direct protectPdf Test
  console.log('\n--- 6. Direct Test: protectPdf ---');
  try {
    const sample = await generateSamplePdf(2, 'Confidential Page');
    const protectResult = await protectPdf(sample, 'confidential_brief.pdf', 'SuperSecretPass123!');

    assert(protectResult.processedSize > 0, 'protectPdf produced encrypted PDF output');
    assert(protectResult.filename.includes('_protected.pdf'), `protectPdf output filename formatted properly: ${protectResult.filename}`);

    // Verify rejection without password
    const encBuffer = await protectResult.blob.arrayBuffer();
    let unauthenticatedLoadBlocked = false;
    try {
      await PDFDocument.load(encBuffer);
    } catch {
      unauthenticatedLoadBlocked = true;
    }
    assert(unauthenticatedLoadBlocked, 'Encrypted PDF successfully blocks unauthenticated access');
  } catch (err: any) {
    assert(false, `protectPdf threw unexpected error: ${err.message}`);
  }

  // 7. Direct watermarkPdf Test
  console.log('\n--- 7. Direct Test: watermarkPdf ---');
  try {
    const sample = await generateSamplePdf(2, 'Watermark Page');
    const watermarkResult = await watermarkPdf(sample, 'internal_memo.pdf', {
      text: 'CONFIDENTIAL DRAFT',
      fontSize: 36,
      opacity: 0.35,
      rotation: 45,
      colorHex: '#dc2626',
      position: 'center',
    });

    assert(watermarkResult.processedSize > 0, 'watermarkPdf stamped watermark and produced valid bytes');
    assert(watermarkResult.filename.includes('_watermarked.pdf'), `watermarkPdf output filename: ${watermarkResult.filename}`);
  } catch (err: any) {
    assert(false, `watermarkPdf threw unexpected error: ${err.message}`);
  }

  // 8. Direct wordToPdf Test
  console.log('\n--- 8. Direct Test: wordToPdf ---');
  try {
    const docxBuffer = await generateSampleDocx([
      'Executive Summary of Document Operations',
      'This DOCX document tests the direct wordToPdf conversion routine in pdfEngine.ts.',
      'Paragraph two validates multi-line text flow and page rendering.',
    ]);

    const wordResult = await wordToPdf(docxBuffer, 'quarterly_report.docx', {
      pageSize: 'a4',
      margin: 'standard',
    });

    assert(wordResult.processedSize > 0, 'wordToPdf compiled DOCX into valid PDF buffer');
    assert(wordResult.filename.endsWith('.pdf'), `wordToPdf generated PDF filename: ${wordResult.filename}`);

    const compiledDoc = await PDFDocument.load(await wordResult.blob.arrayBuffer(), { ignoreEncryption: true });
    assert(compiledDoc.getPageCount() >= 1, `wordToPdf created valid PDF document with ${compiledDoc.getPageCount()} page(s)`);
  } catch (err: any) {
    assert(false, `wordToPdf threw unexpected error: ${err.message}`);
  }

  // 9. Direct pdfToWord Test
  console.log('\n--- 9. Direct Test: pdfToWord ---');
  try {
    const samplePdf = await generateSamplePdf(2, 'Exportable Section');
    const p2wResult = await pdfToWord(samplePdf, 'source_document.pdf');

    assert(p2wResult.processedSize > 0, 'pdfToWord generated genuine DOCX output');
    assert(p2wResult.filename.endsWith('.docx'), `pdfToWord output filename: ${p2wResult.filename}`);

    // Verify DOCX structure using JSZip (DOCX is a zip package containing word/document.xml)
    const docxZip = await JSZip.loadAsync(await p2wResult.blob.arrayBuffer());
    assert(docxZip.file('word/document.xml') !== null, 'Generated DOCX contains valid word/document.xml archive structure');
  } catch (err: any) {
    assert(false, `pdfToWord threw unexpected error: ${err.message}`);
  }

  // 10. Direct sanitizeFilename Test
  console.log('\n--- 10. Direct Test: sanitizeFilename ---');
  try {
    assert(sanitizeFilename('../../etc/passwd.pdf') === 'etc_passwd.pdf', 'Sanitizes directory traversal characters');
    assert(sanitizeFilename('CON.pdf') === 'doc_CON.pdf', 'Sanitizes reserved DOS device names');
    assert(sanitizeFilename('my*bad:file?name.pdf') === 'my_bad_file_name.pdf', 'Sanitizes filesystem illegal characters');
    assert(sanitizeFilename('') === 'document', 'Applies fallback name on empty input');
  } catch (err: any) {
    assert(false, `sanitizeFilename threw unexpected error: ${err.message}`);
  }

  // 11. Direct parseAndValidatePageRanges Test
  console.log('\n--- 11. Direct Test: parseAndValidatePageRanges ---');
  try {
    const r1 = parseAndValidatePageRanges('1-3, 5', 10);
    assert(r1.valid === true, 'Parses comma and hyphen ranges');
    assert(JSON.stringify(r1.pageNumbers) === JSON.stringify([1, 2, 3, 5]), 'Produces expected 1-based page numbers [1, 2, 3, 5]');
    assert(JSON.stringify(r1.pageIndices) === JSON.stringify([0, 1, 2, 4]), 'Produces expected 0-based page indices [0, 1, 2, 4]');

    const r2 = parseAndValidatePageRanges('1-15', 10);
    assert(r2.valid === false, 'Correctly rejects ranges exceeding total document pages');

    const r3 = parseAndValidatePageRanges('abc, 123', 10);
    assert(r3.valid === false, 'Correctly rejects invalid non-numeric inputs');
  } catch (err: any) {
    assert(false, `parseAndValidatePageRanges threw unexpected error: ${err.message}`);
  }

  // Final Summary Output
  console.log('\n===============================================================');
  console.log('                     TEST SUMMARY RESULTS                      ');
  console.log('===============================================================');
  console.log(`Direct Node Engine Test Assertions Passed: ${passedCount}`);
  console.log(`Direct Node Engine Test Assertions Failed: ${failedCount}`);

  console.log('\n---------------------------------------------------------------');
  console.log('             BROWSER INTEGRATION TESTS STILL REQUIRED          ');
  console.log('---------------------------------------------------------------');
  console.log('The following 5 tools rely on HTML5 Canvas rasterization and/or');
  console.log('browser-only PDF.js worker execution. They require manual or');
  console.log('headless browser (e.g. Playwright/Puppeteer) verification:');
  console.log('  1. compressPdf   — Canvas re-encoding & JPEG quality stream compression');
  console.log('  2. pdfToJpg      — High-DPI canvas rendering & JPEG image extraction');
  console.log('  3. pdfToPng      — Canvas rendering with transparency & PNG export');
  console.log('  4. imagesToPdf   — Browser image loading (HTMLImageElement) & orientation');
  console.log('  5. unlockPdf     — Canvas rasterization fallback for encrypted streams');
  console.log('===============================================================\n');

  if (failedCount > 0) {
    process.exit(1);
  }
}

runDirectEngineTests().catch((err) => {
  console.error('Fatal error running direct engine tests:', err);
  process.exit(1);
});
