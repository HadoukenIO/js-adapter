import * as assert from 'assert';
import { delayPromise } from './delay-promise';
import { launchAndConnect, cleanOpenRuntimes, DELAY_MS, TEST_TIMEOUT } from './multi-runtime-utils';

describe('Multi Runtime', () =>  {

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

        // tslint:disable-next-line
        appConfigTemplate.uuid += Math.floor(Math.random() * 1000);
        return appConfigTemplate;
    }

    afterEach(async () => {
        return await cleanOpenRuntimes();
    });

    describe('Events', () => {

        describe('Launch then subscribe', () => {
            describe('application', () => {
                // tslint:disable-next-line
                it.skip('should raise closed events', function(done: Function) {
                    // tslint:disable-next-line no-invalid-this
                    this.timeout(TEST_TIMEOUT);

                    async function test() {
                        const appConfig = getAppConfig();
                        const runtimeA = await launchAndConnect();
                        const runtimeB = await launchAndConnect();
                        await delayPromise(DELAY_MS);

                        const realApp = await runtimeB.fin.Application.create(appConfig.uuid);
                        await realApp.run();
                        const app = runtimeA.fin.Application.wrap({ uuid: appConfig.uuid });

                        app.on('closed', (e: any) => {
                            assert.equal(e.type, 'closed', 'Expected event type to match event');
                            done();
                        });

                        await delayPromise(30);
                        await realApp.close();
                    }

                    test();
                });

                it('should raise initialized events', function(done: Function) {
                    // tslint:disable-next-line no-invalid-this
                    this.timeout(TEST_TIMEOUT);

                    async function test() {
                        const runtimeA = await launchAndConnect();
                        const runtimeB = await launchAndConnect();
                        const appConfig = getAppConfig();
                        await delayPromise(DELAY_MS);

                        const realApp = await runtimeB.fin.Application.create(appConfig);
                        const app = runtimeA.fin.Application.wrap({ uuid: appConfig.uuid });

                        app.on('initialized', (e: any) => {
                            assert.equal(e.type, 'initialized', 'Expected event type to match event');
                            app.close().then(done);
                        });

                        await delayPromise(30);
                        await realApp.run();
                        await realApp.close();
                    }

                    test();
                });
            });
        });

        describe('Launch then subscribe', () => {
            describe('Window', () => {

                it('should raise initialized', function(done: Function) {
                    // tslint:disable-next-line no-invalid-this
                    this.timeout(TEST_TIMEOUT);

                    async function test() {
                        const appConfig = getAppConfig();
                        const runtimeA = await launchAndConnect();
                        const runtimeB = await launchAndConnect();
                        await delayPromise(DELAY_MS);
                        const app = runtimeA.fin.Application.wrap({ uuid: appConfig.uuid });
                        const win = await app.getWindow();

                        win.on('initialized', (e: any) => {
                            assert.equal(e.type, 'initialized', 'Expected event type to match event');
                            win.close().then(done);
                        });

                        await delayPromise(30);
                        const realApp = await runtimeB.fin.Application.create(appConfig);
                        await realApp.run();
                    }

                    test();
                });
            });
        });

        describe('Subscribe then launch', () => {

            describe('Application', () => {

                //Bug regarding Application/Window close events.
                // tslint:disable-next-line
                it.skip('should raise closed events', function(done: Function) {
                    // tslint:disable-next-line no-invalid-this
                    this.timeout(TEST_TIMEOUT * 2);

                    async function test() {
                        const appConfig = getAppConfig();
                        const runtimeA = await launchAndConnect();
                        await delayPromise(DELAY_MS);
                        const app = runtimeA.fin.Application.wrap({ uuid: appConfig });
                        app.on('closed', (e: any) => {
                            assert.equal(e.type, 'closed', 'Expected event type to match event');
                            done();
                        });
                        const runtimeB = await launchAndConnect();
                        await delayPromise(DELAY_MS);
                        const realApp = await runtimeB.fin.Application.create(appConfig);
                        await realApp.run();

                        await delayPromise(30);
                        await realApp.close();
                    }

                    test();
                });

                it('should raise initialized events', function(done: Function) {
                    // tslint:disable-next-line no-invalid-this
                    this.timeout(TEST_TIMEOUT * 2); //We need a bit more time for these tests.

                    async function test() {
                        const appConfig = getAppConfig();
                        const argsConnect = [
                            '--security-realm=supersecret',
                            '--enable-mesh',
                            '--enable-multi-runtime',
                            '--v=1'
                        ];
                        const runtimeA = await launchAndConnect(undefined, undefined, true, argsConnect);
                        await delayPromise(DELAY_MS);

                        const app = runtimeA.fin.Application.wrap({ uuid: appConfig.uuid });

                        app.on('initialized', (e: any) => {
                            assert.equal(e.type, 'initialized', 'Expected event type to match event');
                            app.close().then(done);
                        });

                        const runtimeB = await launchAndConnect();
                        await delayPromise(DELAY_MS);
                        const realApp = await runtimeB.fin.Application.create(appConfig);
                        await delayPromise(300);
                        await realApp.run();
                        await delayPromise(300);
                        await realApp.close();
                    }

                    test();
                });
            });

        });

        describe('Subscribe then launch', () => {
            describe('Window', () => {

                it('should raise bounds-changed', function(done: Function) {
                    // tslint:disable-next-line no-invalid-this
                    this.timeout(TEST_TIMEOUT * 2); //We need a bit more time for these tests.

                    async function test() {
                        const appConfig = getAppConfig();
                        const runtimeA = await launchAndConnect();
                        await delayPromise(DELAY_MS);
                        const app = runtimeA.fin.Application.wrap({ uuid: appConfig.uuid });
                        const win = await app.getWindow();

                        win.on('bounds-changed', (e: any) => {
                            assert.equal(e.type, 'bounds-changed', 'Expected event type to match event');
                            win.close().then(done);
                        });

                        const runtimeB = await launchAndConnect();
                        await delayPromise(DELAY_MS);
                        const realApp = await runtimeB.fin.Application.create(appConfig);
                        await realApp.run();
                        const realWindow = await realApp.getWindow();
                        await delayPromise(300);
                        await realWindow.moveBy(100, 100);
                    }

                    test();
                });

                it('should raise hidden', function(done: Function) {
                    // tslint:disable-next-line no-invalid-this
                    this.timeout(TEST_TIMEOUT * 2); //We need a bit more time for these tests.

                    async function test() {
                        const appConfig = getAppConfig();
                        const runtimeA = await launchAndConnect();
                        await delayPromise(DELAY_MS);
                        const app = runtimeA.fin.Application.wrap({ uuid: appConfig.uuid });
                        const win = await app.getWindow();

                        win.on('hidden', (e: any) => {
                            assert.equal(e.type, 'hidden', 'Expected event type to match event');
                            win.close().then(done);
                        });

                        const runtimeB = await launchAndConnect();
                        await delayPromise(DELAY_MS);
                        const realApp = await runtimeB.fin.Application.create(appConfig);
                        await realApp.run();
                        const realWindow = await realApp.getWindow();
                        await delayPromise(300);
                        await realWindow.hide();
                    }

                    test();
                });

            });
        });
    });

});
