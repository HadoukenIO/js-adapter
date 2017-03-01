import { EventEmitter } from "events";

export interface Wire extends EventEmitter {
    connect(address): Promise<any>;
    send(data): Promise<any>;
    shutdown(): Promise<void>;
}
export interface WireConstructor {
    new(onmessage: (data: any) => void);
}
