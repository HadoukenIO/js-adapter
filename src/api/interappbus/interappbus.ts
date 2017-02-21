import { Bare } from "../base";
import { Identity } from "../../identity";
import Transport, { Message } from "../../transport/transport";
import RefCounter from "../../util/ref-counter";

export default class InterApplicationBus extends Bare {
    events = {
        subscriberAdded: "subscriber-added",
        subscriberRemoved: "subscriber-removed"
    };

    refCounter = new RefCounter();

    constructor(wire: Transport) {
        super(wire);
        wire.registerMessageHandler(this.onmessage.bind(this));
    }

    publish(topic: string, message): Promise<void> {
        return this.wire.sendAction("publish-message", {
            topic,
            message,
            sourceWindowName: this.me.name
        });
    }

    send(destination: Identity, topic: string, message): Promise<void> {
        return this.wire.sendAction("send-message", {
            destinationUuid: destination.uuid,
            destinationWindowName: destination.name,
            topic,
            message,
            sourceWindowName: this.me.name
        });
    }

    subscribe(source: Identity, topic: string, listener: Function): Promise<void> {
        const subKey = this.createSubscriptionKey(source.uuid, source.name || "*", topic);
        const sendSubscription = () => {
            return this.wire.sendAction("subscribe", {
                sourceUuid: source.uuid,
                sourceWindowName: source.name || "*",
                topic,
                destinationWindowName: this.me.name
            });
        };
        const alreadySubscribed = () => {
            return new Promise(r => r);
        };

        this.on(subKey, listener);

        return this.refCounter.actOnFirst(subKey, sendSubscription, alreadySubscribed);
    }

    unsubscribe(source: Identity, topic: string, listener: Function): Promise<void> {
        const subKey = this.createSubscriptionKey(source.uuid, source.name || "*", topic);
        const sendUnsubscription = () => {
            return this.wire.sendAction("unsubscribe", {
                sourceUuid: source.uuid,
                sourceWindowName: source.name || "*",
                topic,
                destinationWindowName: this.me.name
            });
        };
        const dontSendUnsubscription = () => {
            return new Promise(r => r);
        };

        this.removeListener(subKey, listener);
        return this.refCounter.actOnLast(subKey, sendUnsubscription, dontSendUnsubscription);
    }

    private processMessage(message: Message<InterAppPayload>) {
        const {payload: {message: payloadMessage, sourceWindowName, sourceUuid, topic}} = message;
        const keys = [
            this.createSubscriptionKey(sourceUuid, sourceWindowName, topic),
            this.createSubscriptionKey(sourceUuid, "*", topic),
            this.createSubscriptionKey("*", "*", topic)
        ];
        const idOfSender = { uuid: sourceUuid, name: sourceWindowName };

        keys.forEach((key) => {
            this.emit(key, payloadMessage, idOfSender);
        });
    }

    private emitSubscriverEvent(type: string, message: any) {
        const {payload: {senderName, senderUuid, topic}} = message;
        const payload = {
            name: senderName,
            uuid: senderUuid,
            topic
        };

        this.emit(type, payload);
    }

    protected createSubscriptionKey(uuid: string, name: string, topic: string): string {
        if (!(uuid && name && topic)) {
            throw new Error("Missing uuid, name, or topic string");
        }

        return createKey(uuid, name, topic);
    }

    protected onmessage(message: Message<InterAppPayload>): boolean {
        const {action} = message;

        switch (action) {
            case "process-message": this.processMessage(message);
                break;
            case this.events.subscriberAdded: this.emitSubscriverEvent(this.events.subscriberAdded, message);
                break;
            case this.events.subscriberRemoved: this.emitSubscriverEvent(this.events.subscriberRemoved, message);
                break;
            default: break;
        }

        return true;
    }
}

export class InterAppPayload {
    sourceUuid: string;
    sourceWindowName: string;
    topic: string;
    destinationUuid?: string;
    message?: any;

}

function createKey(...toHash) {
    return toHash.map((item) => {
        return (new Buffer("" + item)).toString("base64");
    }).join("/");
}
