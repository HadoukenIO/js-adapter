import * as assert from 'assert';
import * as fs from 'fs';
import Launcher from '../src/launcher/launcher';
import { connect as rawConnect, Fin } from '../src/main';
import { promiseMap } from '../src/launcher/util';
// tslint:disable-next-line
const appConfig = JSON.parse(fs.readFileSync('test/app.json').toString());

describe('PortDiscovery.', function() {
    // do NOT use => function here for 'this' to be set properly
    // tslint:disable-next-line
    this.timeout(30000);
    let fin: Fin;
    before(function() {
        if (Launcher.IS_SUPPORTED()) {
            return rawConnect({
                // tslint:disable-next-line
                uuid: 'example_uuid' + Math.random(),
                runtime: {
                    version: 'alpha',
                    verboseLogging: false,
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

    it('discovers in parrallel', async () => {
        await promiseMap([{
            uuid: 'example_uuid' + Math.random(),
            runtime: {
                version: 'alpha',
                verboseLogging: false,
                securityRealm: 'adapter-test-port-discovery-3'
            }
        }, {
            uuid: 'example_uuid' + Math.random(),
            runtime: {
                version: 'alpha',
                verboseLogging: false,
                securityRealm: 'adapter-test-port-discovery-2'
            }
        }], rawConnect)
        assert(true)
    })
});
