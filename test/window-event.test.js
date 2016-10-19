const { describe, it } = require("mocha"),
    sinon = require("sinon"),
    should = require("should"),
    connect = require("./connect"),
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
            return win.addEventListener("focused", null)
                .should.be.fulfilled()
        })
        it.skip("called", () => {
            const spy = sinon.spy()
            return win.addEventListener("focused", spy)
                .then(() => win.focus())
                .then(() => spy.should.be.calledOnce())
        })
    })
})     