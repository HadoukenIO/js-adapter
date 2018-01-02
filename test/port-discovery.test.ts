import Fin from '../src/api/fin';
import Launcher from '../src/launcher/launcher';
import * as assert from 'assert';
import * as fs from 'fs';
import { connect as rawConnect } from '../src/main';
import { promiseMap } from '../src/launcher/util';
import { ConnectConfig } from '../src/transport/wire';
// tslint:disable-next-line
const appConfig = JSON.parse(fs.readFileSync('test/app.json').toString());

describe('PortDiscovery.', function() {
    // do NOT use => function here for 'this' to be set properly
    // tslint:disable-next-line
    this.timeout(120000);
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
    const quickConnect = async (config?: any): Promise<Fin> => await rawConnect(makeConfig(config));
    it('getVersion', async () => {
        if (Launcher.IS_SUPPORTED()) {
            const fin = await quickConnect();
            await fin.System.getVersion();
            assert(true);
        } else {
            assert(true);
        }
    });

    it('Can handle multiple launches in sequence', async () => {
        if (Launcher.IS_SUPPORTED()) {
            const fin0 = await quickConnect();
            const fin1 = await quickConnect();
            const fin2 = await quickConnect();
            await promiseMap([fin0, fin1, fin2], f => f.System.getVersion());
            assert(true);
        } else {
            assert(true);
        }
    });

    it('discovers in parrallel', async () => {
        await promiseMap([{}, {}, {}], quickConnect);
        assert(true);
    });
});
