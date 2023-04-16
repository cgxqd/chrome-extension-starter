import { sendMessage, HMRServer } from './tools';

/**
 * 热更新
 */
HMRServer({ port: 8080 });

sendMessage({ cmd: 'TEST', data: '前台数据' }, (res) => {
  console.log('收到后台的消息', res);
});
