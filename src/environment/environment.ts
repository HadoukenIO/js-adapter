import { ConnectConfig } from '../transport/wire';

export interface Environment {
    writeToken(path: string, token: string): Promise<string>;
    retreivePort(config: ConnectConfig): Promise<number>;
    getNextMessageId(): any;
}
