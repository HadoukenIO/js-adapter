import * as assert from 'assert';
import { connect as rawConnect, Fin } from '../src/main';
import * as os from 'os';
import * as fs from 'fs';
// tslint:disable-next-line
const appConfig = JSON.parse(fs.readFileSync('test/app.json').toString());

// tslint:disable-next-line
function supported(): boolean {
    return (os.platform() === 'win32');
}
describe('PortDiscovery.', function() {
    // do NOT use => function here for 'this' to be set properly
    // tslint:disable-next-line
    this.timeout(10000);
    let fin: Fin;
    before(function() {
        if (supported()) {
            return rawConnect({
                // tslint:disable-next-line
                uuid: 'example_uuid' + Math.random(),
                runtime: {
                    version: appConfig.runtime.version,
                    verboseLogging: true,
                    securityRealm: 'adapter-test-port-discovery'
                }
            }).then((a: Fin) => {
                fin = a;
            });
        }
    });

    it('getVersion', () => {
        if (supported()) {
            fin.System.getVersion().then(() => assert(true));
        } else {
            assert(true);
        }
    });
});
