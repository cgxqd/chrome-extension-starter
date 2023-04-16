import { SendMessage, SendMessageArgs, ReceiveMessage } from './tool.type';
import { name } from '../../package.json';
/**
 * 发送消息
 * @param opt.cmd 消息类型
 * @param opt.data 发送的数据
 * @param cb 后台响应后的回调
 */
export const sendMessage: SendMessage = (opt, cb) => {
  chrome.runtime.sendMessage(opt, cb);
};

/**
 * 异步发送消息
 * @param opt.cmd 消息类型
 * @param opt.data 发送的数据
 * @param cb background 响应后的回调
 * @returns {Promise<void>} 异步等待响应
 */
export const sendMessageAsync = async (opt: SendMessageArgs) =>
  new Promise((resolve) => {
    sendMessage(opt, resolve);
  });

/**
 * 后台接收消息
 * @param _cmd 消息类型
 * @param cb 接收消息的回调
 */
export const receiveMessage: ReceiveMessage = (_cmd: string, cb) => {
  chrome.runtime.onMessage.addListener((event, sender, response) => {
    const { cmd, data } = event;
    if (cmd === _cmd) {
      const res = cb({ data, sender, response });
      if (res) {
        response(res);
      }
    }
  });
};

/**
 * 后台脚本获取标签页信息
 */
export const getTab = async (): Promise<chrome.tabs.Tab> =>
  new Promise((resolve) => {
    chrome.tabs.query({ active: true, currentWindow: true }, ([tab]: chrome.tabs.Tab[]) => {
      resolve(tab);
    });
  });

/**
 * 后台动态加载文件
 */
export const onloadScript = () => {
  receiveMessage('loadScript1', async ({ data, response }) => {
    const { id = 0 } = await getTab();
    chrome.tabs.update(id, { active: true }, function () {
      chrome.scripting.executeScript(
        {
          target: { tabId: id },
          files: [data],
        },
        () => {
          response();
        },
      );
    });
  });
};

/**
 * 热更新
 */
export const HMRServer = ({ port }: { port: number }) => {
  if (process.env.NODE_ENV !== 'development') return;
  const ws = new WebSocket(`ws://localhost:${port}/${name}/ctx`);
  let timer: NodeJS.Timeout | undefined;

  ws.onopen = async function () {
    const { id } = (await sendMessageAsync({ cmd: 'GET_TAB' })) as chrome.runtime.MessageSender;
    ws.send(JSON.stringify({ type: 'connection', id }));
    if (timer) clearInterval(timer);
    timer = setInterval(() => {
      ws.send(JSON.stringify({ type: 'ping' }));
    }, 1500);
    console.log(`%c[${name}] connection established`, 'color: green');
  };
  ws.onmessage = async function (e) {
    if (e.data === 'UPDATE_CONTENT') {
      await sendMessageAsync({ cmd: 'RELOAD' });
      window.location.reload();
    }
  };
  ws.onclose = function () {
    if (timer) clearInterval(timer);
    console.log(`%c[${name}] connection closed.`, 'color: red');
  };
};
