import { PDFDocument, rgb, degrees, StandardFonts, PageSizes } from 'pdf-lib';
import JSZip from 'jszip';
import { Document, Packer, Paragraph, TextRun, HeadingLevel } from 'docx';
import mammoth from 'mammoth';
import * as pdfjsLib from 'pdfjs-dist';
import { encryptPDF } from '@pdfsmaller/pdf-encrypt-lite';
import { ProcessingResult } from '../types';
import { extractPdfText } from './pdfPreview';

// Ensure PDF.js worker is properly configured
if (typeof window !== 'undefined' && !pdfjsLib.GlobalWorkerOptions.workerSrc) {
  pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;
}

// Helper to convert hex to RGB 0..1
function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const cleanHex = hex.replace('#', '');
  const r = parseInt(cleanHex.substring(0, 2), 16) / 255 || 0;
  const g = parseInt(cleanHex.substring(2, 4), 16) / 255 || 0;
  const b = parseInt(cleanHex.substring(4, 6), 16) / 255 || 0;
  return { r, g, b };
}

/**
 * Checks if a string can be safely encoded by standard PDF WinAnsi fonts (Helvetica, Times, etc.)
 */
export function canEncodeWinAnsi(text: string): boolean {
  if (!text) return true;
  for (let i = 0; i < text.length; i++) {
    const code = text.charCodeAt(i);
    if (code >= 32 && code <= 126) continue;
    if (code === 9 || code === 10 || code === 13) continue;
    if (code >= 128 && code <= 255) {
      if (code === 129 || code === 141 || code === 143 || code === 144 || code === 157) return false;
      continue;
    }
    return false;
  }
  return true;
}

/**
 * Converts a base64 dataUrl directly to Uint8Array without network fetch
 */
