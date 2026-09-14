import { GuideArticle } from '../types';

export const GUIDES: GuideArticle[] = [
  {
    slug: 'why-client-side-pdf-tools-are-safer',
    title: 'Why Client-Side PDF Tools Provide Superior Privacy for Sensitive Documents',
    summary: 'Understand the security difference between traditional cloud-upload converters and modern client-side browser processing.',
    readingTime: '4 min read',
    category: 'Privacy & Security',
    publishedDate: 'August 15, 2026',
    relatedToolSlugs: ['protect-pdf', 'merge-pdf', 'watermark-pdf'],
    content: [
      'When you upload a financial statement, legal contract, or passport scan to an ordinary online PDF converter, your file is transmitted over the internet to a third-party server. Even if the service promises deletion within hours, your sensitive data is exposed to potential server logs, backup snapshots, and intercept risks.',
      'PDFSmart Tools was engineered from the ground up on modern WebAssembly and HTML5 client APIs. This means when you click "Merge", "Split", or "Protect", the actual computational logic executes on your own device’s CPU and RAM.',
      'Zero bytes of your document are ever sent to any remote server or third-party database. When you close the browser tab, your document memory is immediately discarded, ensuring local privacy with instantaneous speed.'
    ]
  },
  {
    slug: 'how-to-compress-pdf-without-losing-text-clarity',
    title: 'How to Reduce PDF File Size: Understanding Compression, Rasterization, and Quality',
    summary: 'A comprehensive guide to optimizing PDF file size for email and web sharing, balancing visual resolution, rasterization, and compression presets.',
    readingTime: '5 min read',
    category: 'Optimization',
    publishedDate: 'August 10, 2026',
    relatedToolSlugs: ['compress-pdf', 'pdf-to-jpg', 'split-pdf'],
    content: [
      'Large PDF files often exceed strict email attachment thresholds (usually 10MB–25MB) or online application portal limits (often capped at 2MB). Understanding how client-side PDF compression works helps you choose the optimal settings for your documents without unexpected trade-offs.',
      'Client-side browser compression works by rendering document pages to an HTML5 canvas at target DPI resolutions (such as 72 DPI for extreme compression, ~100 DPI for balanced compression, and ~120 DPI for high quality) and encoding the resulting visual frames using JPEG stream compression.',
      'Because pages are rasterized into visual images during in-browser compression, graphic layout, logos, signatures, and visual appearance are preserved according to your chosen quality level, while vector characters are baked into the page image. For documents where text copyability is essential, splitting large PDFs or selecting higher quality profiles helps balance file size with clear readability.'
    ]
  },
  {
    slug: 'best-practices-for-converting-pdf-to-word',
    title: 'Best Practices for Converting PDF Documents into Editable Microsoft Word Files',
    summary: 'Tips for achieving clean paragraph hierarchy, table extraction, and font fidelity when converting PDF to DOCX.',
    readingTime: '6 min read',
    category: 'Conversion',
    publishedDate: 'August 05, 2026',
    relatedToolSlugs: ['pdf-to-word', 'word-to-pdf', 'extract-pdf-pages'],
    content: [
      'PDF was originally conceived as a digital "digital paper" format intended to lock down visual geometry, whereas Microsoft Word is a fluid reflowable document format.',
      'When converting PDF to DOCX, digital native PDFs (created from Word, Google Docs, or InDesign) produce the most pristine editable documents because character positions and font metrics are clearly encoded.',
      'Always review paragraph spacing, table alignments, and header/footer elements after conversion to ensure consistency before submitting your final document.'
    ]
  },
  {
    slug: 'how-to-watermark-confidential-documents',
    title: 'How to Watermark Confidential PDFs Before External Distribution',
    summary: 'A step-by-step guide to marking proprietary documents with DRAFT, CONFIDENTIAL, and copyright stamps.',
    readingTime: '3 min read',
    category: 'Security & Rights',
    publishedDate: 'July 28, 2026',
    relatedToolSlugs: ['watermark-pdf', 'protect-pdf', 'rotate-pdf'],
    content: [
      'Watermarking is a simple yet powerful deterrent against unauthorized distribution of internal memoranda, client proposals, and unpublished intellectual property.',
      'For maximum effectiveness, place semi-transparent diagonal text (between 15% and 30% opacity) across the center of each page. This ensures the document remains legible to legitimate reviewers while making unauthorized photography or screenshots obvious.',
      'Watermarking provides immediate visual provenance and copyright protection for your organization’s sensitive files.'
    ]
  }
];

export function getGuideBySlug(slug: string): GuideArticle | undefined {
  return GUIDES.find((g) => g.slug === slug);
}
