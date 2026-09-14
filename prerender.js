/**
 * prerender.js - Static Site Generation (SSG), SEO & DOM Validator
 * 
 * 1. Verifies and ensures that every generated HTML file in `dist/` contains
 *    full static DOM markup inside `<div id="root">` with no empty root containers.
 * 2. Injects/verifies per-page canonical <link rel="canonical">, <meta property="og:url">,
 *    and structured JSON-LD schemas bound strictly to the canonical domain.
 * 3. Enforces canonical pages.dev domain across all meta and schema tags.
 */

import fs from 'fs';
import path from 'path';

const DIST_DIR = path.resolve('dist');

function getAllHtmlFiles(dir, fileList = []) {
  if (!fs.existsSync(dir)) return fileList;
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      getAllHtmlFiles(filePath, fileList);
    } else if (file.endsWith('.html')) {
      fileList.push(filePath);
    }
  }
  return fileList;
}

function getRouteFromPath(relativePath) {
  // Normalize path separators
  let normalized = relativePath.replace(/\\/g, '/');
  if (normalized === 'index.html') return '/';
  if (normalized.endsWith('/index.html')) {
    return '/' + normalized.slice(0, -'/index.html'.length);
  }
  if (normalized.endsWith('.html')) {
    return '/' + normalized.slice(0, -'.html'.length);
  }
  return '/' + normalized;
}

function validateAndEnrichPrerenderedHtml() {
  console.log('🔍 Validating True SSG pre-rendered DOM content & SEO tags across generated HTML files...');
  const htmlFiles = getAllHtmlFiles(DIST_DIR);
  
  if (htmlFiles.length === 0) {
    console.error('❌ No HTML files found in dist directory. Run `npm run build` first.');
    process.exit(1);
  }

  const canonicalDomain = (process.env.VITE_SITE_URL || process.env.SITE_URL || 'https://pdfsmart-tools.pages.dev').replace(/\/$/, '');
  console.log(`🌐 Synchronizing HTML canonical and OpenGraph tags with: ${canonicalDomain}`);

  let totalFiles = htmlFiles.length;
  let validFiles = 0;
  let emptyRootFiles = 0;

  for (const filePath of htmlFiles) {
    let content = fs.readFileSync(filePath, 'utf-8');
    const relativePath = path.relative(DIST_DIR, filePath);
    const route = getRouteFromPath(relativePath);
    const pageUrl = route === '/' ? canonicalDomain : `${canonicalDomain}${route}`;

    // 1. Check for root div and ensure it's not empty
    const rootMatch = content.match(/<div id="root"[^>]*>([\s\S]*?)<\/div>/i);
    const hasRenderedContent = rootMatch && rootMatch[1].trim().length > 100;

    if (hasRenderedContent) {
      validFiles++;
    } else {
      emptyRootFiles++;
      console.warn(`⚠️ Warning: ${relativePath} appears to have an empty or minimal <div id="root">`);
    }

    // 2. Ensure canonical tag
    const canonicalTag = `<link rel="canonical" href="${pageUrl}" />`;
    if (content.includes('rel="canonical"')) {
      content = content.replace(/<link\s+[^>]*rel="canonical"[^>]*>/gi, canonicalTag);
    } else {
      content = content.replace('</head>', `    ${canonicalTag}\n  </head>`);
    }

    // 3. Ensure og:url tag
    const ogUrlTag = `<meta property="og:url" content="${pageUrl}" />`;
    if (content.includes('property="og:url"')) {
      content = content.replace(/<meta\s+[^>]*property="og:url"[^>]*>/gi, ogUrlTag);
    } else {
      content = content.replace('</head>', `    ${ogUrlTag}\n  </head>`);
    }

    // 4. Ensure og:image tag
    const ogImageTag = `<meta property="og:image" content="${canonicalDomain}/og-image.png" />`;
    if (content.includes('property="og:image"')) {
      content = content.replace(/<meta\s+[^>]*property="og:image"[^>]*>/gi, ogImageTag);
    } else {
      content = content.replace('</head>', `    ${ogImageTag}\n  </head>`);
    }

    // 5. Ensure JSON-LD structured data with canonicalDomain
    if (!content.includes('application/ld+json')) {
      const pageSchema = {
        '@context': 'https://schema.org',
        '@graph': [
          {
            '@type': 'WebSite',
            '@id': `${canonicalDomain}/#website`,
            url: canonicalDomain,
            name: 'PDFSmart Tools',
            description: 'Free, private, and fast online PDF tools processed locally in your browser.',
            inLanguage: 'en-US',
            publisher: {
              '@type': 'Organization',
              '@id': `${canonicalDomain}/#organization`,
              name: 'PDFSmart Tools',
              url: canonicalDomain,
              logo: {
                '@type': 'ImageObject',
                url: `${canonicalDomain}/logo.png`,
              },
            },
          },
          {
            '@type': 'WebPage',
            '@id': `${pageUrl}/#webpage`,
            url: pageUrl,
            inLanguage: 'en-US',
            isPartOf: {
              '@id': `${canonicalDomain}/#website`,
            },
          },
        ],
      };

      const jsonLdScript = `    <script type="application/ld+json" id="structured-data-json-ld">\n${JSON.stringify(pageSchema, null, 2)}\n    </script>\n  </head>`;
      content = content.replace('</head>', jsonLdScript);
    } else {
      // Ensure existing JSON-LD uses canonicalDomain
      content = content.replace(/https:\/\/[a-z0-9-]+\.workers\.dev/g, canonicalDomain);
    }

    // 6. Strict replacement of any lingering worker domains if any existed
    content = content.replace(/https:\/\/[a-z0-9-]+\.workers\.dev/g, canonicalDomain);

    fs.writeFileSync(filePath, content, 'utf-8');
  }

  console.log(`✅ SSG DOM & SEO Verification Complete:`);
  console.log(`   - Total HTML routes checked & enriched: ${totalFiles}`);
  console.log(`   - Pre-rendered files with full DOM: ${validFiles}`);
  console.log(`   - Empty root files: ${emptyRootFiles}`);

  if (emptyRootFiles > 0) {
    console.error(`❌ Found ${emptyRootFiles} files without full pre-rendered DOM.`);
    process.exit(1);
  } else {
    console.log('🎉 All generated HTML files contain rich pre-rendered SSG markup with synchronized SEO canonical & OG tags.');
  }
}

validateAndEnrichPrerenderedHtml();