export function dataUrlToUint8Array(dataUrl: string): Uint8Array {
  const commaIdx = dataUrl.indexOf(',');
  const base64 = commaIdx >= 0 ? dataUrl.slice(commaIdx + 1) : dataUrl;
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

/**
 * Converts a base64 dataUrl directly to Blob without network fetch
 */
export function dataUrlToBlob(dataUrl: string): Blob {
  const commaIdx = dataUrl.indexOf(',');
  const mime = dataUrl.substring(5, commaIdx).split(';')[0] || 'image/jpeg';
  const bytes = dataUrlToUint8Array(dataUrl);
  return new Blob([bytes], { type: mime });
}

/**
 * Robust filename sanitizer for security against XSS, path traversal, null bytes, and malicious characters.
 * Preserves legitimate international/Unicode names while removing traversal sequences.
 */
export function sanitizeFilename(name: string, defaultName = 'document'): string {
  if (!name || typeof name !== 'string') return defaultName;
  
  let clean = name
    // Strip null bytes and control characters
    .replace(/[\x00-\x1f\x7f-\x9f]/g, '')
    // Replace directory traversal sequences
    .replace(/\.{2,}/g, '_')
    .replace(/[/\\]+/g, '_')
    // Replace dangerous filesystem, shell, and injection characters
    .replace(/[<>:"|?*#$!%&{}`~^]/g, '_')
    .replace(/\s+/g, '_')
    // Trim leading and trailing dots or underscores
    .replace(/^[._]+|[._]+$/g, '')
    .trim();

  // Strip reserved DOS/Windows device names
  if (/^(con|prn|aux|nul|com[1-9]|lpt[1-9])(\..*)?$/i.test(clean)) {
    clean = `doc_${clean}`;
  }

  // Cap length
  if (clean.length > 80) {
    clean = clean.substring(0, 80);
  }

  return clean || defaultName;
}

/**
 * Page range validation helper
 */
export interface PageRangeValidationResult {
  valid: boolean;
  pageIndices: number[]; // 0-based
  pageNumbers: number[]; // 1-based
  error?: string;
}

export function parseAndValidatePageRanges(
  rangeString: string,
  totalPages: number
): PageRangeValidationResult {
  if (!rangeString || !rangeString.trim()) {
    return { valid: false, pageIndices: [], pageNumbers: [], error: 'Please specify at least one page or range.' };
  }

  const clean = rangeString.trim();
  // Valid characters: digits, commas, hyphens, spaces
  if (!/^[0-9\s,-]+$/.test(clean)) {
    return { valid: false, pageIndices: [], pageNumbers: [], error: 'Invalid characters. Use only numbers, commas, and hyphens (e.g. 1-3, 5, 8).' };
  }

  const parts = clean.split(',').map((p) => p.trim()).filter(Boolean);
  if (parts.length === 0) {
    return { valid: false, pageIndices: [], pageNumbers: [], error: 'Please specify a valid page range.' };
  }

  const collectedNumbers: Set<number> = new Set();

  for (const part of parts) {
    if (part.includes('-')) {
      const subParts = part.split('-');
      if (subParts.length !== 2) {
        return { valid: false, pageIndices: [], pageNumbers: [], error: `Invalid range format "${part}". Use format like 1-5.` };
      }
      const start = parseInt(subParts[0].trim(), 10);
      const end = parseInt(subParts[1].trim(), 10);

      if (isNaN(start) || isNaN(end)) {
        return { valid: false, pageIndices: [], pageNumbers: [], error: `Invalid numbers in range "${part}".` };
      }
      if (start < 1) {
        return { valid: false, pageIndices: [], pageNumbers: [], error: `Page numbers must be 1 or greater (found ${start}).` };
      }
      if (end < start) {
        return { valid: false, pageIndices: [], pageNumbers: [], error: `Invalid range "${part}": start page (${start}) is greater than end page (${end}).` };
      }
      if (totalPages > 0 && (start > totalPages || end > totalPages)) {
        return { valid: false, pageIndices: [], pageNumbers: [], error: `Range "${part}" exceeds total document pages (${totalPages}).` };
      }

      for (let p = start; p <= end; p++) {
        collectedNumbers.add(p);
      }
    } else {
      const num = parseInt(part, 10);
      if (isNaN(num)) {
        return { valid: false, pageIndices: [], pageNumbers: [], error: `Invalid page number "${part}".` };
      }
      if (num < 1) {
        return { valid: false, pageIndices: [], pageNumbers: [], error: `Page numbers must be 1 or greater.` };
      }
      if (totalPages > 0 && num > totalPages) {
        return { valid: false, pageIndices: [], pageNumbers: [], error: `Page ${num} exceeds total document pages (${totalPages}).` };
      }
      collectedNumbers.add(num);
    }
  }

  const pageNumbers = Array.from(collectedNumbers).sort((a, b) => a - b);
  if (pageNumbers.length === 0) {
    return { valid: false, pageIndices: [], pageNumbers: [], error: 'No valid pages found.' };
  }

  const pageIndices = pageNumbers.map((p) => p - 1);
  return { valid: true, pageIndices, pageNumbers };
}

/**
 * 1. MERGE PDF
 */
export async function mergePdfs(
  files: { buffer: ArrayBuffer; name: string }[],
  onProgress?: (progress: number) => void
): Promise<ProcessingResult> {
  if (!files || files.length < 2) {
    throw new Error('Please select at least 2 PDF documents to merge.');
  }

  const mergedPdf = await PDFDocument.create();
  let totalOriginalSize = 0;

  for (let i = 0; i < files.length; i++) {
    const item = files[i];
    totalOriginalSize += item.buffer.byteLength;

    let srcDoc: PDFDocument;
    try {
      srcDoc = await PDFDocument.load(item.buffer, { ignoreEncryption: true });
    } catch (err: any) {
      throw new Error(`Failed to read "${item.name}": The file may be damaged, corrupted, or password-protected.`);
    }

    const pageCount = srcDoc.getPageCount();
    if (pageCount === 0) {
      throw new Error(`Document "${item.name}" has no pages.`);
    }

    const copiedPages = await mergedPdf.copyPages(srcDoc, srcDoc.getPageIndices());
    copiedPages.forEach((page) => mergedPdf.addPage(page));

    if (onProgress) {
      onProgress(Math.round(((i + 1) / files.length) * 90));
    }
  }

  if (onProgress) onProgress(95);
  const pdfBytes = await mergedPdf.save();
  const blob = new Blob([pdfBytes], { type: 'application/pdf' });

  const firstBase = sanitizeFilename(files[0].name.replace(/\.pdf$/i, ''), 'merged');
  const outFilename = `${firstBase}_merged.pdf`;

  if (onProgress) onProgress(100);

  return {
    blob,
    filename: outFilename,
    originalSize: totalOriginalSize,
    processedSize: blob.size,
    previewUrl: URL.createObjectURL(blob),
    previewType: 'pdf',
  };
}

/**
 * 2. SPLIT PDF
 */
export async function splitPdf(
  buffer: ArrayBuffer,
  originalFilename: string,
  mode: 'ranges' | 'all' | 'custom_pages',
  rangeStringOrPages?: string | number[],
  onProgress?: (progress: number) => void
): Promise<ProcessingResult> {
  let srcDoc: PDFDocument;
  try {
    srcDoc = await PDFDocument.load(buffer, { ignoreEncryption: true });
  } catch (err: any) {
    throw new Error(`Failed to read "${originalFilename}": The file may be damaged, corrupted, or password-protected.`);
  }

  const totalPages = srcDoc.getPageCount();
  if (totalPages === 0) {
    throw new Error('This PDF has no pages to split.');
  }

  const baseName = sanitizeFilename(originalFilename.replace(/\.pdf$/i, ''), 'split');

  if (mode === 'all') {
    const zip = new JSZip();
    for (let i = 0; i < totalPages; i++) {
      const singleDoc = await PDFDocument.create();
      const [copiedPage] = await singleDoc.copyPages(srcDoc, [i]);
      singleDoc.addPage(copiedPage);
      const pdfBytes = await singleDoc.save();
      const paddedNum = String(i + 1).padStart(String(totalPages).length, '0');
      zip.file(`${baseName}_page_${paddedNum}.pdf`, pdfBytes);

      if (onProgress) {
        onProgress(Math.round(((i + 1) / totalPages) * 90));
      }
    }

    const zipBlob = await zip.generateAsync({ type: 'blob' }, (metadata) => {
      if (onProgress) {
        onProgress(90 + Math.round(metadata.percent * 0.1));
      }
    });

    return {
      blob: zipBlob,
      filename: `${baseName}_split_pages.zip`,
      originalSize: buffer.byteLength,
      processedSize: zipBlob.size,
      previewType: 'zip',
    };
  } else {
    let targetIndices: number[] = [];

    if (Array.isArray(rangeStringOrPages)) {
      // 1-based page numbers array
      targetIndices = rangeStringOrPages
        .filter((p) => p >= 1 && p <= totalPages)
        .map((p) => p - 1)
        .sort((a, b) => a - b);
    } else {
      const validation = parseAndValidatePageRanges(rangeStringOrPages || '1', totalPages);
      if (!validation.valid) {
        throw new Error(validation.error || 'Invalid page range specified.');
      }
      targetIndices = validation.pageIndices;
    }

    if (targetIndices.length === 0) {
      throw new Error(`Please select at least 1 valid page between 1 and ${totalPages}.`);
    }

    const splitDoc = await PDFDocument.create();
    const copiedPages = await splitDoc.copyPages(srcDoc, targetIndices);
    copiedPages.forEach((page) => splitDoc.addPage(page));

    if (onProgress) onProgress(80);
    const pdfBytes = await splitDoc.save();
    const blob = new Blob([pdfBytes], { type: 'application/pdf' });

    if (onProgress) onProgress(100);

    return {
      blob,
      filename: `${baseName}_split.pdf`,
      originalSize: buffer.byteLength,
      processedSize: blob.size,
      previewUrl: URL.createObjectURL(blob),
      previewType: 'pdf',
    };
  }
}

/**
 * 3. COMPRESS PDF
 */
export async function compressPdf(
  buffer: ArrayBuffer,
  originalFilename: string,
  level: 'extreme' | 'recommended' | 'light',
  onProgress?: (progress: number) => void
): Promise<ProcessingResult> {
  let pdfjsDoc;
  try {
    const loadingTask = pdfjsLib.getDocument({ data: new Uint8Array(buffer) });
    pdfjsDoc = await loadingTask.promise;
  } catch (err: any) {
    throw new Error(`Could not open "${originalFilename}": The file may be password protected, damaged, or unreadable.`);
  }

  const numPages = pdfjsDoc.numPages;
  if (numPages === 0) {
    throw new Error('This PDF has no pages to compress.');
  }

  const targetDoc = await PDFDocument.create();
  
  // High-performance settings based on compression level
  // extreme: ~1.0 scale (72 DPI), quality 0.45
  // recommended: ~1.3 scale (~100 DPI), quality 0.65
  // light: ~1.6 scale (~120 DPI), quality 0.85
  const quality = level === 'extreme' ? 0.45 : level === 'recommended' ? 0.65 : 0.85;
  const renderScale = level === 'extreme' ? 1.0 : level === 'recommended' ? 1.3 : 1.6;

  for (let i = 1; i <= numPages; i++) {
    const page = await pdfjsDoc.getPage(i);
    const viewport = page.getViewport({ scale: renderScale });

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) continue;

    canvas.width = Math.floor(viewport.width);
    canvas.height = Math.floor(viewport.height);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    await (page.render({ canvasContext: ctx, viewport, canvas } as any)).promise;

    const dataUrl = canvas.toDataURL('image/jpeg', quality);
    canvas.width = 0;
    canvas.height = 0;
    const jpgImageBytes = dataUrlToUint8Array(dataUrl);
    const jpgImage = await targetDoc.embedJpg(jpgImageBytes);

    // Maintain original standard PDF page dimensions
    const originalViewport = page.getViewport({ scale: 1.0 });
    const targetPage = targetDoc.addPage([originalViewport.width, originalViewport.height]);
    targetPage.drawImage(jpgImage, {
      x: 0,
      y: 0,
      width: originalViewport.width,
      height: originalViewport.height,
    });

    if (onProgress) {
      onProgress(Math.round((i / numPages) * 90));
    }
  }

  const compressedBytes = await targetDoc.save({ useObjectStreams: true });
  const blob = new Blob([compressedBytes], { type: 'application/pdf' });
  const baseName = sanitizeFilename(originalFilename.replace(/\.pdf$/i, ''), 'compressed');

  if (onProgress) onProgress(100);

  return {
    blob,
    filename: `${baseName}_compressed.pdf`,
    originalSize: buffer.byteLength,
    processedSize: blob.size,
    previewUrl: URL.createObjectURL(blob),
    previewType: 'pdf',
  };
}

/**
 * 4. PDF TO JPG
 */
export async function pdfToJpg(
  buffer: ArrayBuffer,
  originalFilename: string,
  options?: {
    quality?: number;
    scale?: number;
    pageNumbers?: number[];
  },
  onProgress?: (progress: number) => void
): Promise<ProcessingResult> {
  let pdfDoc;
  try {
    const loadingTask = pdfjsLib.getDocument({ data: new Uint8Array(buffer) });
    pdfDoc = await loadingTask.promise;
  } catch (err: any) {
    throw new Error(`Failed to read "${originalFilename}": The file may be password protected or corrupted.`);
  }

  const numPages = pdfDoc.numPages;
  if (numPages === 0) {
    throw new Error('This PDF has no pages to convert.');
  }

  const quality = options?.quality ?? 0.9;
  const renderScale = options?.scale ?? 2.0;
  const targetPages = options?.pageNumbers && options.pageNumbers.length > 0
    ? options.pageNumbers.filter((p) => p >= 1 && p <= numPages)
    : Array.from({ length: numPages }, (_, i) => i + 1);

  if (targetPages.length === 0) {
    throw new Error('No valid pages selected for conversion.');
  }

  const baseName = sanitizeFilename(originalFilename.replace(/\.pdf$/i, ''), 'converted');

  if (targetPages.length === 1) {
    const pageNum = targetPages[0];
    const page = await pdfDoc.getPage(pageNum);
    const viewport = page.getViewport({ scale: renderScale });
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d')!;
    canvas.width = Math.floor(viewport.width);
    canvas.height = Math.floor(viewport.height);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    await (page.render({ canvasContext: ctx, viewport, canvas } as any)).promise;
    const dataUrl = canvas.toDataURL('image/jpeg', quality);
    canvas.width = 0;
    canvas.height = 0;
    const imageBlob = dataUrlToBlob(dataUrl);

    if (onProgress) onProgress(100);

    return {
      blob: imageBlob,
      filename: `${baseName}_page_${pageNum}.jpg`,
      originalSize: buffer.byteLength,
      processedSize: imageBlob.size,
      previewUrl: dataUrl,
      previewType: 'image',
    };
  } else {
    const zip = new JSZip();
    let firstDataUrl = '';
    const padLen = String(Math.max(...targetPages)).length;

    for (let idx = 0; idx < targetPages.length; idx++) {
      const pageNum = targetPages[idx];
      const page = await pdfDoc.getPage(pageNum);
      const viewport = page.getViewport({ scale: renderScale });
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d')!;
      canvas.width = Math.floor(viewport.width);
      canvas.height = Math.floor(viewport.height);
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      await (page.render({ canvasContext: ctx, viewport, canvas } as any)).promise;
      const dataUrl = canvas.toDataURL('image/jpeg', quality);
      canvas.width = 0;
      canvas.height = 0;
      if (idx === 0) firstDataUrl = dataUrl;

      const base64Data = dataUrl.replace(/^data:image\/jpeg;base64,/, '');
      const paddedNum = String(pageNum).padStart(padLen, '0');
      zip.file(`${baseName}_page_${paddedNum}.jpg`, base64Data, { base64: true });

      if (onProgress) {
        onProgress(Math.round(((idx + 1) / targetPages.length) * 90));
      }
    }

    const zipBlob = await zip.generateAsync({ type: 'blob' }, (meta) => {
      if (onProgress) onProgress(90 + Math.round(meta.percent * 0.1));
    });

    return {
      blob: zipBlob,
      filename: `${baseName}_jpg_images.zip`,
      originalSize: buffer.byteLength,
      processedSize: zipBlob.size,
      previewUrl: firstDataUrl,
      previewType: 'zip',
    };
  }
}

/**
 * Universal Image conversion helper for JPG / PNG / WebP / BMP with canvas memory cleanup
 */
async function convertImageToCleanJpg(buffer: ArrayBuffer, filename: string): Promise<ArrayBuffer> {
  return new Promise((resolve, reject) => {
    const blob = new Blob([buffer]);
    const url = URL.createObjectURL(blob);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      const canvas = document.createElement('canvas');
      canvas.width = img.naturalWidth || img.width || 800;
      canvas.height = img.naturalHeight || img.height || 600;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        canvas.width = 0;
        canvas.height = 0;
        return reject(new Error(`Failed to initialize graphics context for "${filename}".`));
      }
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);
      canvas.toBlob((convertedBlob) => {
        canvas.width = 0;
        canvas.height = 0;
        if (!convertedBlob) return reject(new Error(`Failed to convert image "${filename}".`));
        convertedBlob.arrayBuffer().then(resolve).catch(reject);
      }, 'image/jpeg', 0.95);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error(`The image "${filename}" is corrupted, unreadable, or in an unsupported format.`));
    };
    img.src = url;
  });
}

