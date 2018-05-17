import Transport, { Message } from '../transport/transport';
import { Identity } from '../identity';
import { EventEmitter } from 'events';
import { promiseMap } from '../util/promises';

export interface RuntimeEvent extends Identity {
    topic: string;
    type: string|symbol;
}

export class Base {
    public wire: Transport;

    constructor(wire: Transport) {
        this.wire = wire;
    }

    protected get topic()
    : string {
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

    protected runtimeEventComparator = (listener: RuntimeEvent): boolean => {
        return listener.topic === this.topic;
    }

}

export class EmitterBase extends Base {

    protected identity: Identity;
    protected emitter: EventEmitter;
    public listeners: (event: string | symbol) => Function[];
    public listenerCount: (type: string | symbol) => number;

    constructor(wire: Transport) {
        super(wire);
        this.emitter = new EventEmitter();
        this.wire.registerMessageHandler(this.onmessage.bind(this));
        this.listeners = this.emitter.listeners ? this.emitter.listeners.bind(this.emitter) : void 0;
        this.listenerCount = this.emitter.listenerCount ? this.emitter.listenerCount.bind(this.emitter) : void 0;
    }

    public emit = (eventName: string| symbol, ...args: any[]) => {
        this.emitter.emit(eventName, ...args);
    }

    protected onmessage = (message: Message<any>): boolean => {

        if (message.action === 'process-desktop-event') {
            const payload = message.payload;

            if (this.runtimeEventComparator(<RuntimeEvent>payload)) {
                this.emitter.emit(payload.type, message.payload);
            }
            return true;
        } else {
            return false;
        }
    }

    protected registerEventListener = (listener: RuntimeEvent): Promise<void | Message<void>> => {
        const key = createKey(listener);
        const refCount = this.wire.topicRefMap.get(key);

        if (!refCount) {
            this.wire.topicRefMap.set(key, 1);
            return this.wire.sendAction('subscribe-to-desktop-event', listener);
        } else {
            this.wire.topicRefMap.set(key, refCount + 1);
            return Promise.resolve();
        }
    }

    protected deregisterEventListener = (listener: RuntimeEvent): Promise<void | Message<void>> => {
        const key = createKey(listener);
        const refCount = this.wire.topicRefMap.get(key);

        if (refCount) {

            const newRefCount = refCount - 1;
            this.wire.topicRefMap.set(key, newRefCount);

            if (newRefCount === 0) {
                return this.wire.sendAction('unsubscribe-to-desktop-event', listener);
            }
            return Promise.resolve();
        }
    }

    public on(eventType: string, listener: (...args: any[]) => void): Promise<void> {
        this.emitter.on(eventType, listener);
        return this.registerEventListener(Object.assign({}, this.identity, {
            type: eventType,
            topic: this.topic
        })).then(() => undefined);
    }

    public addListener = this.on;
    public once(eventType: string, listener: (...args: any[]) => void): Promise<void> {
        this.emitter.once(eventType, listener);
        const deregister =  () => {
            this.deregisterEventListener(Object.assign({}, this.identity, {
                type: eventType,
                topic: this.topic
            }));
        };
        this.emitter.once(eventType, deregister);
        return this.registerEventListener(Object.assign({}, this.identity, {
            type: eventType,
            topic: this.topic
        })).then(() => undefined);
    }

    public prependListener(eventType: string, listener: (...args: any[]) => void): Promise<void> {
        this.emitter.prependListener(eventType, listener);
        return this.registerEventListener(Object.assign({}, this.identity, {
            type: eventType,
            topic: this.topic
        })).then(() => undefined);
    }

    public prependOnceListener(eventType: string, listener: (...args: any[]) => void): Promise<void> {
        this.emitter.prependOnceListener(eventType, listener);
        const deregister =  () => {
            this.deregisterEventListener(Object.assign({}, this.identity, {
                type: eventType,
                topic: this.topic
            }));
        };
        this.emitter.once(eventType, deregister);
        return this.registerEventListener(Object.assign({}, this.identity, {
            type: eventType,
            topic: this.topic
        })).then(() => undefined);
    }

    public removeListener(eventType: string, listener: (...args: any[]) => void): Promise<void> {
        this.emitter.removeListener(eventType, listener);
        return this.deregisterEventListener(Object.assign({}, this.identity, {
            type: eventType,
            topic: this.topic
        })).then(() => undefined);
    }

    protected deregisterAllListeners = (eventType: string|symbol): Promise<void | Message<void>> => {
        const runtimeEvent = Object.assign({}, this.identity, {
            type: eventType,
            topic: this.topic
        });
        const key = createKey(runtimeEvent);
        const refCount = this.wire.topicRefMap.get(key);

        if (refCount) {
            this.wire.topicRefMap.delete(key);
            return this.wire.sendAction('unsubscribe-to-desktop-event', runtimeEvent);
        } else {
            return Promise.resolve();
        }
    }

    public async removeAllListeners(eventType?: string): Promise<void> {

        const removeByEvent = (event: string|symbol): Promise<void> => {
            this.emitter.removeAllListeners(event);
            return this.deregisterAllListeners(event).then(() => undefined);
        };

        if (eventType) {
            return removeByEvent(eventType);
        } else {
            const events = this.emitter.eventNames();
            await promiseMap(events, removeByEvent);
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
