const { describe, it } = require("mocha"),
    should = require("should"),
    connect = require("./connect")

describe("Window.", () => {
    var Window 
    before(() => {
        return connect()
            .then(a => Window = a.Window)
    })
    it("wrap()", () => {
        Window.wrap("my-uuid-123", "my-window")
            .should.be.Object()
    })
    it("getBounds()", () => {
        const id = "adapter-test-window"
        return Window.wrap(id, id).getBounds()
            .should.eventually.have.properties({ height: 500, width: 500 })
    })
})     