async function ensureCompatibleImage(
  item: { buffer: ArrayBuffer; type: string; name: string }
): Promise<{ buffer: ArrayBuffer; isPng: boolean }> {
  const isPng = item.type.includes('png') || item.name.toLowerCase().endsWith('.png');
  const isJpg = item.type.includes('jpeg') || item.type.includes('jpg') || item.name.toLowerCase().endsWith('.jpg') || item.name.toLowerCase().endsWith('.jpeg');

  if (isPng) {
    return { buffer: item.buffer, isPng: true };
  }
  if (isJpg) {
    return { buffer: item.buffer, isPng: false };
  }

  // Convert WebP or other formats via clean canvas JPEG conversion
  const cleanBuf = await convertImageToCleanJpg(item.buffer, item.name);
  return { buffer: cleanBuf, isPng: false };
}

/**
 * 5. JPG TO PDF & 9. PNG TO PDF
 */
export async function imagesToPdf(
  images: { buffer: ArrayBuffer; type: string; name: string }[],
  options: {
    orientation: 'auto' | 'portrait' | 'landscape';
    margins: 'none' | 'small' | 'large';
    pageSize: 'a4' | 'letter' | 'fit';
  },
  onProgress?: (progress: number) => void
): Promise<ProcessingResult> {
  if (!images || images.length === 0) {
    throw new Error('Please select at least one image to convert into PDF.');
  }

  const pdfDoc = await PDFDocument.create();
  let totalOriginalSize = 0;

  const marginMap = {
    none: 0,
    small: 18, // 18pt = 0.25 inch
    large: 36, // 36pt = 0.5 inch
  };
  const margin = marginMap[options.margins] || 0;

  for (let i = 0; i < images.length; i++) {
    totalOriginalSize += images[i].buffer.byteLength;
    const imgItem = images[i];
    const compatible = await ensureCompatibleImage(imgItem);

    let embeddedImg;
    if (compatible.isPng) {
      try {
        embeddedImg = await pdfDoc.embedPng(compatible.buffer);
      } catch {
        // Fallback to converting PNG with color profiles/transparency to clean JPEG via canvas
        try {
          const cleanJpgBuffer = await convertImageToCleanJpg(compatible.buffer, imgItem.name);
          embeddedImg = await pdfDoc.embedJpg(cleanJpgBuffer);
        } catch (convErr: any) {
          throw new Error(`Failed to process image "${imgItem.name}": ${convErr?.message || 'Invalid or corrupted image format.'}`);
        }
      }
    } else {
      try {
        embeddedImg = await pdfDoc.embedJpg(compatible.buffer);
      } catch {
        try {
          const cleanJpgBuffer = await convertImageToCleanJpg(compatible.buffer, imgItem.name);
          embeddedImg = await pdfDoc.embedJpg(cleanJpgBuffer);
        } catch (convErr: any) {
          throw new Error(`Failed to process image "${imgItem.name}": ${convErr?.message || 'Invalid or corrupted image format.'}`);
        }
      }
    }

    const imgWidth = embeddedImg.width;
    const imgHeight = embeddedImg.height;

    let pageWidth = PageSizes.A4[0];
    let pageHeight = PageSizes.A4[1];

    if (options.pageSize === 'letter') {
      pageWidth = PageSizes.Letter[0];
      pageHeight = PageSizes.Letter[1];
    } else if (options.pageSize === 'fit') {
      pageWidth = imgWidth + margin * 2;
      pageHeight = imgHeight + margin * 2;
    }

    // Apply orientation
    if (options.orientation === 'auto') {
      if (imgWidth > imgHeight && pageWidth < pageHeight) {
        const temp = pageWidth;
        pageWidth = pageHeight;
        pageHeight = temp;
      }
    } else if (options.orientation === 'landscape' && pageWidth < pageHeight) {
      const temp = pageWidth;
      pageWidth = pageHeight;
      pageHeight = temp;
    } else if (options.orientation === 'portrait' && pageWidth > pageHeight) {
      const temp = pageWidth;
      pageWidth = pageHeight;
      pageHeight = temp;
    }

    const availableWidth = pageWidth - margin * 2;
    const availableHeight = pageHeight - margin * 2;

    const scale = Math.min(availableWidth / imgWidth, availableHeight / imgHeight);
    const drawWidth = imgWidth * scale;
    const drawHeight = imgHeight * scale;

    const x = margin + (availableWidth - drawWidth) / 2;
    const y = margin + (availableHeight - drawHeight) / 2;

    const page = pdfDoc.addPage([pageWidth, pageHeight]);
    page.drawImage(embeddedImg, {
      x,
      y,
      width: drawWidth,
      height: drawHeight,
    });

    if (onProgress) {
      onProgress(Math.round(((i + 1) / images.length) * 90));
    }
  }

  const pdfBytes = await pdfDoc.save();
  const blob = new Blob([pdfBytes], { type: 'application/pdf' });

  const firstBase = sanitizeFilename(images[0].name.replace(/\.[^/.]+$/, ''), 'converted_image');
  const outFilename = images.length === 1 ? `${firstBase}_converted.pdf` : 'converted_images.pdf';

  if (onProgress) onProgress(100);

  return {
    blob,
    filename: outFilename,
    originalSize: totalOriginalSize,
    processedSize: blob.size,
    previewUrl: URL.createObjectURL(blob),
    previewType: 'pdf',
  };
}

