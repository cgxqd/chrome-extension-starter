import { receiveMessage } from '@/tools';

receiveMessage('TEST', ({ data, response }) => {
  console.log('收到前台的消息', data);
  setTimeout(() => {
    response('我已经收到数据啦，跟你说下');
  }, 3000);
});
