import { SendMessage, ReceiveMessage } from '@/tools/tool.type';

/**
 * 发送消息
 * @param cmd 消息类型
 * @param data 发送给接收方的数据
 * @param cb 接收方接收到数据后的回调
 * @param toTab
 */
export const sendMessage: SendMessage = (cmd: string, data, cb = () => undefined, toTab = false) => {
    const id = chrome.runtime.id;
    cmd = `${cmd}:${id}`;
    if (toTab) {
        chrome.tabs.query({ active: true, currentWindow: true }, function ([tab]: chrome.tabs.Tab[]) {
            if (/^https?/.test(tab.url || '')) {
                chrome.tabs.sendMessage(tab.id as number, { cmd, data }, cb);
            }
        });
    } else {
        chrome.runtime.sendMessage({ cmd, data }, cb);
    }
};

/**
 * 异步发送消息
 * @param cmd 消息类型
 * @param data 发送给接收方的数据
 * @returns {Promise<any>} 异步等待响应
 */
export const sendMessageAsync = async (cmd: string, data?: any, toTab?: any): Promise<any> =>
    new Promise((resolve) => {
        sendMessage(cmd, data, resolve, toTab);
    });

/**
 * 后台接收消息
 * @param _cmd 消息类型
 * @param cb 接收消息的回调
 */
export const receiveMessage: ReceiveMessage = (_cmd: string, cb) => {
    chrome.runtime.onMessage.addListener((event, sender, response) => {
        const { cmd, data } = event;
        if (cmd === `${_cmd}:${sender.id}`) {
            const res = cb({ data, sender, response });
            if (res) {
                response(res);
            }
        }
        return true;
    });
};

/**
 * 后台脚本获取当前标签页信息
 */
export const getTab = async (): Promise<chrome.tabs.Tab> =>
    new Promise((resolve) => {
        chrome.tabs.query({ active: true, currentWindow: true }, ([tab]: chrome.tabs.Tab[]) => {
            resolve(tab);
        });
    });
