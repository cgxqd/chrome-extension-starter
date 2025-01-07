import { type BuildOptions, type InlineConfig, type UserConfig, build, loadEnv } from 'vite';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import vue from '@vitejs/plugin-vue';
import topLevelAwait from 'vite-plugin-top-level-await';

/** 自定义插件 */
import transformCode from './vite-plugin-transform-code';
import styleSheetsInject from './vite-plugin-style-sheets-inject';
import manifest from './vite-plugin-manifest';

/** 环境变量 */
const env = loadEnv('', process.cwd());
const { VITE_PORT } = env;

const __dirname = fileURLToPath(new URL('..', import.meta.url));

/** 是否开发环境 */
const isDev = process.env.NODE_ENV === 'development';

const toPath = (path: string) => resolve(__dirname, path);

/** 入口配置 */
const inputs: Record<string, string> = {
    /** 扩展配置文件 */
    manifest: toPath('manifest.json'),

    popup: toPath('src/popup/index.html'),
    options: toPath('src/options/index.html'),
    devtools: toPath('src/devtools/index.html'),
    helper: toPath('src/helper/index.html'),
    panel: toPath('src/panel/index.html'),
    /** 后台脚本 */
    background: toPath('src/background/main.ts'),
    /** 内容脚本 */
    'content.main': toPath('src/content_script/main.ts'),
};

const transformOption = {
    port: VITE_PORT,
    // 后台脚本
    background: inputs.background,
    // 剥离外部依赖
    external: {
        vue: '/assets/vue.js',
        'webextension-polyfill': '/assets/browser-polyfill.js',
    },
};

export async function buildFun({ mode }: { mode: string }) {
    let rollupOptions: BuildOptions['rollupOptions'];
    const plugins: UserConfig['plugins'] = [
        vue(),
        topLevelAwait({
            promiseExportName: '__tla',
            promiseImportName: (i: any) => `__tla_${i}`,
        }),
        transformCode(transformOption),
        manifest(),
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

    if (/^content/.test(mode)) {
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
        /** 处理内容脚本的样式 */
        plugins.push(styleSheetsInject());
    } else {
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
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
        console.error(`[${mode}] entry 打包报错`);
    }
}

for (const mode in inputs) {
    if (Object.prototype.hasOwnProperty.call(inputs, mode)) {
        buildFun({ mode });
    }
}
