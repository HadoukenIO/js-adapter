import * as WebSocket from "ws"
import writeToken from "./write-token"
import { Identity } from "./identity"
import EventStore from "./event-store"

export default class Transport {
    protected wire: WebSocket
    protected messageCounter = 0
    protected listeners: {resolve: Function, reject: Function}[] = []
    protected eventListeners = new EventStore //(new loki).addCollection("eventListeners") // in-memory? when no loki(filename)
    protected uncorrelatedListener: Function
    connect(address: string): Promise<any> { 
        return new Promise((resolve, reject) => {
            this.wire = new WebSocket(address)
            this.wire.addEventListener("open", resolve)
            this.wire.addEventListener("error", reject)
            this.wire.addEventListener("ping", (data, flags) => this.wire.pong(data, flags, true))
            this.wire.addEventListener("message", this.onmessage.bind(this))
        })
    } 
    authenticate(identity: Identity): Promise<string> {
        const { uuid } = this._identity = identity
        let token
        return this.sendAction("request-external-authorization", {
            uuid,
            type: "file-token", // Other type for browser? Ask @xavier
            authorizationToken: null // Needed?
        }, true)
            // Simplify this chain.. DONE?
            .then(({ action, payload }) => {
                if (action !== "external-authorization-response")
                    return Promise.reject(new UnexpectedAction(action))
                else {
                    token = payload.token
                    return writeToken(payload.file, payload.token)
                }
            })
            .then(() => this.sendAction("request-authorization", { uuid, type: "file-token" }, true))
            .then(({ action, payload }) => {
                if (action !== "authorization-response")
                    return Promise.reject(new UnexpectedAction(action))
                else if (payload.success !== true)
                    return Promise.reject(new Error(`Success=${payload.success}`))
                else 
                    return token
            })
    }
    send(data, flags?): Promise<any> {
        return new Promise(resolve => {
            this.wire.send(JSON.stringify(data), flags, resolve)
        })
    }
    sendAction(action: string, payload = null, uncorrelated = false): Promise<Message> {
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
    subscribeToEvent(identity: Identity, topic: string, type: string, listener: Function): Promise<any> {
        this.eventListeners.add(identity, topic, type, listener)
        return this.sendAction("subscribe-to-desktop-event", {
            topic,
            type,
            // Spread ...identity
            uuid: identity.uuid, 
            name: identity.name
        })
    }
    shutdown(): Promise<void> {
        this.wire.terminate()
        return Promise.resolve()
    }

    protected addListener(id: number, resolve: Function, reject: Function, uncorrelated: boolean): void {
        if (uncorrelated)  
            this.uncorrelatedListener = resolve
        else if (id in this.listeners) 
            reject(new Error(`Listener for ${id} already registered`))
        else 
            this.listeners[id] = { resolve, reject }
            // Timeout and reject()?
    }
    protected onmessage(message, flags?): void {
        const data = JSON.parse(message.data), 
            id: number = data.correlationId 
        if (!("correlationId" in data)) 
            this.uncorrelatedListener.call(null, data)
            //throw new Error("Message has no .correlationId")
        else if (!(id in this.listeners))            
            throw new Error(`No listener registered for ${id}`)
        else {
            const { resolve, reject } = this.listeners[id]
            if (data.action != "ack")
                reject(new Error(`Got ${data.action}, not "ack"`))
            else if (!("payload" in data) || !data.payload.success)
                reject(new Error(`No success, ${data.payload && data.payload.success}`))
            else
                resolve.call(null, data)
            delete this.listeners[id]
        }
    }
}

class UnexpectedAction extends Error {
    constructor(action: string) {
        super(`Unexpected message with action=${action}`)
    }
}

export class Message {
    action: string
    payload: {
        success: boolean,
        data
    }
}