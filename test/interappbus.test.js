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
require("should-sinon");

describe("InterApplicationBus.", () => {
    let fin;

    before(() => {
        return connect().then(a => fin = a);
    })

    it("send() with no subscription", () => {
        return fin.InterApplicationBus.send(new Identity(id), topic, m)
            .should.be.rejected();
    })
    it("subscribe()", () => {
        const spy = sinon.spy();
        return fin.InterApplicationBus.subscribe(new Identity("*"), topic, spy)
            .then(() => fin.InterApplicationBus.publish(topic, m))
            .then(() => fin.InterApplicationBus.publish(topic, null))
            .then(() => delayPromise())
            .then(() => spy.should.be.calledTwice());
    })
    it.skip("unsubscribe()", () => {
        const spy = sinon.spy()
        return fin.InterApplicationBus.subscribe(new Identity(id), topic2, spy)
            .then(() => fin.InterApplicationBus.unsubscribe(new Identity(id), topic2, spy))
            .then(() => fin.InterApplicationBus.send(new Identity(id), topic2, m))
            .then(() => delayPromise())
            .then(() => spy.should.not.be.called());
    })
})     