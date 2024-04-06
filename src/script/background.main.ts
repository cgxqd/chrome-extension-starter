import { receiveMessage } from '@/tools';
import '@/background/main';
/**
 *  开启热更新
 */
receiveMessage('RELOAD', ({ sender }) => {
  chrome.runtime.reload();
  return sender;
});

receiveMessage('GET_TAB', ({ sender }) => sender);
