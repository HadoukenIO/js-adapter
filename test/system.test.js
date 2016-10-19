const { describe, it } = require("mocha"),
    should = require("should"),
    connect = require("./connect")

describe("System.", () => {
    let System 
    before(() => {
        return connect()
            .then(a => System = a.System)
    })
    it("getVersion() Promise", () => {
        System.getVersion()
            .should.have.property("then")
    })
    it("getVersion()", () => {
        return System.getVersion()
            .should.be.fulfilledWith("6.49.12.62")
    })
})     