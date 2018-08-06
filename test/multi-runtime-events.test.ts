/* tslint:disable:no-invalid-this no-function-expression insecure-random mocha-no-side-effect-code no-empty */
import { conn } from './connect';
import { Fin } from '../src/main';
import * as assert from 'assert';
import { delayPromise } from './delay-promise';
import { launchAndConnect, cleanOpenRuntimes, DELAY_MS, TEST_TIMEOUT } from './multi-runtime-utils';

describe('Multi Runtime', function() {
    let fin: Fin;

    this.slow(TEST_TIMEOUT / 2 );
    this.timeout(TEST_TIMEOUT * 2);

    function getAppConfig() {
        const appConfigTemplate = {
            name: 'adapter-test-app',
            url: 'about:blank',
            uuid: 'adapter-test-app',
            autoShow: true,
            saveWindowState: false,
            accelerator: {
                devtools: true
            },
            experimental: {
                v2api: true
            }
        };

        appConfigTemplate.uuid += Math.floor(Math.random() * 1000);
        return appConfigTemplate;
    }

    before(async () => {
        fin = await conn();
    });

    beforeEach(async function() {
        return await cleanOpenRuntimes();
    });

    describe('Events', function() {

        describe('Launch then subscribe', function() {
            describe('System', function() {
                it('should raise application started events', function (done: Function) {

                    async function test() {
                        const appConfig = getAppConfig();
                        const [finA, finB] = await Promise.all([launchAndConnect(), launchAndConnect()]);
                        await delayPromise(DELAY_MS);
                        const realApp = await finB.Application.create(appConfig);
                        finA.System.on('application-started', async (e: any) => {
                            assert.equal(e.type, 'application-started', 'Expected event type to match event');
                            await realApp.close();

                            done();
                        });
                        await delayPromise(DELAY_MS);

                        return await realApp.run();
                    }

                    test().catch(() => cleanOpenRuntimes());
                });

                it('should raise application created events', function (done: Function) {

                    async function test() {
                        const [finA, finB] = await Promise.all([launchAndConnect(), launchAndConnect()]);
                        await delayPromise(DELAY_MS);

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

                    test().catch(() => cleanOpenRuntimes());
                });
            });
        });

        describe('Launch then subscribe', function() {
            describe('Application', function() {
                it('should raise application started events', function (done: Function) {
                    async function test() {
                        const appConfig = getAppConfig();
                        const [finA, finB] = await Promise.all([launchAndConnect(), launchAndConnect()]);
                        await delayPromise(DELAY_MS);
                        const realApp = await finB.Application.create(appConfig);
                        const app = await finA.Application.wrap({ uuid: appConfig.uuid });
                        await delayPromise(DELAY_MS);

                        app.on('started', async (e: any) => {
                            assert.equal(e.type, 'started', 'Expected event type to match event');
                            await app.close();

                            done();
                        });

                        await delayPromise(DELAY_MS);
                        await realApp.run();
                    }

                    test().catch((err) => {
                        cleanOpenRuntimes();
                    });
                });

                it('should raise initialized events', function (done: () => void) {
                    async function test() {
                        const appConfig = getAppConfig();
                        const [finA, finB] = await Promise.all([launchAndConnect(), launchAndConnect()]);
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

                    test().catch(() => cleanOpenRuntimes());
                });
            });
        });

        describe('Launch then subscribe', function() {
            describe('Window', function() {

                it('should raise initialized', function (done: (value: void) => void) {
                    async function test() {
                        const appConfig = getAppConfig();
                        const [finA, finB] = await Promise.all([launchAndConnect(), launchAndConnect()]);
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

                    test().catch(() => cleanOpenRuntimes());
                });
            });
        });

        describe('Subscribe then launch', function() {

            describe('System', function() {

                it('should raise application started events', function (done: Function) {
                    this.timeout(TEST_TIMEOUT * 2);

                    async function test() {
                        const appConfig = getAppConfig();
                        const finA = await launchAndConnect();
                        await delayPromise(DELAY_MS);
                        await finA.System.on('application-started', (e: any) => {
                            assert.equal(e.type, 'application-started', 'Expected event type to match event');
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

                    test().catch(() => cleanOpenRuntimes());
                });

                it('should raise application-created events', function (done: (value: void) => void) {
                    this.timeout(TEST_TIMEOUT * 2); //We need a bit more time for these tests.

                    async function test() {
                        const appConfig = getAppConfig();
                        const finA = await launchAndConnect();
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

                    test().catch(() => cleanOpenRuntimes());
                });
            });

        });

        describe('Subscribe then launch', function() {

            describe('Application', function() {

                it('should raise started events', function (done: Function) {
                    this.timeout(TEST_TIMEOUT * 2);

                    async function test() {
                        const appConfig = getAppConfig();
                        const finA = await launchAndConnect();
                        await delayPromise(DELAY_MS);
                        const app = await finA.Application.wrap({ uuid: appConfig.uuid });
                        app.on('started', async (e: any) => {
                            assert.equal(e.type, 'started', 'Expected event type to match event');
                            await app.close();
                            done();
                        });
                        const finB = await launchAndConnect();
                        await delayPromise(DELAY_MS);
                        const realApp = await finB.Application.create(appConfig);
                        await realApp.run();

                        await delayPromise(DELAY_MS);
                    }

                    test().catch(() => cleanOpenRuntimes());
                });

                it('should raise initialized eventsss', function (done: (value: void) => void) {
                    this.timeout(TEST_TIMEOUT * 2); //We need a bit more time for these tests.

                    async function test() {
                        const appConfig = getAppConfig();
                        const finA = await launchAndConnect();
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

                    test().catch(() => cleanOpenRuntimes());
                });
            });

        });

        describe('Subscribe then launch', function() {
            describe('Window', function() {

                it('should raise bounds-changed', function (done: (value: void) => void) {
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

                    test().catch(() => cleanOpenRuntimes());
                });

                it('should raise hidden', function (done: (value: void) => void) {
                    this.timeout(TEST_TIMEOUT * 2); //We need a bit more time for these tests.

                    async function test() {
                        const appConfig = getAppConfig();
                        const finA = await launchAndConnect();
                        const app = await finA.Application.wrap({ uuid: appConfig.uuid });
                        const win = await app.getWindow();

                        await delayPromise(DELAY_MS);

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

                    test().catch(() => cleanOpenRuntimes());
                });

            });
        });
    });

});
