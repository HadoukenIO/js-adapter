const { describe, it } = require("mocha"),
    should = require("should"),
    connect = require("./connect")

describe("System.", () => {
    let fin 
    before(() => {
        return connect()
            .then(a => fin = a)
    })
    it("getVersion() Promise", () => {
        fin.System.getVersion()
            .should.have.property("then")
    })
    it("getVersion()", () => {
        return fin.System.getVersion()
            .should.be.fulfilledWith("6.49.12.118")
    })
})     