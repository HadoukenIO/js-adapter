/* tslint:disable:no-invalid-this no-function-expression insecure-random mocha-no-side-effect-code no-empty */
import { conn } from './connect';
import { Fin } from '../src/main';
import * as assert from 'assert';
import { delayPromise } from './delay-promise';
import { cleanOpenRuntimes, DELAY_MS, getRuntimeProcessInfo, launchAndConnect, TEST_TIMEOUT } from './multi-runtime-utils';

describe.skip('Multi Runtime', function() {
    let fin: Fin;

    this.retries(2);
    this.slow(TEST_TIMEOUT);
    this.timeout(TEST_TIMEOUT);

    before(async () => {
        fin = await conn();
    });

    beforeEach(async function() {
        return await cleanOpenRuntimes();
    });

    function uuidFromConnection(conn: any) {
        const { version, port, realm } = getRuntimeProcessInfo(conn);
        return `${version}/${port}/${realm ? realm : ''}`;
    }

    describe('Connections', function() {

        it('should respect the enable-mesh flag for security realms', async function() {
            const argsConnect = [
                `--security-realm=super-secret-${Math.floor(Math.random() * 1000)}`
            ];

            const [ finA, finB, finC ] = await Promise.all([launchAndConnect(),
            launchAndConnect(undefined, undefined, undefined, argsConnect),
                                                            launchAndConnect()]);

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
