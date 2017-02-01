//import * as mocha from "mocha";
import { conn } from "./connect";
import * as assert from "assert";

describe("connect()", () => {
    let fin;
    before(() => {
        return conn().then(a => fin = a);
    });
    it("authentication", () => {
        assert(fin.System !== undefined);
    });
});
