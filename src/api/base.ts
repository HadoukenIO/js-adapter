import Transport from "../transport"
import { Identity } from "../identity"

abstract class Base {
    protected identity: Identity 
    constructor(protected wire: Transport, protected token?: string) {}
    addEventListener(type: string, listener: Function): Promise<any> {
        if (this.identity)
            return this.wire.subscribeToEvent(this.identity, this.topic, type, listener)
        else    
            return Promise.reject(new Error("No identity set on instance"))
    }
    protected get topic(): string {
        return this.constructor.name.replace("_", "").toLowerCase()
    }
}
export default Base