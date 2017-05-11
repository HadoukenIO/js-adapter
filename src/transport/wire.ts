import { EventEmitter } from 'events';

export interface Wire extends EventEmitter {
    connect(address: string): Promise<any>;
    send(data: any): Promise<any>;
    shutdown(): Promise<void>;
}
export interface WireConstructor {
    new(onmessage: (data: any) => void): Wire;
}
