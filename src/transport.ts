import WebSocket = require("ws")
import Promise = require("bluebird")
import writeToken from "./write-token"

export default class Transport {
    private wire: WebSocket
    private messageCounter = 0
    private listeners: Function[] = []
    private uncorrelatedListener: Function
    connect(address: string): Promise<any> { // Type?
        return new Promise((resolve, reject) => {
            this.wire = new WebSocket(address)
            this.wire.addEventListener("open", resolve)
            this.wire.addEventListener("error", reject)
            this.wire.addEventListener("ping", (data, flags) => this.wire.pong(data, flags, true))
            this.wire.addEventListener("message", this.onmessage.bind(this))
        })
    } 
    authenticate(uuid: string): Promise<string> {
        return new Promise((resolve, reject) => {
            this.sendAction("request-external-authorization", {
                uuid,
                type: "file-token", // Other type for browser? Ask @xavier
                authorizationToken: null // Needed?
            }, true)
                .then(({ action, payload }) => {
                    if (action != "external-authorization-response")
                        reject(new UnexpectedAction(action))
                    else {
                        const token: string = payload.token
                        return writeToken(payload.file, token) 
                            .then(() => {
                                return this.sendAction("request-authorization", { 
                                    uuid,
                                    type: "file-token"
                                }, true)
                                    .then(({ action, payload }) => {
                                        if (action != "authorization-response")
                                            reject(new UnexpectedAction(action))
                                        else if (payload.success !== true)
                                            reject(new Error(`Success=${payload.success}`))
                                        else 
                                            resolve(token)
                                    })
                                    .catch(reject)
                            })
                    }
                })
                .catch(reject)
        })
    }
    send(data, flags?): Promise<any> {
        return new Promise(resolve => {
            this.wire.send(JSON.stringify(data), flags, resolve)
        })
    }
    sendAction(action: string, payload: any, uncorrelated = false): Promise<any> {
        return new Promise((resolve, reject) => {
            const id = this.messageCounter++
            this.send({
                action,
                payload,
                messageId: id
            })
            this.addListener(id, resolve, reject, uncorrelated)
        })
    }
    shutdown(): Promise {
        this.wire.terminate()
        return Promise.resolve()
    }

    private addListener(id: number, f: Function, reject: Function, uncorrelated: boolean): void {
        if (uncorrelated)  
            this.uncorrelatedListener = f
        else if (id in this.listeners) 
            reject(new Error(`Listener for ${id} already registered`))
        else 
            this.listeners[id] = f
            // Timeout and reject()?
    }
    private onmessage(message, flags?): void {
        const data = JSON.parse(message.data), 
            id: number = data.correlationId 
        if (!("correlationId" in data)) 
            this.uncorrelatedListener.call(null, data)
            //throw new Error("Message has no .correlationId")
        else if (!(id in this.listeners))            
            throw new Error(`No listener registered for ${id}`)
        else
            this.listeners[id].call(null, data)
    }

    assertAck(action: string, reject: Function): void {
        if (action != "ack")
            reject(new Error(`Got ${action}, not "ack"`))
    }
}

class UnexpectedAction extends Error {
    constructor(action: string) {
        super(`Unexpected message with action=${action}`)
    }
}