import * as assert from 'assert';
import { delayPromise } from './delay-promise';
import { launchAndConnect, cleanOpenRuntimes, DELAY_MS, TEST_TIMEOUT } from './multi-runtime-utils';

describe('Multi Runtime', () => {

    let realmCount = 0;

    afterEach(async () => {
        return await cleanOpenRuntimes();
    });

    function uuidFromConnection(conn: any, realm: string) {
        const { version, port } = conn;
        return `${version}/${port}/${realm ? realm : ''}`;
    }

    function getRealm() {
        // tslint:disable-next-line
        return `supersecret_${ Math.floor(Math.random() * 10000)}_${++realmCount}`;
    }

    describe('Connections', () => {
        it('should respect the enable-mesh flag for security realms', async function() {
            const realm = getRealm();
            const argsNoConnect = [`--security-realm=${ getRealm() }`];
            const argsConnect = [
                `--security-realm=${ realm }`,
                '--enable-mesh',
                '--enable-multi-runtime'
            ];

            // tslint:disable-next-line no-invalid-this
            this.timeout(TEST_TIMEOUT);
            const conns = await Promise.all([launchAndConnect(),
                                             launchAndConnect(undefined, undefined, true, argsNoConnect),
                                             launchAndConnect(undefined, undefined, true, argsConnect)]);
            const runtimeA = conns[0];
            const runtimeB = conns[1];
            const runtimeC = conns[2];
            await delayPromise(DELAY_MS);

            const apps = await runtimeA.fin.System.getAllExternalApplications();
            const uuidList = apps.map((a: any) => { return a.uuid; });
            assert.ok(!uuidList.includes(uuidFromConnection(runtimeB, runtimeB.realm)),
                      'Expected runtimeB to be missing from the uuid list');
            assert.ok(uuidList.includes(uuidFromConnection(runtimeC, realm)), 'Expected runtimeC to be found');
            return apps;
        });
    });

});
