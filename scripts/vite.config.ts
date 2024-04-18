import { BuildOptions, InlineConfig, UserConfig, build } from 'vite';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import fs from 'fs-extra';
import vue from '@vitejs/plugin-vue';
import topLevelAwait from 'vite-plugin-top-level-await';
import transformCode from './vite-plugin-transform-code';
import styleSheetsInject from './vite-plugin-style-sheets-inject';

const __dirname = fileURLToPath(new URL('..', import.meta.url));

/** 是否开发环境 */
const isDev = process.env.NODE_ENV === 'development';

const toPath = (path: string) => resolve(__dirname, path);

const inputs = {
  popup: toPath('src/popup/index.html'),
  options: toPath('src/options/index.html'),
  devtools: toPath('src/devtools/index.html'),
  helper: toPath('src/helper/index.html'),
  panel: toPath('src/panel/index.html'),
  /** 后台脚本 */
  background: toPath('src/background/main.ts'),
  /**热更新内容脚本 */
  'content.hmr': toPath('src/script/content.hmr.ts'),
  /** 内容脚本 */
  'content.main': toPath('src/content_script/main.ts'),
};

const transformOption = {
  // 后台脚本
  background: inputs.background,

  // 剥离外部依赖
  external: {
    vue: '/assets/vue.js',
  },
};

const modes = Object.keys(inputs);

(async () => {
  for (let index = 0; index < modes.length; index++) {
    const mode = modes[index] as keyof typeof inputs;
    let rollupOptions: BuildOptions['rollupOptions'];
    const plugins: UserConfig['plugins'] = [
      vue(),
      topLevelAwait({
        promiseExportName: '__tla',
        promiseImportName: (i: any) => `__tla_${i}`,
      }),
      transformCode(transformOption),
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
          entryFileNames: ({ name }) => {
            const whileName = ['popup', 'options', 'devtools', 'helper', 'panel'];
            if (!whileName.includes(name)) return '[name].js';
            return 'src/[name]/[name].js';
          },
        },
      };
    } else {
      publicBuildConf.lib = {
        entry: inputs[mode],
        formats: ['es'],
      };
      rollupOptions = {
        output: {
          entryFileNames: () => `${mode}.js`,
          assetFileNames: () => `assets/[name].[hash:8].[ext]`,
          chunkFileNames: () => `assets/[name].[hash:8].js`,
          manualChunks: {},
        },
      };
      plugins.push(styleSheetsInject());
    }

    rollupOptions.external = Object.values(transformOption.external);

    const config: InlineConfig = {
      ...publicConf,
      configFile: false,
      build: {
        ...publicBuildConf,
        cssCodeSplit: true,
        rollupOptions,
      },
      plugins,
    };
    try {
      await build(config);
    } catch (error) {
      console.error(`[${mode}] entry 打包报错`);
    }
  }
})();

process.once('beforeExit', async () => {
  await fs.writeJson(resolve(__dirname, 'dist/.env.json'), { env: `${process.env.NODE_ENV}` });
});
