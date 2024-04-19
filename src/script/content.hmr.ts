const { HMRServer } = await import('@/tools');
HMRServer({ port: import.meta.env.VITE_PORT });
globalThis.__PROCESS_ENV = 'development:hmr';
export {};
