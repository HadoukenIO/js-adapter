import { NewConnectConfig } from '../transport/wire';
import { Identity } from '../identity';
import { EntityInfo } from '../api/system/entity';

export interface Environment {
    writeToken(path: string, token: string): Promise<string>;
    retrievePort(config: NewConnectConfig): Promise<number>;
    getNextMessageId(): any;
    getRandomId(): string;
    createChildWindow(options: any): Promise<any>;
    isWindowExists(uuid: string, name: string) : boolean;
    getWebWindow(identity: Identity): Window;
    getCurrentEntity(): EntityInfo & { [x: string]: any };
}

export const notImplementedEnvErrorMsg = 'Not implemented in this environment';
