import * as assert from 'assert';
import { delayPromise } from './delay-promise';
import { launchAndConnect, cleanOpenRuntimes, DELAY_MS, TEST_TIMEOUT, launchX } from './multi-runtime-utils';

describe('Multi Runtime', () => {

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
            describe('System', () => {
                // tslint:disable-next-line
                it('should raise application closed events', function (done: Function) {
                    // tslint:disable-next-line no-invalid-this
                    this.timeout(TEST_TIMEOUT * 2);

                    async function test() {
                        const appConfig = getAppConfig();
                        const conns = await launchX(2);
                        const finA = conns[0];
                        const finB = conns[1];
                        await delayPromise(DELAY_MS);

                        const realApp = await finB.Application.create(appConfig);
                        await realApp.run();

                        finA.System.on('application-closed', (e: any) => {
                            assert.equal(e.type, 'application-closed', 'Expected event type to match event');
                            done();
                        });

                        await delayPromise(DELAY_MS);
                        await realApp.close();
                        await delayPromise(1500);
                    }

                    test();
                });

                it('should raise application created events', function (done: Function) {
                    // tslint:disable-next-line no-invalid-this
                    this.timeout(TEST_TIMEOUT * 2);

                    async function test() {
                        const conns = await launchX(2);
                        const finA = conns[0];
                        const finB = conns[1];
                        const appConfig = getAppConfig();
                        await delayPromise(DELAY_MS);
                        let realApp: any;

                        finA.System.on('application-created', (e: any) => {
                            assert.equal(e.type, 'application-created', 'Expected event type to match event');
                            done();
                        });

                        await delayPromise(DELAY_MS);

                        realApp = await finB.Application.create(appConfig);
                        await realApp.run();
                        await realApp.close();
                        await delayPromise(DELAY_MS);
                    }

                    test();
                });
            });
        });

        describe('Launch then subscribe', () => {
            describe('application', () => {
                // tslint:disable-next-line
                it.skip('should raise closed events', function (done: Function) {
                    // tslint:disable-next-line no-invalid-this
                    this.timeout(TEST_TIMEOUT);

                    async function test() {
                        const appConfig = getAppConfig();
                        const conns = await launchX(2);
                        const finA = conns[0];
                        const finB = conns[1];
                        await delayPromise(DELAY_MS);

                        const realApp = await finB.Application.create(appConfig.uuid);
                        await realApp.run();
                        const app = await finA.Application.wrap({ uuid: appConfig.uuid });

                        app.on('closed', (e: any) => {
                            assert.equal(e.type, 'closed', 'Expected event type to match event');
                            done();
                        });

                        await delayPromise(DELAY_MS);
                        await realApp.close();
                        await delayPromise(DELAY_MS);
                    }

                    test();
                });

                it('should raise initialized events', function (done: () => void) {
                    // tslint:disable-next-line no-invalid-this
                    this.timeout(TEST_TIMEOUT);

                    async function test() {
                        const conns = await launchX(2);
                        const finA = conns[0];
                        const finB = conns[1];
                        const appConfig = getAppConfig();
                        await delayPromise(DELAY_MS);

                        const realApp = await finB.Application.create(appConfig);
                        const app = await finA.Application.wrap({ uuid: appConfig.uuid });

                        app.on('initialized', (e: any) => {
                            assert.equal(e.type, 'initialized', 'Expected event type to match event');
                            app.close().then(done);
                        });

                        await delayPromise(DELAY_MS);
                        await realApp.run();
                        await realApp.close();
                        await delayPromise(DELAY_MS);
                    }

                    test();
                });
            });
        });

        describe('Launch then subscribe', () => {
            describe('Window', () => {

                it('should raise initialized', function (done: (value: void) => void) {
                    // tslint:disable-next-line no-invalid-this
                    this.timeout(TEST_TIMEOUT);

                    async function test() {
                        const appConfig = getAppConfig();
                        const conns = await launchX(2);
                        const finA = conns[0];
                        const finB = conns[1];
                        await delayPromise(DELAY_MS);
                        const app = await finA.Application.wrap({ uuid: appConfig.uuid });
                        const win = await app.getWindow();

                        win.on('initialized', (e: any) => {
                            assert.equal(e.type, 'initialized', 'Expected event type to match event');
                            win.close().then(done);
                        });

                        await delayPromise(DELAY_MS);
                        const realApp = await finB.Application.create(appConfig);
                        await realApp.run();
                        await delayPromise(DELAY_MS);
                    }

                    test();
                });
            });
        });

        describe('Subscribe then launch', () => {

            describe('System', () => {

                // tslint:disable-next-line
                it('should raise application closed events', function (done: Function) {
                    // tslint:disable-next-line no-invalid-this
                    this.timeout(TEST_TIMEOUT * 2);

                    async function test() {
                        const appConfig = getAppConfig();
                        const finA = await launchAndConnect();
                        await delayPromise(DELAY_MS);
                        finA.System.on('application-closed', (e: any) => {
                            assert.equal(e.type, 'application-closed', 'Expected event type to match event');
                            done();
                        });
                        const finB = await launchAndConnect();
                        await delayPromise(DELAY_MS);
                        const realApp = await finB.Application.create(appConfig);
                        await realApp.run();

                        await delayPromise(DELAY_MS);
                        await realApp.close();
                        await delayPromise(1500);
                    }

                    test();
                });

                it('should raise application-started events', function (done: (value: void) => void) {
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
                        const finA = await launchAndConnect(undefined, undefined, 'supersecret', argsConnect);
                        await delayPromise(DELAY_MS);

                        const app = await finA.Application.wrap({ uuid: appConfig.uuid });

                        finA.System.on('application-created', (e: any) => {
                            assert.equal(e.type, 'application-created', 'Expected event type to match event');
                            app.close().then(done);
                        });

                        const finB = await launchAndConnect();
                        await delayPromise(DELAY_MS);
                        const realApp = await finB.Application.create(appConfig);
                        await delayPromise(DELAY_MS);
                        await realApp.run();
                        await delayPromise(DELAY_MS);
                        await realApp.close();
                        await delayPromise(DELAY_MS);
                    }

                    test();
                });
            });

        });

        describe('Subscribe then launch', () => {

            describe('Application', () => {

                //Bug regarding Application/Window close events.
                // tslint:disable-next-line
                it.skip('should raise closed events', function (done: Function) {
                    // tslint:disable-next-line no-invalid-this
                    this.timeout(TEST_TIMEOUT * 2);

                    async function test() {
                        const appConfig = getAppConfig();
                        const finA = await launchAndConnect();
                        await delayPromise(DELAY_MS);
                        const app = await finA.Application.wrap({ uuid: appConfig.uuid });
                        app.on('closed', (e: any) => {
                            assert.equal(e.type, 'closed', 'Expected event type to match event');
                            done();
                        });
                        const finB = await launchAndConnect();
                        await delayPromise(DELAY_MS);
                        const realApp = await finB.Application.create(appConfig);
                        await realApp.run();

                        await delayPromise(DELAY_MS);
                        await realApp.close();
                        await delayPromise(DELAY_MS);
                    }

                    test();
                });

                it('should raise initialized events', function (done: (value: void) => void) {
                    // tslint:disable-next-line no-invalid-this
                    this.timeout(TEST_TIMEOUT * 2); //We need a bit more time for these tests.

                    async function test() {
                        const appConfig = getAppConfig();
                        const argsConnect = [
                            '--enable-mesh',
                            '--enable-multi-runtime',
                            '--v=1'
                        ];
                        const finA = await launchAndConnect(undefined, undefined, 'supersecret', argsConnect);
                        await delayPromise(DELAY_MS);

                        const app = await finA.Application.wrap({ uuid: appConfig.uuid });

                        app.on('initialized', (e: any) => {
                            assert.equal(e.type, 'initialized', 'Expected event type to match event');
                            app.close().then(done);
                        });

                        const finB = await launchAndConnect();
                        await delayPromise(DELAY_MS);
                        const realApp = await finB.Application.create(appConfig);
                        await delayPromise(DELAY_MS);
                        await realApp.run();
                        await delayPromise(DELAY_MS);
                        await realApp.close();
                        await delayPromise(DELAY_MS);
                    }

                    test();
                });
            });

        });

        describe('Subscribe then launch', () => {
            describe('Window', () => {

                it('should raise bounds-changed', function (done: (value: void) => void) {
                    // tslint:disable-next-line no-invalid-this
                    this.timeout(TEST_TIMEOUT * 2); //We need a bit more time for these tests.

                    async function test() {
                        const appConfig = getAppConfig();
                        const finA = await launchAndConnect();
                        await delayPromise(DELAY_MS);
                        const app = await finA.Application.wrap({ uuid: appConfig.uuid });
                        const win = await app.getWindow();

                        win.on('bounds-changed', (e: any) => {
                            assert.equal(e.type, 'bounds-changed', 'Expected event type to match event');
                            win.close().then(done);
                        });

                        const finB = await launchAndConnect();
                        await delayPromise(DELAY_MS);
                        const realApp = await finB.Application.create(appConfig);
                        await realApp.run();
                        const realWindow = await realApp.getWindow();
                        await delayPromise(DELAY_MS);
                        await realWindow.moveBy(100, 100);
                        await delayPromise(DELAY_MS);
                    }

                    test();
                });

                it('should raise hidden', function (done: (value: void) => void) {
                    // tslint:disable-next-line no-invalid-this
                    this.timeout(TEST_TIMEOUT * 2); //We need a bit more time for these tests.

                    async function test() {
                        const appConfig = getAppConfig();
                        const finA = await launchAndConnect();
                        const app = await finA.Application.wrap({ uuid: appConfig.uuid });
                        const win = await app.getWindow();

                        win.on('hidden', (e: any) => {
                            assert.equal(e.type, 'hidden', 'Expected event type to match event');
                            win.close().then(done);
                        });

                        const finB = await launchAndConnect();
                        const realApp = await finB.Application.create(appConfig);
                        await realApp.run();
                        const realWindow = await realApp.getWindow();
                        await delayPromise(DELAY_MS);
                        await realWindow.hide();
                        await delayPromise(DELAY_MS);
                    }

                    test();
                });

            });
        });
    });

});
