import React, { useRef, useState } from 'react';
import { UploadCloud, File, X, AlertCircle, Plus, ArrowUp, ArrowDown } from 'lucide-react';

export interface UploadedFileItem {
  id: string;
  file: File;
  buffer: ArrayBuffer;
  previewUrl?: string;
  sizeFormatted: string;
}

interface FileDropzoneProps {
  acceptMimeTypes: string;
  inputFormats: string[];
  allowMultiple: boolean;
  maxFileSizeMb: number;
  files: UploadedFileItem[];
  onFilesSelected: (files: UploadedFileItem[]) => void;
  onFileRemoved: (id: string) => void;
  onFilesReordered?: (files: UploadedFileItem[]) => void;
  title?: string;
  subtitle?: string;
}

function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

export function FileDropzone({
  acceptMimeTypes,
  inputFormats,
  allowMultiple,
  maxFileSizeMb,
  files,
  onFilesSelected,
  onFileRemoved,
  onFilesReordered,
  title = 'Select PDF files',
  subtitle = 'or drag & drop files here',
}: FileDropzoneProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const processFiles = async (fileList: FileList | File[]) => {
    setErrorMessage(null);
    const newItems: UploadedFileItem[] = [];

    for (let i = 0; i < fileList.length; i++) {
      const f = fileList[i];

      // Format validation
      const ext = '.' + f.name.split('.').pop()?.toLowerCase();
      const isFormatValid = inputFormats.some((fmt) => fmt.toLowerCase() === ext) || 
                            (acceptMimeTypes && acceptMimeTypes.includes(f.type));

      if (!isFormatValid && inputFormats.length > 0) {
        setErrorMessage(`Invalid file format: "${f.name}". Supported formats: ${inputFormats.join(', ')}`);
        return;
      }

      // Size validation
      if (f.size === 0) {
        setErrorMessage(`"${f.name}" is empty (0 bytes). Please upload a valid document.`);
        return;
      }
      const sizeMb = f.size / (1024 * 1024);
      if (sizeMb > maxFileSizeMb) {
        setErrorMessage(`"${f.name}" is too large (${sizeMb.toFixed(1)}MB). Max size is ${maxFileSizeMb}MB.`);
        return;
      }

      const buffer = await f.arrayBuffer();

      // Quick PDF signature check
      if (ext === '.pdf') {
        const headerBytes = new Uint8Array(buffer.slice(0, 5));
        const headerText = String.fromCharCode(...headerBytes);
        if (!headerText.startsWith('%PDF')) {
          setErrorMessage(`"${f.name}" is not a valid PDF document (missing PDF signature header).`);
          return;
        }
      }

      const previewUrl = f.type.startsWith('image/') ? URL.createObjectURL(f) : undefined;

      newItems.push({
        id: `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
        file: f,
        buffer,
        previewUrl,
        sizeFormatted: formatBytes(f.size),
      });

      if (!allowMultiple) break;
    }

    if (allowMultiple) {
      onFilesSelected([...files, ...newItems]);
    } else {
      onFilesSelected(newItems);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      await processFiles(e.dataTransfer.files);
    }
  };

  const handleFileInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      await processFiles(e.target.files);
      e.target.value = ''; // Reset for re-uploading same file if desired
    }
  };

  const moveFile = (index: number, direction: 'up' | 'down') => {
    if (!onFilesReordered) return;
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= files.length) return;
    const reordered = [...files];
    const temp = reordered[index];
    reordered[index] = reordered[newIndex];
    reordered[newIndex] = temp;
    onFilesReordered(reordered);
  };

  return (
    <div className="w-full space-y-4">
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept={acceptMimeTypes}
        multiple={allowMultiple}
        onChange={handleFileInputChange}
        className="hidden"
        id="hidden-file-input"
      />

      {/* Main Drop Area */}
      {files.length === 0 ? (
        <div
          id="dropzone-area"
          role="button"
          tabIndex={0}
          aria-label={`${title}, ${subtitle}. Click or drop files here.`}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              fileInputRef.current?.click();
            }
          }}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`relative border-2 border-dashed rounded-2xl p-8 sm:p-12 text-center transition-all cursor-pointer focus:outline-none focus:ring-4 focus:ring-blue-500/20 ${
            isDragging
              ? 'border-blue-500 bg-blue-50/80 scale-[1.01]'
              : 'border-slate-300 hover:border-blue-400 bg-white hover:bg-slate-50/50'
          }`}
        >
          <div className="max-w-md mx-auto space-y-4">
            <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto shadow-xs">
              <UploadCloud className="w-8 h-8" />
            </div>

            <div>
              <button
                type="button"
                className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm sm:text-base rounded-xl shadow-md hover:shadow-lg transition-all"
              >
                {title}
              </button>
              <p className="text-slate-500 text-xs sm:text-sm mt-3">{subtitle}</p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-2 text-[11px] text-slate-400 pt-2 border-t border-slate-100">
              <span>Formats: {inputFormats.join(', ')}</span>
              <span>•</span>
              <span>Max: {maxFileSizeMb} MB</span>
              <span>•</span>
              <span className="text-emerald-600 font-medium">In-Browser Execution</span>
            </div>
          </div>
        </div>
      ) : (
        /* Uploaded Files List / Arrangement Bar */
        <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-6 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
            <div>
              <h4 className="font-bold text-slate-900 text-sm sm:text-base">
                Selected Files ({files.length})
              </h4>
              <p className="text-xs text-slate-500">
                {allowMultiple ? 'Drag or use arrows to rearrange sequence order.' : 'File ready for processing.'}
              </p>
            </div>

            {allowMultiple && (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition-colors"
              >
                <Plus className="w-4 h-4" />
                Add More Files
              </button>
            )}
          </div>

          <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
            {files.map((item, idx) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-3 bg-slate-50 hover:bg-slate-100/70 border border-slate-200/80 rounded-xl text-xs sm:text-sm transition-colors"
              >
                <div className="flex items-center gap-3 overflow-hidden">
                  <span className="w-6 h-6 rounded-md bg-blue-100 text-blue-700 font-bold text-xs flex items-center justify-center shrink-0">
                    {idx + 1}
                  </span>

                  {item.previewUrl ? (
                    <img src={item.previewUrl} alt={item.file.name} className="w-9 h-9 object-cover rounded-md shrink-0 border border-slate-200" />
                  ) : (
                    <div className="w-9 h-9 rounded-md bg-white border border-slate-200 flex items-center justify-center text-slate-500 shrink-0">
                      <File className="w-5 h-5 text-blue-600" />
                    </div>
                  )}

                  <div className="truncate">
                    <p className="font-semibold text-slate-800 truncate">{item.file.name}</p>
                    <p className="text-slate-400 text-[11px]">{item.sizeFormatted}</p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0 ml-3">
                  {allowMultiple && (
                    <div className="flex items-center bg-white border border-slate-200 rounded-md overflow-hidden">
                      <button
                        type="button"
                        disabled={idx === 0}
                        onClick={() => moveFile(idx, 'up')}
                        title="Move Up"
                        aria-label="Move file up"
                        className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-slate-100 disabled:opacity-30 disabled:hover:bg-transparent"
                      >
                        <ArrowUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        disabled={idx === files.length - 1}
                        onClick={() => moveFile(idx, 'down')}
                        title="Move Down"
                        aria-label="Move file down"
                        className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-slate-100 disabled:opacity-30 disabled:hover:bg-transparent border-l border-slate-100"
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={() => onFileRemoved(item.id)}
                    title="Remove File"
                    className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Error Message Alert */}
      {errorMessage && (
        <div className="p-3.5 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2.5 text-xs text-red-700 animate-in fade-in">
          <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
          <span>{errorMessage}</span>
          <button
            type="button"
            onClick={() => setErrorMessage(null)}
            aria-label="Dismiss error message"
            className="ml-auto text-red-500 hover:text-red-800 p-1 rounded-md hover:bg-red-100/50 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}
