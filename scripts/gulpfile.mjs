import Gulp from 'gulp';
import express from 'express'
import dotenv from 'dotenv';
import fs from 'fs-extra';
import cors from 'cors'
import death from 'death';
import { createRequire } from 'module';
import { EventEmitter } from 'node:events'

const { watch } = Gulp;
const app = express()
let emitter = new EventEmitter();

const require = createRequire(import.meta.url);
const pkg = require('../package.json');

let watcher = null

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
const notify = (/** @type {undefined} */ data) => emitter.emit('hmr', data);

/** 监听 dist 资源 */
const watchDistTask = async (/** @type {() => void} */ done) => {
	notify()
	done()
};

/**
 * @param {number | undefined} delay
 */
function sleep(delay) {
	return new Promise(succ => setTimeout(succ, delay))
}

// 异步清理函数
death(async () => {
	await fs.copy('../manifest.json', '../dist/manifest.json');
	notify()
	watcher.close()
	await sleep(250)
	globalThis.process.exit(0)
});

/** 热更新 */
export const hmr = (/** @type {() => void} */ done) => {
	watcher = watch(['../dist/**/*'], watchDistTask);
	done();
};
