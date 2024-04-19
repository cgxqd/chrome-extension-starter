import { type Plugin, normalizePath } from 'vite';

const bgHMR = `
receiveMessage('RELOAD', ({ sender }) => {
  chrome.runtime.reload();
  return sender;
});

receiveMessage('GET_TAB', ({ sender }) => sender);
`;

export default (
  options: {
    external?: object;
    background?: string;
  } = {},
): Plugin => {
  return {
    name: 'vite-plugin-transform-code',
    transform(code, id) {
      /** 后台脚本嵌入 HMR相关代码 */
      if (normalizePath(id) === normalizePath(options.background ?? '')) {
        if (!/import {([^}]+)?\sreceiveMessage[,\s]([^}]+)?} from/.test(code)) {
          code = code.replace(/^/, `import { receiveMessage } from '@/tools';\r\n`);
        }
        code += bgHMR;
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
