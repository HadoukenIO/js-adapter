import  * as sinon  from "sinon";
import { conn } from "./connect";
import { delayPromise } from "./delay-promise";
import { Identity } from "../src/identity";
import * as assert from "assert";
import { connect as rawConnect } from "../src/main";

const id = "adapter-test-window";
const topic = "topic";
const topic2 = "topic2";
const m = Math.random().toString(36).slice(2);

describe("InterApplicationBus.", () => {
    let fin;

    beforeEach(() => {
        return conn().then(a => fin = a);
    });

    it("subscribe()", (done) => {
        fin.InterApplicationBus.subscribe(new Identity("*"), topic, (...got) => {
            done();
        }).then(() => fin.InterApplicationBus.publish(topic, m));
    });

    it("subscriber added", (done) => {
        
        rawConnect({
            address: `ws://localhost:9696`,
            uuid: "SUBSCRIBER_ADDED"
        }).then((otherFin) => {
            const iab = otherFin.InterApplicationBus;
            const appid = new Identity("SUBSCRIBER_ADDED");
            const topic = "SUBSCRIBER_ADDED";
            const listener = function() { };

            iab.on(iab.events.subscriberAdded, () => {
                iab.removeAllListeners(iab.events.subscriberAdded);
                done();
            });

            fin.InterApplicationBus.subscribe(appid, topic, listener);
        });
    });

    it("subscriber removed", (done) => {
        
        rawConnect({
            address: `ws://localhost:9696`,
            uuid: "SUBSCRIBER_REMOVED"
        }).then((otherFin) => {
            const iab = otherFin.InterApplicationBus;
            const appid = new Identity("SUBSCRIBER_REMOVED");
            const topic = "SUBSCRIBER_REMOVED";
            const listener = function() { };

            iab.on(iab.events.subscriberRemoved, () => {
                iab.removeAllListeners(iab.events.subscriberRemoved);
                done();
            });

            fin.InterApplicationBus.subscribe(appid, topic, listener)
                .then(() => {
                    return fin.InterApplicationBus.unsubscribe(appid, topic, listener);
                });
        });
    });

    it.skip("unsubscribe()", () => {
        const spy = sinon.spy();
        return fin.InterApplicationBus.subscribe(new Identity(id), topic2, spy)
            .then(() => fin.InterApplicationBus.unsubscribe(new Identity(id), topic2, spy))
            .then(() => fin.InterApplicationBus.send(new Identity(id), topic2, m))
            .then(() => delayPromise())
            .then(() => assert(!spy.called));
    });
});
