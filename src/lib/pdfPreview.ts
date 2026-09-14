import * as pdfjsLib from 'pdfjs-dist';

// Configure worker safely for browser environment
if (typeof window !== 'undefined' && !pdfjsLib.GlobalWorkerOptions.workerSrc) {
  pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;
}

export interface RenderedPdfPage {
  pageNumber: number;
  dataUrl: string;
  width: number;
  height: number;
}

/**
 * Loads a PDF from an ArrayBuffer and renders all pages as thumbnail data URLs
 */
export async function renderPdfThumbnails(
  arrayBuffer: ArrayBuffer,
  maxPages: number = 100,
  scale: number = 0.5,
  onProgress?: (current: number, total: number) => void
): Promise<RenderedPdfPage[]> {
  try {
    const loadingTask = pdfjsLib.getDocument({ data: new Uint8Array(arrayBuffer) });
    const pdfDoc = await loadingTask.promise;
    const totalPages = Math.min(pdfDoc.numPages, maxPages);
    const pages: RenderedPdfPage[] = [];

    for (let i = 1; i <= totalPages; i++) {
      const page = await pdfDoc.getPage(i);
      const viewport = page.getViewport({ scale });

      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) continue;

      canvas.width = viewport.width;
      canvas.height = viewport.height;

      // Draw white background
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const renderContext = {
        canvasContext: ctx,
        viewport: viewport,
        canvas: canvas,
      };

      await (page.render(renderContext as any)).promise;

      const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
      canvas.width = 0;
      canvas.height = 0;

      pages.push({
        pageNumber: i,
        dataUrl,
        width: viewport.width,
        height: viewport.height,
      });

      if (onProgress) {
        onProgress(i, totalPages);
      }
    }

    return pages;
  } catch (error) {
    console.error('Failed to render PDF thumbnails:', error);
    throw new Error('Unable to render PDF preview. The file might be corrupted or password protected.');
  }
}

/**
 * Get total page count of a PDF quickly without full render
 */
export async function getPdfPageCount(arrayBuffer: ArrayBuffer): Promise<number> {
  try {
    const loadingTask = pdfjsLib.getDocument({ data: new Uint8Array(arrayBuffer) });
    const pdfDoc = await loadingTask.promise;
    return pdfDoc.numPages;
  } catch (error) {
    console.error('Failed to get page count:', error);
    return 1;
  }
}

/**
 * Extracts plain text lines and structural content from PDF using pdfjs-dist
 */
export async function extractPdfText(
  arrayBuffer: ArrayBuffer,
  onProgress?: (current: number, total: number) => void
): Promise<{ pageNumber: number; text: string; lines: string[] }[]> {
  const loadingTask = pdfjsLib.getDocument({ data: new Uint8Array(arrayBuffer) });
  const pdfDoc = await loadingTask.promise;
  const results: { pageNumber: number; text: string; lines: string[] }[] = [];

  for (let i = 1; i <= pdfDoc.numPages; i++) {
    const page = await pdfDoc.getPage(i);
    const content = await page.getTextContent();
    
    // Group text items by roughly same Y coordinate to preserve lines
    const lineMap = new Map<number, string[]>();
    for (const item of content.items as any[]) {
      if (!item.str) continue;
      const y = Math.round(item.transform[5] / 4) * 4; // approximate baseline
      if (!lineMap.has(y)) {
        lineMap.set(y, []);
      }
      lineMap.get(y)!.push(item.str);
    }

    // Sort baselines top to bottom (descending Y)
    const sortedBaselines = Array.from(lineMap.keys()).sort((a, b) => b - a);
    const lines = sortedBaselines.map(y => lineMap.get(y)!.join(' ').trim()).filter(Boolean);
    const fullText = lines.join('\n');

    results.push({
      pageNumber: i,
      text: fullText,
      lines,
    });

    if (onProgress) {
      onProgress(i, pdfDoc.numPages);
    }
  }

  return results;
}
