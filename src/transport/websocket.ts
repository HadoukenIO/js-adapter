import * as WebSocket from "ws"
import { Wire } from "./transport"

export default class WebSocketTransport implements Wire {
    private wire: WebSocket
    connect(address: string): Promise<any> { 
        return new Promise((resolve, reject) => {
            this.wire = new WebSocket(address)
            this.wire.addEventListener("open", resolve)
            this.wire.addEventListener("error", reject)
            this.wire.addEventListener("ping", this.wire.pong)
            this.wire.addEventListener("message", (message, flags?) => this.onmessage(JSON.parse(message.data)))
        })
    } 
    send(data, flags?): Promise<any> {
        return new Promise(resolve => {
            this.wire.send(JSON.stringify(data), flags, resolve)
        })
    }
    shutdown(): Promise<void> {
        this.wire.terminate()
        return Promise.resolve()
    }
    /*protected*/
    onmessage(data): void {}
}