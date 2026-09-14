import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';

const toolSlugs = [
  'merge-pdf',
  'split-pdf',
  'compress-pdf',
  'pdf-to-jpg',
  'jpg-to-pdf',
  'pdf-to-word',
  'word-to-pdf',
  'pdf-to-png',
  'png-to-pdf',
  'rotate-pdf',
  'delete-pdf-pages',
  'extract-pdf-pages',
  'protect-pdf',
  'unlock-pdf',
  'watermark-pdf',
];

const guideSlugs = [
  'why-client-side-pdf-tools-are-safer',
  'how-to-compress-pdf-without-losing-text-clarity',
  'best-practices-for-converting-pdf-to-word',
  'how-to-watermark-confidential-documents',
];

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    ssgOptions: {
      script: 'async',
      dirStyle: 'nested',
      mock: true,
      includedRoutes(paths) {
        const dynamicRoutes = [
          ...toolSlugs.map((s) => `/tools/${s}`),
          ...guideSlugs.map((s) => `/guides/${s}`),
        ];
        return Array.from(new Set([...paths, ...dynamicRoutes]));
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
