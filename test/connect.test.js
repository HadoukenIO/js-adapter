const { describe, it } = require("mocha"),
    should = require("should"),
    { connect } = require("../."),
    PORT = 9696

describe("connect()", () => {
    it("authentication", () => {
        return connect(`ws://localhost:${PORT}`, Math.random().toString(36))
            .should.eventually.have.property("_token")
    })
})    