/**
 * 6. PDF TO WORD (.docx)
 */
export async function pdfToWord(
  buffer: ArrayBuffer,
  originalFilename: string,
  onProgress?: (progress: number) => void
): Promise<ProcessingResult> {
  const extractedPages = await extractPdfText(buffer, (current, total) => {
    if (onProgress) onProgress(Math.round((current / total) * 70));
  });

  const docParagraphs: Paragraph[] = [];

  for (const page of extractedPages) {
    // Add page header marker
    docParagraphs.push(
      new Paragraph({
        text: `--- Page ${page.pageNumber} ---`,
        heading: HeadingLevel.HEADING_3,
        spacing: { before: 200, after: 120 },
      })
    );

    if (page.lines.length === 0) {
      docParagraphs.push(
        new Paragraph({
          children: [
            new TextRun({
              text: '[Scanned graphic or blank page content]',
              italics: true,
              color: '888888',
            }),
          ],
          spacing: { after: 100 },
        })
      );
    } else {
      for (const line of page.lines) {
        // Detect if line resembles heading
        const isHeaderLike = line.length < 60 && /^[A-Z0-9\s:.-]+$/.test(line) && line.length > 3;
        docParagraphs.push(
          new Paragraph({
            children: [
              new TextRun({
                text: line,
                bold: isHeaderLike,
                size: isHeaderLike ? 26 : 22, // 13pt or 11pt
              }),
            ],
            spacing: { after: 120 },
          })
        );
      }
    }
  }

  if (onProgress) onProgress(85);

  const doc = new Document({
    sections: [
      {
        properties: {},
        children: docParagraphs,
      },
    ],
  });

  const docxBlob = await Packer.toBlob(doc);
  if (onProgress) onProgress(100);

  const baseName = sanitizeFilename(originalFilename.replace(/\.pdf$/i, ''), 'converted');
  return {
    blob: docxBlob,
    filename: `${baseName}_converted.docx`,
    originalSize: buffer.byteLength,
    processedSize: docxBlob.size,
    previewType: 'docx',
  };
}

/**
 * High-resolution canvas renderer for Word to PDF when handling Unicode/non-ASCII characters
 */
async function renderWordToPdfCanvasPages(
  lines: string[],
  pageWidth: number,
  pageHeight: number,
  margin: number,
  pdfDoc: PDFDocument,
  onProgress?: (p: number) => void
): Promise<void> {
  const scale = 2;
  const scaledWidth = Math.floor(pageWidth * scale);
  const scaledHeight = Math.floor(pageHeight * scale);
  const scaledMargin = Math.floor(margin * scale);
  const usableWidth = scaledWidth - scaledMargin * 2;

  let canvas = document.createElement('canvas');
  canvas.width = scaledWidth;
  canvas.height = scaledHeight;
  let ctx = canvas.getContext('2d')!;
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, scaledWidth, scaledHeight);

  let currentY = scaledMargin + 30 * scale;
  const bodyFontSize = 13 * scale;
  const headingFontSize = 18 * scale;
  const bodyLineHeight = 20 * scale;
  const headingLineHeight = 28 * scale;

  const fontStack = '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif';

  async function flushCurrentPage() {
    const blob = await new Promise<Blob | null>((res) => canvas.toBlob(res, 'image/jpeg', 0.92));
    canvas.width = 0;
    canvas.height = 0;
    if (blob) {
      const buf = await blob.arrayBuffer();
      const img = await pdfDoc.embedJpg(buf);
      const page = pdfDoc.addPage([pageWidth, pageHeight]);
      page.drawImage(img, { x: 0, y: 0, width: pageWidth, height: pageHeight });
    }
  }

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const isHeading = line.length < 60 && (i === 0 || /^[A-Z0-9\s:.-]{4,}$/.test(line));
    const activeFontSize = isHeading ? headingFontSize : bodyFontSize;
    const activeLineHeight = isHeading ? headingLineHeight : bodyLineHeight;
    ctx.font = `${isHeading ? 'bold ' : ''}${activeFontSize}px ${fontStack}`;
    ctx.fillStyle = '#1e293b';

    const words = line.split(' ');
    let currentLine = '';

    for (const word of words) {
      const testLine = currentLine ? `${currentLine} ${word}` : word;
      const testWidth = ctx.measureText(testLine).width;

      if (testWidth > usableWidth && currentLine.length > 0) {
        if (currentY + activeLineHeight > scaledHeight - scaledMargin) {
          await flushCurrentPage();
          canvas = document.createElement('canvas');
          canvas.width = scaledWidth;
          canvas.height = scaledHeight;
          ctx = canvas.getContext('2d')!;
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(0, 0, scaledWidth, scaledHeight);
          currentY = scaledMargin + 30 * scale;
          ctx.font = `${isHeading ? 'bold ' : ''}${activeFontSize}px ${fontStack}`;
          ctx.fillStyle = '#1e293b';
        }

        ctx.fillText(currentLine, scaledMargin, currentY);
        currentY += activeLineHeight;
        currentLine = word;
      } else {
        currentLine = testLine;
      }
    }

    if (currentLine.length > 0) {
      if (currentY + activeLineHeight > scaledHeight - scaledMargin) {
        await flushCurrentPage();
        canvas = document.createElement('canvas');
        canvas.width = scaledWidth;
        canvas.height = scaledHeight;
        ctx = canvas.getContext('2d')!;
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, scaledWidth, scaledHeight);
        currentY = scaledMargin + 30 * scale;
        ctx.font = `${isHeading ? 'bold ' : ''}${activeFontSize}px ${fontStack}`;
        ctx.fillStyle = '#1e293b';
      }

      ctx.fillText(currentLine, scaledMargin, currentY);
      currentY += activeLineHeight;
    }

    currentY += 10 * scale;

    if (onProgress) {
      onProgress(Math.round(50 + ((i + 1) / lines.length) * 45));
    }
  }

  await flushCurrentPage();
}

