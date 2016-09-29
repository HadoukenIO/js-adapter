const { describe, it } = require("mocha"),
    should = require("should"),
    connect = require("./connect")

describe("System.", () => {
    var api 
    before(() => {
        return connect()
            .then(a => api = a)
    })
    it("getVersion()", () => {
        return api.System.getVersion()
            .should.be.fulfilledWith("0.0.0")
    })
})     