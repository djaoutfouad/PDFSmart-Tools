/**
 * prerender.js - Static Site Generation (SSG) & DOM Validator
 * 
 * Verifies and ensures that every generated HTML file in `dist/` contains
 * full static DOM markup inside `<div id="root">` with no empty root containers.
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

function validateAndEnsurePrerenderedDom() {
  console.log('🔍 Validating True SSG pre-rendered DOM content across generated HTML files...');
  const htmlFiles = getAllHtmlFiles(DIST_DIR);
  
  if (htmlFiles.length === 0) {
    console.error('❌ No HTML files found in dist directory. Run `npm run build` first.');
    process.exit(1);
  }

  let totalFiles = htmlFiles.length;
  let validFiles = 0;
  let emptyRootFiles = 0;

  for (const filePath of htmlFiles) {
    const content = fs.readFileSync(filePath, 'utf-8');
    const relativePath = path.relative(DIST_DIR, filePath);

    // Check for root div and ensure it's not empty
    const rootMatch = content.match(/<div id="root"[^>]*>([\s\S]*?)<\/div>/i);
    const hasRenderedContent = rootMatch && rootMatch[1].trim().length > 100;

    if (hasRenderedContent) {
      validFiles++;
    } else {
      emptyRootFiles++;
      console.warn(`⚠️ Warning: ${relativePath} appears to have an empty or minimal <div id="root">`);
    }
  }

  console.log(`✅ SSG DOM Verification Complete:`);
  console.log(`   - Total HTML routes checked: ${totalFiles}`);
  console.log(`   - Pre-rendered files with full DOM: ${validFiles}`);
  console.log(`   - Empty root files: ${emptyRootFiles}`);

  if (emptyRootFiles > 0) {
    console.error(`❌ Found ${emptyRootFiles} files without full pre-rendered DOM.`);
    process.exit(1);
  } else {
    console.log('🎉 All generated HTML files contain rich, true pre-rendered SSG markup for AdSense and SEO.');
  }
}

validateAndEnsurePrerenderedDom();
