import * as assert from 'assert';
import { delayPromise } from './delay-promise';
import { launchAndConnect, cleanOpenRuntimes, DELAY_MS, TEST_TIMEOUT } from './multi-runtime-utils';

describe('Multi Runtime', () =>  {
    const appConfigTemplate = {
        name: 'adapter-test-app',
        url: 'about:blank',
        uuid: 'adapter-test-app',
        autoShow: true,
        accelerator: {
            devtools: true
        }
    };

    afterEach(async () => {
        return await cleanOpenRuntimes();
    });

    describe('Application', () => {

        describe('getInfo', () => {
            it('should return the application Information', async function () {
                // tslint:disable-next-line no-invalid-this
                this.timeout(TEST_TIMEOUT);
                const expectedLaunchMode = 'adapter';

                const conns = await Promise.all([launchAndConnect(), launchAndConnect()]);
                await delayPromise(DELAY_MS);

                const runtimeA = conns[0];
                const runtimeB = conns[1];

                const realApp = await runtimeB.fin.Application.create(appConfigTemplate);
                await realApp.run();
                const app = await runtimeA.fin.Application.wrap({ uuid: appConfigTemplate.uuid });
                const info = await app.getInfo();

                assert.equal(info.launchMode, expectedLaunchMode, `Expected launchMode to be "${ expectedLaunchMode }"`);
                return await realApp.close();
            });
        });

        describe('getParentUuid', () => {
            it('should return the uuid of the parent adapter connection', async function () {
                // tslint:disable-next-line no-invalid-this
                this.timeout(TEST_TIMEOUT);
                const conns = await Promise.all([launchAndConnect(), launchAndConnect()]);
                const runtimeA = conns[0];
                const runtimeB = conns[1];
                const expectedUuid = runtimeB.fin.wire.me.uuid;

                await delayPromise(DELAY_MS);
                const realApp = await runtimeB.fin.Application.create(appConfigTemplate);
                await realApp.run();
                const app = await runtimeA.fin.Application.wrap({ uuid: appConfigTemplate.uuid });
                const parentUuid = await app.getParentUuid();

                assert.equal(parentUuid, expectedUuid, `Expected uuid to be "${ expectedUuid }"`);
                return await realApp.close();
            });
        });

        describe('isRunning', () => {
            it('should return the running state of an application', async function () {
                // tslint:disable-next-line no-invalid-this
                this.timeout(TEST_TIMEOUT);
                const conns = await Promise.all([launchAndConnect(), launchAndConnect()]);
                const runtimeA = conns[0];
                const runtimeB = conns[1];

                await delayPromise(DELAY_MS);
                const realApp = await runtimeB.fin.Application.create(appConfigTemplate);
                await realApp.run();
                const app = await runtimeA.fin.Application.wrap({ uuid: appConfigTemplate.uuid });
                const isRunning = await app.isRunning();

                assert.equal(isRunning, true, 'Expected application to be running');
                return await realApp.close().then();
            });
        });
    });
});
