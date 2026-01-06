import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import { fileURLToPath, URL } from 'node:url';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./vitest.setup.ts'],
  },
  resolve: {
    alias: {
      '@/core': fileURLToPath(new URL('./src/core', import.meta.url)),
      '@/adapters': fileURLToPath(new URL('./src/adapters', import.meta.url)),
      '@/shared': fileURLToPath(new URL('./src/shared', import.meta.url)),
    },
  },
});