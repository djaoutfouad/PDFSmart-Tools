/**
 * Centralized Site and Contact Configuration
 */
export const SITE_CONFIG = {
  siteName: 'PDFSmart Tools',
  contactName: 'PDFSmart Tools Support',
  contactEmail: 'pdfsmarttools@gmail.com',
  canonicalUrl: (typeof import.meta !== 'undefined' && import.meta.env?.VITE_SITE_URL) ||
                (typeof process !== 'undefined' && (process.env?.VITE_SITE_URL || (process.env as any)?.SITE_URL)) ||
                (typeof window !== 'undefined' && window.location?.origin) ||
                'https://pdfsmart-tools.djaoutfouad19762321.workers.dev',
};
