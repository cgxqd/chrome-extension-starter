import { receiveMessage } from './tools';

receiveMessage('RELOAD', ({ sender }) => {
  chrome.runtime.reload();
  return sender;
});

receiveMessage('GET_TAB', ({ sender }) => sender);

receiveMessage('TEST', ({ data }) => {
  console.log('收到前台的消息', data);
  return '后台数据';
});