/**
 * 7. WORD TO PDF
 */
export async function wordToPdf(
  buffer: ArrayBuffer,
  originalFilename: string,
  options?: {
    pageSize?: 'a4' | 'letter';
    margin?: 'standard' | 'wide' | 'compact';
  },
  onProgress?: (progress: number) => void
): Promise<ProcessingResult> {
  if (onProgress) onProgress(20);

  // Extract raw text and structure from DOCX using mammoth (support both browser and node environments)
  const mammothInput = typeof window === 'undefined' && typeof Buffer !== 'undefined'
    ? { buffer: Buffer.from(buffer), arrayBuffer: buffer }
    : { arrayBuffer: buffer, buffer: typeof Buffer !== 'undefined' ? Buffer.from(buffer) : (buffer as any) };
  const result = await mammoth.extractRawText(mammothInput as any);
  const rawText = result.value || 'Empty document';
  const lines = rawText.split('\n').filter((l) => l.trim().length > 0);

  if (onProgress) onProgress(50);

  const pdfDoc = await PDFDocument.create();
  const pageSize = options?.pageSize === 'letter' ? PageSizes.Letter : PageSizes.A4;
  const pageWidth = pageSize[0];
  const pageHeight = pageSize[1];

  const marginMap = {
    standard: 50,
    wide: 72,
    compact: 36,
  };
  const margin = marginMap[options?.margin || 'standard'] || 50;
  const usableWidth = pageWidth - margin * 2;

  // Check if text can be safely rendered using standard WinAnsi fonts
  const isAllAnsi = canEncodeWinAnsi(rawText);

  if (!isAllAnsi) {
    // Unicode text: render via high-DPI canvas
    await renderWordToPdfCanvasPages(lines, pageWidth, pageHeight, margin, pdfDoc, onProgress);
  } else {
    try {
      const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
      const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
      const fontSize = 11;
      const lineHeight = 16;

      let currentPage = pdfDoc.addPage([pageWidth, pageHeight]);
      let currentY = pageHeight - margin;

      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        const isHeading = line.length < 60 && (i === 0 || /^[A-Z0-9\s:.-]{4,}$/.test(line));
        const activeFont = isHeading ? boldFont : font;
        const activeFontSize = isHeading ? 14 : fontSize;
        const activeLineHeight = isHeading ? 22 : lineHeight;

        // Word wrapping
        const words = line.split(' ');
        let currentLineText = '';

        for (const word of words) {
          const testLine = currentLineText ? `${currentLineText} ${word}` : word;
          const testWidth = activeFont.widthOfTextAtSize(testLine, activeFontSize);

          if (testWidth > usableWidth && currentLineText.length > 0) {
            if (currentY - activeLineHeight < margin) {
              currentPage = pdfDoc.addPage([pageWidth, pageHeight]);
              currentY = pageHeight - margin;
            }

            currentPage.drawText(currentLineText, {
              x: margin,
              y: currentY,
              size: activeFontSize,
              font: activeFont,
              color: rgb(0.12, 0.14, 0.18),
            });

            currentY -= activeLineHeight;
            currentLineText = word;
          } else {
            currentLineText = testLine;
          }
        }

        if (currentLineText.length > 0) {
          if (currentY - activeLineHeight < margin) {
            currentPage = pdfDoc.addPage([pageWidth, pageHeight]);
            currentY = pageHeight - margin;
          }

          currentPage.drawText(currentLineText, {
            x: margin,
            y: currentY,
            size: activeFontSize,
            font: activeFont,
            color: rgb(0.12, 0.14, 0.18),
          });
          currentY -= activeLineHeight;
        }

        currentY -= 6; // Paragraph spacing
      }
    } catch {
      // If font.widthOfTextAtSize or drawText throws WinAnsi error, fallback to canvas renderer
      await renderWordToPdfCanvasPages(lines, pageWidth, pageHeight, margin, pdfDoc, onProgress);
    }
  }

  if (onProgress) onProgress(85);

  const pdfBytes = await pdfDoc.save();
  const blob = new Blob([pdfBytes], { type: 'application/pdf' });
  const baseName = sanitizeFilename(originalFilename.replace(/\.docx?$/i, ''), 'converted');

  if (onProgress) onProgress(100);

  return {
    blob,
    filename: `${baseName}_converted.pdf`,
    originalSize: buffer.byteLength,
    processedSize: blob.size,
    previewUrl: URL.createObjectURL(blob),
    previewType: 'pdf',
  };
}

/**
 * 8. PDF TO PNG
 */
