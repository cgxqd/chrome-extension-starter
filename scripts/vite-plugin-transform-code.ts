import { type Plugin, normalizePath } from 'vite';
import { name } from '../package.json';

const injectBgCode = (option: { port: string }) => {
    const { port } = option;
    return `
(async () => {
	const manifest = await fetch(globalThis.chrome.runtime.getURL('manifest.json'))
		.then((res) => res.json())
	if (manifest.hot) {
		function onHMR (env) {
        	console.log('%c[${name}] connection established', 'color: green');
			const source = new EventSource('http://localhost:${port}/hmr');
			source.addEventListener('message', () => {
				if (env === 'background') {
					chrome.runtime.reload()
				}
				if (env === 'contentScript') {
					window.location.reload();
				}
			});
		}
		onHMR('background')
		chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
			if (changeInfo.status === 'complete' && tab.url) {
				chrome.scripting.executeScript({
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
                if (!/import {([^}]+)?\sreceiveMessage[,\s]([^}]+)?} from/.test(code)) {
                    code = code.replace(/^/, `import { receiveMessage } from '@/tools';\r\n`);
                }
                code += injectBgCode({ port: options.port });
            }

            /**
             * 替换 import 路径为静态资源路径
             * 比如：import { xx } from 'vue' => import { xx } from '/assets/vue.js'
             */
            if (options.external) {
                Object.entries(options.external).forEach(([oldPath, newPath]) => {
                    const regex = new RegExp(`from\\s+['"]${oldPath}['"]`, 'g');
                    code = code.replace(regex, `from '${newPath}'`);
                });
            }
            return code;
        },
    };
};
