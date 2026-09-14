/**
 * generate-sitemap.js
 * Generates an up-to-date, canonical-synchronized sitemap.xml and robots.txt
 * for both `public/` and `dist/` based on SITE_CONFIG.canonicalUrl.
 */

import fs from 'fs';
import path from 'path';

// Determine canonical domain with precedence:
// 1. process.env.VITE_SITE_URL
// 2. process.env.SITE_URL
// 3. Fallback from siteConfig.ts or default to https://pdfsmart-tools.pages.dev
let fallbackDomain = 'https://pdfsmart-tools.pages.dev';
try {
  const siteConfigRaw = fs.readFileSync('src/config/siteConfig.ts', 'utf-8');
  const domainMatches = siteConfigRaw.match(/'https:\/\/[^']+'/g);
  if (domainMatches && domainMatches.length > 0) {
    fallbackDomain = domainMatches[domainMatches.length - 1].replace(/'/g, '');
  }
} catch (e) {
  // Use default pages.dev fallback
}

let canonicalUrl = (process.env.VITE_SITE_URL || process.env.SITE_URL || fallbackDomain).replace(/\/$/, '');

console.log(`🌐 Synchronizing sitemap & robots with canonical domain: ${canonicalUrl}`);

const routes = [
  { path: '', changefreq: 'daily', priority: '1.0' },
  { path: '/tools', changefreq: 'daily', priority: '0.9' },
  // Tools
  { path: '/tools/merge-pdf', changefreq: 'weekly', priority: '0.8' },
  { path: '/tools/split-pdf', changefreq: 'weekly', priority: '0.8' },
  { path: '/tools/compress-pdf', changefreq: 'weekly', priority: '0.8' },
  { path: '/tools/pdf-to-jpg', changefreq: 'weekly', priority: '0.8' },
  { path: '/tools/jpg-to-pdf', changefreq: 'weekly', priority: '0.8' },
  { path: '/tools/pdf-to-word', changefreq: 'weekly', priority: '0.8' },
  { path: '/tools/word-to-pdf', changefreq: 'weekly', priority: '0.8' },
  { path: '/tools/pdf-to-png', changefreq: 'weekly', priority: '0.8' },
  { path: '/tools/png-to-pdf', changefreq: 'weekly', priority: '0.8' },
  { path: '/tools/rotate-pdf', changefreq: 'weekly', priority: '0.8' },
  { path: '/tools/delete-pdf-pages', changefreq: 'weekly', priority: '0.8' },
  { path: '/tools/extract-pdf-pages', changefreq: 'weekly', priority: '0.8' },
  { path: '/tools/protect-pdf', changefreq: 'weekly', priority: '0.8' },
  { path: '/tools/unlock-pdf', changefreq: 'weekly', priority: '0.8' },
  { path: '/tools/watermark-pdf', changefreq: 'weekly', priority: '0.8' },
  // Guides
  { path: '/guides', changefreq: 'weekly', priority: '0.7' },
  { path: '/guides/why-client-side-pdf-tools-are-safer', changefreq: 'monthly', priority: '0.6' },
  { path: '/guides/how-to-compress-pdf-without-losing-text-clarity', changefreq: 'monthly', priority: '0.6' },
  { path: '/guides/best-practices-for-converting-pdf-to-word', changefreq: 'monthly', priority: '0.6' },
  { path: '/guides/how-to-watermark-confidential-documents', changefreq: 'monthly', priority: '0.6' },
  // Legal & Company
  { path: '/about', changefreq: 'monthly', priority: '0.5' },
  { path: '/contact', changefreq: 'monthly', priority: '0.5' },
  { path: '/privacy-policy', changefreq: 'monthly', priority: '0.5' },
  { path: '/terms', changefreq: 'monthly', priority: '0.5' },
  { path: '/cookie-policy', changefreq: 'monthly', priority: '0.5' },
  { path: '/disclaimer', changefreq: 'monthly', priority: '0.5' },
];

const sitemapContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${routes
  .map(
    (r) => `  <url>
    <loc>${canonicalUrl}${r.path}</loc>
    <changefreq>${r.changefreq}</changefreq>
    <priority>${r.priority}</priority>
  </url>`
  )
  .join('\n')}
</urlset>
`;

const robotsContent = `User-agent: *
Allow: /

Sitemap: ${canonicalUrl}/sitemap.xml
`;

// Write to public/
fs.writeFileSync('public/sitemap.xml', sitemapContent, 'utf-8');
fs.writeFileSync('public/robots.txt', robotsContent, 'utf-8');

// Also write to dist/ if it exists
if (fs.existsSync('dist')) {
  fs.writeFileSync('dist/sitemap.xml', sitemapContent, 'utf-8');
  fs.writeFileSync('dist/robots.txt', robotsContent, 'utf-8');
}

console.log(`✅ Generated sitemap.xml with ${routes.length} entries and robots.txt pointing to ${canonicalUrl}/sitemap.xml`);
