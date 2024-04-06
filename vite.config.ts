import { BuildOptions, UserConfig, defineConfig } from 'vite';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import vue from '@vitejs/plugin-vue';
import Components from 'unplugin-vue-components/vite';
import { ElementUiResolver } from 'unplugin-vue-components/resolvers';

const __dirname = fileURLToPath(new URL('.', import.meta.url));

const isDev = process.env.NODE_ENV === 'development';

const inputs = {
  popup: resolve(__dirname, 'src/popup', 'index.html'),
  options: resolve(__dirname, 'src/options', 'index.html'),
  devtools: resolve(__dirname, 'src/devtools', 'index.html'),
  helper: resolve(__dirname, 'src/helper', 'index.html'),
  panel: resolve(__dirname, 'src/panel', 'index.html'),

  /** 后台脚本 */
  background: resolve(__dirname, 'src/script/background.main.ts'),

  /** 内容脚本 */
  'content.main': resolve(__dirname, `src/script/content.main.ts`),
  // content2.main: resolve(__dirname, `src/script/content2.main.ts`),
};

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  let rollupOptions: BuildOptions['rollupOptions'];
  const plugins: UserConfig['plugins'] = [
    vue(),
    Components({
      resolvers: [ElementUiResolver()],
    }),
  ];
  const input = { [mode]: inputs[mode] };

  const publicConf = {
    define: {
      'process.env': process.env,
    },
    resolve: {
      alias: {
        '@': resolve(__dirname, 'src'),
        '~': resolve(__dirname),
      },
    },
  };
  const publicBuildConf: BuildOptions = {
    emptyOutDir: false,
    watch: isDev as unknown as BuildOptions['watch'],
    minify: !isDev,
  };

  if (!/^content/.test(mode)) {
    rollupOptions = {
      input,
      output: {
        entryFileNames: (entry) => {
          const whileName = ['popup', 'options', 'devtools', 'helper', 'panel'];
          if (!whileName.includes(entry.name)) return '[name].js';
          return 'src/[name]/[name].js';
        },
      },
    };
  } else {
    publicBuildConf.lib = {
      entry: inputs[mode],
      formats: ['es'],
      fileName: () => `${mode}.js`,
    };
    rollupOptions = {
      output: {
        entryFileNames: () => '[name].js',
        assetFileNames: () => `assets/${mode}.css`,
        chunkFileNames: () => 'assets/[name].js',
        manualChunks: {
          vue: ['vue'],
          'element-plus': ['element-plus'],
        },
      },
    };
  }

  return {
    ...publicConf,
    build: {
      ...publicBuildConf,
      rollupOptions,
    },
    plugins,
  };
});
