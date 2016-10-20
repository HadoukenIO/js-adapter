import Transport from "../transport/transport"
import { Identity } from "../identity"
import {
    NoIdentity,
    Not_a_Function
} from "./api-errors"

abstract class Base {
    protected identity: Identity 
    constructor(protected wire: Transport, protected token?: string) {}
    addEventListener(type: string, listener: Function): Promise<void> {
        if (typeof listener !== "function")
            return Promise.reject(new Not_a_Function)
        else if (this.identity)
            return this.wire.subscribeToEvent(this.identity, this.topic, type, listener)
        else    
            return Promise.reject(new NoIdentity)
    }
    protected get topic(): string {
        return this.constructor.name.replace("_", "").toLowerCase()
    }
}
export default Base