import { SendMessage, SendMessageArgs, ReceiveMessage } from './tool.type';

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
 * 获取标签页信息
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
