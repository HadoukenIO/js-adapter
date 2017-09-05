import * as assert from 'assert';
import { delayPromise } from './delay-promise';
import { launchAndConnect, cleanOpenRuntimes } from './multi-runtime-utils';

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
                this.timeout(12000);
                const expectedLaunchMode = 'adapter';

                const conns = await Promise.all([launchAndConnect(), launchAndConnect()]);
                await delayPromise(3000);

                const runtimeA = conns[0];
                const runtimeB = conns[1];

                const app = await runtimeB.fin.Application.create(appConfigTemplate);
                await app.run();
                const info = await runtimeA.fin.Application.wrap({ uuid: appConfigTemplate.uuid }).getInfo();

                assert.equal(info.launchMode, expectedLaunchMode, `Expected launchMode to be "${ expectedLaunchMode }"`);
                return await app.close();
            });
        });

        describe('getParentUuid', () => {
            it('should return the uuid of the parent adapter connection', async function () {
                // tslint:disable-next-line no-invalid-this
                this.timeout(12000);
                const conns = await Promise.all([launchAndConnect(), launchAndConnect()]);
                const runtimeA = conns[0];
                const runtimeB = conns[1];
                const expectedUuid = runtimeB.fin.wire.me.uuid;

                await delayPromise(3000);
                const app = await runtimeB.fin.Application.create(appConfigTemplate);
                await app.run();
                const parentUuid = await runtimeA.fin.Application.wrap({ uuid: appConfigTemplate.uuid }).getParentUuid();

                assert.equal(parentUuid, expectedUuid, `Expected uuid to be "${ expectedUuid }"`);
                return await app.close();
            });
        });

        describe('isRunning', () => {
            it('should return the running state of an application', async function () {
                // tslint:disable-next-line no-invalid-this
                this.timeout(12000);
                const conns = await Promise.all([launchAndConnect(), launchAndConnect()]);
                const runtimeA = conns[0];
                const runtimeB = conns[1];

                await delayPromise(3000);
                const app = await runtimeB.fin.Application.create(appConfigTemplate);
                await app.run();
                const isRunning = await runtimeA.fin.Application.wrap({ uuid: appConfigTemplate.uuid }).isRunning();
                assert.equal(isRunning, true, 'Expected application to be running');
                return await app.close().then();
            });
        });
    });
});
