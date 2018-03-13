import { Environment } from './environment';
import { NewConnectConfig } from '../transport/wire';
import { NotImplementedError } from '../transport/transport-errors';
import { _Window } from '../api/window/window';
import Transport from '../transport/transport';

declare var fin: any;

export default class OpenFinEnvironment implements Environment {

    public writeToken = (path: string, token: string): Promise<string> => {
        throw new NotImplementedError('Not Implemented');
    }

    public retrievePort = (config: NewConnectConfig): Promise<number> => {
        throw new NotImplementedError('Not Implemented');
    }

    public getNextMessageId = (): any => {
        return fin.desktop.getUuid();
    }

    public createChildWindow = (wire: Transport, options: any): Promise<_Window> => {
        return new Promise((resolve, reject) => {
            const { uuid: parentUuid } = fin.__internal_.initialOptions;
            const opt = JSON.parse(JSON.stringify(options));
            const ABOUT_BLANK = 'about:blank';
            const CONSTRUCTOR_CB_TOPIC = 'fire-constructor-callback';

            if (!name || typeof name !== 'string') {
                return reject(new Error('Window must have a name'));
            }

            opt.uuid = opt.uuid || parentUuid;
            opt.url = opt.url || ABOUT_BLANK;

            if (opt.uuid !== parentUuid) {
                return reject(new Error('Child window uuid must match the parent window\'s uuid: ' + parentUuid));
            }

            if (fin.__internal_.windowExists(opt.uuid, opt.name)) {
                return reject(new Error('Trying to create a window that already exists'));
            }

            if (opt.url !== ABOUT_BLANK) {
                opt.url = this.resolveUrl(opt.url);
            }

            // need to call pageResponse, otherwise when a window is created, page is not loaded
            const win = new _Window(wire, {uuid: opt.uuid, name: opt.name});
            const pageResponse = new Promise((resolve) => {
                // tslint:disable-next-line
                win.on(CONSTRUCTOR_CB_TOPIC, function fireConstructor(response: any) {
                    let cbPayload;
                    const success = response.success;
                    const responseData = response.data;
                    const message = responseData.message;

                    if (success) {
                        cbPayload = {
                            httpResponseCode: responseData.httpResponseCode,
                            apiInjected: responseData.apiInjected
                        };
                    } else {
                        cbPayload = {
                            message: responseData.message,
                            networkErrorCode: responseData.networkErrorCode,
                            stack: responseData.stack
                        };
                    }

                    win.removeListener(CONSTRUCTOR_CB_TOPIC, fireConstructor);
                    resolve({
                        message: message,
                        cbPayload: cbPayload,
                        success: success
                    });
                });
            });

            const windowCreation = new Promise((resolve) => {
                fin.__internal_.createChildWindow(opt, (childWin: any) => {
                    resolve();
                });
            });

            Promise.all([pageResponse, windowCreation]).then((resolvedArr: any[]) => {
                const pageResolve = resolvedArr[0];

                if (pageResolve.success) {
                    resolve(win);
                } else {
                    reject(pageResolve.message);
                }
            });
         });
    }

    private resolveUrl(url: string): string {
        const newUrl = new URL(url, location.href);
        return newUrl.href;
    }
}
