import { conn } from "./connect";
import * as assert from "assert";
import { Fin } from "../src/main";

describe("Clipboard.", () => {
    let fin: Fin;

    const writeObj = {
        data: "some text goes here"
    };

    const writeAllObj = {
        data: {
            text: "a",
            html: "b",
            rtf: "c"
        }
    };
    
    before(() => {
        return conn().then((a:Fin) => fin = a);
    });

    describe("writeText()", () => {
        
        it("Fulfilled", () => fin.Clipboard.writeText(writeObj)
           .then(() => assert(true)));
    });

    describe("readText()", () => {
        
        before(() => fin.Clipboard.writeText(writeObj));
        
        it("Fulfilled", () => fin.Clipboard.readText()
           .then(data => assert(data === writeObj.data)));
    });
    
    describe("writeHtml()", () => {
        
        it("Fulfilled", () => fin.Clipboard.writeHtml(writeObj)
           .then(() => assert(true)));
    });

    describe("readHtml()", () => {

        before(() => fin.Clipboard.writeHtml(writeObj));
        
        it("Fulfilled", () => fin.Clipboard.readHtml()
           .then(data => assert(data === writeObj.data)));
    });
    
    describe("writeRtf()", () => {
        
        it("Fulfilled", () => fin.Clipboard.writeRtf(writeObj)
           .then(() => assert(true)));
    });

    describe("readRtf()", () => {

        before(() => fin.Clipboard.writeRtf(writeObj));
        
        it("Fulfilled", () => fin.Clipboard.readRtf()
           .then(data => assert(data === writeObj.data)));
    });

    describe("write()", () => {
        
        it("Fulfilled", () => fin.Clipboard.write(writeAllObj)
           .then(() => assert(true)));
    });
    
    describe("getAvailableFormats()", () => {
        
        before(() => fin.Clipboard.write(writeAllObj));
        
        it("Fulfilled", () => fin.Clipboard.getAvailableFormats()
           .then(data => assert(data instanceof Array, `Expected ${typeof(data)} to be instance of Array`)));
    });    
});
