import { Base } from '../base';
import { Identity } from '../../identity';
import Transport, { Message } from '../../transport/transport';
import RefCounter from '../../util/ref-counter';
import { EventEmitter } from 'events';
import { Channel } from './channel/index';
import { validateIdentity } from '../../util/validate';

/**
 * A messaging bus that allows for pub/sub messaging between different applications.
 * @namespace
*/
export default class InterApplicationBus extends Base {
    public Channel: Channel;

    public events = {
        subscriberAdded: 'subscriber-added',
        subscriberRemoved: 'subscriber-removed'
    };

    private refCounter = new RefCounter();
    protected emitter: EventEmitter;
    public on: any;
    public removeAllListeners: any;
    constructor(wire: Transport) {
        super(wire);
        //tslint:disable-next-line
        this.Channel = new Channel(wire);
        this.emitter = new EventEmitter();
        wire.registerMessageHandler(this.onmessage.bind(this));

        this.on = this.emitter.on.bind(this.emitter);
        this.removeAllListeners = this.emitter.removeAllListeners.bind(this.emitter);
    }

    /**
     * Publishes a message to all applications running on OpenFin Runtime that
     * are subscribed to the specified topic.
     * @param { string } topic The topic on which the message is sent
     * @param { any } message The message to be published. Can be either a primitive
     * data type (string, number, or boolean) or composite data type (object, array)
     * that is composed of other primitive or composite data types
     * @return {Promise.<void>}
     * @tutorial InterApplicationBus.publish
    */
    public publish(topic: string, message: any): Promise<void> {
        return this.wire.sendAction('publish-message', {
            topic,
            message,
            sourceWindowName: this.me.name
        }).then(() => undefined);
    }

    /**
     * Sends a message to a specific application on a specific topic.
     * @param { Identity } destination The identity of the application to which the message is sent
     * @param { string } topic The topic on which the message is sent
     * @param { any } message The message to be sent. Can be either a primitive data
     * type (string, number, or boolean) or composite data type (object, array) that
     * is composed of other primitive or composite data types
     * @return {Promise.<void>}
     * @tutorial InterApplicationBus.send
    */
    public async send(destination: Identity, topic: string, message: any): Promise<void> {
        const errorMsg = validateIdentity(destination);
        if (errorMsg) {
            throw new Error(errorMsg);
        }
        await this.wire.sendAction('send-message', {
            destinationUuid: destination.uuid,
            destinationWindowName: destination.name,
            topic,
            message,
            sourceWindowName: this.me.name
        });
    }

    /**
     * Subscribes to messages from the specified application on the specified topic.
     * If the subscription is for a uuid, [name], topic combination that has already
     * been published to upon subscription you will receive the last 20 missed messages
     * in the order they were published.
     * @param { Identity } source This object is described in the Identity in the typedef
     * @param { string } topic The topic on which the message is sent
     * @param { function } listener A function that is called when a message has
     * been received. It is passed the message, uuid and name of the sending application.
     * The message can be either a primitive data type (string, number, or boolean) or
     * composite data type (object, array) that is composed of other primitive or composite
     * data types
     * @return {Promise.<void>}
     * @tutorial InterApplicationBus.subscribe
     */
    public subscribe(source: Identity, topic: string, listener: any): Promise<void> {
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

        this.emitter.on(subKey, listener);

        return this.refCounter.actOnFirst(subKey, sendSubscription, alreadySubscribed);
    }

    /**
     * Unsubscribes to messages from the specified application on the specified topic.
     * @param { Identity } source This object is described in the Identity in the typedef
     * @param { string } topic The topic on which the message is sent
     * @param { function } listener A callback previously registered with subscribe()
     * @return {Promise.<void>}
     * @tutorial InterApplicationBus.unsubscribe
     */
    public unsubscribe(source: Identity, topic: string, listener: any): Promise<void> {
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

        this.emitter.removeListener(subKey, listener);
        return this.refCounter.actOnLast(subKey, sendUnsubscription, dontSendUnsubscription);
    }

    private processMessage(message: Message<InterAppPayload>) {
        const { payload: { message: payloadMessage, sourceWindowName, sourceUuid, topic } } = message;
        const keys = [
            this.createSubscriptionKey(sourceUuid, sourceWindowName, topic),
            this.createSubscriptionKey(sourceUuid, '*', topic),
            this.createSubscriptionKey('*', '*', topic)
        ];
        const idOfSender = { uuid: sourceUuid, name: sourceWindowName };

        keys.forEach((key) => {
            this.emitter.emit(key, payloadMessage, idOfSender);
        });
    }

    private emitSubscriverEvent(type: string, message: any) {
        const { payload: { name, uuid, topic } } = message;
        const payload = { name, uuid, topic };

        this.emitter.emit(type, payload);
    }

    protected createSubscriptionKey(uuid: string, name: string, topic: string): string {
        const n = name || '*';
        if (!(uuid && n && topic)) {
            throw new Error('Missing uuid, name, or topic string');
        }

        return createKey(uuid, n, topic);
    }

    protected onmessage(message: Message<InterAppPayload>): boolean {
        const { action } = message;

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
