import type { BuildOptions, Plugin } from 'vite';
import { minify } from 'terser';

function getCode({ initialCode, styleNames }: { initialCode: string; styleNames: string[] }) {
    return `
(async () => {
	const { default: Browser } = await import('/assets/browser-polyfill.js');
	const adoptedStyleSheets = [...document.adoptedStyleSheets]
	
	const files = ${JSON.stringify(styleNames)};
	for(let i = 0; i< files.length; i++) {
        const sheet = new CSSStyleSheet();
		const css = await fetch(Browser.runtime.getURL(files[i])).then(res => res.text())
		sheet.replaceSync(css)
		adoptedStyleSheets.push(sheet)
	}

	document.adoptedStyleSheets = adoptedStyleSheets
})();
${initialCode}
    `;
}

export default (): Plugin => {
    let buildConf: BuildOptions;
    return {
        name: 'vite-plugin-style-sheets-inject',
        apply: 'build',
        enforce: 'post',
        configResolved(config) {
            buildConf = config.build;
        },
        async generateBundle(_, bundle) {
            const styleNames: string[] = [];
            let entry: any;
            for (const key in bundle) {
                const chunk: any = bundle[key];
                /** 判断 chunk 是否为入口 */
                if (chunk.isEntry) {
                    entry = chunk;
                }
                /** 判断 chunk 是否 css 文件 */
                if (chunk.type === 'asset' && chunk.fileName.includes('.css')) {
                    styleNames.push(chunk.fileName);
                }
            }

            if (entry && styleNames.length) {
                const initialCode = entry.code;
                let code: string = getCode({ initialCode, styleNames });
                if (buildConf.minify) {
                    code = (await minify(code, {})).code as string;
                }
                entry.code = code;
            }
        },
    };
};
