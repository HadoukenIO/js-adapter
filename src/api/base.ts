import Transport from '../transport/transport';
import { Identity } from '../identity';
import { promiseMap } from '../util/promises';
import { EventEmitter } from 'events';
import { EmitterAccessor } from './events/emitterMap';
import { BaseEventMap } from './events/base';

interface SubOptions {
    timestamp?: number;
}

export class Base {
    public wire: Transport;

    constructor(wire: Transport) {
        this.wire = wire;
    }

    private _topic: string;
    protected get topic(): string {
        return this._topic || this.constructor.name.replace('_', '').toLowerCase();
    }

    protected set topic(t: string) {
        this._topic = t;
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

export class EmitterBase<EventTypes extends BaseEventMap> extends Base {
    protected identity: Identity;

    constructor(wire: Transport, private emitterAccessor: EmitterAccessor) {
        super(wire);
        this.listeners = (event: string | symbol) => this.hasEmitter()
            ? this.getEmitter().listeners(event)
            : [];
    }

    public eventNames = () => this.hasEmitter() ? this.getEmitter().eventNames() : [];

    public emit = <E extends Extract<keyof EventTypes, string> | string | symbol>
    (eventName: E, payload: E extends Extract<keyof EventTypes, string>
        ? EventTypes[E]
        : any, ...args: any[]) => {
        return this.hasEmitter()
            ? this.getEmitter().emit(eventName, payload, ...args)
            : false;
    }
    private hasEmitter = () => this.wire.eventAggregator.has(this.emitterAccessor);
    private getEmitter = () => this.wire.eventAggregator.get(this.emitterAccessor);

    public listeners = (type: string | symbol) => this.hasEmitter() ? this.getEmitter().listeners(type) : [];
    public listenerCount = (type: string | symbol) => this.hasEmitter() ? this.getEmitter().listenerCount(type) : 0;

    protected registerEventListener = async (
        eventType: Extract<keyof EventTypes, string> | string | symbol,
        options: SubOptions = {}
    ): Promise<EventEmitter> => {
        const runtimeEvent = Object.assign({}, this.identity, {
            timestamp: options.timestamp || Date.now(),
            topic: this.topic,
            type: eventType
        });
        const emitter = this.getEmitter();
        const refCount = emitter.listenerCount(runtimeEvent.type);
        if (!refCount) {
            await this.wire.sendAction('subscribe-to-desktop-event', runtimeEvent);
        }
        return emitter;
    }

    protected deregisterEventListener = async (
        eventType: Extract<keyof EventTypes, string> | string | symbol,
        options: SubOptions = {}
    ): Promise<void | EventEmitter> => {
        if (this.hasEmitter()) {
            const runtimeEvent = Object.assign({}, this.identity, {
                timestamp: options.timestamp || Date.now(),
                topic: this.topic,
                type: eventType
            });
            const emitter = this.getEmitter();
            const refCount = emitter.listenerCount(runtimeEvent.type);
            const newRefCount = refCount - 1;
            if (newRefCount === 0) {
                await this.wire.sendAction('unsubscribe-to-desktop-event', runtimeEvent);
                if (emitter.eventNames && emitter.eventNames().length === 0) {
                    this.wire.eventAggregator.delete(this.emitterAccessor);
                    return;
                }
            }
            return emitter;
        }
        // This will only be reached if unsubscribe from event that does not exist but do not want to error here
        return Promise.resolve();
    }

    public async on<E extends Extract<keyof EventTypes, string> | string | symbol> (
        eventType: E,
        listener: (
            payload: E extends keyof EventTypes ? EventTypes[E] : any,
            ...args: any[]
        ) => void,
        options?: SubOptions
    ): Promise<this> {
        const emitter = await this.registerEventListener(eventType, options);
        emitter.on(eventType, listener);
        return this;
    }

    public addListener = this.on;

    public async once<E extends Extract<keyof EventTypes, string> | string | symbol>(
        eventType: E,
        listener: (
            payload: E extends keyof EventTypes ? EventTypes[E] : any,
            ...args: any[]
        ) => void,
        options?: SubOptions
    ): Promise<this> {
        const deregister = () => this.deregisterEventListener(eventType);
        const emitter = await this.registerEventListener(eventType, options);
        emitter.once(eventType, deregister);
        emitter.once(eventType, listener);
        return this;
    }

    public async prependListener<E extends Extract<keyof EventTypes, string> | string | symbol>(
        eventType: E,
        listener: (
            payload: E extends keyof EventTypes ? EventTypes[E] : any,
            ...args: any[]
        ) => void,
        options?: SubOptions
    ): Promise<this> {
        const emitter = await this.registerEventListener(eventType, options);
        emitter.prependListener(eventType, listener);
        return this;
    }

    public async prependOnceListener<E extends Extract<keyof EventTypes, string> | string | symbol>(
        eventType: E,
        listener: (
            payload: E extends keyof EventTypes ? EventTypes[E] : any,
            ...args: any[]
        ) => void,
        options?: SubOptions
    ): Promise<this> {
        const deregister = () => this.deregisterEventListener(eventType);
        const emitter = await this.registerEventListener(eventType, options);
        emitter.prependOnceListener(eventType, listener);
        emitter.once(eventType, deregister);
        return this;
    }

    public async removeListener<E extends Extract<keyof EventTypes, string> | string | symbol>(
        eventType: E,
        listener: (
            payload: E extends keyof EventTypes ? EventTypes[E] : any,
            ...args: any[]
        ) => void,
        options?: SubOptions
    ): Promise<this> {
        const emitter = await this.deregisterEventListener(eventType, options);
        if (emitter) {
            emitter.removeListener(eventType, listener);
        }
        return this;
    }

    protected deregisterAllListeners = async (eventType: Extract<keyof EventTypes, string> | string | symbol):
        Promise<EventEmitter | void> => {
        const runtimeEvent = Object.assign({}, this.identity, {
            type: eventType,
            topic: this.topic
        });

        if (this.hasEmitter()) {
            await this.wire.sendAction('unsubscribe-to-desktop-event', runtimeEvent);
            const emitter = this.getEmitter();
            emitter.removeAllListeners(eventType);
            if (emitter.eventNames().length === 0) {
                this.wire.eventAggregator.delete(this.emitterAccessor);
                return;
            }
            return emitter;
        }
    }

    public async removeAllListeners(eventType?: Extract<keyof EventTypes, string> | string | symbol): Promise<this> {
        const removeByEvent = async (event: Extract<keyof EventTypes, string> | string | symbol): Promise<void> => {
            const emitter = await this.deregisterAllListeners(event);
            if (emitter) {
                emitter.removeAllListeners(event);
            }
        };

        if (eventType) {
            await removeByEvent(eventType);
        } else if (this.hasEmitter()) {
            const events = this.getEmitter().eventNames();
            await promiseMap(events, removeByEvent);
        }
        return this;
    }
}

export class Reply<TOPIC extends string, TYPE extends string | void> implements Identity {
    public topic: TOPIC;
    public type: TYPE;
    public uuid: string;
    public name?: string;
}
