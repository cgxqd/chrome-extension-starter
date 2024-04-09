const bgHMR = `
receiveMessage('RELOAD', ({ sender }) => {
  chrome.runtime.reload();
  return sender;
});

receiveMessage('GET_TAB', ({ sender }) => sender);
`;

export default (
  options: {
    external?: Object;
    background?: string;
  } = {},
) => {
  return {
    name: 'vite-plugin-transform-code',
    transform(code: string, id: string) {
      /** 后台脚本嵌入 HMR相关代码 */
      if (id.replace(/\//g, '\\') === options.background) {
        if (!/import {([^}]+)?\sreceiveMessage[,\s]([^}]+)?} from/.test(code)) {
          code = code.replace(/^/, `import { receiveMessage } from '@/tools';\r\n`);
        }
        code += bgHMR;
      }

      /**
       * 替换 import 路径为静态资源路径
       * 比如：import { xx } from 'vue' => import { xx } from '/assets/vue.js'
       */
      Object.entries(options.external as {}).forEach(([oldPath, newPath]) => {
        const regex = new RegExp(`from\\s+['"]${oldPath}['"]`, 'g');
        code = code.replace(regex, `from '${newPath}'`);
      });
      return code;
    },
  };
};
