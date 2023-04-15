import { defineConfig } from 'vite';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import vue from '@vitejs/plugin-vue';

const __dirname = fileURLToPath(new URL('.', import.meta.url));

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    emptyOutDir: false,
    rollupOptions: {
      input: {
        popup: resolve(__dirname, 'src/popup', 'index.html'),
        options: resolve(__dirname, 'src/options', 'index.html'),
        devtools: resolve(__dirname, 'src/devtools', 'index.html'),
        helper: resolve(__dirname, 'src/helper', 'index.html'),
        panel: resolve(__dirname, 'src/panel', 'index.html'),
      },
      output: {
        entryFileNames: (entry) => {
          const whileName = ['popup', 'options', 'devtools', 'helper', 'panel'];
          if (!whileName.includes(entry.name)) return '[name].js';
          return 'src/[name]/[name].js';
        },
        dir: 'dist',
      },
    },
  },
  plugins: [vue()],
});
