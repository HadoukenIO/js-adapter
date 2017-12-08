import * as assert from 'assert';
import * as fs from 'fs';
import Launcher from '../src/launcher/launcher';
import { connect as rawConnect, Fin } from '../src/main';
// tslint:disable-next-line
const appConfig = JSON.parse(fs.readFileSync('test/app.json').toString());

describe('PortDiscovery.', function() {
    // do NOT use => function here for 'this' to be set properly
    // tslint:disable-next-line
    this.timeout(50000);
    let fin: Fin;
    before(function() {
        if (Launcher.isSupported()) {
            return rawConnect({
                // tslint:disable-next-line
                uuid: 'example_uuid' + Math.random(),
                runtime: {
                    version: 'community',
                    verboseLogging: true,
                    securityRealm: 'adapter-test-port-discovery'
                }
            }).then((a: Fin) => {
                fin = a;
            });
        }
    });

    it('getVersion', () => {
        if (Launcher.isSupported()) {
            fin.System.getVersion().then(() => assert(true));
        } else {
            assert(true);
        }
    });
});
