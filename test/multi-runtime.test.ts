import * as assert from "assert";
import { launchAndConnect, cleanOpenRuntimes } from "./multi-runtime-utils";

describe(`multi runtime`, function() {

    afterEach(function(done) {
        cleanOpenRuntimes().then(() => done());
    });
    
    it(`should fire listener on remote runtime`, function(done)  {
        this.timeout(60000);
        Promise.all([launchAndConnect(), launchAndConnect()]).then((conns: any) => {
            const [{appConfig: {startup_app:{uuid}}},
                   {fin}] = conns;

            // give the initial runtime app a bit to complete spinup
            setTimeout(() => {
                fin.Window.wrap({uuid, name: uuid}).once(`bounds-changed`, () => {
                    assert(true);
                    done();
                });
                fin.Window.wrap({uuid, name: uuid}).moveBy(500, 500);
            }, 3000);

        });
    });
});
