import { EventEmitter } from "events";
import * as WebSocket from "ws";
import { Wire } from "./wire";

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
    }

    send(data: any, flags?: any): Promise<any> {
        return new Promise(resolve => {
            this.wire.send(JSON.stringify(data), flags, resolve);
        });
    }
    
    shutdown(): Promise<void> {
        this.wire.terminate();
        return Promise.resolve();
    }
}
