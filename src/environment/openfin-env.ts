import { Environment } from './environment';
import { NewConnectConfig } from '../transport/wire';
import { NotImplementedError } from '../transport/transport-errors';

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

    public createChildWindow = (options: any): Promise<any> => {
        return new Promise((resolve, reject) => {
            const { uuid: parentUuid } = fin.__internal_.initialOptions;
            const opt = JSON.parse(JSON.stringify(options));
            const ABOUT_BLANK = 'about:blank';

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

            fin.__internal_.createChildWindow(opt, (childWin: any) => {
                resolve(childWin);
            });

         });
    }

    private resolveUrl(url: string): string {
        const newUrl = new URL(url, location.href);
        return newUrl.href;
    }
}
