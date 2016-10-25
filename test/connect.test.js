const { describe, it } = require("mocha"),
    should = require("should"),
    connect = require("./connect")

describe("connect()", () => {
    let fin 
    before(() => {
        return connect()
            .should.be.fulfilled()
            .then(a => fin = a)
    })
    it("authentication", () => {
        fin.should.have.property("System")
    })
})     