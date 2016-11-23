import Transport, { Message } from "../transport/transport";
import { Identity, AppIdentity } from "../identity";
import ListenerStore from "../util/listener-store";
import { createHash } from "crypto";
import {
    Not_a_Function
} from "./api-errors";

export class Bare {
    constructor(protected wire: Transport) {}
    
    protected get topic(): string {
        return this.constructor.name.replace("_", "").toLowerCase();
    }
    
    get me(): AppIdentity {
        return this.wire.me;
    }
}

export class Base extends Bare {
    protected identity: Identity = new Identity;
    protected listeners = new ListenerStore<string>();

    constructor(wire: Transport) {
        super(wire);
        wire.registerMessageHandler(this.onmessage.bind(this));
    }
    
    /** This method is intended for handling _only_ messages relevant to this class. Override in subclasses */
    protected onmessage(message: Message<any>): boolean {
        if (message.action === "process-desktop-event") {
            for (const f of this.listeners.getAll(createKey(message.payload))) {
                f.call(null, message.payload);
            }
            return true;
        } else {
            return false;
        }
    }

    addEventListener(type: string, listener: Function): Promise<void> {
        if (typeof listener !== "function") {    
            return Promise.reject(new Not_a_Function);
        } else { 
            const id = this.identity.mergeWith({ 
                    topic: this.topic,
                    type
                });
            this.listeners.add(createKey(id), listener);
            return this.wire.sendAction("subscribe-to-desktop-event", id);
        }
    }
    
    removeEventListener(type: string, listener: Function): Promise<void> {
        const id = this.identity.mergeWith({
                topic: this.topic,
                type
            });
        return this.listeners.delete(createKey(id), listener)
            .then(wasLast => wasLast? this.wire.sendAction("unsubscribe-to-desktop-event", id) : Promise.resolve(wasLast));
    }
} 

export class Reply<TOPIC extends string, TYPE extends string|void> extends Identity {
    topic: TOPIC;
    type: TYPE;
}

function createKey(data): string {
    const key = createHash("md4")
        .update(data.topic)
        .update(data.type);

    switch (data.topic) {
        case "window":
        case "notifications":
            key.update(data.uuid)
                .update(data.name);
            break;
        case "application":
        case "externalapplication":
            key.update(data.uuid);
            break;
    }
    return key.digest("base64");
}
