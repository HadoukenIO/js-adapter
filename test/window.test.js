const { describe, it } = require("mocha"),
    should = require("should"),
    connect = require("./connect"),
    { Identity } = require("../."), 
    id = "adapter-test-window"

describe("Window.", () => {
    let fin 
    before(() => {
        return connect()
            .then(a => fin = a)
    })
    it("wrap()", () => {
        fin.Window.wrap(new Identity("my-uuid-123", "my-window"))
            .should.be.Object()
    })
    it("getBounds()", () => {
        return fin.Window.wrap(new Identity(id, id)).getBounds()
            .should.eventually.have.property("height").a.Number()
    })
})     