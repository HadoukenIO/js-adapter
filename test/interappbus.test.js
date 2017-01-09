const { describe, it } = require("mocha"),
    sinon = require("sinon"),
    should = require("should"),
    connect = require("./connect"),
    delayPromise = require("./delay-promise"),
    { Identity } = require("../."),
    id = "adapter-test-window",
    topic = "topic",
    topic2 = "topic2",
    m = Math.random().toString(36).slice(2);
const { connect: rawConnect } = require("../.");
require("should-sinon");

describe("InterApplicationBus.", () => {
    let fin;

    beforeEach(() => {
        return connect().then(a => fin = a);
    });

    it("subscribe()", (done) => {
        const spy = sinon.spy();
        fin.InterApplicationBus.subscribe(new Identity("*"), topic, (...got) => {
            done();
        }).then(() => fin.InterApplicationBus.publish(topic, m));
    });

    it("subscriber added", (done) => {
        
        rawConnect(`ws://localhost:9696`, 'SUBSCRIBER_ADDED').then((otherFin) => {
            const iab = otherFin.InterApplicationBus;
            const appid = new Identity('SUBSCRIBER_ADDED');
            const topic = 'SUBSCRIBER_ADDED';
            const listener = function() { };

            iab.on(iab.events.subscriberAdded, () => {
                iab.removeAllListeners(iab.events.subscriberAdded);
                done();
            });

            fin.InterApplicationBus.subscribe(appid, topic, listener);
        });
    });

    it("subscriber removed", (done) => {
        
        rawConnect(`ws://localhost:9696`, 'SUBSCRIBER_REMOVED').then((otherFin) => {
            const iab = otherFin.InterApplicationBus;
            const appid = new Identity('SUBSCRIBER_REMOVED');
            const topic = 'SUBSCRIBER_REMOVED';
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
        const spy = sinon.spy()
        return fin.InterApplicationBus.subscribe(new Identity(id), topic2, spy)
            .then(() => fin.InterApplicationBus.unsubscribe(new Identity(id), topic2, spy))
            .then(() => fin.InterApplicationBus.send(new Identity(id), topic2, m))
            .then(() => delayPromise())
            .then(() => spy.should.not.be.called());
    });
});