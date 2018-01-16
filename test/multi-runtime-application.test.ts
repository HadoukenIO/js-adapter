import * as assert from 'assert';
import { delayPromise } from './delay-promise';
import { cleanOpenRuntimes, DELAY_MS, TEST_TIMEOUT, launchX } from './multi-runtime-utils';
import { clean } from './connect';

describe('Multi Runtime', () => {
    let appConfigTemplate: any;
    before(() => {
        clean();
    });

    describe('Application', () => {

        function getAppConfig(): any {
            const appConfigTemplate = {
                name: 'adapter-test-app',
                uuid: 'adapter-test-app',
                autoShow: true,
                saveWindowState: false,
                accelerator: {
                    devtools: true
                }
            };

            // tslint:disable-next-line
            appConfigTemplate.uuid += Math.floor(Math.random() * 10000);
            return appConfigTemplate;
        }

        beforeEach(() => {
            appConfigTemplate = getAppConfig();
        });

        afterEach(async () => {
            return await cleanOpenRuntimes();
        });

        describe('getInfo', () => {
            it('should return the application Information', async function () {
                // tslint:disable-next-line no-invalid-this
                this.timeout(TEST_TIMEOUT);
                const expectedLaunchMode = 'adapter';
                const conns = await launchX(2);
                const finA = conns[0];
                const finB = conns[1];
                const realApp = await finB.Application.create(appConfigTemplate);
                await realApp.run();
                const app = await finA.Application.wrap({ uuid: appConfigTemplate.uuid });
                const info = await app.getInfo();
                assert.equal(info.launchMode, expectedLaunchMode, `Expected launchMode to be "${expectedLaunchMode}"`);
                return await realApp.close();
            });
        });

        describe('getParentUuid', () => {
            it('should return the uuid of the parent adapter connection', async function () {
                // tslint:disable-next-line no-invalid-this
                this.timeout(TEST_TIMEOUT);
                const conns = await launchX(2);
                const finA = conns[0];
                const finB = conns[1];
                const expectedUuid = finB.wire.me.uuid;

                await delayPromise(DELAY_MS);
                const realApp = await finB.Application.create(appConfigTemplate);
                await realApp.run();
                const app = await finA.Application.wrap({ uuid: appConfigTemplate.uuid });
                const parentUuid = await app.getParentUuid();

                assert.equal(parentUuid, expectedUuid, `Expected uuid to be "${expectedUuid}"`);
                return await realApp.close();
            });
        });

        describe('isRunning', () => {
            it('should return the running state of an application', async function () {
                // tslint:disable-next-line no-invalid-this
                this.timeout(TEST_TIMEOUT);
                const conns = await launchX(2);
                const finA = conns[0];
                const finB = conns[1];

                await delayPromise(DELAY_MS);
                const realApp = await finB.Application.create(appConfigTemplate);
                await realApp.run();
                const app = await finA.Application.wrap({ uuid: appConfigTemplate.uuid });
                const isRunning = await app.isRunning();

                assert.equal(isRunning, true, 'Expected application to be running');
                return await realApp.close().then();
            });
        });
    });
});
