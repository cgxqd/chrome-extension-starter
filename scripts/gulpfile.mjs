import Gulp from 'gulp';
import express from 'express'
import dotenv from 'dotenv';
import fs from 'fs-extra';
import cors from 'cors'
import { createRequire } from 'module';
import { EventEmitter } from 'node:events'

const { watch } = Gulp;
const app = express()
let emitter = new EventEmitter();

const require = createRequire(import.meta.url);
const pkg = require('../package.json');

/** 配置环境变量 */
dotenv.config({ path: '../.env' });

app.use(cors());

app.get('/hmr', (_, res) => {
	console.log(`\x1B[32m[${pkg.name}]\x1B[0m client connected.`);
	res.set({
		'Content-Type': 'text/event-stream',
		'Cache-Control': 'no-cache',
		'X-Accel-Buffering': 'no',
	});

	emitter.on('hmr', (data) => {
		res.write(`data: ${JSON.stringify({ type: 'hmr', data })}\n\n`);
	})
})

app.listen(Number(globalThis.process.env.VITE_PORT), () => {
	console.log('启动成功')
})

/** 消息通知 */
const notify = (data = true) => emitter.emit('hmr', data);

/** 监听 dist 资源 */
const watchDistTask = (/** @type {() => void} */ done) => {
	notify(true);
	done();
};

/** 控制台退出异步操作 */
;['SIGHUP', 'SIGINT', 'SIGTERM', 'SIGBREAK', 'SIGKILL'].map((name) => {
	globalThis.process.on(name, async function () {
		await fs.copy('../manifest.json', '../dist/manifest.json');
		notify(false);
		setTimeout(() => globalThis.process.exit(0), 250);
	});
});

/** 热更新 */
export const hmr = (/** @type {() => void} */ done) => {
	watch(['../dist/**/*'], watchDistTask);
	done();
};
