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

    describe('Window', () => {

        describe('moveBy', () => {
            it('should move the Window by the given values', async function () {
                // tslint:disable-next-line no-invalid-this
                this.timeout(12000);

                const conns = await Promise.all([launchAndConnect(), launchAndConnect()]);
                const runtimeA = conns[0];
                const runtimeB = conns[1];
                await delayPromise(3000);
                const app = await runtimeB.fin.Application.create(appConfigTemplate);
                await app.run();
                const win = await runtimeA.fin.Application.wrap({ uuid: appConfigTemplate.uuid }).getWindow();
                const bounds = await win.getBounds();
                await win.moveBy(1, 1);
                const postMoveBounds = await win.getBounds();

                assert.equal(postMoveBounds.top, bounds.top + 1, 'Expected bounds top to match');
                assert.equal(postMoveBounds.left, bounds.left + 1, 'Expected bounds left to match');
                return await app.close();
            });
        });

        describe('resizeTo', () => {
            it('should resize the Window by the given values', async function () {
                // tslint:disable-next-line no-invalid-this
                this.timeout(12000);

                const resizeToVal = 200;
                const conns = await Promise.all([launchAndConnect(), launchAndConnect()]);
                const runtimeA = conns[0];
                const runtimeB = conns[1];
                await delayPromise(3000);
                const app = await runtimeB.fin.Application.create(appConfigTemplate);
                await app.run();
                const win = await runtimeA.fin.Application.wrap({ uuid: appConfigTemplate.uuid }).getWindow();
                const bounds = await win.getBounds();
                await win.resizeTo(resizeToVal, resizeToVal, 'top-left');
                const postResizeBounds = await win.getBounds();

                assert.equal(postResizeBounds.top, bounds.top, 'Expected top bounds to be equal');
                assert.equal(postResizeBounds.left, bounds.left, 'Expected left bounds to be equal');
                assert.equal(postResizeBounds.right, bounds.left + resizeToVal, 'Expected right bounds to be left + resizeToVal');
                assert.equal(postResizeBounds.bottom, bounds.top + resizeToVal, 'Expected bottom bounds to be bottom + resizeToVal');

                return await app.close();

            });
        });
    });

    describe('getState', () => {
        it('should return the state of the Window', async function () {
            // tslint:disable-next-line no-invalid-this
            this.timeout(12000);

            const conns = await Promise.all([launchAndConnect(), launchAndConnect()]);
            const runtimeA = conns[0];
            const runtimeB = conns[1];
            await delayPromise(3000);
            const app = await runtimeB.fin.Application.create(appConfigTemplate);
            await app.run();
            const win = await runtimeA.fin.Application.wrap({ uuid: appConfigTemplate.uuid }).getWindow();
            const state = await win.getState();
            const expectedState = 'normal';

            assert.equal(state, expectedState, `Expected state to be ${ expectedState }`);

            return await app.close();

        });

        it('should return the state of the Window post a minimize action', async function () {
            // tslint:disable-next-line no-invalid-this
            this.timeout(12000);

            const conns = await Promise.all([launchAndConnect(), launchAndConnect()]);
            const runtimeA = conns[0];
            const runtimeB = conns[1];
            await delayPromise(3000);
            const app = await runtimeB.fin.Application.create(appConfigTemplate);
            await app.run();
            const win = await runtimeA.fin.Application.wrap({ uuid: appConfigTemplate.uuid }).getWindow();
            await win.minimize();
            const state = await win.getState();
            const expectedState = 'minimized';

            assert.equal(state, expectedState, `Expected state to be ${ expectedState }`);

            return await app.close();
        });
    });

});
