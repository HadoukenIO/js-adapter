import { Wire, WireConstructor } from "./wire";
import writeToken from "./write-token";
import { AppIdentity } from "../identity";
import { EventEmitter } from "events";

import {
    UnexpectedAction,
    NoSuccess,
    DuplicateCorrelation,
    NoAck,
    NoCorrelation,
    RuntimeError
} from "./transport-errors";

class Transport extends EventEmitter {
    protected messageCounter = 0;
    protected wireListeners: {resolve: Function, reject: Function}[] = [];
    protected uncorrelatedListener: Function;
    protected messageHandlers: MessageHandler[] = [];
    me: AppIdentity;
    protected wire: Wire;
    
    constructor(wireType: WireConstructor) {
        super();
        this.wire = new wireType(this.onmessage.bind(this));
        this.registerMessageHandler(this.handleMessage.bind(this));
        this.wire.on("disconnected", () => {
            this.emit("disconnected");
        });
    }

    connect(address: string, me: AppIdentity): Promise<Token> {
        const { uuid } = this.me = me;
        let token;
        return this.wire.connect(address)
            .then(() => this.sendAction("request-external-authorization", {
                uuid,
                type: "file-token", // Other type for browser? Ask @xavier
                //authorizationToken: null
            }, true))
            .then(({ action, payload }) => {
                if (action !== "external-authorization-response") {
                    return Promise.reject(new UnexpectedAction(action));
                } else {
                    token = payload.token;
                    return writeToken(payload.file, payload.token);
                }
            })
            .then(() => this.sendAction("request-authorization", { uuid, type: "file-token" }, true))
            .then(({ action, payload }) => {
                if (action !== "authorization-response") {
                    return Promise.reject(new UnexpectedAction(action));
                } else if (payload.success !== true) {
                    return Promise.reject(new NoSuccess);
                } else {
                    return token;
                }
            });
    }
    
    sendAction(action: string, payload = {}, uncorrelated = false): Promise<Message<any>> {
        return new Promise((resolve, reject) => {
            const id = this.messageCounter++;
            const msg = {
                action,
                payload,
                messageId: id
            };
            
            this.wire.send(msg);
            this.addWireListener(id, resolve, reject, uncorrelated);
        });
    }
    
    registerMessageHandler(handler: MessageHandler): void {
        this.messageHandlers.unshift(handler);
    }

    protected addWireListener(id: number, resolve: Function, reject: Function, uncorrelated: boolean): void {
        if (uncorrelated) {
            this.uncorrelatedListener = resolve;
        } else if (id in this.wireListeners) {
            reject(new DuplicateCorrelation(String(id)));
        } else {
            this.wireListeners[id] = { resolve, reject };
        }
        // Timeout and reject()?
    }
    
    /** This method executes message handlers until the _one_ that handles the message (returns truthy) has run */
    protected onmessage(data: Message<Payload>): void {
        for (const h of this.messageHandlers) {
            h.call(null, data);
        }
    }
    
    protected handleMessage(data: Message<Payload>): boolean {
        const id: number = data.correlationId || NaN;
        if (!("correlationId" in data)) {
            this.uncorrelatedListener.call(null, data);
            this.uncorrelatedListener = () => {};
        } else if (!(id in this.wireListeners)) {
            throw new NoCorrelation(String(id));
            // Return false?
        } else {
            const { resolve, reject } = this.wireListeners[id];
            if (data.action !== "ack") {
                reject(new NoAck(data.action));
            } else if (!("payload" in data) || !data.payload.success) {
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
    sendAction(action: "request-external-authorization", payload: {}, uncorrelated: true): Promise<Message<AuthorizationPayload>>;
    sendAction(action: string, payload: {}, uncorrelated: boolean): Promise<Message<Payload>>;
}

export class Message<T> {
    action: string;
    payload: T;
    correlationId?: number;
}
export class Payload {
    success: boolean;
    data: any;
}
export class AuthorizationPayload {
    token: string;
    file: string;
}
