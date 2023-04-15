import { receiveMessage } from './tools';

receiveMessage('test1', ({ data }) => {
  console.log('收到前台的消息', data);
  return 'abc';
});
