import { useState, useEffect } from 'react';
import { 
  Play, 
  Settings2, 
  Lock, 
  Unlock,
  RotateCw, 
  RotateCcw,
  Stamp, 
  Layers, 
  Minimize2, 
  Sparkles, 
  FileText, 
  ShieldCheck, 
  Info,
  Sliders,
  Type,
  AlertCircle,
  Check,
  Eye,
  EyeOff,
  Trash2,
  Copy,
  FileCode,
  FileSpreadsheet,
  Palette,
  CheckSquare,
  Square
} from 'lucide-react';
import { ToolDefinition, ProcessingResult } from '../../types';
import { FileDropzone, UploadedFileItem } from '../common/FileDropzone';
import { PageThumbnailGrid } from '../common/PageThumbnailGrid';
import { ProcessingModal } from '../common/ProcessingModal';
import { 
  mergePdfs, 
  splitPdf, 
  compressPdf, 
  pdfToJpg, 
  imagesToPdf, 
  pdfToWord, 
  wordToPdf, 
  pdfToPng, 
  rotatePdf, 
  deletePdfPages, 
  extractPdfPages, 
  protectPdf, 
  unlockPdf, 
  watermarkPdf,
  parseAndValidatePageRanges
} from '../../lib/pdfEngine';
import { getPdfPageCount } from '../../lib/pdfPreview';

interface ToolRunnerProps {
  tool: ToolDefinition;
}