export async function pdfToPng(
  buffer: ArrayBuffer,
  originalFilename: string,
  options?: {
    scale?: number;
    pageNumbers?: number[];
  },
  onProgress?: (progress: number) => void
): Promise<ProcessingResult> {
  let pdfDoc;
  try {
    const loadingTask = pdfjsLib.getDocument({ data: new Uint8Array(buffer) });
    pdfDoc = await loadingTask.promise;
  } catch (err: any) {
    throw new Error(`Failed to read "${originalFilename}": The file may be password protected or corrupted.`);
  }

  const numPages = pdfDoc.numPages;
  if (numPages === 0) {
    throw new Error('This PDF has no pages to convert.');
  }

  const renderScale = options?.scale ?? 2.0;
  const targetPages = options?.pageNumbers && options.pageNumbers.length > 0
    ? options.pageNumbers.filter((p) => p >= 1 && p <= numPages)
    : Array.from({ length: numPages }, (_, i) => i + 1);

  if (targetPages.length === 0) {
    throw new Error('No valid pages selected for PNG conversion.');
  }

  const baseName = sanitizeFilename(originalFilename.replace(/\.pdf$/i, ''), 'converted');

  if (targetPages.length === 1) {
    const pageNum = targetPages[0];
    const page = await pdfDoc.getPage(pageNum);
    const viewport = page.getViewport({ scale: renderScale });
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d')!;
    canvas.width = Math.floor(viewport.width);
    canvas.height = Math.floor(viewport.height);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    await (page.render({ canvasContext: ctx, viewport, canvas } as any)).promise;
    const dataUrl = canvas.toDataURL('image/png');
    canvas.width = 0;
    canvas.height = 0;
    const imageBlob = dataUrlToBlob(dataUrl);

    if (onProgress) onProgress(100);

    return {
      blob: imageBlob,
      filename: `${baseName}_page_${pageNum}.png`,
      originalSize: buffer.byteLength,
      processedSize: imageBlob.size,
      previewUrl: dataUrl,
      previewType: 'image',
    };
  } else {
    const zip = new JSZip();
    let firstDataUrl = '';
    const padLen = String(Math.max(...targetPages)).length;

    for (let idx = 0; idx < targetPages.length; idx++) {
      const pageNum = targetPages[idx];
      const page = await pdfDoc.getPage(pageNum);
      const viewport = page.getViewport({ scale: renderScale });
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d')!;
      canvas.width = Math.floor(viewport.width);
      canvas.height = Math.floor(viewport.height);
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      await (page.render({ canvasContext: ctx, viewport, canvas } as any)).promise;
      const dataUrl = canvas.toDataURL('image/png');
      canvas.width = 0;
      canvas.height = 0;
      if (idx === 0) firstDataUrl = dataUrl;

      const base64Data = dataUrl.replace(/^data:image\/png;base64,/, '');
      const paddedNum = String(pageNum).padStart(padLen, '0');
      zip.file(`${baseName}_page_${paddedNum}.png`, base64Data, { base64: true });

      if (onProgress) {
        onProgress(Math.round(((idx + 1) / targetPages.length) * 90));
      }
    }

    const zipBlob = await zip.generateAsync({ type: 'blob' }, (meta) => {
      if (onProgress) onProgress(90 + Math.round(meta.percent * 0.1));
    });

    return {
      blob: zipBlob,
      filename: `${baseName}_png_images.zip`,
      originalSize: buffer.byteLength,
      processedSize: zipBlob.size,
      previewUrl: firstDataUrl,
      previewType: 'zip',
    };
  }
}

/**
 * 10. ROTATE PDF
 */
export async function rotatePdf(
  buffer: ArrayBuffer,
  originalFilename: string,
  pageRotations: Map<number, number> | number | { pageNumbers: number[]; angle: number },
  onProgress?: (progress: number) => void
): Promise<ProcessingResult> {
  let pdfDoc: PDFDocument;
  try {
    pdfDoc = await PDFDocument.load(buffer, { ignoreEncryption: true });
  } catch (err: any) {
    throw new Error(`Failed to load "${originalFilename}": The file may be damaged, corrupted, or password-protected.`);
  }

  const totalPages = pdfDoc.getPageCount();
  if (totalPages === 0) {
    throw new Error('This PDF has no pages to rotate.');
  }

  for (let i = 0; i < totalPages; i++) {
    const pageNum = i + 1;
    const page = pdfDoc.getPage(i);
    const currentRot = page.getRotation().angle;
    let delta = 0;

    if (typeof pageRotations === 'number') {
      delta = pageRotations;
    } else if (pageRotations instanceof Map) {
      delta = pageRotations.get(pageNum) || 0;
    } else if (typeof pageRotations === 'object' && pageRotations !== null && 'pageNumbers' in pageRotations) {
      if (pageRotations.pageNumbers.includes(pageNum)) {
        delta = pageRotations.angle || 0;
      }
    }

    // Normalize angle to 0, 90, 180, 270
    const newAngle = (((currentRot + delta) % 360) + 360) % 360;
    page.setRotation(degrees(newAngle));

    if (onProgress) {
      onProgress(Math.round(((i + 1) / totalPages) * 90));
    }
  }

  if (onProgress) onProgress(95);
  const pdfBytes = await pdfDoc.save();
  const blob = new Blob([pdfBytes], { type: 'application/pdf' });
  const baseName = sanitizeFilename(originalFilename.replace(/\.pdf$/i, ''), 'rotated');

  if (onProgress) onProgress(100);

  return {
    blob,
    filename: `${baseName}_rotated.pdf`,
    originalSize: buffer.byteLength,
    processedSize: blob.size,
    previewUrl: URL.createObjectURL(blob),
    previewType: 'pdf',
  };
}

/**
 * 11. DELETE PDF PAGES
 */
export async function deletePdfPages(
  buffer: ArrayBuffer,
  originalFilename: string,
  pagesToDelete: number[], // 1-based page numbers
  onProgress?: (progress: number) => void
): Promise<ProcessingResult> {
  const srcDoc = await PDFDocument.load(buffer, { ignoreEncryption: true });
  const totalPages = srcDoc.getPageCount();

  const pagesToKeepIndices: number[] = [];
  for (let i = 0; i < totalPages; i++) {
    if (!pagesToDelete.includes(i + 1)) {
      pagesToKeepIndices.push(i);
    }
  }

  if (pagesToKeepIndices.length === 0) {
    throw new Error('You cannot delete all pages in the document. At least one page must remain.');
  }

  const newDoc = await PDFDocument.create();
  const copiedPages = await newDoc.copyPages(srcDoc, pagesToKeepIndices);
  copiedPages.forEach((page) => newDoc.addPage(page));

  if (onProgress) onProgress(90);

  const pdfBytes = await newDoc.save();
  const blob = new Blob([pdfBytes], { type: 'application/pdf' });
  const baseName = sanitizeFilename(originalFilename.replace(/\.pdf$/i, ''), 'trimmed');

  if (onProgress) onProgress(100);

  return {
    blob,
    filename: `${baseName}_trimmed.pdf`,
    originalSize: buffer.byteLength,
    processedSize: blob.size,
    previewUrl: URL.createObjectURL(blob),
    previewType: 'pdf',
  };
}

/**
 * 12. EXTRACT PDF PAGES
 */
export async function extractPdfPages(
  buffer: ArrayBuffer,
  originalFilename: string,
  pagesToKeep: number[], // 1-based page numbers
  options?: {
    mode?: 'single' | 'separate';
  },
  onProgress?: (progress: number) => void
): Promise<ProcessingResult> {
  const srcDoc = await PDFDocument.load(buffer, { ignoreEncryption: true });
  const totalPages = srcDoc.getPageCount();

  const validPages = pagesToKeep
    .filter((p) => p >= 1 && p <= totalPages)
    .sort((a, b) => a - b);

  if (validPages.length === 0) {
    throw new Error('Please select at least one valid page to extract.');
  }

  const validIndices = validPages.map((p) => p - 1);
  const baseName = sanitizeFilename(originalFilename.replace(/\.pdf$/i, ''), 'extracted');

  if (options?.mode === 'separate' && validPages.length > 1) {
    const zip = new JSZip();
    const padLen = String(Math.max(...validPages)).length;

    for (let i = 0; i < validIndices.length; i++) {
      const pageIndex = validIndices[i];
      const pageNum = validPages[i];
      const singleDoc = await PDFDocument.create();
      const [copiedPage] = await singleDoc.copyPages(srcDoc, [pageIndex]);
      singleDoc.addPage(copiedPage);

      const singlePdfBytes = await singleDoc.save();
      const paddedNum = String(pageNum).padStart(padLen, '0');
      zip.file(`${baseName}_page_${paddedNum}.pdf`, singlePdfBytes);

      if (onProgress) {
        onProgress(Math.round(((i + 1) / validIndices.length) * 85));
      }
    }

    const zipBlob = await zip.generateAsync({ type: 'blob' }, (meta) => {
      if (onProgress) onProgress(85 + Math.round(meta.percent * 0.15));
    });

    return {
      blob: zipBlob,
      filename: `${baseName}_extracted_pages.zip`,
      originalSize: buffer.byteLength,
      processedSize: zipBlob.size,
      previewType: 'zip',
    };
  } else {
    const newDoc = await PDFDocument.create();
    const copiedPages = await newDoc.copyPages(srcDoc, validIndices);
    copiedPages.forEach((page) => newDoc.addPage(page));

    if (onProgress) onProgress(90);

    const pdfBytes = await newDoc.save();
    const blob = new Blob([pdfBytes], { type: 'application/pdf' });

    if (onProgress) onProgress(100);

    return {
      blob,
      filename: `${baseName}_extracted.pdf`,
      originalSize: buffer.byteLength,
      processedSize: blob.size,
      previewUrl: URL.createObjectURL(blob),
      previewType: 'pdf',
    };
  }
}

