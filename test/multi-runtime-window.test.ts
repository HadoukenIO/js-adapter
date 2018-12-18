/* tslint:disable:no-invalid-this no-function-expression insecure-random mocha-no-side-effect-code no-empty max-func-body-length*/
import { conn } from './connect';
import { Fin } from '../src/main';
import * as assert from 'assert';
import { delayPromise } from './delay-promise';
import { launchAndConnect, cleanOpenRuntimes, DELAY_MS, TEST_TIMEOUT } from './multi-runtime-utils';

describe.skip('Multi Runtime', function () {
    let fin: Fin;

    this.retries(2);
    this.slow(TEST_TIMEOUT / 2 );
    this.timeout(TEST_TIMEOUT);

    let appConfigTemplate: any;
    function getAppConfig() {
        const appConfigTemplate = {
            name: 'adapter-test-app',
            url: 'about:blank',
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

    describe('Window', function () {

        describe('moveBy', function () {
            it('should move the Window by the given values', async function() {
                this.timeout(TEST_TIMEOUT);

                const [finA, finB] = await Promise.all([launchAndConnect(), launchAndConnect()]);
                await delayPromise(DELAY_MS);
                const realApp = await finB.Application.create(appConfigTemplate);
                await realApp.run();
                const app = await finA.Application.wrap({ uuid: appConfigTemplate.uuid });
                const win = await app.getWindow();
                const bounds = await win.getBounds();
                await win.moveBy(1, 1);
                const postMoveBounds = await win.getBounds();

                assert.equal(postMoveBounds.top, bounds.top + 1, 'Expected bounds top to match');
                assert.equal(postMoveBounds.left, bounds.left + 1, 'Expected bounds left to match');
                return await realApp.close();
            });
        });

        describe('resizeTo', function () {
            it('should resize the Window by the given values', async function() {
                this.timeout(TEST_TIMEOUT);

                const resizeToVal = 200;
                const [finA, finB] = await Promise.all([launchAndConnect(), launchAndConnect()]);
                await delayPromise(DELAY_MS);
                const realApp = await finB.Application.create(appConfigTemplate);
                await realApp.run();
                const win = await finA.Window.wrap({ uuid: appConfigTemplate.uuid, name: appConfigTemplate.uuid});
                const bounds = await win.getBounds();
                await win.resizeTo(resizeToVal, resizeToVal, 'top-left');
                const postResizeBounds = await win.getBounds();

                assert.equal(postResizeBounds.top, bounds.top, 'Expected top bounds to be equal');
                assert.equal(postResizeBounds.left, bounds.left, 'Expected left bounds to be equal');
                assert.equal(postResizeBounds.right, bounds.left + resizeToVal, 'Expected right bounds to be left + resizeToVal');
                assert.equal(postResizeBounds.bottom, bounds.top + resizeToVal, 'Expected bottom bounds to be bottom + resizeToVal');

                return await realApp.close();

            });
        });
    });

    describe('getState', function () {
        it('should return the state of the Window', async function() {
            this.timeout(TEST_TIMEOUT);

            const [finA, finB] = await Promise.all([launchAndConnect(), launchAndConnect()]);
            await delayPromise(DELAY_MS);
            const realApp = await finB.Application.create(appConfigTemplate);
            await realApp.run();
            const win = await finA.Window.wrap({ uuid: appConfigTemplate.uuid, name: appConfigTemplate.uuid });
            const state = await win.getState();
            const expectedState = 'normal';

            assert.equal(state, expectedState, `Expected state to be ${expectedState}`);

            return await realApp.close();

        });

        it('should return the state of the Window post a minimize action', async function() {
            this.timeout(TEST_TIMEOUT);

            const [finA, finB] = await Promise.all([launchAndConnect(), launchAndConnect()]);
            await delayPromise(DELAY_MS);
            const realApp = await finB.Application.create(appConfigTemplate);
            await realApp.run();
            const app = await finA.Application.wrap({ uuid: appConfigTemplate.uuid });
            const win = await app.getWindow();
            await win.minimize();
            const state = await win.getState();
            const expectedState = 'minimized';

            assert.equal(state, expectedState, `Expected state to be ${expectedState}`);

            return await realApp.close();
        });
    });

});
