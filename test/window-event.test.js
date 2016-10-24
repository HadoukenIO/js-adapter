const { describe, it } = require("mocha"),
    sinon = require("sinon"),
    should = require("should"),
    connect = require("./connect"),
    delayPromise = require("./delay-promise"),
    { Identity } = require("../."),
    id = "adapter-test-window"
    require("should-sinon")

describe("Window.addEventListener()", () => {
    let Window,
        win
    before(() => {
        return connect()
            .then(a => {
                Window = a.Window
                win = Window.wrap(new Identity(id, id)) 
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
                .then(() => delayPromise(200))
                .then(() => spy.should.be.calledOnce())
        })
        it.skip("unsubscribe", () => {
            const spy = sinon.spy()
            return win.addEventListener("focused", spy)
                .then(() => win.removeEventListener("focused", spy))
                .then(() => win.focus())
                .then(() => win.blur())
                .then(() => delayPromise())
                .then(() => spy.should.not.be.called())
        })
    })
})     