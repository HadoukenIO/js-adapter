import * as assert from 'assert';
import { delayPromise } from './delay-promise';
import { launchAndConnect, cleanOpenRuntimes } from './multi-runtime-utils';

describe('Multi Runtime', function() {

    afterEach(async () => {
        return await cleanOpenRuntimes();
    });

    function uuidFromConnection(conn: any) {
        return `${conn.version}:${conn.port}`;
    }

    // tslint:disable-next-line no-function-expression
    it('should quickly launch and connect to multiple runtimes', async function()  {
        // tslint:disable-next-line no-invalid-this
        this.timeout(120000);
        const conns = await Promise.all([launchAndConnect(), launchAndConnect(), launchAndConnect(), launchAndConnect()]);
        const runtimeA = conns[0];
        await delayPromise(3000);
        const apps = await runtimeA.fin.System.getAllExternalApplications();
        const uuidList = apps.map((a: any) => { return a.uuid; });

        assert.ok(uuidList.includes(uuidFromConnection(conns[1])), 'Expected to find connection in external application list');
        assert.ok(uuidList.includes(uuidFromConnection(conns[2])), 'Expected to find connection in external application list');
        assert.ok(uuidList.includes(uuidFromConnection(conns[3])), 'Expected to find connection in external application list');
    });

    it('should not connect to non --enable-mesh realms', async function() {
        const args = ['--security-realm=supersecret'];

        // tslint:disable-next-line no-invalid-this
        this.timeout(120000);
        const conns = await Promise.all([launchAndConnect(undefined, undefined, true, args), launchAndConnect()]);
        const runtimeA = conns[0];
        const runtimeB = conns[1];
        await delayPromise(3000);

        const apps = await runtimeA.fin.System.getAllExternalApplications();
        const uuidList = apps.map((a: any) => { return a.uuid; });

        assert.ok(!uuidList.includes(uuidFromConnection(runtimeB)), 'Expected runtimeB to be missing from the uuid list');
    });

    it('should connect to --enable-mesh realms', async function() {
        const args = [
            '--security-realm=supersecret2',
            '--enable-mesh',
            '--enable-multi-runtime'
        ];

        // tslint:disable-next-line no-invalid-this
        this.timeout(120000);
        const conns = await Promise.all([launchAndConnect(undefined, undefined, true, args), launchAndConnect()]);
        const runtimeA = conns[0];
        const runtimeB = conns[1];
        await delayPromise(3000);

        const apps = await runtimeA.fin.System.getAllExternalApplications();
        const uuidList = apps.map((a: any) => { return a.uuid; });

        assert.ok(uuidList.includes(uuidFromConnection(runtimeB)), 'Expected runtimeB to be missing from the uuid list');
    });

});
