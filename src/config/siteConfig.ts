/**
 * Centralized Site and Contact Configuration
 * Precedence:
 * 1. VITE_SITE_URL
 * 2. SITE_URL
 * 3. window.location.origin in browser runtime
 * 4. https://pdfsmart-tools.pages.dev as final fallback
 */
export const SITE_CONFIG = {
  siteName: 'PDFSmart Tools',
  contactName: 'PDFSmart Tools Support',
  contactEmail: 'pdfsmarttools@gmail.com',
  canonicalUrl:
    (typeof import.meta !== 'undefined' && import.meta.env?.VITE_SITE_URL) ||
    (typeof process !== 'undefined' && (process.env?.VITE_SITE_URL || (process.env as any)?.SITE_URL)) ||
    (typeof window !== 'undefined' && window.location?.origin) ||
    'https://pdfsmart-tools.pages.dev',
};
