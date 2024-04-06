import Gulp from 'gulp';
import { createRequire } from 'module';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { WebSocketServer } from 'ws';
const { src, dest, parallel, watch } = Gulp;

const require = createRequire(import.meta.url);
const pkg = require('./package.json');

// eslint-disable-next-line @typescript-eslint/no-unused-vars
let sockets = new Map();
const UPDATE_CONTENT = 'UPDATE_CONTENT';

const wss = new WebSocketServer({ port: 8080 });
wss.on('connection', function connection(ws) {
  console.log(`\x1B[32m[${pkg.name}]\x1B[0m client connected.`);
  ws.on('message', (e) => {
    const { type, id } = JSON.parse(e.toString());
    if (type === 'connection' && id) {
      sockets.set(id, ws);
    }
    ws.send('keep websocket alive.');
  });
  ws.on('close', () => {
    console.log(`\x1B[32m[${pkg.name}]\x1B[0m client disconnected.`);
  });
});

const watchPulicTask = (done) => {
  src(['public/**/*']).pipe(dest('dist/'));
  sockets.forEach((socket) => socket.send(UPDATE_CONTENT));
  done();
};

const watchDistTask = (done) => {
  sockets.forEach((socket) => socket.send(UPDATE_CONTENT));
  done();
};

// 监听资源
const watchTask = (done) => {
  // watch(['dist/{background,content_script}*'], watchDistTask);
  watch(['dist/**/*'], watchDistTask);
  watch(['public/**/*'], watchPulicTask);
  done();
};

export const hmr = parallel(watchTask);
