import { NewConnectConfig } from '../transport/wire';

export interface Environment {
    writeToken(path: string, token: string): Promise<string>;
    retrievePort(config: NewConnectConfig): Promise<number>;
    getNextMessageId(): any;
    getRandomId(): string;
    createChildWindow(options: any): Promise<any>;
}

export const notImplementedEnvErrorMsg = 'Not implemented in this environment';
