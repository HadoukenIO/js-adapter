const { describe, it } = require("mocha"),
    should = require("should"),
    connectToOpenFin = require("../."),
    PORT = 9696

describe("connectToOpenFin()", () => {
    it("authorisation", () => {
        connectToOpenFin(`ws://localhost:${PORT}`, Math.random().toString(36))
            .should.be.fulfilledWith("ok")
    })
})    