import { NewConnectConfig } from '../transport/wire';

export interface Environment {
    writeToken(path: string, token: string): Promise<string>;
    retreivePort(config: NewConnectConfig): Promise<number>;
    getNextMessageId(): any;
}
