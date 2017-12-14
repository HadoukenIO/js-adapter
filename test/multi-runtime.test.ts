
import { delayPromise } from './delay-promise';
import { cleanOpenRuntimes, DELAY_MS, getRuntimeProcessInfo, launchAndConnect, TEST_TIMEOUT } from './multi-runtime-utils';

describe('Multi Runtime', () => {

    let realmCount = 0;

    afterEach(async () => {
        return await cleanOpenRuntimes();
    });

    function uuidFromConnection(conn: any) {
        const { version, port, realm } = getRuntimeProcessInfo(conn);
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
            const finA = conns[0];
            const finB = conns[1];
            const finC = conns[2];
            await delayPromise(DELAY_MS);

            const apps = await finA.System.getAllExternalApplications();
            const uuidList = apps.map((a: any) => { return a.uuid; });
            assert.ok(!uuidList.includes(uuidFromConnection(finB)),
                      'Expected runtimeB to be missing from the uuid list');
            assert.ok(uuidList.includes(uuidFromConnection(finC)), 'Expected runtimeC to be found');
            return apps;
        });
    });

});
