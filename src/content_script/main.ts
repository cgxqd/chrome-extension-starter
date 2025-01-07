const { default: Browser } = await import('webextension-polyfill');
const { default: App } = await import('./App.vue');
const { createApp } = (globalThis.Vue = await import(Browser.runtime.getURL('/assets/vue.js')));

/** 引入 ElementPlus
 *  js https://unpkg.com/element-plus/dist/index.full.js
 *  css https://unpkg.com/element-plus/dist/index.css
 */
await import(Browser.runtime.getURL('/assets/elementPlus.js'));
const el = document.createElement('div');
el.id = 'applictaion';
document.documentElement.appendChild(el);
createApp(App).use(globalThis.ElementPlus).mount('#applictaion');

export {};
