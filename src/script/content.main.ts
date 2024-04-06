(async () => {
  /** 热更新 */
  const { HMRServer } = await import('@/tools');
  HMRServer({ port: 8080 });
  import('@/content_script/main');
})();
