import { BuildOptions, UserConfig, build } from 'vite';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import fs from 'fs-extra';
import vue from '@vitejs/plugin-vue';
import topLevelAwait from 'vite-plugin-top-level-await';
import transformCode from './vite-plugin-transform-code';

const __dirname = fileURLToPath(new URL('..', import.meta.url));

/** 是否开发环境 */
const isDev = process.env.NODE_ENV === 'development';

const inputs: any = {
  popup: resolve(__dirname, 'src/popup', 'index.html'),
  options: resolve(__dirname, 'src/options', 'index.html'),
  devtools: resolve(__dirname, 'src/devtools', 'index.html'),
  helper: resolve(__dirname, 'src/helper', 'index.html'),
  panel: resolve(__dirname, 'src/panel', 'index.html'),

  /** 后台脚本 */
  background: resolve(__dirname, 'src/background/main.ts'),

  /**热更新内容脚本 */
  'content.hmr': resolve(__dirname, `src/script/content.hmr.ts`),
  /** 内容脚本 */
  'content.main': resolve(__dirname, `src/content_script/main.ts`),
};

const transformOption = {
  // 后台脚本
  background: inputs['background'],

  // 剥离外部依赖
  external: {
    vue: '/assets/vue.js',
  },
};

const modes = Object.keys(inputs);

(async () => {
  for (let index = 0; index < modes.length; index++) {
    const mode = modes[index];
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
      };
      rollupOptions = {
        output: {
          entryFileNames: () => `${mode}.js`,
          assetFileNames: () => `assets/${mode}.[name].[ext]`,
          chunkFileNames: () => `assets/[name].[hash:8].js`,
          manualChunks: {},
        },
      };
    }

    rollupOptions.external = Object.values(transformOption.external);

    const config: any = {
      ...publicConf,
      configFile: false,
      build: {
        ...publicBuildConf,
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
