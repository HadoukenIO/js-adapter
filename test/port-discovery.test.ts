import Fin from '../src/api/fin';
import Launcher from '../src/launcher/launcher';
import * as assert from 'assert';
import * as fs from 'fs';
import { connect as rawConnect } from '../src/main';
import { promiseMap } from '../src/launcher/util';
// tslint:disable-next-line
const appConfig = JSON.parse(fs.readFileSync('test/app.json').toString());

describe('PortDiscovery.', function() {
    // do NOT use => function here for 'this' to be set properly
    // tslint:disable-next-line
    this.timeout(120000);
    let fin: Fin;
    before(function() {
        if (Launcher.IS_SUPPORTED()) {
            return rawConnect({
                // tslint:disable-next-line
                uuid: 'example_uuid' + Math.random(),
                runtime: {
                    version: 'alpha',
                    verboseLogging: true,
                    securityRealm: 'adapter-test-port-discovery'
                }
            }).then((a: Fin) => {
                fin = a;
            });
        }
    });

    it('getVersion', () => {
        if (Launcher.IS_SUPPORTED()) {
            fin.System.getVersion().then(() => assert(true));
        } else {
            assert(true);
        }
    });

    it.skip('Can handle multiple runtime args', () => {
        if (Launcher.IS_SUPPORTED()) {
            fin.System.getVersion().then(() => assert(true));
        } else {
            assert(true);
        }
    });

    it('discovers in parrallel', async () => {
        await promiseMap([{
            uuid: 'example_uuid' + Math.random(),
            runtime: {
                version: '8.56.28.3',
                // additionalArgument: '--debug=5858',
                verboseLogging: true,
                securityRealm: 'adapter-test-port-discovery-2'
            }
        }, {
            uuid: 'example_uuid' + Math.random(),
            runtime: {
                version: '8.56.28.3',
                additionalArgument: '--inspect-port=5858',
                verboseLogging: true,
                securityRealm: 'adapter-test-port-discovery-FAILING'
            }
        }], rawConnect);
        assert(true);
    });
});
