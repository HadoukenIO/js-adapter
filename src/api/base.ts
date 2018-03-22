import Transport, { Message } from '../transport/transport';
import { Identity } from '../identity';
import { EventEmitter } from 'events';

export interface RuntimeEvent extends Identity {
    topic: string;
    type: string;
}

export function isDesktopEvent(message: Message<any, any>): message is Message<void, RuntimeEvent> {
    return message.action === 'process-desktop-event';
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

    protected runtimeEventComparator = (listener: RuntimeEvent): boolean => {
        return listener.topic === this.topic;
    }

    protected onmessage = (message: Message<any, any>): boolean => {
        if (isDesktopEvent(message)) {
            const payload = message.payload;

            if (this.runtimeEventComparator(payload)) {
                this.emit(payload.type, message.payload);
            }
            return true;
        } else {
            return false;
        }
    }

    protected registerEventListener = (listener: RuntimeEvent): void => {
        const key = createKey(listener);
        const refCount = this.wire.topicRefMap.get(key);

        if (!refCount) {
            this.wire.topicRefMap.set(key, 1);
            this.wire.sendAction('subscribe-to-desktop-event', listener);
        } else {
            this.wire.topicRefMap.set(key, refCount + 1);
        }
    }

    protected deregisterEventListener = (listener: RuntimeEvent): void => {
        const key = createKey(listener);
        const refCount = this.wire.topicRefMap.get(key);

        if (refCount) {

            const newRefCount = refCount - 1;
            this.wire.topicRefMap.set(key, newRefCount);

            if (newRefCount === 0) {
                this.wire.sendAction('unsubscribe-to-desktop-event', listener);
            }
        }

    }

}

export class Reply<TOPIC extends string, TYPE extends string | void> implements Identity {
    public topic: TOPIC;
    public type: TYPE;
    public uuid: string;
    public name?: string;
}

function createKey(listener: RuntimeEvent): string {
    const { name, uuid, topic, type } = listener;

    return `${name}/${uuid}/${topic}/${type}`;
}
