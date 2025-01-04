import type { Plugin } from 'vite';
import fs from 'fs-extra';

export default (): Plugin => {
    return {
        name: 'vite-plugin-json-plugin',
        apply: 'build',
        enforce: 'post',
        async generateBundle(_, bundle) {
            const manifestEntry: any = bundle['manifest.js'];
            const isEnv = process.env.NODE_ENV === 'development';
            if (manifestEntry) {
                const manifestJson = fs.readJsonSync(manifestEntry.facadeModuleId, 'utf-8');
                manifestEntry.fileName = 'manifest.json';
                if (isEnv) {
                    manifestJson.hot = true;
                }
                manifestEntry.code = JSON.stringify(manifestJson, null, 4);
            }
        },
    };
};
