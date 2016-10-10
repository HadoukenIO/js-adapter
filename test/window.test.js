const { describe, it } = require("mocha"),
    should = require("should"),
    connect = require("./connect"),
    { Identity } = require("../."), 
    id = "adapter-test-window"

describe("Window.", () => {
    var Window 
    before(() => {
        return connect()
            .then(a => Window = a.Window)
    })
    it("wrap()", () => {
        Window.wrap(new Identity("my-uuid-123", "my-window"))
            .should.be.Object()
    })
    it("getBounds()", () => {
        return Window.wrap(new Identity(id, id)).getBounds()
            .should.eventually.have.properties({ height: 500, width: 500 })
    })
})     