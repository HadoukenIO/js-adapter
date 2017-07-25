import Transport, { Message } from '../transport/transport';
import { Identity } from '../identity';
import { EventEmitter } from 'events';
import { createHash } from 'crypto';

//This needs to be a singleton.
const topicRefMap = new Map();

export interface RuntimeEvent extends Identity {
    topic: string;
    type: string;
}

export class Bare extends EventEmitter {
    public wire: Transport;
    constructor(wire: Transport) {
        super();
        this.wire = wire;
    }

    protected get topic(): string {
        return this.constructor.name.replace('_', '').toLowerCase();
    }

    get me(): Identity {
        return this.wire.me;
    }
}

export class Base extends Bare {
    protected identity: Identity;

    constructor(wire: Transport) {
        super(wire);
        wire.registerMessageHandler(this.onmessage.bind(this));
    }

    protected runtimeEventComparator(listener: RuntimeEvent): boolean {
        return listener.topic === this.topic;
    }

    protected onmessage(message: Message<any>): boolean {

        if (message.action === 'process-desktop-event') {
            const payload = message.payload;

            if (this.runtimeEventComparator(<RuntimeEvent>payload)) {
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
            this.wire.sendAction('subscribe-to-desktop-event', listener);
        } else {
            topicRefMap.set(key, refCount + 1);
        }
    }

    protected deregisterEventListener(listener: RuntimeEvent): void {
        const key = createKey(listener);
        const refCount = topicRefMap.get(key);

        if (refCount) {

            const newRefCount = refCount - 1;
            topicRefMap.set(key, newRefCount);

            if (newRefCount === 0) {
                this.wire.sendAction('unsubscribe-to-desktop-event', listener);
            }
        }

    }

}

export class Reply<TOPIC extends string, TYPE extends string|void> implements Identity {
    public topic: TOPIC;
    public type: TYPE;
    public uuid: string;
    public name?: string;
}

function createKey(listener: RuntimeEvent): string {
    const key = createHash('md4')
        .update(<string>listener.name || '')
        .update(<string>listener.uuid || '')
        .update(listener.topic)
        .update(listener.type);

    return key.digest('base64');
}
