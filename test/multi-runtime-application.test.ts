/* tslint:disable:no-invalid-this no-function-expression insecure-random mocha-no-side-effect-code */
import { conn } from './connect';
import { Fin } from '../src/main';
import * as assert from 'assert';
import { delayPromise } from './delay-promise';
import { cleanOpenRuntimes, DELAY_MS, TEST_TIMEOUT, launchAndConnect } from './multi-runtime-utils';

describe('Multi Runtime', function () {
    let appConfigTemplate: any;
    let fin: Fin;

    describe('Application', function () {

        this.retries(2);
        this.slow(TEST_TIMEOUT / 2 );
        this.timeout(TEST_TIMEOUT);

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

            appConfigTemplate.uuid += Math.floor(Math.random() * 10000);
            return appConfigTemplate;
        }

        before(async () => {
            fin = await conn();
        });

        beforeEach(async function () {
            appConfigTemplate = getAppConfig();
            return await cleanOpenRuntimes();
        });

        describe('getInfo', function () {

            it('should return the application Information', async function () {
                const expectedLaunchMode = 'adapter';
                const [finA, finB] = await Promise.all([launchAndConnect(), launchAndConnect()]);
                await delayPromise(DELAY_MS);

                const realApp = await finB.Application.create(appConfigTemplate);
                await realApp.run();
                const app = await finA.Application.wrap({ uuid: appConfigTemplate.uuid });
                const info = await app.getInfo();
                assert.equal(info.launchMode, expectedLaunchMode, `Expected launchMode to be "${expectedLaunchMode}"`);
                return await realApp.close();
            });
        });

        describe('getParentUuid', function () {

            it('should return the uuid of the parent adapter connection', async function () {
                const [finA, finB] = await Promise.all([launchAndConnect(), launchAndConnect()]);
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

        describe('isRunning', function () {

            it('should return the running state of an application', async function () {
                const [finA, finB] = await Promise.all([launchAndConnect(), launchAndConnect()]);

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
