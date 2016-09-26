const { describe, it } = require("mocha"),
    should = require("should"),
    { connect } = require("../."),
    PORT = 9696

describe("connect()", () => {
    it("authorisation", () => {
        connect(`ws://localhost:${PORT}`, Math.random().toString(36))
            .should.be.fulfilled()
    })
})    