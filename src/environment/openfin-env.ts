import { Environment } from './environment';
import { NewConnectConfig } from '../transport/wire';
import { NotImplementedError } from '../transport/transport-errors';
import { Identity } from '../identity';

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

            if (!opt.name || typeof opt.name !== 'string') {
                return reject(new Error('Window must have a name'));
            }

            opt.uuid = opt.uuid || parentUuid;
            opt.url = opt.url || ABOUT_BLANK;

            if (opt.uuid !== parentUuid) {
                return reject(new Error('Child window uuid must match the parent window\'s uuid: ' + parentUuid));
            }

            if (fin.__internal_.entityExists(opt.uuid, opt.name)) {
                return reject(new Error('Trying to create a Window with name-uuid combination already in use - ' +
                    JSON.stringify({ name: opt.name, uuid: opt.uuid })));
            }

            // we should register the window name with the core asap to prevent
            // multiple windows claiming the same uuid-name combo
            fin.__internal_.registerWindowName(opt.uuid, opt.name);

            if (opt.url !== ABOUT_BLANK) {
                opt.url = this.resolveUrl(opt.url);
            }

            fin.__internal_.createChildWindow(opt, (childWin: any) => {
                resolve(childWin);
            });

         });
    }

    public getRandomId = (): string => {
        const intArray = new Uint32Array(1);
        return (<any>window).crypto.getRandomValues(intArray)[0].toString(32);
    }

    private resolveUrl(url: string): string {
        const newUrl = new URL(url, location.href);
        return newUrl.href;
    }

    public isWindowExists = (uuid: string, name: string): boolean => {
        return fin.__internal_.windowExists(uuid, name);
    }

    public getWebWindow = (identity: Identity): Window => {
        return fin.__internal_.getWebWindow(identity.name);
    }

    public getCurrentEntityIdentity = (): Identity => {
        return fin.__internal_.entityInfo;
    }
}
