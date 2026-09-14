import { Download, CheckCircle2, AlertCircle, RotateCcw, FileText, ArrowDown, Sparkles } from 'lucide-react';
import { ProcessingResult } from '../../types';

interface ProcessingModalProps {
  isOpen: boolean;
  isProcessing: boolean;
  progress: number;
  statusMessage?: string;
  result: ProcessingResult | null;
  error: string | null;
  onReset: () => void;
  toolName: string;
}

function formatBytes(bytes?: number): string {
  if (!bytes || bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

export function ProcessingModal({
  isOpen,
  isProcessing,
  progress,
  statusMessage = 'Processing document...',
  result,
  error,
  onReset,
  toolName,
}: ProcessingModalProps) {
  if (!isOpen) return null;

  const handleDownload = () => {
    if (!result) return;
    const url = URL.createObjectURL(result.blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = result.filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 10000);
  };

  const savingsPercent =
    result?.originalSize && result?.processedSize && result.originalSize > result.processedSize
      ? Math.round(((result.originalSize - result.processedSize) / result.originalSize) * 100)
      : null;

  return (
    <div
      id="processing-modal-backdrop"
      className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4"
    >
      <div
        id="processing-modal-card"
        className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 p-6 sm:p-8 overflow-hidden animate-in fade-in zoom-in-95 duration-200"
      >
        {isProcessing && (
          <div className="text-center py-6 space-y-5">
            <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto relative">
              <Sparkles className="w-8 h-8 animate-pulse text-blue-600" />
            </div>

            <div>
              <h3 className="text-lg font-bold text-slate-900 mb-1">
                {toolName} in progress
              </h3>
              <p className="text-xs sm:text-sm text-slate-500">{statusMessage}</p>
            </div>

            {/* Progress bar */}
            <div className="space-y-2 max-w-xs mx-auto">
              <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden p-0.5 border border-slate-200">
                <div
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 h-full rounded-full transition-all duration-300 ease-out"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <div className="text-xs font-mono font-bold text-blue-600">{progress}%</div>
            </div>

            <p className="text-[11px] text-emerald-600 font-medium pt-2">
              🔒 Executing in local browser memory. No data is being sent to external servers.
            </p>
          </div>
        )}

        {!isProcessing && result && (
          <div className="text-center py-4 space-y-6">
            <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto shadow-xs">
              <CheckCircle2 className="w-9 h-9" />
            </div>

            <div>
              <h3 className="text-xl font-bold text-slate-900 mb-1">Your document is ready!</h3>
              <p className="text-xs sm:text-sm text-slate-500 font-mono">
                {result.filename}
              </p>
            </div>

            {/* File Analytics / Stats */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex items-center justify-around text-xs">
              {result.originalSize ? (
                <div>
                  <span className="text-slate-400 block text-[11px]">Original Size</span>
                  <span className="font-semibold text-slate-700">{formatBytes(result.originalSize)}</span>
                </div>
              ) : null}

              {result.originalSize && result.processedSize ? (
                <ArrowDown className="w-4 h-4 text-slate-300" />
              ) : null}

              <div>
                <span className="text-slate-400 block text-[11px]">Final Size</span>
                <span className="font-bold text-slate-900">{formatBytes(result.processedSize)}</span>
              </div>

              {savingsPercent !== null && (
                <div className="bg-emerald-100 text-emerald-800 px-2.5 py-1 rounded-lg font-bold">
                  -{savingsPercent}% Saved
                </div>
              )}
            </div>

            {/* Primary Action Buttons */}
            <div className="space-y-3">
              <button
                id="download-processed-file-btn"
                type="button"
                onClick={handleDownload}
                className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-base rounded-xl shadow-lg hover:shadow-xl transition-all cursor-pointer"
              >
                <Download className="w-5 h-5" />
                Download {result.filename.endsWith('.zip') ? 'ZIP Archive' : 'File'}
              </button>

              <button
                type="button"
                onClick={onReset}
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-semibold rounded-xl transition-colors cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
                Process Another Document
              </button>
            </div>
          </div>
        )}

        {!isProcessing && error && (
          <div className="text-center py-4 space-y-5">
            <div className="w-16 h-16 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center mx-auto">
              <AlertCircle className="w-9 h-9" />
            </div>

            <div>
              <h3 className="text-lg font-bold text-slate-900 mb-1">Processing Failed</h3>
              <p className="text-sm text-red-600 bg-red-50 p-3 rounded-xl border border-red-100">
                {error}
              </p>
            </div>

            <button
              type="button"
              onClick={onReset}
              className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 bg-slate-800 hover:bg-slate-900 text-white font-semibold text-sm rounded-xl transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              Try Again with Another File
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
