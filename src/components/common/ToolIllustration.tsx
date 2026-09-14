import React from 'react';

interface ToolIllustrationProps {
  toolId: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const ToolIllustration: React.FC<ToolIllustrationProps> = ({
  toolId,
  className = '',
  size = 'md',
}) => {
  const sizeClasses = {
    sm: 'w-12 h-12',
    md: 'w-16 h-16',
    lg: 'w-24 h-24 sm:w-28 sm:h-28',
  }[size];

  switch (toolId) {
    // 1. Merge PDF: Two multi-page documents joining into a single bound folder
    case 'merge-pdf':
      return (
        <svg
          viewBox="0 0 80 80"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={`${sizeClasses} ${className}`}
          aria-label="Merge PDF Illustration"
        >
          {/* Back document left */}
          <rect x="8" y="14" width="28" height="38" rx="4" fill="#93C5FD" opacity="0.7" />
          <line x1="14" y1="22" x2="30" y2="22" stroke="#1D4ED8" strokeWidth="2" strokeLinecap="round" />
          <line x1="14" y1="28" x2="26" y2="28" stroke="#1D4ED8" strokeWidth="2" strokeLinecap="round" />

          {/* Back document right */}
          <rect x="44" y="14" width="28" height="38" rx="4" fill="#93C5FD" opacity="0.7" />
          <line x1="50" y1="22" x2="66" y2="22" stroke="#1D4ED8" strokeWidth="2" strokeLinecap="round" />
          <line x1="50" y1="28" x2="62" y2="28" stroke="#1D4ED8" strokeWidth="2" strokeLinecap="round" />

          {/* Merge converging arrows */}
          <path d="M26 36 L36 44 M54 36 L44 44" stroke="#2563EB" strokeWidth="2.5" strokeLinecap="round" />

          {/* Bound Folder Front Center */}
          <rect x="22" y="32" width="36" height="42" rx="5" fill="#2563EB" />
          <rect x="25" y="38" width="30" height="32" rx="3" fill="#FFFFFF" />
          {/* Document lines in folder */}
          <line x1="30" y1="46" x2="48" y2="46" stroke="#2563EB" strokeWidth="2" strokeLinecap="round" />
          <line x1="30" y1="52" x2="51" y2="52" stroke="#93C5FD" strokeWidth="2" strokeLinecap="round" />
          <line x1="30" y1="58" x2="44" y2="58" stroke="#93C5FD" strokeWidth="2" strokeLinecap="round" />
          {/* Bound spine tabs */}
          <circle cx="28" cy="65" r="1.5" fill="#2563EB" />
          <circle cx="34" cy="65" r="1.5" fill="#2563EB" />
          <circle cx="40" cy="65" r="1.5" fill="#2563EB" />
        </svg>
      );

    // 2. Split PDF: A document dividing into distinct separated page leaves
    case 'split-pdf':
      return (
        <svg
          viewBox="0 0 80 80"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={`${sizeClasses} ${className}`}
          aria-label="Split PDF Illustration"
        >
          {/* Center Original Document Base */}
          <rect x="28" y="42" width="24" height="30" rx="3" fill="#BFDBFE" />
          <line x1="33" y1="50" x2="47" y2="50" stroke="#3B82F6" strokeWidth="1.5" strokeLinecap="round" />

          {/* Left separating leaf */}
          <g transform="rotate(-15 22 28)">
            <rect x="10" y="12" width="24" height="32" rx="3" fill="#3B82F6" />
            <line x1="15" y1="18" x2="29" y2="18" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" />
            <line x1="15" y1="23" x2="26" y2="23" stroke="#93C5FD" strokeWidth="1.5" strokeLinecap="round" />
            <line x1="15" y1="28" x2="28" y2="28" stroke="#93C5FD" strokeWidth="1.5" strokeLinecap="round" />
          </g>

          {/* Right separating leaf */}
          <g transform="rotate(15 58 28)">
            <rect x="46" y="12" width="24" height="32" rx="3" fill="#1D4ED8" />
            <line x1="51" y1="18" x2="65" y2="18" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" />
            <line x1="51" y1="23" x2="62" y2="23" stroke="#93C5FD" strokeWidth="1.5" strokeLinecap="round" />
            <line x1="51" y1="28" x2="64" y2="28" stroke="#93C5FD" strokeWidth="1.5" strokeLinecap="round" />
          </g>

          {/* Split divider cutting marks */}
          <path d="M37 20 L40 28 L43 20" stroke="#EF4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );

    // 3. Compress PDF: A document frame flanked by inward compression arrows with size-reduction badge
    case 'compress-pdf':
      return (
        <svg
          viewBox="0 0 80 80"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={`${sizeClasses} ${className}`}
          aria-label="Compress PDF Illustration"
        >
          {/* Main Document Frame */}
          <rect x="22" y="12" width="36" height="52" rx="5" fill="#059669" />
          <rect x="26" y="16" width="28" height="44" rx="3" fill="#ECFDF5" />
          <line x1="31" y1="24" x2="49" y2="24" stroke="#059669" strokeWidth="2" strokeLinecap="round" />
          <line x1="31" y1="30" x2="45" y2="30" stroke="#34D399" strokeWidth="2" strokeLinecap="round" />
          <line x1="31" y1="36" x2="48" y2="36" stroke="#34D399" strokeWidth="2" strokeLinecap="round" />

          {/* Left Inward Arrow */}
          <path d="M6 38 L16 38 M12 34 L16 38 L12 42" stroke="#059669" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />

          {/* Right Inward Arrow */}
          <path d="M74 38 L64 38 M68 34 L64 38 L68 42" stroke="#059669" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />

          {/* Size Reduction Badge */}
          <rect x="24" y="44" width="32" height="18" rx="4" fill="#047857" />
          <text x="40" y="56" fill="#FFFFFF" fontSize="9" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">
            -70%
          </text>
        </svg>
      );

    // 4. PDF to JPG: A PDF sheet transforming across transition arrow into vibrant photograph icon
    case 'pdf-to-jpg':
      return (
        <svg
          viewBox="0 0 80 80"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={`${sizeClasses} ${className}`}
          aria-label="PDF to JPG Illustration"
        >
          {/* Red PDF Document Left */}
          <rect x="6" y="20" width="26" height="38" rx="4" fill="#DC2626" />
          <rect x="9" y="24" width="20" height="30" rx="2" fill="#FEF2F2" />
          <text x="19" y="42" fill="#DC2626" fontSize="8" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">
            PDF
          </text>

          {/* Transition Arrow Center */}
          <path d="M35 39 L45 39 M41 35 L45 39 L41 43" stroke="#4F46E5" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />

          {/* Vibrant JPEG Photo Card Right */}
          <rect x="48" y="20" width="26" height="38" rx="4" fill="#F59E0B" />
          <rect x="51" y="23" width="20" height="24" rx="2" fill="#1E293B" />
          {/* Sun */}
          <circle cx="56" cy="29" r="2.5" fill="#FBBF24" />
          {/* Mountains */}
          <path d="M52 43 L59 34 L64 40 L67 36 L70 43 Z" fill="#10B981" />
          {/* JPG tag */}
          <text x="61" y="54" fill="#FFFFFF" fontSize="7" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">
            JPG
          </text>
        </svg>
      );

    // 5. JPG to PDF: Stack of photo cards consolidating into a PDF binder
    case 'jpg-to-pdf':
      return (
        <svg
          viewBox="0 0 80 80"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={`${sizeClasses} ${className}`}
          aria-label="JPG to PDF Illustration"
        >
          {/* Stack of Image Cards Left */}
          <rect x="6" y="16" width="26" height="26" rx="3" fill="#FBBF24" opacity="0.6" transform="rotate(-6 19 29)" />
          <rect x="10" y="22" width="26" height="26" rx="3" fill="#F59E0B" />
          <circle cx="16" cy="28" r="2.5" fill="#FFFFFF" />
          <path d="M13 42 L20 33 L26 40 L30 35 L34 42 Z" fill="#D97706" />

          {/* Forward consolidation arrow */}
          <path d="M38 38 L46 38 M42 34 L46 38 L42 42" stroke="#DC2626" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />

          {/* Red PDF Binder Right */}
          <rect x="48" y="16" width="26" height="44" rx="4" fill="#DC2626" />
          <rect x="51" y="20" width="20" height="36" rx="2" fill="#FFFFFF" />
          <line x1="55" y1="28" x2="67" y2="28" stroke="#DC2626" strokeWidth="2" strokeLinecap="round" />
          <line x1="55" y1="34" x2="65" y2="34" stroke="#FCA5A5" strokeWidth="2" strokeLinecap="round" />
          <line x1="55" y1="40" x2="66" y2="40" stroke="#FCA5A5" strokeWidth="2" strokeLinecap="round" />
          <text x="61" y="52" fill="#DC2626" fontSize="7" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">
            PDF
          </text>
        </svg>
      );

    // 6. PDF to Word: Red PDF sheet converting into blue editable DOCX with text lines
    case 'pdf-to-word':
      return (
        <svg
          viewBox="0 0 80 80"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={`${sizeClasses} ${className}`}
          aria-label="PDF to Word Illustration"
        >
          {/* Red PDF Document Left */}
          <rect x="6" y="18" width="26" height="42" rx="4" fill="#DC2626" />
          <rect x="9" y="22" width="20" height="34" rx="2" fill="#FFFFFF" />
          <text x="19" y="42" fill="#DC2626" fontSize="8" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">
            PDF
          </text>

          {/* Conversion Flow Arrow */}
          <path d="M35 39 L45 39 M41 35 L45 39 L41 43" stroke="#2563EB" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />

          {/* Blue Editable Word DOCX Right */}
          <rect x="48" y="18" width="26" height="42" rx="4" fill="#2563EB" />
          <rect x="51" y="22" width="20" height="34" rx="2" fill="#EFF6FF" />
          {/* DOCX Text lines and edit cursor */}
          <line x1="54" y1="28" x2="67" y2="28" stroke="#1D4ED8" strokeWidth="2" strokeLinecap="round" />
          <line x1="54" y1="34" x2="65" y2="34" stroke="#60A5FA" strokeWidth="2" strokeLinecap="round" />
          <line x1="54" y1="40" x2="68" y2="40" stroke="#60A5FA" strokeWidth="2" strokeLinecap="round" />
          {/* Pencil edit symbol */}
          <path d="M60 48 L67 43 L68 44 L61 49 Z" fill="#2563EB" />
        </svg>
      );

    // 7. Word to PDF: Blue DOCX document locking into finalized PDF page
    case 'word-to-pdf':
      return (
        <svg
          viewBox="0 0 80 80"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={`${sizeClasses} ${className}`}
          aria-label="Word to PDF Illustration"
        >
          {/* Blue DOCX Document Left */}
          <rect x="6" y="18" width="26" height="42" rx="4" fill="#2563EB" />
          <rect x="9" y="22" width="20" height="34" rx="2" fill="#EFF6FF" />
          <line x1="12" y1="28" x2="25" y2="28" stroke="#2563EB" strokeWidth="2" strokeLinecap="round" />
          <line x1="12" y1="34" x2="23" y2="34" stroke="#93C5FD" strokeWidth="2" strokeLinecap="round" />
          <text x="19" y="48" fill="#2563EB" fontSize="7" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">
            DOC
          </text>

          {/* Locking Lock Icon in Center Arrow */}
          <path d="M35 39 L45 39" stroke="#DC2626" strokeWidth="2.5" strokeLinecap="round" />
          <circle cx="40" cy="31" r="3.5" stroke="#DC2626" strokeWidth="1.5" />
          <rect x="37.5" y="33" width="5" height="5" rx="1" fill="#DC2626" />

          {/* Finalized Red PDF Page Right */}
          <rect x="48" y="18" width="26" height="42" rx="4" fill="#DC2626" />
          <rect x="51" y="22" width="20" height="34" rx="2" fill="#FFFFFF" />
          <line x1="54" y1="28" x2="67" y2="28" stroke="#DC2626" strokeWidth="2" strokeLinecap="round" />
          <line x1="54" y1="34" x2="65" y2="34" stroke="#FCA5A5" strokeWidth="2" strokeLinecap="round" />
          <line x1="54" y1="40" x2="68" y2="40" stroke="#FCA5A5" strokeWidth="2" strokeLinecap="round" />
          <text x="61" y="52" fill="#DC2626" fontSize="8" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">
            PDF
          </text>
        </svg>
      );

    // 8. PDF to PNG: PDF document exporting transparent/high-fidelity PNG frames
    case 'pdf-to-png':
      return (
        <svg
          viewBox="0 0 80 80"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={`${sizeClasses} ${className}`}
          aria-label="PDF to PNG Illustration"
        >
          {/* PDF Source Document */}
          <rect x="6" y="20" width="26" height="38" rx="4" fill="#DC2626" />
          <rect x="9" y="24" width="20" height="30" rx="2" fill="#FFFFFF" />
          <text x="19" y="42" fill="#DC2626" fontSize="8" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">
            PDF
          </text>

          {/* Export Arrow */}
          <path d="M35 39 L45 39 M41 35 L45 39 L41 43" stroke="#8B5CF6" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />

          {/* Transparent Checkerboard PNG Frame Right */}
          <rect x="48" y="20" width="26" height="38" rx="4" fill="#8B5CF6" />
          <g opacity="0.4">
            <rect x="51" y="23" width="5" height="5" fill="#E2E8F0" />
            <rect x="56" y="23" width="5" height="5" fill="#FFFFFF" />
            <rect x="61" y="23" width="5" height="5" fill="#E2E8F0" />
            <rect x="66" y="23" width="5" height="5" fill="#FFFFFF" />
            <rect x="51" y="28" width="5" height="5" fill="#FFFFFF" />
            <rect x="56" y="28" width="5" height="5" fill="#E2E8F0" />
            <rect x="61" y="28" width="5" height="5" fill="#FFFFFF" />
            <rect x="66" y="28" width="5" height="5" fill="#E2E8F0" />
          </g>
          <text x="61" y="52" fill="#FFFFFF" fontSize="8" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">
            PNG
          </text>
        </svg>
      );

    // 9. PNG to PDF: PNG graphic assets compiling into multi-page PDF document
    case 'png-to-pdf':
      return (
        <svg
          viewBox="0 0 80 80"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={`${sizeClasses} ${className}`}
          aria-label="PNG to PDF Illustration"
        >
          {/* PNG Graphic Asset Left */}
          <rect x="6" y="20" width="26" height="36" rx="4" fill="#8B5CF6" />
          <circle cx="14" cy="29" r="3" fill="#DDD6FE" />
          <path d="M10 44 L16 35 L22 41 L25 38 L29 44 Z" fill="#C4B5FD" />
          <text x="19" y="52" fill="#FFFFFF" fontSize="7" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">
            PNG
          </text>

          {/* Compilation Arrow */}
          <path d="M35 39 L45 39 M41 35 L45 39 L41 43" stroke="#DC2626" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />

          {/* Compiled Multi-page PDF Right */}
          <rect x="52" y="14" width="24" height="42" rx="4" fill="#FCA5A5" />
          <rect x="48" y="18" width="24" height="42" rx="4" fill="#DC2626" />
          <rect x="51" y="22" width="18" height="34" rx="2" fill="#FFFFFF" />
          <text x="60" y="42" fill="#DC2626" fontSize="8" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">
            PDF
          </text>
        </svg>
      );

    // 10. Rotate PDF: Document page surrounded by circular 90° clockwise rotation arrows
    case 'rotate-pdf':
      return (
        <svg
          viewBox="0 0 80 80"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={`${sizeClasses} ${className}`}
          aria-label="Rotate PDF Illustration"
        >
          {/* Center Document Page (Tilted slightly) */}
          <g transform="rotate(12 40 40)">
            <rect x="26" y="20" width="28" height="40" rx="4" fill="#2563EB" />
            <rect x="29" y="23" width="22" height="34" rx="2" fill="#FFFFFF" />
            <line x1="33" y1="29" x2="47" y2="29" stroke="#2563EB" strokeWidth="2" strokeLinecap="round" />
            <line x1="33" y1="35" x2="44" y2="35" stroke="#93C5FD" strokeWidth="2" strokeLinecap="round" />
            <line x1="33" y1="41" x2="46" y2="41" stroke="#93C5FD" strokeWidth="2" strokeLinecap="round" />
          </g>

          {/* Circular Clockwise Rotation Arrow Arc */}
          <path
            d="M58 20 A 28 28 0 1 1 20 28"
            stroke="#1D4ED8"
            strokeWidth="3.5"
            strokeLinecap="round"
            fill="none"
          />
          {/* Arrowhead */}
          <path d="M54 13 L63 20 L54 26" fill="#1D4ED8" />

          {/* 90° Badge */}
          <rect x="8" y="10" width="22" height="14" rx="3" fill="#DBEAFE" />
          <text x="19" y="20" fill="#1D4ED8" fontSize="8" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">
            90°
          </text>
        </svg>
      );

    // 11. Delete PDF Pages: Multi-page document with selected page highlighted & discarded into clean bin
    case 'delete-pdf-pages':
      return (
        <svg
          viewBox="0 0 80 80"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={`${sizeClasses} ${className}`}
          aria-label="Delete PDF Pages Illustration"
        >
          {/* Retained PDF Document Left */}
          <rect x="10" y="16" width="26" height="44" rx="4" fill="#3B82F6" />
          <rect x="13" y="20" width="20" height="36" rx="2" fill="#FFFFFF" />
          <line x1="16" y1="27" x2="29" y2="27" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" />
          <line x1="16" y1="33" x2="27" y2="33" stroke="#93C5FD" strokeWidth="2" strokeLinecap="round" />

          {/* Discarded Page Floating Down into Bin */}
          <g transform="rotate(20 48 30)">
            <rect x="40" y="16" width="18" height="26" rx="3" fill="#FCA5A5" stroke="#EF4444" strokeWidth="1.5" />
            <line x1="44" y1="23" x2="54" y2="23" stroke="#EF4444" strokeWidth="1.5" strokeLinecap="round" />
            <line x1="44" y1="28" x2="52" y2="28" stroke="#EF4444" strokeWidth="1.5" strokeLinecap="round" />
            <path d="M44 32 L54 38 M54 32 L44 38" stroke="#DC2626" strokeWidth="2" strokeLinecap="round" />
          </g>

          {/* Clean Recycling Bin Bottom Right */}
          <path d="M46 50 L48 68 L64 68 L66 50 Z" fill="#EF4444" />
          <rect x="44" y="47" width="24" height="4" rx="2" fill="#DC2626" />
          <line x1="52" y1="54" x2="52" y2="64" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="56" y1="54" x2="56" y2="64" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="60" y1="54" x2="60" y2="64" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      );

    // 12. Extract PDF Pages: Specific isolated pages lifted cleanly out of thicker document
    case 'extract-pdf-pages':
      return (
        <svg
          viewBox="0 0 80 80"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={`${sizeClasses} ${className}`}
          aria-label="Extract PDF Pages Illustration"
        >
          {/* Thicker Source Stack */}
          <rect x="10" y="30" width="30" height="38" rx="4" fill="#93C5FD" />
          <rect x="14" y="26" width="30" height="38" rx="4" fill="#60A5FA" />
          <rect x="18" y="22" width="30" height="38" rx="4" fill="#2563EB" />
          <rect x="21" y="26" width="24" height="30" rx="2" fill="#FFFFFF" />
          <line x1="25" y1="33" x2="41" y2="33" stroke="#2563EB" strokeWidth="2" strokeLinecap="round" />
          <line x1="25" y1="39" x2="38" y2="39" stroke="#93C5FD" strokeWidth="2" strokeLinecap="round" />

          {/* Lifted Isolated Page Flying Out Cleanly */}
          <g transform="translate(18 -10) rotate(-10 50 30)">
            <rect x="36" y="16" width="26" height="36" rx="4" fill="#10B981" />
            <rect x="39" y="20" width="20" height="28" rx="2" fill="#ECFDF5" />
            <line x1="43" y1="26" x2="55" y2="26" stroke="#059669" strokeWidth="2" strokeLinecap="round" />
            <line x1="43" y1="32" x2="53" y2="32" stroke="#34D399" strokeWidth="2" strokeLinecap="round" />
            <line x1="43" y1="38" x2="56" y2="38" stroke="#34D399" strokeWidth="2" strokeLinecap="round" />
            {/* Sparkle badge */}
            <circle cx="56" cy="22" r="3" fill="#059669" />
          </g>

          {/* Upward extraction arrow */}
          <path d="M48 38 L54 28 M50 28 L54 28 L54 32" stroke="#10B981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );

    // 13. Protect PDF: Document shielded by secure padlock & access permission keys
    case 'protect-pdf':
      return (
        <svg
          viewBox="0 0 80 80"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={`${sizeClasses} ${className}`}
          aria-label="Protect PDF Illustration"
        >
          {/* Document Base */}
          <rect x="14" y="14" width="34" height="50" rx="5" fill="#3B82F6" />
          <rect x="18" y="18" width="26" height="42" rx="3" fill="#EFF6FF" />
          <line x1="22" y1="26" x2="38" y2="26" stroke="#2563EB" strokeWidth="2" strokeLinecap="round" />
          <line x1="22" y1="32" x2="35" y2="32" stroke="#93C5FD" strokeWidth="2" strokeLinecap="round" />
          <line x1="22" y1="38" x2="39" y2="38" stroke="#93C5FD" strokeWidth="2" strokeLinecap="round" />

          {/* Secure Shield & Golden Padlock Foreground Right */}
          <path
            d="M52 24 C52 24 64 22 68 28 C68 44 58 54 52 58 C46 54 36 44 36 28 C40 22 52 24 52 24 Z"
            fill="#D97706"
            opacity="0.2"
          />
          {/* Padlock Body */}
          <rect x="40" y="38" width="24" height="22" rx="4" fill="#F59E0B" stroke="#B45309" strokeWidth="1.5" />
          {/* Padlock Shackle */}
          <path d="M46 38 V32 C46 28.5 48.5 26 52 26 C55.5 26 58 28.5 58 32 V38" stroke="#B45309" strokeWidth="3" strokeLinecap="round" fill="none" />
          {/* Keyhole */}
          <circle cx="52" cy="47" r="2.5" fill="#78350F" />
          <path d="M52 48 L52 53" stroke="#78350F" strokeWidth="2" strokeLinecap="round" />
        </svg>
      );

    // 14. Unlock PDF: Locked document with open padlock indicating authorized decryption
    case 'unlock-pdf':
      return (
        <svg
          viewBox="0 0 80 80"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={`${sizeClasses} ${className}`}
          aria-label="Unlock PDF Illustration"
        >
          {/* Document Base */}
          <rect x="14" y="14" width="34" height="50" rx="5" fill="#10B981" />
          <rect x="18" y="18" width="26" height="42" rx="3" fill="#ECFDF5" />
          <line x1="22" y1="26" x2="38" y2="26" stroke="#059669" strokeWidth="2" strokeLinecap="round" />
          <line x1="22" y1="32" x2="35" y2="32" stroke="#6EE7B7" strokeWidth="2" strokeLinecap="round" />
          <line x1="22" y1="38" x2="39" y2="38" stroke="#6EE7B7" strokeWidth="2" strokeLinecap="round" />

          {/* Open Padlock Foreground */}
          {/* Open Shackle swung up */}
          <path d="M46 32 V26 C46 22.5 48.5 20 52 20 C55.5 20 58 22.5 58 26" stroke="#059669" strokeWidth="3" strokeLinecap="round" fill="none" />
          {/* Padlock Body */}
          <rect x="40" y="36" width="24" height="22" rx="4" fill="#10B981" stroke="#047857" strokeWidth="1.5" />
          {/* Keyhole */}
          <circle cx="52" cy="45" r="2.5" fill="#FFFFFF" />
          <path d="M52 46 L52 51" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />

          {/* Unlock rays */}
          <line x1="65" y1="24" x2="70" y2="21" stroke="#059669" strokeWidth="2" strokeLinecap="round" />
          <line x1="68" y1="30" x2="73" y2="30" stroke="#059669" strokeWidth="2" strokeLinecap="round" />
        </svg>
      );

    // 15. Watermark PDF: Document bearing prominent semi-transparent diagonal "CONFIDENTIAL" stamp
    case 'watermark-pdf':
      return (
        <svg
          viewBox="0 0 80 80"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={`${sizeClasses} ${className}`}
          aria-label="Watermark PDF Illustration"
        >
          {/* Document Base */}
          <rect x="18" y="10" width="44" height="60" rx="5" fill="#64748B" />
          <rect x="22" y="14" width="36" height="52" rx="3" fill="#F8FAFC" />
          <line x1="28" y1="22" x2="52" y2="22" stroke="#CBD5E1" strokeWidth="2" strokeLinecap="round" />
          <line x1="28" y1="28" x2="48" y2="28" stroke="#E2E8F0" strokeWidth="2" strokeLinecap="round" />
          <line x1="28" y1="34" x2="50" y2="34" stroke="#E2E8F0" strokeWidth="2" strokeLinecap="round" />
          <line x1="28" y1="40" x2="46" y2="40" stroke="#E2E8F0" strokeWidth="2" strokeLinecap="round" />
          <line x1="28" y1="46" x2="51" y2="46" stroke="#E2E8F0" strokeWidth="2" strokeLinecap="round" />

          {/* Diagonal Semi-Transparent CONFIDENTIAL Stamp */}
          <g transform="rotate(-28 40 40)">
            <rect
              x="12"
              y="33"
              width="56"
              height="14"
              rx="3"
              fill="#EF4444"
              fillOpacity="0.18"
              stroke="#DC2626"
              strokeWidth="2"
              strokeDasharray="4 2"
            />
            <text
              x="40"
              y="43"
              fill="#DC2626"
              fontSize="7.5"
              fontWeight="900"
              letterSpacing="0.8"
              textAnchor="middle"
              fontFamily="sans-serif"
            >
              CONFIDENTIAL
            </text>
          </g>
        </svg>
      );

    default:
      return (
        <div className={`${sizeClasses} ${className} flex items-center justify-center bg-blue-50 rounded-xl text-blue-600`}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-8 h-8" aria-hidden="true">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
          </svg>
        </div>
      );
  }
};
