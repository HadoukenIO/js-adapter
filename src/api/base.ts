import Transport, { Message } from '../transport/transport';
import { Identity } from '../identity';
import { EventEmitter } from 'events';

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

    protected isNodeEnvironment = (): boolean => {
        return this.wire.environment.constructor.name === 'NodeEnvironment';
    }

    protected isOpenFinEnvironment = (): boolean => {
        return this.wire.environment.constructor.name === 'OpenFinEnvironment';
    }
}

export class Base extends Bare {
    constructor(wire: Transport) {
        super(wire);
        wire.registerMessageHandler(this.onmessage.bind(this));
    }

    protected runtimeEventComparator = (listener: RuntimeEvent): boolean => {
        return listener.topic === this.topic;
    }

    protected onmessage = (message: Message<any>): boolean => {

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

    protected registerEventListener = (listener: RuntimeEvent): Promise<any> => {
        const key = createKey(listener);
        const refCount = this.wire.topicRefMap.get(key);

        if (!refCount) {
            this.wire.topicRefMap.set(key, 1);
            return this.wire.sendAction('subscribe-to-desktop-event', listener);
        } else {
            this.wire.topicRefMap.set(key, refCount + 1);
            return new Promise(res => res());
        }
    }

    protected deregisterEventListener = (listener: RuntimeEvent): Promise<any> => {
        const key = createKey(listener);
        const refCount = this.wire.topicRefMap.get(key);

        if (refCount) {

            const newRefCount = refCount - 1;
            this.wire.topicRefMap.set(key, newRefCount);

            if (newRefCount === 0) {
                return this.wire.sendAction('unsubscribe-to-desktop-event', listener);
            }
            return new Promise(res => res());
        }

    }

}

// @ts-ignore: return types incompatible with EventEmitter (this)
export class NamedBase extends Base {
    protected identity: Identity;
    // @ts-ignore: return types incompatible with EventEmitter (this)
    public on(eventType: string, listener: (...args: any[]) => void): Promise<void> {
        super.on(eventType, listener);
        return this.registerEventListener(Object.assign({}, this.identity, {
            type: eventType,
            topic: this.topic
        })).then(() => undefined);
    }
    // @ts-ignore: return types incompatible with EventEmitter (this)
    public addListener(eventType: string, listener: (...args: any[]) => void): Promise<void> {
        super.addListener(eventType, listener);
        return this.registerEventListener(Object.assign({}, this.identity, {
            type: eventType,
            topic: this.topic
        })).then(() => undefined);
    }
    // @ts-ignore: return types incompatible with EventEmitter (this)
    public once(eventType: string, listener: (...args: any[]) => void): Promise<void> {
        super.once(eventType, listener);
        return this.registerEventListener(Object.assign({}, this.identity, {
            type: eventType,
            topic: this.topic
        })).then(() => undefined);
    }
    // @ts-ignore: return types incompatible with EventEmitter (this)
    public prependListener(eventType: string, listener: (...args: any[]) => void): Promise<void> {
        super.prependListener(eventType, listener);
        return this.registerEventListener(Object.assign({}, this.identity, {
            type: eventType,
            topic: this.topic
        })).then(() => undefined);
    }
    // @ts-ignore: return types incompatible with EventEmitter (this)
    public prependOnceListener(eventType: string, listener: (...args: any[]) => void): Promise<void> {
        super.prependOnceListener(eventType, listener);
        return this.registerEventListener(Object.assign({}, this.identity, {
            type: eventType,
            topic: this.topic
        })).then(() => undefined);
    }
    // @ts-ignore: return types incompatible with EventEmitter (this)
    public removeListener(eventType: string, listener: (...args: any[]) => void): Promise<void> {
        super.removeListener(eventType, listener);
        return this.deregisterEventListener(Object.assign({}, this.identity, {
            type: eventType,
            topic: this.topic
        })).then(() => undefined);
    }
    // @ts-ignore: return types incompatible with EventEmitter (this)
    public removeAllListeners(eventType: string): Promise<void> {
        let count = super.listenerCount(eventType);
        super.removeAllListeners(eventType);
        while (count > 1) {
            this.deregisterEventListener(Object.assign({}, this.identity, {
                type: eventType,
                topic: this.topic
            }));
            count = count - 1;
        }
        return this.deregisterEventListener(Object.assign({}, this.identity, {
            type: eventType,
            topic: this.topic
        })).then(() => undefined);
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
