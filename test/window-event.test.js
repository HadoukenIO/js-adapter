const { describe, it } = require("mocha"),
    sinon = require("sinon"),
    should = require("should"),
    connect = require("./connect"),
    { Identity } = require("../."),
    id = "adapter-test-window",
    SAFE_LISTENER_DELAY = 50
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
                .then(() => new Promise(resolve => setTimeout(resolve, SAFE_LISTENER_DELAY)))
                .then(() => spy.should.be.calledOnce())
        })
    })
})     