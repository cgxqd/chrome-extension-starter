import { sendMessage } from './tools';

sendMessage(
  {
    cmd: 'test1',
    data: {},
  },
  (res) => {
    console.log('收到后台的消息', res);
  },
);
