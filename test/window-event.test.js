const { describe, it } = require("mocha"),
    sinon = require("sinon"),
    should = require("should"),
    connect = require("./connect"),
    delayPromise = require("./delay-promise"),
    { Identity } = require("../."),
    id = "adapter-test-window"
require("should-sinon")

describe("Window.addEventListener()", () => {
    let fin,
        win
    before(() => {
        return connect()
            .then(a => {
                fin = a
                win = fin.Window.wrap(new Identity(id, id))
            })
    })
    describe('"focused"', () => {
        it("subscribe", () => {
            return win.addEventListener("focused", () => {})
                .should.be.fulfilled()
        })
        it("subscribe with null", () => {
            return win.addEventListener("focused", null)
                .should.be.rejected()
        })
        it("called", () => {
            const spy = sinon.spy()
            return win.addEventListener("focused", spy)
                .then(() => win.focus())
                .then(() => win.blur())
                .then(() => delayPromise())
                .then(() => spy.should.be.calledOnce())
        })
        it("unsubscribe unregistered", () => {
            return win.removeEventListener.bind(win, "focused", () => {})
                .should.throw()
        })
    })
    describe('"bounds-changed"', () => {
        it("unsubscribe", () => {
            const spy = sinon.spy()
            return win.addEventListener("bounds-changed", spy)
                .then(() => win.removeEventListener("bounds-changed", spy))
                .then(() => win.moveBy(1, 0))
                .then(() => delayPromise())
                .then(() => spy.should.not.be.called())
        })
    })
})     