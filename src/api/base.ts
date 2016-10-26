import Transport from "../transport/transport"
import { Identity } from "../identity"
import {
    Not_a_Function
} from "./api-errors"

export class Bare {
    constructor(protected wire: Transport) {}
    protected get topic(): string {
        return this.constructor.name.replace("_", "").toLowerCase()
    }
}

export class Base extends Bare {
    protected identity: Identity = new Identity
    addEventListener(type: string, listener: Function): Promise<void> {
        if (typeof listener !== "function")
            return Promise.reject(new Not_a_Function)
        else 
            return this.wire.subscribeToEvent(this.identity, this.topic, type, listener)
    }
    removeEventListener(type: string, listener: Function): Promise<void> {
        return this.wire.unsubscribeFromEvent(this.identity, this.topic, type, listener)
    }
} 

export class Reply extends Identity {
    topic: string
    type: string
}