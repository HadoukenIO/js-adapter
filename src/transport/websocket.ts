import * as WebSocket from "ws"
import Wire from "./wire"

export default class WebSocketTransport extends Wire {
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
    shutdown(): Promise<boolean> {
        this.wire.terminate()
        return Promise.resolve(true)
    }
    protected onmessage(data): void {}
}