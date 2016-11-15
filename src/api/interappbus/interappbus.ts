import { Bare } from "../base";
import { AppIdentity } from "../../identity";
import Transport, { Message } from "../../transport/transport";
import ListenerStore from "../../util/listener-store";
import { createHash } from "crypto";

export default class InterApplicationBus extends Bare {
    protected subscribers = new ListenerStore<string>();
    constructor(wire: Transport) {
        super(wire);
        wire.registerMessageHandler(this.onmessage.bind(this));
    }
    protected onmessage(message: Message<InterAppPayload>): boolean {
        if (message.action === "process-message") {
            for (const f of this.subscribers.getAll(
                    createKey(message.payload),
                    createKey(Object.assign({}, message.payload, { sourceWindowName: "*" })),
                    createKey(Object.assign({}, message.payload, { sourceWindowName: "*", sourceUuid: "*" }))
                ))
                f.call(null, message.payload.message, message.payload.sourceUuid, message.payload.sourceWindowName);
            return true;
        } else
            return false;
    }

    publish(topic: string, message): Promise<void> {
        return this.wire.sendAction("publish-message", {
            topic,
            message,
            sourceWindowName: this.me.name
        });
    }
    send(destination: AppIdentity, topic: string, message): Promise<void> {
        return this.sendCached(destination, topic, message, null);
    }
    sendCached(destination: AppIdentity, topic: string, message, cache: string | null = "until-delivered"): Promise<void> {
        return this.wire.sendAction("send-message", {
            destinationUuid: destination.uuid,
            destinationWindowName: destination.name,
            topic,
            message,
            cache, // Does the runtime interpret `cache: null` as I think?
            sourceWindowName: this.me.name
        });
    }
    subscribe(source: AppIdentity, topic: string, listener: Function): Promise<void> {
        const id = {
                sourceUuid: source.uuid,
                sourceWindowName: source.name || "*",
                topic
            };
        this.subscribers.add(createKey(id), listener);
        return this.wire.sendAction("subscribe", Object.assign({}, id, { destinationWindowName: this.me.name }));
    }
    unsubscribe(source: AppIdentity, topic: string, listener: Function): Promise<void> {
        const id = {
                sourceUuid: source.uuid,
                sourceWindowName: source.name || "*",
                topic
            },
            idx = Object.assign({}, id, { destinationWindowName: this.me.name });
        return this.subscribers.delete(createKey(id), listener)
            .then(wasLast => wasLast? this.wire.sendAction("unsubscribe", idx) : Promise.resolve(wasLast));
    }
}

export class InterAppPayload {
    sourceUuid: string;
    sourceWindowName: string;
    topic: string;
    destinationUuid?: string;
    message?: any;

}
function createKey(data: InterAppPayload): string {
    return createHash("md4")
        .update(data.sourceUuid)
        .update(data.sourceWindowName)
        .update(data.topic)
        .digest("base64");
}
