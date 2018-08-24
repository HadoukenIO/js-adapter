import Transport from '../transport/transport';
import { Identity } from '../identity';
import { promiseMap } from '../util/promises';
import { EventEmitter } from 'events';
import { EmitterAccessor } from './events/emitterMap';

export interface RuntimeEvent extends Identity {
    topic: string;
    type: string | symbol;
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

    protected runtimeEventComparator = (listener: RuntimeEvent): boolean => {
        return listener.topic === this.topic;
    }

}

export class EmitterBase extends Base {
    protected identity: Identity;

    constructor(wire: Transport, private emitterAccessor: EmitterAccessor) {
        super(wire);
        this.listeners = (event: string | symbol) => this.hasEmitter()
            ? this.getEmitter().listeners(event)
            : [];
    }

    public eventNames = () => this.hasEmitter() ? this.getEmitter().eventNames() : [];

    public emit = (eventName: string | symbol, ...args: any[]) => {
        return this.hasEmitter()
            ? this.getEmitter().emit(eventName, ...args)
            : false;
    }
    private hasEmitter = () => this.wire.eventAggregator.has(this.emitterAccessor);
    private getEmitter = () => this.wire.eventAggregator.get(this.emitterAccessor);

    public listeners = (type: string | symbol) => this.hasEmitter() ? this.getEmitter().listeners(type) : [];
    public listenerCount = (type: string | symbol) => this.hasEmitter() ? this.getEmitter().listenerCount(type) : 0;

    protected registerEventListener = async (eventType: string): Promise<EventEmitter> => {
        const runtimeEvent = Object.assign({}, this.identity, {
            type: eventType,
            topic: this.topic
        });
        const emitter = this.getEmitter();
        const refCount = emitter.listenerCount(runtimeEvent.type);
        if (!refCount) {
            await this.wire.sendAction('subscribe-to-desktop-event', runtimeEvent);
        }
        return emitter;
    }

    protected deregisterEventListener = async (eventType: string): Promise<void | EventEmitter> => {
        if (this.hasEmitter()) {
            const runtimeEvent = Object.assign({}, this.identity, {
                type: eventType,
                topic: this.topic
            });
            const emitter = this.getEmitter();
            const refCount = emitter.listenerCount(runtimeEvent.type);
            const newRefCount = refCount - 1;
            if (newRefCount === 0) {
                await this.wire.sendAction('unsubscribe-to-desktop-event', runtimeEvent);
                // TO DO: FIX - This was erroring out saying eventNames is not a function.
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

    public async on(eventType: string, listener: (...args: any[]) => void): Promise<this> {
        const emitter = await this.registerEventListener(eventType);
        emitter.on(eventType, listener);
        return this;
    }

    public addListener = this.on;
    public async once(eventType: string, listener: (...args: any[]) => void): Promise<this> {
        const deregister = () => this.deregisterEventListener(eventType);
        const emitter = await this.registerEventListener(eventType);
        emitter.once(eventType, deregister);
        emitter.once(eventType, listener);
        return this;
    }

    public async prependListener(eventType: string, listener: (...args: any[]) => void): Promise<this> {
        const emitter = await this.registerEventListener(eventType);
        emitter.prependListener(eventType, listener);
        return this;
    }

    public async prependOnceListener(eventType: string, listener: (...args: any[]) => void): Promise<this> {
        const deregister = () => this.deregisterEventListener(eventType);
        const emitter = await this.registerEventListener(eventType);
        emitter.prependOnceListener(eventType, listener);
        emitter.once(eventType, deregister);
        return this;
    }

    public async removeListener(eventType: string, listener: (...args: any[]) => void): Promise<this> {
        const emitter = await this.deregisterEventListener(eventType);
        if (emitter) {
            emitter.removeListener(eventType, listener);
        }
        return this;
    }

    protected deregisterAllListeners = async (eventType: string | symbol): Promise<EventEmitter | void> => {
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

    public async removeAllListeners(eventType?: string): Promise<this> {

        const removeByEvent = async (event: string | symbol): Promise<void> => {
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
