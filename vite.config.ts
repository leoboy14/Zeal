import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  root: '.',
  build: {
    outDir: 'dist',
    minify: 'esbuild',
    sourcemap: false,
    rollupOptions: {
      input: {
        main: './index.html'
      },
      output: {
        // Long-lived vendor chunks: app copy tweaks no longer cache-bust
        // react/framer-motion for returning visitors. The admin subtree
        // splits automatically via its React.lazy() import.
        manualChunks: {
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          'vendor-motion': ['framer-motion']
        }
      }
    },
    cssCodeSplit: true,
    assetsInlineLimit: 4096
  },
  server: {
    // Honour an injected PORT (preview tooling, hosted sandboxes); default to 3000.
    port: Number(process.env.PORT) || 3000,
    open: true,
    hmr: {
      overlay: true
    }
  },
  css: {
    devSourcemap: true
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'framer-motion']
  }
});
