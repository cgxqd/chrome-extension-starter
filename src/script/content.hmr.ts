/** 热更新 */
const { env } = await fetch(chrome.runtime.getURL('/.env.json')).then((res) => res.json());
globalThis.__PROCESS_ENV = env;
if (env === 'development:hmr') {
  const { HMRServer } = await import('@/tools');
  HMRServer({ port: import.meta.env.VITE_PORT });
}
