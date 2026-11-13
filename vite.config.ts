import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    outDir: 'dist',
    target: 'es2022',
  },
  optimizeDeps: {
    // @unikit-bridge/ui ships TypeScript source — prebundle it for the dev
    // server (esbuild compiles TS; the exports condition resolves the web
    // bridge, so react-native never enters the browser graph).
    include: ['@unikit-bridge/ui'],
  },
});
