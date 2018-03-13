import { NewConnectConfig } from '../transport/wire';
import { _Window } from '../api/window/window';
import Transport from '../transport/transport';

export interface Environment {
    writeToken(path: string, token: string): Promise<string>;
    retrievePort(config: NewConnectConfig): Promise<number>;
    getNextMessageId(): any;
    createChildWindow(wire: Transport, options: any): Promise<_Window>;
}
