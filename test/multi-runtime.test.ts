import * as assert from 'assert';
import { delayPromise } from './delay-promise';
import { launchAndConnect, cleanOpenRuntimes } from './multi-runtime-utils';

describe('Multi Runtime', () => {

    let realmCount = 0;

    afterEach(async () => {
        return await cleanOpenRuntimes();
    });

    function uuidFromConnection(conn: any) {
        return `${conn.version}:${conn.port}`;
    }

    function getRealm() {
        // tslint:disable-next-line
        return `supersecret_${ Math.floor(Math.random() * 10000)}_${++realmCount}`;
    }

    describe('Connections', () => {
        it('should respect the enable-mesh flag for security realms', async function() {
            const argsNoConnect = [`--security-realm=${ getRealm() }`];
            const argsConnect = [
                `--security-realm=${ getRealm() }`,
                '--enable-mesh',
                '--enable-multi-runtime'
            ];

            // tslint:disable-next-line no-invalid-this
            this.timeout(120000);
            const conns = await Promise.all([launchAndConnect(),
                                             launchAndConnect(undefined, undefined, true, argsNoConnect),
                                             launchAndConnect(undefined, undefined, true, argsConnect)]);
            const runtimeA = conns[0];
            const runtimeB = conns[1];
            const runtimeC = conns[2];
            await delayPromise(3000);

            const apps = await runtimeA.fin.System.getAllExternalApplications();
            const uuidList = apps.map((a: any) => { return a.uuid; });

            assert.ok(!uuidList.includes(uuidFromConnection(runtimeB)), 'Expected runtimeB to be missing from the uuid list');
            assert.ok(uuidList.includes(uuidFromConnection(runtimeC)), 'Expected runtimeC to be found');
            return apps;
        });
    });

});
