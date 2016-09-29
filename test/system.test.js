const { describe, it } = require("mocha"),
    should = require("should"),
    connect = require("./connect")

describe("System.", () => {
    var System 
    before(() => {
        return connect()
            .then(a => System = a.System)
    })
    it("getVersion()", () => {
        return System.getVersion()
            .should.be.fulfilledWith("0.0.0")
    })
})     