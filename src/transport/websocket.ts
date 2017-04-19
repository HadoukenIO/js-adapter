import { EventEmitter } from "events";
import * as WebSocket from "ws";
import { Wire } from "./wire";
import { DisconnectedError } from "./transport-errors";

export enum READY_STATE { // https://github.com/websockets/ws/blob/master/doc/ws.md#ready-state-constants
    CONNECTING, // The connection is not yet open.
    OPEN,       // The connection is open and ready to communicate.
    CLOSING,    // The connection is in the process of closing.
    CLOSED      // The connection is closed.
}

export default class WebSocketTransport extends EventEmitter implements Wire {
    protected wire: WebSocket;
    public onmessage: (data: any) => void;
    
    constructor(onmessage: (data: any) => void) {
        super();

        this.onmessage = onmessage;
    }

    connect = (address: string): Promise<any> =>  { 
        return new Promise((resolve, reject) => {
            this.wire = new WebSocket(address);
            this.wire.addEventListener("open", resolve);
            this.wire.addEventListener("error", reject);
            this.wire.addEventListener("ping", this.wire.pong);
            this.wire.addEventListener("message", (message, flags?) => this.onmessage.call(null, JSON.parse(message.data)));
            this.wire.addEventListener("close", () => {
                this.emit("disconnected");
            });
        });
    };

    send(data: any, flags?: any): Promise<any> {
        return new Promise((resolve, reject) => {
            if (this.wire.readyState !== READY_STATE.OPEN) {
                reject(new DisconnectedError(this.wire.readyState));
            } else {
                this.wire.send(JSON.stringify(data), flags, resolve);
            }
        });
    }
    
    shutdown(): Promise<void> {
        this.wire.terminate();
        return Promise.resolve();
    }

    static READY_STATE = READY_STATE;
}
