import * as assert from 'assert';
import { delayPromise } from './delay-promise';
import { cleanOpenRuntimes, DELAY_MS, getRuntimeProcessInfo, launchAndConnect, TEST_TIMEOUT } from './multi-runtime-utils';
import { serial } from '../src/launcher/util';

describe('Multi Runtime', () => {

    afterEach(async () => {
        return await cleanOpenRuntimes();
    });

    function uuidFromConnection(conn: any) {
        const { version, port, realm } = getRuntimeProcessInfo(conn);
        return `${version}/${port}/${realm ? realm : ''}`;
    }

    describe('Connections', () => {
        it('should respect the enable-mesh flag for security realms', async function() {
            const argsConnect = [
                '--security-realm=superSecret'
            ];

            // tslint:disable-next-line no-invalid-this
            this.timeout(TEST_TIMEOUT);
            const conns = await serial([() => launchAndConnect(),
            () => launchAndConnect(undefined, undefined, undefined, argsConnect),
            () => launchAndConnect()]);
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
