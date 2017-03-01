//import * as mocha from "mocha";
import { conn } from "./connect";
import * as assert from "assert";
import { connect as rawConnect, Fin } from "../src/main";

describe("connect()", () => {
    let fin: Fin;
    before(() => {
        return conn().then((a: Fin) => fin = a);
    });
    it("authentication", () => {
        assert(fin.System !== undefined);
    });

    it("should fail if given duplicate UUID's", () => {
        const connOptions = {
            address: `ws://localhost:9696`,
            uuid: "CONECTION_DUP_TEST"
        };

        return rawConnect(connOptions).then(() => {
            return rawConnect(connOptions).catch(err => {
                assert(err.message === `Application with specified UUID already exists: ${connOptions.uuid}`);
            });
        });

    });
});