export function ToolRunner({ tool }: ToolRunnerProps) {
  const [files, setFiles] = useState<UploadedFileItem[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [statusMessage, setStatusMessage] = useState('');
  const [result, setResult] = useState<ProcessingResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  // Loaded document metrics
  const [docPageCount, setDocPageCount] = useState<number>(0);

  // Tool specific state options
  // Split
  const [splitMode, setSplitMode] = useState<'ranges' | 'visual' | 'all'>('ranges');
  const [splitRangeText, setSplitRangeText] = useState('1-2');

  // Compress
  const [compressLevel, setCompressLevel] = useState<'extreme' | 'recommended' | 'light'>('recommended');

  // PDF to Image (JPG / PNG)
  const [imageExtractMode, setImageExtractMode] = useState<'all' | 'custom'>('all');
  const [jpgQualityLevel, setJpgQualityLevel] = useState<'standard' | 'high' | 'ultra'>('high');
  const [pngScaleLevel, setPngScaleLevel] = useState<'screen' | 'hd' | 'ultra'>('hd');

  // JPG to PDF / PNG to PDF
  const [imgOrientation, setImgOrientation] = useState<'auto' | 'portrait' | 'landscape'>('auto');
  const [imgMargins, setImgMargins] = useState<'none' | 'small' | 'large'>('small');
  const [imgPageSize, setImgPageSize] = useState<'a4' | 'letter' | 'fit'>('a4');

  // Word to PDF
  const [docPageSize, setDocPageSize] = useState<'a4' | 'letter'>('a4');
  const [docMargin, setDocMargin] = useState<'standard' | 'wide' | 'compact'>('standard');

  // Rotate
  const [globalRotation, setGlobalRotation] = useState<number>(0);
  const [pageRotations, setPageRotations] = useState<Map<number, number>>(new Map());

  // Delete & Extract Pages
  const [selectedPages, setSelectedPages] = useState<number[]>([]);
  const [pageRangeInput, setPageRangeInput] = useState('');
  const [extractMode, setExtractMode] = useState<'single' | 'separate'>('single');

  // Protect / Unlock
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Watermark
  const [wmText, setWmText] = useState('CONFIDENTIAL');
  const [wmFontSize, setWmFontSize] = useState(44);
  const [wmOpacity, setWmOpacity] = useState(0.25);
  const [wmRotation, setWmRotation] = useState(45);
  const [wmColorHex, setWmColorHex] = useState('#64748b');
  const [wmPosition, setWmPosition] = useState<'center' | 'header' | 'footer' | 'top-left' | 'bottom-right' | 'tiled'>('center');

  // Detect total page count when primary PDF changes
  useEffect(() => {
    if (files.length > 0 && files[0].file.type === 'application/pdf') {
      getPdfPageCount(files[0].buffer)
        .then((count) => {
          setDocPageCount(count);
          if (count > 0 && splitRangeText === '1-2' && count === 1) {
            setSplitRangeText('1');
          } else if (count > 0 && splitRangeText === '1-2' && count > 1) {
            setSplitRangeText(`1-${Math.min(count, 3)}`);
          }
        })
        .catch(() => setDocPageCount(1));
    } else {
      setDocPageCount(0);
    }
  }, [files]);

  const handleReset = () => {
    setModalOpen(false);
    setIsProcessing(false);
    setProgress(0);
    setResult(null);
    setError(null);
    setFiles([]);
    setSelectedPages([]);
    setPageRangeInput('');
    setImageExtractMode('all');
    setPageRotations(new Map());
    setGlobalRotation(0);
    setPassword('');
    setConfirmPassword('');
    setShowPassword(false);
    setShowConfirmPassword(false);
  };

  const handleRotatePage = (pageNum: number) => {
    const current = pageRotations.get(pageNum) ?? globalRotation;
    const nextRot = (current + 90) % 360;
    const newMap = new Map(pageRotations);
    newMap.set(pageNum, nextRot);
    setPageRotations(newMap);
  };

  const handleRotateAll = (delta: number) => {
    const nextAngle = (((globalRotation + delta) % 360) + 360) % 360;
    setGlobalRotation(nextAngle);
    if (docPageCount > 0) {
      const newMap = new Map<number, number>();
      for (let i = 1; i <= docPageCount; i++) {
        const cur = pageRotations.get(i) ?? globalRotation;
        newMap.set(i, (((cur + delta) % 360) + 360) % 360);
      }
      setPageRotations(newMap);
    }
  };

  const handleResetRotations = () => {
    setGlobalRotation(0);
    setPageRotations(new Map());
  };

  const handleTogglePage = (pageNum: number) => {
    if (selectedPages.includes(pageNum)) {
      setSelectedPages(selectedPages.filter((p) => p !== pageNum));
    } else {
      setSelectedPages([...selectedPages, pageNum].sort((a, b) => a - b));
    }
  };

  const handleSelectOddPages = () => {
    if (docPageCount <= 0) return;
    const odds = Array.from({ length: docPageCount }, (_, i) => i + 1).filter((p) => p % 2 !== 0);
    setSelectedPages(odds);
  };

  const handleSelectEvenPages = () => {
    if (docPageCount <= 0) return;
    const evens = Array.from({ length: docPageCount }, (_, i) => i + 1).filter((p) => p % 2 === 0);
    setSelectedPages(evens);
  };

  const handleSelectAllPages = () => {
    if (docPageCount <= 0) return;
    setSelectedPages(Array.from({ length: docPageCount }, (_, i) => i + 1));
  };

  const handleApplyRangeInput = () => {
    if (!pageRangeInput.trim() || docPageCount <= 0) return;
    const parts = pageRangeInput.split(',').map((s) => s.trim()).filter(Boolean);
    const pages = new Set<number>();
    for (const part of parts) {
      if (part.includes('-')) {
        const [startStr, endStr] = part.split('-');
        const start = parseInt(startStr, 10);
        const end = parseInt(endStr, 10);
        if (!isNaN(start) && !isNaN(end)) {
          const min = Math.max(1, Math.min(start, end));
          const max = Math.min(docPageCount, Math.max(start, end));
          for (let i = min; i <= max; i++) pages.add(i);
        }
      } else {
        const p = parseInt(part, 10);
        if (!isNaN(p) && p >= 1 && p <= docPageCount) {
          pages.add(p);
        }
      }
    }
    setSelectedPages(Array.from(pages).sort((a, b) => a - b));
  };

  // Password strength helper
  const getPasswordStrength = (pwd: string) => {
    if (!pwd) return { label: 'None', color: 'bg-slate-200', score: 0 };
    let score = 0;
    if (pwd.length >= 6) score++;
    if (pwd.length >= 10) score++;
    if (/[A-Z]/.test(pwd) && /[a-z]/.test(pwd)) score++;
    if (/[0-9]/.test(pwd)) score++;
    if (/[^A-Za-z0-9]/.test(pwd)) score++;

    if (score <= 1) return { label: 'Weak', color: 'bg-red-500', score: 1 };
    if (score <= 3) return { label: 'Medium', color: 'bg-amber-500', score: 2 };
    return { label: 'Strong', color: 'bg-emerald-500', score: 3 };
  };

  // Live range validation for split tool
  const rangeValidation = tool.id === 'split-pdf' && splitMode === 'ranges'
    ? parseAndValidatePageRanges(splitRangeText, docPageCount)
    : { valid: true, pageIndices: [], pageNumbers: [] };

  const handleRunTool = async () => {
    if (files.length === 0) return;

    setIsProcessing(true);
    setProgress(10);
    setError(null);
    setResult(null);
    setModalOpen(true);
    setStatusMessage(`Preparing ${tool.name}...`);

    try {
      let res: ProcessingResult;

      switch (tool.id) {
        case 'merge-pdf': {
          if (files.length < 2) {
            throw new Error('Please select at least 2 PDF files to merge.');
          }
          setStatusMessage('Merging PDF documents in your specified order...');
          res = await mergePdfs(
            files.map((f) => ({ buffer: f.buffer, name: f.file.name })),
            (p) => setProgress(p)
          );
          break;
        }

        case 'split-pdf': {
          setStatusMessage('Splitting PDF pages...');
          if (splitMode === 'all') {
            res = await splitPdf(
              files[0].buffer,
              files[0].file.name,
              'all',
              undefined,
              (p) => setProgress(p)
            );
          } else if (splitMode === 'visual') {
            if (selectedPages.length === 0) {
              throw new Error('Please select at least one page to extract.');
            }
            res = await splitPdf(
              files[0].buffer,
              files[0].file.name,
              'custom_pages',
              selectedPages,
              (p) => setProgress(p)
            );
          } else {
            if (!rangeValidation.valid || rangeValidation.pageNumbers.length === 0) {
              throw new Error(rangeValidation.error || 'Invalid page range specified.');
            }
            res = await splitPdf(
              files[0].buffer,
              files[0].file.name,
              'custom_pages',
              rangeValidation.pageNumbers,
              (p) => setProgress(p)
            );
          }
          break;
        }

        case 'compress-pdf': {
          setStatusMessage(`Applying ${compressLevel} compression algorithm...`);
          res = await compressPdf(
            files[0].buffer,
            files[0].file.name,
            compressLevel,
            (p) => setProgress(p)
          );
          break;
        }

        case 'pdf-to-jpg': {
          setStatusMessage('Rendering PDF pages into high-resolution JPG images...');
          const qualityVal = jpgQualityLevel === 'standard' ? 0.8 : jpgQualityLevel === 'high' ? 0.92 : 0.99;
          const scaleVal = jpgQualityLevel === 'standard' ? 1.5 : jpgQualityLevel === 'high' ? 2.0 : 2.8;

          if (imageExtractMode === 'custom' && selectedPages.length === 0) {
            throw new Error('Please select at least one page to convert to JPG.');
          }

          res = await pdfToJpg(
            files[0].buffer,
            files[0].file.name,
            {
              quality: qualityVal,
              scale: scaleVal,
              pageNumbers: imageExtractMode === 'custom' ? selectedPages : undefined,
            },
            (p) => setProgress(p)
          );
          break;
        }

        case 'jpg-to-pdf': {
          setStatusMessage(`Compiling ${files.length} JPG images into standardized PDF document...`);
          res = await imagesToPdf(
            files.map((f) => ({ buffer: f.buffer, type: f.file.type, name: f.file.name })),
            {
              orientation: imgOrientation,
              margins: imgMargins,
              pageSize: imgPageSize,
            },
            (p) => setProgress(p)
          );
          break;
        }

        case 'pdf-to-word': {
          setStatusMessage('Extracting document paragraphs and structure to Word DOCX format...');
          res = await pdfToWord(
            files[0].buffer,
            files[0].file.name,
            (p) => setProgress(p)
          );
          break;
        }

        case 'word-to-pdf': {
          setStatusMessage('Parsing Word document and formatting into clean PDF pages...');
          res = await wordToPdf(
            files[0].buffer,
            files[0].file.name,
            {
              pageSize: docPageSize,
              margin: docMargin,
            },
            (p) => setProgress(p)
          );
          break;
        }

        case 'pdf-to-png': {
          setStatusMessage('Extracting PNG images from PDF pages...');
          const scaleVal = pngScaleLevel === 'screen' ? 1.0 : pngScaleLevel === 'hd' ? 2.0 : 3.0;

          if (imageExtractMode === 'custom' && selectedPages.length === 0) {
            throw new Error('Please select at least one page to convert to PNG.');
          }

          res = await pdfToPng(
            files[0].buffer,
            files[0].file.name,
            {
              scale: scaleVal,
              pageNumbers: imageExtractMode === 'custom' ? selectedPages : undefined,
            },
            (p) => setProgress(p)
          );
          break;
        }

        case 'png-to-pdf': {
          setStatusMessage(`Converting ${files.length} PNG images to clean PDF format...`);
          res = await imagesToPdf(
            files.map((f) => ({ buffer: f.buffer, type: f.file.type, name: f.file.name })),
            {
              orientation: imgOrientation,
              margins: imgMargins,
              pageSize: imgPageSize,
            },
            (p) => setProgress(p)
          );
          break;
        }

        case 'rotate-pdf': {
          setStatusMessage('Applying page rotations and updating document...');
          res = await rotatePdf(
            files[0].buffer,
            files[0].file.name,
            pageRotations.size > 0 ? pageRotations : globalRotation,
            (p) => setProgress(p)
          );
          break;
        }

        case 'delete-pdf-pages': {
          if (selectedPages.length === 0) {
            throw new Error('Please click on at least one page to delete.');
          }
          if (docPageCount > 0 && selectedPages.length >= docPageCount) {
            throw new Error('You cannot delete all pages. At least one page must remain in the document.');
          }
          setStatusMessage(`Removing ${selectedPages.length} selected pages...`);
          res = await deletePdfPages(
            files[0].buffer,
            files[0].file.name,
            selectedPages,
            (p) => setProgress(p)
          );
          break;
        }

        case 'extract-pdf-pages': {
          if (selectedPages.length === 0) {
            throw new Error('Please select at least one page to extract.');
          }
          setStatusMessage(`Extracting ${selectedPages.length} pages ${extractMode === 'separate' ? 'into separate PDFs' : 'into single PDF'}...`);
          res = await extractPdfPages(
            files[0].buffer,
            files[0].file.name,
            selectedPages,
            { mode: extractMode },
            (p) => setProgress(p)
          );
          break;
        }

        case 'protect-pdf': {
          if (!password) {
            throw new Error('Please enter a password to protect your PDF.');
          }
          if (password !== confirmPassword) {
            throw new Error('The passwords do not match. Please verify your password entry.');
          }
          setStatusMessage('Encrypting document with standard 128-bit encryption in browser memory...');
          res = await protectPdf(
            files[0].buffer,
            files[0].file.name,
            password,
            undefined,
            (p) => setProgress(p)
          );
          break;
        }

        case 'unlock-pdf': {
          setStatusMessage('Validating credentials and decrypting document in browser memory...');
          res = await unlockPdf(
            files[0].buffer,
            files[0].file.name,
            password,
            (p) => setProgress(p)
          );
          break;
        }

        case 'watermark-pdf': {
          if (!wmText.trim()) {
            throw new Error('Please enter watermark text.');
          }
          setStatusMessage('Stamping watermark onto document pages...');
          res = await watermarkPdf(
            files[0].buffer,
            files[0].file.name,
            {
              text: wmText,
              fontSize: wmFontSize,
              opacity: wmOpacity,
              rotation: wmRotation,
              colorHex: wmColorHex,
              position: wmPosition,
            },
            (p) => setProgress(p)
          );
          break;
        }

        default:
          throw new Error('Unknown tool selected.');
      }

      setResult(res);
      setProgress(100);
      setIsProcessing(false);
    } catch (err: any) {
      console.error(err);
      setError(err?.message || 'An unexpected error occurred during processing.');
      setIsProcessing(false);
    }
  };

  const hasFiles = files.length > 0;
  const isPdfSingleFile = hasFiles && files[0].file.type === 'application/pdf';
  const pwdStrength = getPasswordStrength(password);

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* File Dropzone */}
      <FileDropzone
        acceptMimeTypes={tool.acceptMimeTypes}
        inputFormats={tool.inputFormats}
        allowMultiple={tool.allowMultiple}
        maxFileSizeMb={tool.maxFileSizeMb}
        files={files}
        onFilesSelected={setFiles}
        onFileRemoved={(id) => {
          setFiles((prev) => prev.filter((f) => f.id !== id));
        }}
        onFilesReordered={setFiles}
      />

      {/* Tool Options Configuration Panel */}
      {hasFiles && (
        <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-7 shadow-xs space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
                <Settings2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Tool Configuration
                </h3>
                <p className="text-xs text-slate-500">
                  Fine-tune processing parameters before execution.
                </p>
              </div>
            </div>

            {docPageCount > 0 && isPdfSingleFile && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-100 text-slate-700 text-xs font-semibold rounded-full">
                <FileText className="w-3.5 h-3.5 text-blue-600" />
                {docPageCount} {docPageCount === 1 ? 'Page' : 'Pages'}
              </span>
            )}
          </div>

          {/* 1. COMPRESS OPTIONS */}
          {tool.id === 'compress-pdf' && (
            <div className="space-y-4">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Compression Level
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  {
                    id: 'extreme',
                    title: 'Extreme Compression',
                    desc: 'Smallest file size, good for low-bandwidth sharing.',
                    badge: 'Max Reduction',
                  },
                  {
                    id: 'recommended',
                    title: 'Recommended',
                    desc: 'Balanced file size reduction with crisp reading quality.',
                    badge: 'Best Balance',
                  },
                  {
                    id: 'light',
                    title: 'Light Compression',
                    desc: 'Highest visual fidelity, modest size reduction.',
                    badge: 'High Quality',
                  },
                ].map((lvl) => {
                  const isSelected = compressLevel === lvl.id;
                  return (
                    <div
                      key={lvl.id}
                      onClick={() => setCompressLevel(lvl.id as any)}
                      className={`relative p-4 rounded-xl border-2 cursor-pointer transition-all ${
                        isSelected
                          ? 'border-blue-600 bg-blue-50/50 shadow-xs'
                          : 'border-slate-200 hover:border-slate-300 bg-slate-50/40'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="font-bold text-sm text-slate-900">{lvl.title}</span>
                        {isSelected && <Check className="w-4 h-4 text-blue-600 stroke-[3]" />}
                      </div>
                      <p className="text-xs text-slate-500 leading-relaxed">{lvl.desc}</p>
                      <span className="inline-block mt-3 px-2 py-0.5 bg-slate-200/70 text-slate-700 text-[10px] font-semibold rounded-md">
                        {lvl.badge}
                      </span>
                    </div>
                  );
                })}
              </div>

              <div className="p-3.5 bg-blue-50/70 border border-blue-200 rounded-xl text-xs text-slate-600 flex items-start gap-2.5">
                <Minimize2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                <span>
                  <strong>How client-side compression works:</strong> Document pages are rendered to high-efficiency image frames at your selected resolution and recompiled into an optimized PDF binary. Visual layout and graphics are preserved, while page text is rasterized into image pages (not selectable).
                </span>
              </div>
            </div>
          )}

          {/* 2. PDF TO JPG OPTIONS */}
          {tool.id === 'pdf-to-jpg' && isPdfSingleFile && (
            <div className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Page Extraction Scope
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setImageExtractMode('all')}
                      className={`px-3 py-2 text-xs font-bold rounded-xl border-2 transition-all cursor-pointer ${
                        imageExtractMode === 'all'
                          ? 'border-blue-600 bg-blue-50 text-blue-700'
                          : 'border-slate-200 bg-slate-50 text-slate-700 hover:border-slate-300'
                      }`}
                    >
                      All Pages ({docPageCount})
                    </button>
                    <button
                      type="button"
                      onClick={() => setImageExtractMode('custom')}
                      className={`px-3 py-2 text-xs font-bold rounded-xl border-2 transition-all cursor-pointer ${
                        imageExtractMode === 'custom'
                          ? 'border-blue-600 bg-blue-50 text-blue-700'
                          : 'border-slate-200 bg-slate-50 text-slate-700 hover:border-slate-300'
                      }`}
                    >
                      Select Pages ({selectedPages.length})
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                    JPG Quality & Resolution
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: 'standard', title: 'Standard', desc: '150 DPI' },
                      { id: 'high', title: 'High (HD)', desc: '300 DPI' },
                      { id: 'ultra', title: 'Ultra HD', desc: '400 DPI' },
                    ].map((q) => (
                      <button
                        key={q.id}
                        type="button"
                        onClick={() => setJpgQualityLevel(q.id as any)}
                        className={`p-2 text-center rounded-xl border-2 transition-all cursor-pointer ${
                          jpgQualityLevel === q.id
                            ? 'border-blue-600 bg-blue-50 text-blue-700 font-bold'
                            : 'border-slate-200 bg-slate-50 text-slate-700 hover:border-slate-300'
                        }`}
                      >
                        <div className="text-xs">{q.title}</div>
                        <div className="text-[10px] text-slate-500 font-normal">{q.desc}</div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {imageExtractMode === 'custom' && (
                <div className="pt-2">
                  <PageThumbnailGrid
                    arrayBuffer={files[0].buffer}
                    mode="select"
                    selectedPages={selectedPages}
                    onTogglePage={handleTogglePage}
                    onSelectAll={handleSelectAllPages}
                    onDeselectAll={() => setSelectedPages([])}
                  />
                </div>
              )}
            </div>
          )}

          {/* 3. PDF TO PNG OPTIONS */}
          {tool.id === 'pdf-to-png' && isPdfSingleFile && (
            <div className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Page Extraction Scope
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setImageExtractMode('all')}
                      className={`px-3 py-2 text-xs font-bold rounded-xl border-2 transition-all cursor-pointer ${
                        imageExtractMode === 'all'
                          ? 'border-blue-600 bg-blue-50 text-blue-700'
                          : 'border-slate-200 bg-slate-50 text-slate-700 hover:border-slate-300'
                      }`}
                    >
                      All Pages ({docPageCount})
                    </button>
                    <button
                      type="button"
                      onClick={() => setImageExtractMode('custom')}
                      className={`px-3 py-2 text-xs font-bold rounded-xl border-2 transition-all cursor-pointer ${
                        imageExtractMode === 'custom'
                          ? 'border-blue-600 bg-blue-50 text-blue-700'
                          : 'border-slate-200 bg-slate-50 text-slate-700 hover:border-slate-300'
                      }`}
                    >
                      Select Pages ({selectedPages.length})
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                    PNG Render Resolution
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: 'screen', title: 'Screen', desc: '1x Scale' },
                      { id: 'hd', title: 'HD Crisp', desc: '2x Scale' },
                      { id: 'ultra', title: 'Ultra HD', desc: '3x Scale' },
                    ].map((s) => (
                      <button
                        key={s.id}
                        type="button"
                        onClick={() => setPngScaleLevel(s.id as any)}
                        className={`p-2 text-center rounded-xl border-2 transition-all cursor-pointer ${
                          pngScaleLevel === s.id
                            ? 'border-blue-600 bg-blue-50 text-blue-700 font-bold'
                            : 'border-slate-200 bg-slate-50 text-slate-700 hover:border-slate-300'
                        }`}
                      >
                        <div className="text-xs">{s.title}</div>
                        <div className="text-[10px] text-slate-500 font-normal">{s.desc}</div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {imageExtractMode === 'custom' && (
                <div className="pt-2">
                  <PageThumbnailGrid
                    arrayBuffer={files[0].buffer}
                    mode="select"
                    selectedPages={selectedPages}
                    onTogglePage={handleTogglePage}
                    onSelectAll={handleSelectAllPages}
                    onDeselectAll={() => setSelectedPages([])}
                  />
                </div>
              )}
            </div>
          )}

          {/* 4. JPG TO PDF & PNG TO PDF OPTIONS */}
          {(tool.id === 'jpg-to-pdf' || tool.id === 'png-to-pdf') && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Page Orientation
                </label>
                <select
                  value={imgOrientation}
                  onChange={(e) => setImgOrientation(e.target.value as any)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:bg-white focus:ring-2 focus:ring-blue-500"
                >
                  <option value="auto">Auto (Match Image Ratio)</option>
                  <option value="portrait">Portrait</option>
                  <option value="landscape">Landscape</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Page Size
                </label>
                <select
                  value={imgPageSize}
                  onChange={(e) => setImgPageSize(e.target.value as any)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:bg-white focus:ring-2 focus:ring-blue-500"
                >
                  <option value="a4">A4 (210 × 297 mm)</option>
                  <option value="letter">US Letter (8.5 × 11 in)</option>
                  <option value="fit">Fit to Exact Image Size</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Page Margins
                </label>
                <select
                  value={imgMargins}
                  onChange={(e) => setImgMargins(e.target.value as any)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:bg-white focus:ring-2 focus:ring-blue-500"
                >
                  <option value="none">No Margins (Edge-to-Edge)</option>
                  <option value="small">Small Margins (10mm)</option>
                  <option value="large">Large Margins (20mm)</option>
                </select>
              </div>
            </div>
          )}

          {/* 5. PDF TO WORD OPTIONS */}
          {tool.id === 'pdf-to-word' && (
            <div className="space-y-4">
              <div className="p-4 bg-blue-50/60 border border-blue-200 rounded-xl space-y-2 text-sm text-slate-700">
                <div className="flex items-center gap-2 font-bold text-blue-900">
                  <FileText className="w-4 h-4 text-blue-600" />
                  Client-Side Word (.docx) Extraction
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  PDFSmart extracts structured text, headings, bullet lists, and paragraphs directly in your browser and packages them into a clean, editable Microsoft Word (<code className="text-blue-700 font-mono">.docx</code>) document.
                </p>
                <div className="flex flex-wrap items-center gap-3 pt-1 text-xs text-slate-600">
                  <span className="flex items-center gap-1"><Check className="w-3.5 h-3.5 text-emerald-600" /> Real DOCX output</span>
                  <span className="flex items-center gap-1"><Check className="w-3.5 h-3.5 text-emerald-600" /> Preserves paragraph flow</span>
                  <span className="flex items-center gap-1"><Check className="w-3.5 h-3.5 text-emerald-600" /> In-browser private processing</span>
                </div>
              </div>
            </div>
          )}

          {/* 6. WORD TO PDF OPTIONS */}
          {tool.id === 'word-to-pdf' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Target PDF Page Size
                  </label>
                  <select
                    value={docPageSize}
                    onChange={(e) => setDocPageSize(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:bg-white focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="a4">A4 (Standard 210 × 297 mm)</option>
                    <option value="letter">US Letter (8.5 × 11 in)</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Page Margins
                  </label>
                  <select
                    value={docMargin}
                    onChange={(e) => setDocMargin(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:bg-white focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="standard">Standard (50 pt / ~18 mm)</option>
                    <option value="wide">Wide (72 pt / 1 inch)</option>
                    <option value="compact">Compact (36 pt / 0.5 inch)</option>
                  </select>
                </div>
              </div>

              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-600 flex items-start gap-2.5">
                <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                <span>The in-browser DOCX parser processes text headings, paragraphs, and lists into formatted PDF pages without sending your confidential document over any network.</span>
              </div>
            </div>
          )}

          {/* 7. SPLIT OPTIONS */}
          {tool.id === 'split-pdf' && isPdfSingleFile && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  { id: 'ranges', title: 'Custom Range', desc: 'Extract specific page intervals (e.g. 1-3, 5).' },
                  { id: 'visual', title: 'Visual Selection', desc: 'Click thumbnails to pick exact pages.' },
                  { id: 'all', title: 'Extract Every Page', desc: 'Save every page as an individual PDF.' },
                ].map((mode) => (
                  <button
                    key={mode.id}
                    type="button"
                    onClick={() => setSplitMode(mode.id as any)}
                    className={`p-3.5 text-left rounded-xl border-2 transition-all cursor-pointer ${
                      splitMode === mode.id
                        ? 'border-blue-600 bg-blue-50/50 shadow-xs'
                        : 'border-slate-200 bg-slate-50/40 hover:border-slate-300'
                    }`}
                  >
                    <div className="font-bold text-sm text-slate-900 mb-1">{mode.title}</div>
                    <div className="text-xs text-slate-500">{mode.desc}</div>
                  </button>
                ))}
              </div>

              {splitMode === 'ranges' && (
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Page Ranges to Extract
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={splitRangeText}
                      onChange={(e) => setSplitRangeText(e.target.value)}
                      placeholder="e.g. 1-2, 4, 6-8"
                      className="flex-1 px-3.5 py-2 bg-white border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                    />
                  </div>
                  {!rangeValidation.valid && rangeValidation.error && (
                    <div className="flex items-center gap-1 text-xs text-red-600 font-semibold">
                      <AlertCircle className="w-3.5 h-3.5" />
                      {rangeValidation.error}
                    </div>
                  )}
                  {rangeValidation.valid && (
                    <p className="text-xs text-slate-500">
                      Extracting {rangeValidation.pageNumbers.length} pages: {rangeValidation.pageNumbers.join(', ')}
                    </p>
                  )}
                </div>
              )}

              {splitMode === 'visual' && (
                <PageThumbnailGrid
                  arrayBuffer={files[0].buffer}
                  mode="select"
                  selectedPages={selectedPages}
                  onTogglePage={handleTogglePage}
                  onSelectAll={handleSelectAllPages}
                  onDeselectAll={() => setSelectedPages([])}
                />
              )}
            </div>
          )}

          {/* 8. ROTATE PDF GRID */}
          {tool.id === 'rotate-pdf' && isPdfSingleFile && (
            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                <div className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Global Rotation
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleRotateAll(90)}
                    className="inline-flex items-center gap-1 px-3 py-1.5 bg-white hover:bg-blue-50 text-blue-700 border border-slate-200 hover:border-blue-300 rounded-lg text-xs font-bold transition-all shadow-2xs cursor-pointer"
                  >
                    <RotateCw className="w-3.5 h-3.5" />
                    +90° Clockwise
                  </button>
                  <button
                    type="button"
                    onClick={() => handleRotateAll(180)}
                    className="inline-flex items-center gap-1 px-3 py-1.5 bg-white hover:bg-blue-50 text-blue-700 border border-slate-200 hover:border-blue-300 rounded-lg text-xs font-bold transition-all shadow-2xs cursor-pointer"
                  >
                    <RotateCw className="w-3.5 h-3.5" />
                    +180°
                  </button>
                  <button
                    type="button"
                    onClick={() => handleRotateAll(270)}
                    className="inline-flex items-center gap-1 px-3 py-1.5 bg-white hover:bg-blue-50 text-blue-700 border border-slate-200 hover:border-blue-300 rounded-lg text-xs font-bold transition-all shadow-2xs cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    +270° (90° CCW)
                  </button>
                  <button
                    type="button"
                    onClick={handleResetRotations}
                    className="inline-flex items-center gap-1 px-3 py-1.5 bg-slate-200/80 hover:bg-slate-300 text-slate-700 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                  >
                    Reset (0°)
                  </button>
                </div>
              </div>

              <PageThumbnailGrid
                arrayBuffer={files[0].buffer}
                mode="rotate"
                pageRotations={pageRotations}
                onRotatePage={handleRotatePage}
              />
            </div>
          )}

          {/* 9. DELETE PDF PAGES */}
          {tool.id === 'delete-pdf-pages' && isPdfSingleFile && (
            <div className="space-y-4">
              {/* Batch selection toolbar */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Quick Page Selection
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      onClick={handleSelectOddPages}
                      className="px-2.5 py-1 text-xs font-semibold bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 rounded-lg transition-colors cursor-pointer"
                    >
                      Select Odd
                    </button>
                    <button
                      type="button"
                      onClick={handleSelectEvenPages}
                      className="px-2.5 py-1 text-xs font-semibold bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 rounded-lg transition-colors cursor-pointer"
                    >
                      Select Even
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedPages([])}
                      className="px-2.5 py-1 text-xs font-semibold bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg transition-colors cursor-pointer"
                    >
                      Clear Selection
                    </button>
                  </div>
                </div>

                {/* Range text input helper */}
                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="text"
                    value={pageRangeInput}
                    onChange={(e) => setPageRangeInput(e.target.value)}
                    placeholder="Or type pages to remove (e.g. 2, 4-6)..."
                    className="flex-1 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    type="button"
                    onClick={handleApplyRangeInput}
                    className="px-3 py-1.5 bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold rounded-lg transition-colors cursor-pointer"
                  >
                    Select
                  </button>
                </div>
              </div>

              <PageThumbnailGrid
                arrayBuffer={files[0].buffer}
                mode="delete"
                selectedPages={selectedPages}
                onTogglePage={handleTogglePage}
                onDeselectAll={() => setSelectedPages([])}
              />

              <div className="p-3 bg-red-50/60 border border-red-200 rounded-xl flex items-center justify-between text-xs">
                <span className="text-slate-700 font-medium">
                  Marked for deletion: <strong className="text-red-700">{selectedPages.length}</strong> of {docPageCount} page(s).
                </span>
                <span className="font-bold text-slate-900">
                  Remaining in output: {Math.max(0, docPageCount - selectedPages.length)} page(s)
                </span>
              </div>
            </div>
          )}

          {/* 10. EXTRACT PDF PAGES */}
          {tool.id === 'extract-pdf-pages' && isPdfSingleFile && (
            <div className="space-y-4">
              {/* Extraction Mode Switch */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setExtractMode('single')}
                  className={`p-3.5 text-left rounded-xl border-2 transition-all cursor-pointer ${
                    extractMode === 'single'
                      ? 'border-blue-600 bg-blue-50/60 shadow-xs'
                      : 'border-slate-200 bg-slate-50/40 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-sm text-slate-900">Single PDF Document</span>
                    {extractMode === 'single' && <Check className="w-4 h-4 text-blue-600 stroke-[3]" />}
                  </div>
                  <p className="text-xs text-slate-500">Combine all chosen pages into one concise PDF.</p>
                </button>

                <button
                  type="button"
                  onClick={() => setExtractMode('separate')}
                  className={`p-3.5 text-left rounded-xl border-2 transition-all cursor-pointer ${
                    extractMode === 'separate'
                      ? 'border-blue-600 bg-blue-50/60 shadow-xs'
                      : 'border-slate-200 bg-slate-50/40 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-sm text-slate-900">Individual PDFs (ZIP)</span>
                    {extractMode === 'separate' && <Check className="w-4 h-4 text-blue-600 stroke-[3]" />}
                  </div>
                  <p className="text-xs text-slate-500">Save each extracted page as an individual file in a ZIP.</p>
                </button>
              </div>

              {/* Batch selection toolbar */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Quick Page Selection
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      onClick={handleSelectAllPages}
                      className="px-2.5 py-1 text-xs font-semibold bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 rounded-lg transition-colors cursor-pointer"
                    >
                      Select All
                    </button>
                    <button
                      type="button"
                      onClick={handleSelectOddPages}
                      className="px-2.5 py-1 text-xs font-semibold bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 rounded-lg transition-colors cursor-pointer"
                    >
                      Select Odd
                    </button>
                    <button
                      type="button"
                      onClick={handleSelectEvenPages}
                      className="px-2.5 py-1 text-xs font-semibold bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 rounded-lg transition-colors cursor-pointer"
                    >
                      Select Even
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedPages([])}
                      className="px-2.5 py-1 text-xs font-semibold bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg transition-colors cursor-pointer"
                    >
                      Clear
                    </button>
                  </div>
                </div>

                {/* Range text input helper */}
                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="text"
                    value={pageRangeInput}
                    onChange={(e) => setPageRangeInput(e.target.value)}
                    placeholder="Or type pages to extract (e.g. 1, 3-5, 8)..."
                    className="flex-1 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    type="button"
                    onClick={handleApplyRangeInput}
                    className="px-3 py-1.5 bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold rounded-lg transition-colors cursor-pointer"
                  >
                    Select
                  </button>
                </div>
              </div>

              <PageThumbnailGrid
                arrayBuffer={files[0].buffer}
                mode="select"
                selectedPages={selectedPages}
                onTogglePage={handleTogglePage}
                onSelectAll={handleSelectAllPages}
                onDeselectAll={() => setSelectedPages([])}
              />

              <div className="p-3 bg-blue-50/60 border border-blue-200 rounded-xl flex items-center justify-between text-xs">
                <span className="text-slate-700 font-medium">
                  Selected to extract: <strong className="text-blue-700">{selectedPages.length}</strong> of {docPageCount} page(s).
                </span>
                <span className="font-bold text-slate-900">
                  Output: {extractMode === 'separate' ? `${selectedPages.length} PDF files (ZIP)` : '1 PDF document'}
                </span>
              </div>
            </div>
          )}

          {/* 11. PROTECT CONTROLS */}
          {tool.id === 'protect-pdf' && (
            <div className="space-y-5 max-w-xl">
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Document Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter a strong password to protect your PDF..."
                      className="w-full pl-4 pr-11 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-mono text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors p-1"
                      title={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>

                  {/* Password strength indicator */}
                  {password && (
                    <div className="mt-2 space-y-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-500">Security strength:</span>
                        <span className="font-semibold text-slate-700">{pwdStrength.label}</span>
                      </div>
                      <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden flex gap-1">
                        <div className={`h-full flex-1 rounded-full transition-all ${pwdStrength.score >= 1 ? pwdStrength.color : 'bg-transparent'}`} />
                        <div className={`h-full flex-1 rounded-full transition-all ${pwdStrength.score >= 2 ? pwdStrength.color : 'bg-transparent'}`} />
                        <div className={`h-full flex-1 rounded-full transition-all ${pwdStrength.score >= 3 ? pwdStrength.color : 'bg-transparent'}`} />
                      </div>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Re-enter your password to confirm..."
                      className="w-full pl-4 pr-11 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-mono text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors p-1"
                      title={showConfirmPassword ? 'Hide password' : 'Show password'}
                    >
                      {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>

                  {confirmPassword && password && (
                    <div className="mt-1.5 flex items-center gap-1.5 text-xs">
                      {password === confirmPassword ? (
                        <span className="text-emerald-600 font-medium flex items-center gap-1">
                          <Check className="w-3.5 h-3.5" /> Passwords match perfectly.
                        </span>
                      ) : (
                        <span className="text-red-500 font-medium flex items-center gap-1">
                          <AlertCircle className="w-3.5 h-3.5" /> Passwords do not match.
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>

              <div className="p-3.5 bg-blue-50/70 border border-blue-200 rounded-xl text-xs text-blue-900 flex items-start gap-2.5">
                <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                <span>
                  <strong>Client-Side Standard Encryption:</strong> Your document is encrypted directly in your browser using standard 128-bit PDF security. Your password and PDF binary are never transmitted across the network.
                </span>
              </div>
            </div>
          )}

          {/* 12. UNLOCK CONTROLS */}
          {tool.id === 'unlock-pdf' && (
            <div className="space-y-4 max-w-xl">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Document Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter the PDF password to unlock restrictions..."
                    className="w-full pl-4 pr-11 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-mono text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors p-1"
                    title={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <p className="mt-1.5 text-xs text-slate-500">
                  If the document has an open password, enter it above. If it only has print/copy permission locks, leave empty to test automatic restriction removal.
                </p>
              </div>

              <div className="p-3.5 bg-emerald-50/70 border border-emerald-200 rounded-xl text-xs text-emerald-900 flex items-start gap-2.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>
                  <strong>Authorized Client-Side Decryption:</strong> An unlocked, unrestricted version of your PDF will be generated locally in browser memory. No data leaves your computer.
                </span>
              </div>
            </div>
          )}

          {/* 13. WATERMARK CONTROLS */}
          {tool.id === 'watermark-pdf' && (
            <div className="space-y-5">
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Watermark Text
                </label>
                <input
                  type="text"
                  value={wmText}
                  onChange={(e) => setWmText(e.target.value)}
                  placeholder="e.g. CONFIDENTIAL, DRAFT, DO NOT COPY"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-500"
                />

                {/* Quick Presets */}
                <div className="flex flex-wrap gap-2 pt-1">
                  {['CONFIDENTIAL', 'DRAFT', 'DO NOT COPY', 'APPROVED', 'ORIGINAL', 'SAMPLE'].map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => setWmText(preset)}
                      className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                        wmText === preset
                          ? 'bg-blue-600 text-white shadow-xs'
                          : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                      }`}
                    >
                      {preset}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Position
                  </label>
                  <select
                    value={wmPosition}
                    onChange={(e) => setWmPosition(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:bg-white focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="center">Center Diagonal</option>
                    <option value="header">Header (Top Center)</option>
                    <option value="footer">Footer (Bottom Center)</option>
                    <option value="top-left">Top Left</option>
                    <option value="bottom-right">Bottom Right</option>
                    <option value="tiled">Tiled Grid Pattern</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Opacity: {Math.round(wmOpacity * 100)}%
                  </label>
                  <input
                    type="range"
                    min="0.05"
                    max="0.9"
                    step="0.05"
                    value={wmOpacity}
                    onChange={(e) => setWmOpacity(parseFloat(e.target.value))}
                    className="w-full accent-blue-600 cursor-pointer"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Font Size: {wmFontSize}pt
                  </label>
                  <input
                    type="range"
                    min="16"
                    max="96"
                    step="2"
                    value={wmFontSize}
                    onChange={(e) => setWmFontSize(parseInt(e.target.value, 10))}
                    className="w-full accent-blue-600 cursor-pointer"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Rotation: {wmRotation}°
                  </label>
                  <input
                    type="range"
                    min="-90"
                    max="90"
                    step="5"
                    value={wmRotation}
                    onChange={(e) => setWmRotation(parseInt(e.target.value, 10))}
                    className="w-full accent-blue-600 cursor-pointer"
                  />
                </div>
              </div>

              {/* Color Picker & Swatches */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Watermark Color
                </label>
                <div className="flex flex-wrap items-center gap-3">
                  {[
                    { name: 'Slate Gray', hex: '#64748b' },
                    { name: 'Crimson Red', hex: '#dc2626' },
                    { name: 'Navy Blue', hex: '#2563eb' },
                    { name: 'Emerald Green', hex: '#059669' },
                    { name: 'Amber Gold', hex: '#d97706' },
                    { name: 'Midnight Black', hex: '#0f172a' },
                  ].map((color) => (
                    <button
                      key={color.hex}
                      type="button"
                      onClick={() => setWmColorHex(color.hex)}
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-xs font-semibold transition-all cursor-pointer ${
                        wmColorHex.toLowerCase() === color.hex.toLowerCase()
                          ? 'border-blue-600 bg-blue-50 text-blue-700 shadow-2xs ring-2 ring-blue-500/20'
                          : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                      }`}
                    >
                      <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: color.hex }} />
                      {color.name}
                    </button>
                  ))}

                  <div className="flex items-center gap-1.5 ml-auto">
                    <input
                      type="color"
                      value={wmColorHex}
                      onChange={(e) => setWmColorHex(e.target.value)}
                      className="w-8 h-8 rounded-lg border border-slate-200 cursor-pointer p-0.5"
                    />
                    <span className="text-xs font-mono text-slate-500 uppercase">{wmColorHex}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Action Trigger Button */}
          <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-xs text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Processed locally in your browser. No files uploaded.</span>
            </div>

            <button
              id={`run-tool-btn-${tool.slug}`}
              type="button"
              disabled={
                (tool.id === 'merge-pdf' && files.length < 2) ||
                (tool.id === 'protect-pdf' && (!password || password !== confirmPassword))
              }
              onClick={handleRunTool}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-base rounded-xl shadow-lg hover:shadow-xl transition-all cursor-pointer"
            >
              <Play className="w-5 h-5 fill-white" />
              {tool.id === 'merge-pdf'
                ? files.length >= 2
                  ? `Merge ${files.length} PDF Documents`
                  : 'Select at least 2 PDFs'
                : tool.id === 'rotate-pdf'
                ? 'Save & Download Rotated PDF'
                : tool.id === 'split-pdf'
                ? 'Split PDF Now'
                : tool.id === 'compress-pdf'
                ? 'Compress PDF Now'
                : tool.id === 'pdf-to-jpg'
                ? 'Convert PDF to JPG'
                : tool.id === 'jpg-to-pdf'
                ? `Convert ${files.length} JPG ${files.length === 1 ? 'Image' : 'Images'} to PDF`
                : tool.id === 'pdf-to-png'
                ? 'Convert PDF to PNG'
                : tool.id === 'png-to-pdf'
                ? `Convert ${files.length} PNG ${files.length === 1 ? 'Image' : 'Images'} to PDF`
                : tool.id === 'pdf-to-word'
                ? 'Convert PDF to Word (.docx)'
                : tool.id === 'word-to-pdf'
                ? 'Convert Word to PDF'
                : tool.id === 'delete-pdf-pages'
                ? selectedPages.length > 0
                  ? `Delete ${selectedPages.length} Page(s) & Download`
                  : 'Select Pages to Delete'
                : tool.id === 'extract-pdf-pages'
                ? selectedPages.length > 0
                  ? `Extract ${selectedPages.length} Page(s) & Download`
                  : 'Select Pages to Extract'
                : tool.id === 'protect-pdf'
                ? !password
                  ? 'Enter Password to Protect'
                  : password !== confirmPassword
                  ? 'Passwords Do Not Match'
                  : 'Protect & Encrypt PDF'
                : tool.id === 'unlock-pdf'
                ? 'Unlock & Decrypt PDF'
                : tool.id === 'watermark-pdf'
                ? 'Apply Watermark & Download'
                : tool.name}
            </button>
          </div>
        </div>
      )}

      {/* Progress & Result Modal */}
      <ProcessingModal
        isOpen={modalOpen}
        isProcessing={isProcessing}
        progress={progress}
        statusMessage={statusMessage}
        result={result}
        error={error}
        onReset={handleReset}
        toolName={tool.name}
      />
    </div>
  );
}