/**
 * 13. PROTECT PDF (Add Password & Security)
 * Encrypts a PDF document client-side using standard PDF 128-bit encryption
 * with @pdfsmaller/pdf-encrypt-lite in local browser memory.
 */
export async function protectPdf(
  buffer: ArrayBuffer,
  originalFilename: string,
  userPassword: string,
  ownerPassword?: string,
  onProgress?: (progress: number) => void
): Promise<ProcessingResult> {
  if (!userPassword || userPassword.trim().length === 0) {
    throw new Error('Please specify a password to protect your PDF.');
  }

  if (onProgress) onProgress(20);

  // Load document structure first
  let srcDoc: PDFDocument;
  try {
    srcDoc = await PDFDocument.load(buffer, { ignoreEncryption: true });
  } catch (err: any) {
    throw new Error(`Failed to load "${originalFilename}": The file may be damaged or invalid.`);
  }

  if (onProgress) onProgress(40);

  // Re-save standard clean PDF bytes
  const cleanPdfBytes = await srcDoc.save({ useObjectStreams: false });

  if (onProgress) onProgress(60);

  // Encrypt PDF bytes using @pdfsmaller/pdf-encrypt-lite
  let encryptedBytes: Uint8Array;
  try {
    encryptedBytes = await encryptPDF(
      cleanPdfBytes,
      userPassword,
      ownerPassword || userPassword
    );
  } catch (encErr: any) {
    throw new Error(`Failed to encrypt PDF: ${encErr?.message || 'Encryption failed'}`);
  }

  if (onProgress) onProgress(90);

  const blob = new Blob([encryptedBytes], { type: 'application/pdf' });
  const baseName = sanitizeFilename(originalFilename.replace(/\.pdf$/i, ''), 'protected');

  if (onProgress) onProgress(100);

  return {
    blob,
    filename: `${baseName}_protected.pdf`,
    originalSize: buffer.byteLength,
    processedSize: blob.size,
    previewUrl: URL.createObjectURL(blob),
    previewType: 'pdf',
  };
}

/**
 * 14. UNLOCK PDF
 * Authorized decryption and restriction removal executed locally in browser memory.
 */
export async function unlockPdf(
  buffer: ArrayBuffer,
  originalFilename: string,
  password?: string,
  onProgress?: (progress: number) => void
): Promise<ProcessingResult> {
  if (onProgress) onProgress(15);

  // Check if document requires password or if password provided is valid via pdfjsLib
  const uint8 = new Uint8Array(buffer);
  let pdfjsDoc: any = null;

  try {
    const task = pdfjsLib.getDocument({
      data: uint8,
      password: password || undefined,
    });
    pdfjsDoc = await task.promise;
  } catch (err: any) {
    const msg = err?.message?.toLowerCase() || '';
    const name = err?.name || '';
    const code = err?.code;

    if (name === 'PasswordException' || code === 1 || code === 2 || /password/i.test(msg)) {
      if (!password || password.trim().length === 0 || code === 1 || /no password/i.test(msg)) {
        throw new Error('This PDF is password-protected. Please enter the document password to unlock it.');
      } else {
        throw new Error('Incorrect password. Please verify and enter the valid document password.');
      }
    }
    throw new Error(`Failed to read "${originalFilename}": ${err?.message || 'The file may be corrupted.'}`);
  }

  if (onProgress) onProgress(45);

  const numPages = pdfjsDoc.numPages;
  if (numPages === 0) {
    throw new Error('This document contains no pages.');
  }

  // Attempt lossless vector unlocking by creating a fresh unencrypted PDFDocument and copying pages
  let unlockedBlob: Blob | null = null;
  try {
    const loadedDoc = await PDFDocument.load(buffer, { ignoreEncryption: true });
    const freshDoc = await PDFDocument.create();
    const pageIndices = loadedDoc.getPageIndices();
    const copiedPages = await freshDoc.copyPages(loadedDoc, pageIndices);
    copiedPages.forEach((p) => freshDoc.addPage(p));

    const savedBytes = await freshDoc.save();
    unlockedBlob = new Blob([savedBytes], { type: 'application/pdf' });
  } catch (vectorErr) {
    // If vector copy fails due to encrypted content streams, reconstruct cleanly from verified decrypted pdfjs pages
    console.warn('Vector stream extraction failed, falling back to decrypted page rendering:', vectorErr);
    const renderDoc = await PDFDocument.create();

    for (let i = 1; i <= numPages; i++) {
      const page = await pdfjsDoc.getPage(i);
      const viewport = page.getViewport({ scale: 2.0 });
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (ctx) {
        canvas.width = Math.floor(viewport.width);
        canvas.height = Math.floor(viewport.height);
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        await (page.render({ canvasContext: ctx, viewport, canvas } as any)).promise;
        const dataUrl = canvas.toDataURL('image/jpeg', 0.92);
        canvas.width = 0;
        canvas.height = 0;
        const jpgBytes = dataUrlToUint8Array(dataUrl);
        const embedded = await renderDoc.embedJpg(jpgBytes);
        const origViewport = page.getViewport({ scale: 1.0 });
        const newP = renderDoc.addPage([origViewport.width, origViewport.height]);
        newP.drawImage(embedded, {
          x: 0,
          y: 0,
          width: origViewport.width,
          height: origViewport.height,
        });
      }
      if (onProgress) onProgress(Math.round(45 + (i / numPages) * 45));
    }
    const renderedBytes = await renderDoc.save();
    unlockedBlob = new Blob([renderedBytes], { type: 'application/pdf' });
  }

  if (onProgress) onProgress(100);

  const baseName = sanitizeFilename(originalFilename.replace(/\.pdf$/i, ''), 'unlocked');

  return {
    blob: unlockedBlob,
    filename: `${baseName}_unlocked.pdf`,
    originalSize: buffer.byteLength,
    processedSize: unlockedBlob.size,
    previewUrl: URL.createObjectURL(unlockedBlob),
    previewType: 'pdf',
  };
}

/**
 * Creates a high-DPI transparent PNG badge for Unicode watermark text
 */
