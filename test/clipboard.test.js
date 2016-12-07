const { describe, it } = require("mocha"),
      should = require("should"),
      connect = require("./connect");

describe("Clipboard.", () => {
    let fin;

    const writeObj = {
        data: "some text goes here",
        type: null
    };

    const writeAllObj = {
        data: {
            text: "a",
            html: "b",
            rtf: "c"
        },
        type: null
    };
    
    before(() => {
        return connect().then(a => fin = a);
    });

    describe("writeText()", () => {
        
	    it("Promise", () => fin.Clipboard.writeText(writeObj)
          .should.be.a.Promise());
	    
	    it("Fulfilled", () => fin.Clipboard.writeText(writeObj)
           .should.be.fulfilled());
    });

    describe("readText()", () => {
        
        before(() => fin.Clipboard.writeText(writeObj));
        
	    it("Promise", () => fin.Clipboard.readText()
          .should.be.a.Promise());
	    
	    it("Fulfilled", () => fin.Clipboard.readText()
           .should.be.fulfilledWith(writeObj.data));
    });
    
    describe("writeHtml()", () => {
        
	    it("Promise", () => fin.Clipboard.writeHtml(writeObj)
          .should.be.a.Promise());
	    
	    it("Fulfilled", () => fin.Clipboard.writeHtml(writeObj)
           .should.be.fulfilled());
    });

    describe("readHtml()", () => {

        before(() => fin.Clipboard.writeHtml(writeObj));
        
	    it("Promise", () => fin.Clipboard.readHtml()
          .should.be.a.Promise());
	    
	    it("Fulfilled", () => fin.Clipboard.readHtml()
           .should.be.fulfilledWith(writeObj.data));
    });
    
    describe("writeRtf()", () => {
        
	    it("Promise", () => fin.Clipboard.writeRtf(writeObj)
          .should.be.a.Promise());
	    
	    it("Fulfilled", () => fin.Clipboard.writeRtf(writeObj)
           .should.be.fulfilled());
    });

    describe("readRtf()", () => {

        before(() => fin.Clipboard.writeRtf(writeObj));
        
	    it("Promise", () => fin.Clipboard.readRtf().should.have.property("then"));
	    
	    it("Fulfilled", () => fin.Clipboard.readRtf()
           .should.be.fulfilledWith(writeObj.data));
    });

    describe("write()", () => {
        
        it("Promise", () => fin.Clipboard.write(writeAllObj)
          .should.be.a.Promise());
	    
	    it("Fulfilled", () => fin.Clipboard.write(writeAllObj)
           .should.be.fulfilled());
    });
    

    describe("getAvailableFormats()", () => {

        const expected = ["text/plain", "text/html", "text/rtf"];
        
        before(() => fin.Clipboard.write(writeAllObj));
        
	    it("Promise", () => fin.Clipboard.getAvailableFormats()
          .should.be.a.Promise());
	    
	    it("Fulfilled", () => fin.Clipboard.getAvailableFormats()
           .should.be.fulfilledWith(expected));
    });    
});
