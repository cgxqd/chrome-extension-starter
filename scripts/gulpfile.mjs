import Gulp from 'gulp';
import dotenv from 'dotenv';
import fs from 'fs-extra';
import { createRequire } from 'module';
import { WebSocketServer } from 'ws';
const { watch } = Gulp;

const require = createRequire(import.meta.url);
const pkg = require('../package.json');

/** 配置环境变量 */
dotenv.config({ path: '../.env' });

let sockets = new Map();
const UPDATE_CONTENT = 'UPDATE_CONTENT';

/** 开启热更新服务 */
const wss = new WebSocketServer({ port: Number(process.env.VITE_PORT) });
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

/** 消息通知 */
const notify = () => sockets.forEach((socket) => socket.send(UPDATE_CONTENT));

/** 监听 dist 资源 */
const watchDistTask = (/** @type {() => void} */ done) => {
  notify();
  done();
};

/** 控制台退出异步操作 */
['SIGHUP', 'SIGINT', 'SIGTERM', 'SIGBREAK', 'SIGKILL'].map((name) => {
  process.on(name, async function () {
    await fs.copy('../manifest.json', '../dist/manifest.json');
    await fs.remove('../dist/content.hmr.js');
    notify();
    process.exit(1);
  });
});

/** 热更新 */
export const hmr = (/** @type {() => void} */ done) => {
  watch(['../dist/**/*'], watchDistTask);
  done();
};
