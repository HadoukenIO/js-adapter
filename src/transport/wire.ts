import { EventEmitter } from 'events';

export interface Wire extends EventEmitter {
    connect(address: string): Promise<any>;
    send(data: any): Promise<any>;
    shutdown(): Promise<void>;
}
export interface WireConstructor {
    new(onmessage: (data: any) => void): Wire;
}

export enum READY_STATE { // https://github.com/websockets/ws/blob/master/doc/ws.md#ready-state-constants
    CONNECTING, // The connection is not yet open.
    OPEN,       // The connection is open and ready to communicate.
    CLOSING,    // The connection is in the process of closing.
    CLOSED      // The connection is closed.
}
