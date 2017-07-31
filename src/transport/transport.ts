import { Wire, WireConstructor } from './wire';
import writeToken from './write-token';
import { Identity } from '../identity';
import { EventEmitter } from 'events';
import { READY_STATE } from './websocket';

import {
    UnexpectedActionError,
    DuplicateCorrelationError,
    NoAckError,
    NoCorrelationError,
    RuntimeError
} from './transport-errors';

export interface MessageHandler {
    (data: Function): boolean;
}

class Transport extends EventEmitter {
    protected messageCounter = 0;
    protected wireListeners: { resolve: Function, reject: Function }[] = [];
    protected uncorrelatedListener: Function;
    protected messageHandlers: MessageHandler[] = [];
    public me: Identity;
    protected wire: Wire;

    constructor(wireType: WireConstructor) {
        super();
        this.wire = new wireType(this.onmessage.bind(this));
        this.registerMessageHandler(this.handleMessage.bind(this));
        this.wire.on('disconnected', () => {
            this.emit('disconnected');
        });
    }

    public connect(config: ConnectConfig): Promise<string> {
        const {address, uuid, name} = config;
        const reqAuthPaylaod = Object.assign({}, config, { type: 'file-token' });
        let token: string;

        this.me = { uuid, name };

        return this.wire.connect(address)
            .then(() => this.sendAction('request-external-authorization', {
                uuid,
                type: 'file-token' // Other type for browser? Ask @xavier
                //authorizationToken: null
            }, true))
            .then(({ action, payload }) => {
                if (action !== 'external-authorization-response') {
                    return Promise.reject(new UnexpectedActionError(action));
                } else {
                    token = payload.token;
                    return writeToken(payload.file, payload.token);
                }
            })
            .then(() => this.sendAction('request-authorization', reqAuthPaylaod, true))
            .then(({ action, payload }) => {
                if (action !== 'authorization-response') {
                    return Promise.reject(new UnexpectedActionError(action));
                } else if (payload.success !== true) {
                    return Promise.reject(new RuntimeError(payload));
                } else {
                    return Promise.resolve(token);
                }
            });
    }

    /* `READY_STATE` is an instance var set by `constructor` to reference the `WebTransportSocket.READY_STATE` enum.
     * This is syntactic sugar that makes the enum accessible through the `wire` property of the various `fin` singletons.
     * For example, `fin.system.wire.READY_STATE` is a shortcut to `fin.system.wire.wire.constructor.READY_STATE`.
     * However it is accessed, the enum is useful for interrogating the state of the web socket on send failure.
     * The `err.readyState` value is passed to the `reject` handler of the promise returned by either of
     * `sendAction` or `ferryAction`, and hence all the API methods in the various `fin` singletons that call them.
     * The enum can be used in two distinct ways by the `reject` handler (using `fin.System.getVersion` by way of example):
     * 1. State name by state value:
     * fin.system.getVersion().catch(err => { console.log('State:', fin.system.wire.READY_STATE[err.readyState]); });
     * 2. State value by state name:
     * fin.system.getVersion().catch(err => { console.log('Closed:', err.readyState === fin.system.wire.READY_STATE.CLOSED); });
     * Note that `reject` is called when and only when `readyState` is not `OPEN`.
     */
    public READY_STATE = READY_STATE;

    public sendAction(action: string, payload: any = {}, uncorrelated: boolean = false): Promise<Message<any>> {
        return new Promise((resolve, reject) => {
            // tslint:disable-next-line
            const id = this.messageCounter++;
            const msg = {
                action,
                payload,
                messageId: id
            };

            return this.wire.send(msg)
                .then(() => this.addWireListener(id, resolve, reject, uncorrelated))
                .catch(reject);
        });
    }

    public ferryAction(data: any): Promise<Message<any>> {
        return new Promise((resolve, reject) => {
            // tslint:disable-next-line
            const id = this.messageCounter++;
            data.messageId = id;

            const resolver = (data: any) => { resolve(data.payload); };

            return this.wire.send(data)
                .then(() => this.addWireListener(id, resolver, reject, false))
                .catch(reject);
        });
    }

    public registerMessageHandler(handler: MessageHandler): void {
        this.messageHandlers.unshift(handler);
    }

    protected addWireListener(id: number, resolve: Function, reject: Function, uncorrelated: boolean): void {
        if (uncorrelated) {
            this.uncorrelatedListener = resolve;
        } else if (id in this.wireListeners) {
            reject(new DuplicateCorrelationError(String(id)));
        } else {
            this.wireListeners[id] = { resolve, reject };
        }
        // Timeout and reject()?
    }

    // This method executes message handlers until the _one_ that handles the message (returns truthy) has run
    protected onmessage(data: Message<Payload>): void {

        for (const h of this.messageHandlers) {
            h.call(null, data);
        }
    }

    protected handleMessage(data: Message<Payload>): boolean {
        // tslint:disable-next-line
        const id: number = data.correlationId || NaN;
        
        if (!('correlationId' in data)) {
            this.uncorrelatedListener.call(null, data);
            // tslint:disable-next-line
            this.uncorrelatedListener = () => { };
        } else if (!(id in this.wireListeners)) {
            throw new NoCorrelationError(String(id));
            // Return false?
        } else {
            const { resolve, reject } = this.wireListeners[id];
            if (data.action !== 'ack') {
                reject(new NoAckError(data.action));
            } else if (!('payload' in data) || !data.payload.success) {
                reject(new RuntimeError(data.payload));
            } else {
                resolve.call(null, data);
            }

            delete this.wireListeners[id];
        }
        return true;
    }
}

export default Transport;

interface Transport {
    sendAction(action: 'request-external-authorization', payload: {}, uncorrelated: true): Promise<Message<AuthorizationPayload>>;
    sendAction(action: string, payload: {}, uncorrelated: boolean): Promise<Message<Payload>>;
}

export class Message<T> {
    public action: string;
    public payload: T;
    public correlationId?: number;
}
export class Payload {
    public success: boolean;
    public data: any;
}
export class AuthorizationPayload {
    public token: string;
    public file: string;
}

export interface ConnectConfig {
    address: string;
    uuid: string;
    name?: string;
    nonPersistent?: boolean;
    runtimeClient?: boolean;
    licenseKey?: string;
    client?: any;
}
