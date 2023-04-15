import { defineConfig } from 'vite';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import vue from '@vitejs/plugin-vue';

const __dirname = fileURLToPath(new URL('.', import.meta.url));

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  return {
    build: {
      emptyOutDir: false,
      lib: {
        entry: resolve(__dirname, `src/${mode}.ts`),
        name: mode,
        formats: ['iife'],
        fileName: () => `${mode}.js`,
      },
    },
    plugins: [vue()],
  };
});
