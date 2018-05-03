import { Base } from '../base';
import Transport from '../../transport/transport';
import { notImplementedEnvErrorMsg } from '../../environment/environment';

/**
 * The Plugin API allows importing OpenFin plugins
 * @namespace
*/
export default class Plugin extends Base {
    private pluginsImportBaseKey: string; // unique plugins key for window
    private noEsmSupportErrorMsg: string;
    private importId: number;

    constructor(wire: Transport) {
        super(wire);

        this.importId = 0;
        this.pluginsImportBaseKey = '__plugins_import_';
        this.noEsmSupportErrorMsg = 'ES modules are not supported in this version of OpenFin.';
    }

    /**
     * Imports an OpenFin plugin and resolves with plugin's exported API.
     *
     * Works only in __OpenFin environment__.
     *
     * **Important**: If you set HTTP Content-Security-Policy's `script-src` directive
     * you must allow `unsafe-inline` for `blob:` for this API to work.
     *
     * @param {string} name - Plugin to import. Specified plugin must be listed in app's manifest.
     * @return {Promise<any>}
     * @tutorial Plugin.import
     */
    public async import(name: string): Promise<any> {
        if (!this.isOpenFinEnvironment()) {
            throw new Error(notImplementedEnvErrorMsg);
        }

        if (!this.isEsmSupported()) {
            throw new Error(this.noEsmSupportErrorMsg);
        }

        const { payload } = await this.wire.sendAction('get-plugin-module', name);
        const { data: content } = payload;

        return this.importModule(content);
    }

    // ESM is supported in OF v9+
    private isEsmSupported = (): boolean => {
        return parseInt((<any>window).fin.desktop.getVersion()) >= 9;
    }

    // Returns an unique key string for imports
    private getImportKey = (): string => {
        this.importId += 1;
        return `${this.pluginsImportBaseKey}${this.importId}`;
    }

    // Handles importing a plugin. Resolves with a plugin API object.
    private importModule(content: string): Promise<any> {
        return new Promise((resolve, reject) => {
            const blob = new Blob([content], { type: 'text/javascript' });
            const url = window.URL.createObjectURL(blob);
            const el = document.createElement('script');
            const key = this.getImportKey();

            // Cleanup: remove artifacts
            const cleanup = () => {
                el.remove();
                delete (<any>window)[key];
                window.URL.revokeObjectURL(url);
            };

            // <script type="module"> will handle native module loading
            el.type = 'module';
            el.textContent = `import * as api from '${url}'; window.${key}(api);`;
            el.onerror = (error: any) => {
                cleanup();
                reject(new Error(`Failed to import plugin: ${error}`));
            };
            (<any>window)[key] = (api: any) => {
                cleanup();
                resolve(api);
            };
            document.documentElement.appendChild(el);
        });
    }

}
