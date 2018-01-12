import Fin from '../src/api/fin';
import Launcher from '../src/launcher/launcher';
import * as assert from 'assert';
import * as fs from 'fs';
import { connect as rawConnect } from '../src/main';
import { promiseMap } from '../src/launcher/util';
import { ConnectConfig } from '../src/transport/wire';
import { kill } from './multi-runtime-utils';
import { clean } from './connect';
import { delayPromise } from './delay-promise';
// tslint:disable-next-line
const appConfig = JSON.parse(fs.readFileSync('test/app.json').toString());

describe('PortDiscovery.', function () {
    // do NOT use => function here for 'this' to be set properly
    // tslint:disable-next-line
    this.timeout(30000);
    before(clean);
    let spawns = 0;
    function makeConfig(config: any = {}): ConnectConfig {
        const defaultRconfig = {
            version: 'alpha',
            verboseLogging: false,
            rvmDir: process.env.RVM_DIR,
            securityRealm: 'adapter-test-port-discovery-' + spawns
        };
        if (config.runtime) {
            config.runtime = Object.assign(defaultRconfig, config.runtime);
        }
        return Object.assign({
            runtime: defaultRconfig,
            // tslint:disable-next-line
            uuid: 'js-adapter-port-discovery-test-' + spawns++,
        }, config);
    }
    afterEach(() => delayPromise(5000));

    const quickConnect = async (config?: any): Promise<Fin> => await rawConnect(makeConfig(config));
    it('getVersion', async () => {
        if (Launcher.IS_SUPPORTED()) {
            const fin = await quickConnect();
            await fin.System.getVersion();
            assert(true);
            kill(fin);
        } else {
            assert(true);
        }
    });

    it('Can handle multiple launches in sequence', async () => {
        if (Launcher.IS_SUPPORTED()) {
            const fin0 = await quickConnect();
            const fin1 = await quickConnect();
            const fin2 = await quickConnect();
            const r = [fin0, fin1, fin2];
            await promiseMap(r, f => f.System.getVersion());
            assert(true);
            r.map(kill);
        } else {
            assert(true);
        }
    });

    //tslint:disable-next-line
    it.skip('discovers in parrallel', async () => {
        const r = await promiseMap([{}, {}, {}], quickConnect);
        assert(true);
        r.map(kill);
    });
});
