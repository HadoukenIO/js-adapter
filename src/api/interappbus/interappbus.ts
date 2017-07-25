import { Bare } from '../base';
import { Identity } from '../../identity';
import Transport, { Message } from '../../transport/transport';
import RefCounter from '../../util/ref-counter';

/**
  @namespace
*/
export default class InterApplicationBus extends Bare {
    public events = {
        subscriberAdded: 'subscriber-added',
        subscriberRemoved: 'subscriber-removed'
    };

    private refCounter = new RefCounter();

    /**
      @param { object } wire
      @constructor
    */
    constructor(wire: Transport) {
        super(wire);
        wire.registerMessageHandler(this.onmessage.bind(this));
    }

    /**
      @param { string } topic
      @param { any } message
      @static
    */
    public publish(topic: string, message: any): Promise<void> {
        return this.wire.sendAction('publish-message', {
            topic,
            message,
            sourceWindowName: this.me.name
        }).then(() => undefined);
    }

    /**
      @param { object } destination
      @param { string } topic
      @param { any } message
      @static
    */
    public send(destination: Identity, topic: string, message: any): Promise<void> {
        return this.wire.sendAction('send-message', {
            destinationUuid: destination.uuid,
            destinationWindowName: destination.name,
            topic,
            message,
            sourceWindowName: this.me.name
        }).then(() => undefined);
    }

    public subscribe(source: Identity, topic: string, listener: Function): Promise<void> {
        const subKey = this.createSubscriptionKey(source.uuid, source.name || '*', topic);
        const sendSubscription = () => {
            return this.wire.sendAction('subscribe', {
                sourceUuid: source.uuid,
                sourceWindowName: source.name || '*',
                topic,
                destinationWindowName: this.me.name
            });
        };
        const alreadySubscribed = () => {
            // tslint:disable-next-line
            return new Promise(r => r).then(() => undefined);
        };

        this.on(subKey, listener);

        return this.refCounter.actOnFirst(subKey, sendSubscription, alreadySubscribed);
    }

    public unsubscribe(source: Identity, topic: string, listener: Function): Promise<void> {
        const subKey = this.createSubscriptionKey(source.uuid, source.name || '*', topic);
        const sendUnsubscription = () => {
            return this.wire.sendAction('unsubscribe', {
                sourceUuid: source.uuid,
                sourceWindowName: source.name || '*',
                topic,
                destinationWindowName: this.me.name
            });
        };
        const dontSendUnsubscription = () => {
            // tslint:disable-next-line
            return new Promise(r => r).then(() => undefined);
        };

        this.removeListener(subKey, listener);
        return this.refCounter.actOnLast(subKey, sendUnsubscription, dontSendUnsubscription);
    }

    private processMessage(message: Message<InterAppPayload>) {
        const {payload: {message: payloadMessage, sourceWindowName, sourceUuid, topic}} = message;
        const keys = [
            this.createSubscriptionKey(sourceUuid, sourceWindowName, topic),
            this.createSubscriptionKey(sourceUuid, '*', topic),
            this.createSubscriptionKey('*', '*', topic)
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
        const n = name || '*';
        if (!(uuid && n && topic)) {
            throw new Error('Missing uuid, name, or topic string');
        }

        return createKey(uuid, n, topic);
    }

    protected onmessage(message: Message<InterAppPayload>): boolean {
        const {action} = message;

        switch (action) {
            case 'process-message': this.processMessage(message);
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
    public sourceUuid: string;
    public sourceWindowName: string;
    public topic: string;
    public destinationUuid?: string;
    public message?: any;

}

function createKey(...toHash: string[]) {
    return toHash.map((item) => {
        return (new Buffer('' + item)).toString('base64');
    }).join('/');
}