async function createUnicodeWatermarkImage(
  text: string,
  fontSize: number,
  colorHex: string,
  opacity: number
): Promise<{ buffer: ArrayBuffer; width: number; height: number }> {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    throw new Error('Canvas 2D context not available.');
  }

  const scale = 2;
  const scaledFontSize = Math.max(16, fontSize) * scale;
  const fontStack = 'bold ' + scaledFontSize + 'px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif';
  ctx.font = fontStack;

  const metrics = ctx.measureText(text);
  const textWidth = Math.ceil(metrics.width);
  const textHeight = Math.ceil(scaledFontSize * 1.3);

  const pad = 20 * scale;
  canvas.width = textWidth + pad * 2;
  canvas.height = textHeight + pad * 2;

  const drawCtx = canvas.getContext('2d')!;
  drawCtx.clearRect(0, 0, canvas.width, canvas.height);
  drawCtx.font = fontStack;
  drawCtx.fillStyle = colorHex;
  drawCtx.globalAlpha = opacity;
  drawCtx.textBaseline = 'middle';
  drawCtx.textAlign = 'center';
  drawCtx.fillText(text, canvas.width / 2, canvas.height / 2);

  const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, 'image/png'));
  canvas.width = 0;
  canvas.height = 0;

  if (!blob) {
    throw new Error('Failed to generate watermark raster image.');
  }

  const buf = await blob.arrayBuffer();
  return {
    buffer: buf,
    width: (textWidth + pad * 2) / scale,
    height: (textHeight + pad * 2) / scale,
  };
}

/**
 * 15. WATERMARK PDF
 */
export async function watermarkPdf(
  buffer: ArrayBuffer,
  originalFilename: string,
  options: {
    text: string;
    fontSize: number;
    opacity: number;
    rotation: number;
    colorHex: string;
    position: 'center' | 'header' | 'footer' | 'top-left' | 'bottom-right' | 'tiled';
  },
  onProgress?: (progress: number) => void
): Promise<ProcessingResult> {
  const text = options.text.trim();
  if (!text) {
    throw new Error('Please enter watermark text.');
  }

  const pdfDoc = await PDFDocument.load(buffer, { ignoreEncryption: true });
  const totalPages = pdfDoc.getPageCount();
  const color = hexToRgb(options.colorHex || '#64748b');
  const pdfColor = rgb(color.r, color.g, color.b);
  const opacity = Math.max(0.05, Math.min(1.0, options.opacity || 0.25));
  const isAllAnsi = canEncodeWinAnsi(text);

  if (isAllAnsi) {
    const font = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    for (let i = 0; i < totalPages; i++) {
      const page = pdfDoc.getPage(i);
      const { width, height } = page.getSize();
      const textSize = options.fontSize || 42;
      const textWidth = font.widthOfTextAtSize(text, textSize);
      const textHeight = font.heightAtSize(textSize);

      if (options.position === 'center') {
        page.drawText(text, {
          x: (width - textWidth) / 2,
          y: (height - textHeight) / 2,
          size: textSize,
          font,
          color: pdfColor,
          opacity,
          rotate: degrees(options.rotation || 45),
        });
      } else if (options.position === 'header') {
        page.drawText(text, {
          x: (width - textWidth) / 2,
          y: height - 40,
          size: Math.min(textSize, 20),
          font,
          color: pdfColor,
          opacity,
        });
      } else if (options.position === 'footer') {
        page.drawText(text, {
          x: (width - textWidth) / 2,
          y: 30,
          size: Math.min(textSize, 18),
          font,
          color: pdfColor,
          opacity,
        });
      } else if (options.position === 'top-left') {
        page.drawText(text, {
          x: 40,
          y: height - 40,
          size: Math.min(textSize, 20),
          font,
          color: pdfColor,
          opacity,
        });
      } else if (options.position === 'bottom-right') {
        page.drawText(text, {
          x: Math.max(20, width - textWidth - 40),
          y: 30,
          size: Math.min(textSize, 18),
          font,
          color: pdfColor,
          opacity,
        });
      } else if (options.position === 'tiled') {
        const stepX = textWidth + 100;
        const stepY = textHeight + 120;
        for (let x = -50; x < width + 100; x += stepX) {
          for (let y = -50; y < height + 100; y += stepY) {
            page.drawText(text, {
              x,
              y,
              size: Math.min(textSize, 24),
              font,
              color: pdfColor,
              opacity: opacity * 0.8,
              rotate: degrees(options.rotation || 30),
            });
          }
        }
      }

      if (onProgress) {
        onProgress(Math.round(((i + 1) / totalPages) * 100));
      }
    }
  } else {
    // Unicode text watermark: generate high-DPI transparent raster image and embed
    const watermarkImgData = await createUnicodeWatermarkImage(
      text,
      options.fontSize || 42,
      options.colorHex || '#64748b',
      opacity
    );
    const embeddedImg = await pdfDoc.embedPng(watermarkImgData.buffer);

    for (let i = 0; i < totalPages; i++) {
      const page = pdfDoc.getPage(i);
      const { width, height } = page.getSize();
      const imgW = watermarkImgData.width;
      const imgH = watermarkImgData.height;

      if (options.position === 'center') {
        page.drawImage(embeddedImg, {
          x: (width - imgW) / 2,
          y: (height - imgH) / 2,
          width: imgW,
          height: imgH,
          rotate: degrees(options.rotation || 45),
        });
      } else if (options.position === 'header') {
        const scale = Math.min(1, 24 / imgH);
        page.drawImage(embeddedImg, {
          x: (width - imgW * scale) / 2,
          y: height - 45,
          width: imgW * scale,
          height: imgH * scale,
        });
      } else if (options.position === 'footer') {
        const scale = Math.min(1, 20 / imgH);
        page.drawImage(embeddedImg, {
          x: (width - imgW * scale) / 2,
          y: 25,
          width: imgW * scale,
          height: imgH * scale,
        });
      } else if (options.position === 'top-left') {
        const scale = Math.min(1, 24 / imgH);
        page.drawImage(embeddedImg, {
          x: 40,
          y: height - 45,
          width: imgW * scale,
          height: imgH * scale,
        });
      } else if (options.position === 'bottom-right') {
        const scale = Math.min(1, 20 / imgH);
        page.drawImage(embeddedImg, {
          x: Math.max(20, width - imgW * scale - 40),
          y: 25,
          width: imgW * scale,
          height: imgH * scale,
        });
      } else if (options.position === 'tiled') {
        const stepX = imgW + 80;
        const stepY = imgH + 80;
        for (let x = -50; x < width + 100; x += stepX) {
          for (let y = -50; y < height + 100; y += stepY) {
            page.drawImage(embeddedImg, {
              x,
              y,
              width: imgW * 0.7,
              height: imgH * 0.7,
              rotate: degrees(options.rotation || 30),
            });
          }
        }
      }

      if (onProgress) {
        onProgress(Math.round(((i + 1) / totalPages) * 100));
      }
    }
  }

  const pdfBytes = await pdfDoc.save();
  const blob = new Blob([pdfBytes], { type: 'application/pdf' });
  const baseName = sanitizeFilename(originalFilename.replace(/\.pdf$/i, ''), 'watermarked');

  return {
    blob,
    filename: `${baseName}_watermarked.pdf`,
    originalSize: buffer.byteLength,
    processedSize: blob.size,
    previewUrl: URL.createObjectURL(blob),
    previewType: 'pdf',
  };
}
