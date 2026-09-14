/**
 * verify-digits.js
 * Build-time and CI verification script to ensure no Arabic-Indic (٠١٢٣٤٥٦٧٨٩)
 * or Persian/Eastern Arabic-Indic (۰۱۲۳۴۵۶۷۸۹) digits exist anywhere in user-facing content.
 */

import fs from 'fs';
import path from 'path';

// Regex for Arabic-Indic and Eastern Arabic-Indic/Persian digits
const FORBIDDEN_DIGITS_REGEX = /[\u0660-\u0669\u06F0-\u06F9]/g;

// Directories to scan
const SCAN_DIRS = ['src', 'public'];
const SCAN_EXTENSIONS = ['.ts', '.tsx', '.js', '.jsx', '.html', '.json', '.md'];

let violationCount = 0;
const violations = [];

function scanFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split('\n');
  
  lines.forEach((line, index) => {
    const matches = line.match(FORBIDDEN_DIGITS_REGEX);
    if (matches) {
      violationCount += matches.length;
      violations.push({
        file: filePath,
        line: index + 1,
        match: matches.join(', '),
        text: line.trim().slice(0, 100),
      });
    }
  });
}

function scanDir(dir) {
  if (!fs.existsSync(dir)) return;
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name !== 'node_modules' && entry.name !== 'dist' && entry.name !== '.git') {
        scanDir(fullPath);
      }
    } else if (entry.isFile()) {
      const ext = path.extname(entry.name).toLowerCase();
      if (SCAN_EXTENSIONS.includes(ext)) {
        scanFile(fullPath);
      }
    }
  }
}

console.log('🔍 Running Arabic-Indic & Persian Digits Safety Verification...');
for (const dir of SCAN_DIRS) {
  scanDir(path.resolve(dir));
}

// Also scan index.html and root files
if (fs.existsSync('index.html')) scanFile(path.resolve('index.html'));

if (violationCount > 0) {
  console.error(`❌ Non-ASCII digit check failed! Found ${violationCount} forbidden Arabic-Indic or Persian digit(s):`);
  violations.forEach((v) => {
    console.error(`   - ${v.file}:${v.line} -> Found [${v.match}] in "${v.text}"`);
  });
  process.exit(1);
} else {
  console.log('✅ Digit safety check passed: 0 Arabic-Indic or Persian digits found across all user-facing content.');
}
