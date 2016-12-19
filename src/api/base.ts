import Transport, { Message } from "../transport/transport";
import { Identity, AppIdentity } from "../identity";
import { EventEmitter } from "events";
import { createHash } from "crypto";

//This needs to be a singleton.
const topicRefMap = new Map();

export interface RuntimeEvent extends Identity {
    topic: string;
    type: string;
}

export class Bare extends EventEmitter {
    constructor(protected wire: Transport) {
        super();
    }
    
    protected get topic(): string {
        return this.constructor.name.replace("_", "").toLowerCase();
    }
    
    get me(): AppIdentity {
        return this.wire.me;
    }
}

export class Base extends Bare {
    protected identity: Identity = new Identity;
    
    constructor(wire: Transport) {
        super(wire);
        wire.registerMessageHandler(this.onmessage.bind(this));
    }

    protected runtimeEventComparator(listener: RuntimeEvent): boolean {
        return listener.topic === this.topic;
    }
    
    protected onmessage(message: Message<any>): boolean {
        
        if (message.action === "process-desktop-event") {
            const payload = message.payload;

            if (this.runtimeEventComparator(payload as RuntimeEvent)) {
                this.emit(payload.type, message.payload);
            }
            return true;
        } else {
            return false;
        }
    }

    protected registerEventListener(listener: RuntimeEvent): void {
        const key = createKey(listener);
        const refCount = topicRefMap.get(key);

        if (!refCount) {
            topicRefMap.set(key, 1);
            this.wire.sendAction("subscribe-to-desktop-event", listener);
        } else {
            topicRefMap.set(key, refCount + 1);
        }        
    }

    protected deregisterEventListener(listener: RuntimeEvent): void {
        const key = createKey(listener);
        const refCount = topicRefMap.get(key);

        if (refCount) {
            
            let newRefCount = refCount - 1;
            topicRefMap.set(key, newRefCount);

            if (newRefCount === 0) {
                this.wire.sendAction("unsubscribe-to-desktop-event", listener);
            }
        }
        
    }
    
} 

export class Reply<TOPIC extends string, TYPE extends string|void> extends Identity {
    topic: TOPIC;
    type: TYPE;
}

function createKey(listener: RuntimeEvent): string {
    const key = createHash("md4")
        .update(listener.name as string || "")
        .update(listener.uuid as string || "")
        .update(listener.topic)
        .update(listener.type);

    return key.digest("base64");
}
