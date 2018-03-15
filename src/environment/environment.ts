import { NewConnectConfig } from '../transport/wire';

export interface Environment {
    writeToken(path: string, token: string): Promise<string>;
    retrievePort(config: NewConnectConfig): Promise<number>;
    getNextMessageId(): any;
    createChildWindow(options: any): Promise<any>;
}
