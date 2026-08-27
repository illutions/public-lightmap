import { defineConfig } from 'vite';
import dns from 'dns';
import path from 'path';
import { fileURLToPath } from 'url';
import viteCompression from 'vite-plugin-compression';
import { visualizer } from 'rollup-plugin-visualizer';
import unusedCode from 'vite-plugin-unused-code';

dns.setDefaultResultOrder('verbatim');
const REPO_ROOT = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  root: REPO_ROOT,
  base: process.env.PAGES_BASE_PATH || '/',

  server: {
  host: 'localhost',
    port: 5173,
    strictPort: true,
  },

  cacheDir: path.resolve(REPO_ROOT, '.vite-cache'),
  publicDir: 'public',
  css: false,

  plugins: [
    unusedCode({
      patterns: ['src/**/*.*'],
    }),
    viteCompression({
      algorithm: 'gzip',
      ext: '.gz',
      threshold: 0,
      verbose: true,
    }),
    visualizer({
      open: false,
      filename: 'bundle-report.html',
    }),
  ],

  build: {
    outDir: path.resolve(REPO_ROOT, 'dist'),
    emptyOutDir: true,
    sourcemap: false,
    chunkSizeWarningLimit: 1500,
    minify: 'terser',
    license: {
      fileName: 'licenses.md',
    },
    terserOptions: {
      compress: { drop_console: false }, // Keep console logs for debugging
    },
    rolldownOptions: {
      output: {
        entryFileNames: 'main.min.js',
        chunkFileNames: 'modules/[name].js',
        assetFileNames: (asset) => {
         if (asset.name.endsWith('.css')) return 'css/[name].[ext]';
          return 'assets/[name].[ext]';
        }
      },
    },
  },

  preview: {
    host: 'localhost',
    port: 5173,
    strictPort: true
  }
});
