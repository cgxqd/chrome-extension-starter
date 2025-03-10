import { type Plugin, normalizePath } from 'vite';
import { name } from '../package.json';

const injectBgCode = (option: { port: string }) => {
    const { port } = option;
    return `
(async () => {
	const manifest = await fetch('./manifest.json')
		.then((res) => res.json())
	console.log(manifest)
	if (manifest.hot) {
		function onHMR (env) {
        	console.log('%c[${name}] connection established', 'color: green');
			const source = new EventSource('http://localhost:${port}/hmr');
			source.addEventListener('message', () => {
				if (env === 'background') {
					Browser.runtime.reload()
				}
				if (env === 'contentScript') {
					window.location.reload();
				}
			});
		}
		onHMR('background')
		Browser.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
			if (changeInfo.status === 'complete' && tab.url) {
				Browser.scripting.executeScript({
					target: { tabId },
					func: onHMR,
					args: ['contentScript']
				});
			}
		});
	}
})()
`;
};

export default (options: { port?: string; external?: object; background?: string }): Plugin => {
    return {
        name: 'vite-plugin-transform-code',
        transform(code, id) {
            /** 后台脚本嵌入 HMR相关代码 */
            if (normalizePath(id) === normalizePath(options.background ?? '')) {
                code += injectBgCode({ port: options.port });
            }

            /**
             * 替换 import 路径为静态资源路径
             * 比如：import { xx } from 'vue' => import { xx } from '/assets/vue.js'
             */
            if (options.external) {
                Object.entries(options.external).forEach(([oldPath, newPath]) => {
                    const regex = new RegExp(`from\\s+['"]${oldPath}['"]`, 'g');
                    const regex2 = new RegExp(`await\\s+import\\("${oldPath}"\\)`, 'g');

                    code = code.replace(regex, `from '${newPath}'`);
                    code = code.replace(regex2, `await import('${newPath}')`);
                });
            }
            return code;
        },
    };
};
