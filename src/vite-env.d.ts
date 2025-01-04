/// <reference types="vite/client" />
declare global {
    /* eslint-disable */
    var __PROCESS_ENV: any;
    var Vue: any;
    var ElementPlus: any;
    var process: NodeJS.Process;
    /* eslint-enable */
}

declare module '*.vue' {
    import { ComponentOptions } from 'vue';
    const componentOptions: ComponentOptions;
    export default componentOptions;
}

export {};
