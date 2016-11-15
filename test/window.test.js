const { describe, it } = require("mocha"),
    should = require("should"),
    connect = require("./connect"),
    { Identity } = require("../."), 
    id = "adapter-test-window";

describe("Window.", () => {
    let fin, imag, real;

    before(() => {
        return connect().then(a => {
            fin = a;
            imag = fin.Window.wrap(new Identity("my-uuid-123", "my-window"));
            real = fin.Window.wrap(new Identity(id, id));
        })
    })

    describe("wrap(non-existent).", () => {
        it("^", () => {
            imag.should.be.Object();
        })
        it("getNativeId()", () => {
            return imag.getNativeId()
                .should.be.rejected();
        })
    })
    describe("wrap().", () => {
        it("getBounds()", () => {
            return real.getBounds()
                .should.eventually.have.property("height").a.Number();
        })
    })
})     