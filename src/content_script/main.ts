import App from './App.vue';

(async () => {
  const { createApp } = await import('vue');
  const app = document.createElement('div');
  app.id = 'applictaion';
  document.documentElement.appendChild(app);
  createApp(App).mount('#applictaion');
})();

export default {};
