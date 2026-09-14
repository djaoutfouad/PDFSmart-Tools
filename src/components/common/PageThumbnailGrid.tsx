import { useState, useEffect } from 'react';
import { RotateCw, Check, Trash2, CheckSquare, Square, Loader2 } from 'lucide-react';
import { renderPdfThumbnails, RenderedPdfPage } from '../../lib/pdfPreview';

interface PageThumbnailGridProps {
  arrayBuffer: ArrayBuffer;
  mode: 'select' | 'rotate' | 'delete';
  selectedPages?: number[]; // 1-based page numbers
  pageRotations?: Map<number, number>; // pageNumber -> degrees
  onTogglePage?: (pageNumber: number) => void;
  onSelectAll?: () => void;
  onDeselectAll?: () => void;
  onRotatePage?: (pageNumber: number) => void;
  maxPagesRender?: number;
}

export function PageThumbnailGrid({
  arrayBuffer,
  mode,
  selectedPages = [],
  pageRotations = new Map(),
  onTogglePage,
  onSelectAll,
  onDeselectAll,
  onRotatePage,
  maxPagesRender = 60,
}: PageThumbnailGridProps) {
  const [pages, setPages] = useState<RenderedPdfPage[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [renderError, setRenderError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setRenderError(null);

    renderPdfThumbnails(arrayBuffer, maxPagesRender, 0.4, (curr, total) => {
      if (isMounted) {
        setLoadingProgress(Math.round((curr / total) * 100));
      }
    })
      .then((rendered) => {
        if (isMounted) {
          setPages(rendered);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (isMounted) {
          console.error(err);
          setRenderError('Unable to generate page thumbnails. Document might be encrypted or corrupted.');
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [arrayBuffer, maxPagesRender]);

  if (loading) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center space-y-3">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin mx-auto" />
        <p className="font-semibold text-slate-800 text-sm">Rendering PDF Page Previews...</p>
        <div className="w-48 bg-slate-100 rounded-full h-2 mx-auto overflow-hidden">
          <div
            className="bg-blue-600 h-full transition-all duration-200 rounded-full"
            style={{ width: `${loadingProgress}%` }}
          />
        </div>
        <p className="text-xs text-slate-400">{loadingProgress}% completed</p>
      </div>
    );
  }

  if (renderError) {
    return (
      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 text-center text-amber-800 text-sm">
        {renderError}
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-6 shadow-xs space-y-4">
      {/* Batch toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100">
        <div>
          <h4 className="font-bold text-slate-900 text-sm">
            Document Pages ({pages.length})
          </h4>
          <p className="text-xs text-slate-500">
            {mode === 'delete' && 'Click on pages you want to remove from the document.'}
            {mode === 'select' && 'Click on pages to toggle selection.'}
            {mode === 'rotate' && 'Click the rotate button on any card to rotate 90°.'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {onSelectAll && (
            <button
              type="button"
              onClick={onSelectAll}
              className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md transition-colors"
            >
              <CheckSquare className="w-3.5 h-3.5" />
              Select All
            </button>
          )}
          {onDeselectAll && (
            <button
              type="button"
              onClick={onDeselectAll}
              className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md transition-colors"
            >
              <Square className="w-3.5 h-3.5" />
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Pages Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 max-h-[460px] overflow-y-auto p-1">
        {pages.map((p) => {
          const isSelected = selectedPages.includes(p.pageNumber);
          const rotationAngle = pageRotations.get(p.pageNumber) || 0;

          return (
            <div
              key={p.pageNumber}
              onClick={() => onTogglePage && onTogglePage(p.pageNumber)}
              className={`group relative rounded-xl border-2 p-2 transition-all cursor-pointer flex flex-col items-center bg-slate-50 ${
                mode === 'delete'
                  ? isSelected
                    ? 'border-red-500 bg-red-50/60 shadow-xs'
                    : 'border-slate-200 hover:border-slate-300'
                  : isSelected
                  ? 'border-blue-600 bg-blue-50/70 shadow-xs'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              {/* Thumbnail Container */}
              <div className="relative w-full aspect-[3/4] bg-white rounded-lg border border-slate-200 overflow-hidden flex items-center justify-center">
                <img
                  src={p.dataUrl}
                  alt={`Page ${p.pageNumber}`}
                  className="max-h-full max-w-full object-contain transition-transform duration-200"
                  style={{
                    transform: `rotate(${rotationAngle}deg)`,
                  }}
                />

                {/* Badges and actions */}
                {mode === 'delete' && isSelected && (
                  <div className="absolute inset-0 bg-red-600/30 backdrop-blur-2xs flex items-center justify-center">
                    <div className="bg-red-600 text-white p-2 rounded-full shadow-md">
                      <Trash2 className="w-5 h-5" />
                    </div>
                  </div>
                )}

                {mode === 'select' && isSelected && (
                  <div className="absolute top-2 right-2 bg-blue-600 text-white rounded-full p-1 shadow-xs">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                )}

                {mode === 'rotate' && onRotatePage && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onRotatePage(p.pageNumber);
                    }}
                    className="absolute bottom-2 right-2 bg-slate-900/80 hover:bg-blue-600 text-white p-1.5 rounded-lg shadow-md transition-colors"
                    title="Rotate 90° Clockwise"
                  >
                    <RotateCw className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Page Number footer */}
              <div className="mt-2 text-center text-xs font-semibold text-slate-700 flex items-center gap-1">
                <span>Page {p.pageNumber}</span>
                {rotationAngle > 0 && (
                  <span className="text-[10px] text-blue-600 font-mono">({rotationAngle}°)</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
