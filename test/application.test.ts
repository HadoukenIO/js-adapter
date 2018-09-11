import { conn } from './connect';
import { Fin, Application, Window, connect as rawConnect } from '../src/main';
import { cleanOpenRuntimes } from './multi-runtime-utils';
import * as assert from 'assert';
import * as path from 'path';

// tslint:disable-next-line
describe('Application.', function() {
    let fin: Fin;
    let testApp: Application;
    // tslint:disable-next-line
    this.timeout(30000);

    let counter = 0;
    before(async () => {
        await cleanOpenRuntimes();
        fin = await conn();
    });

    beforeEach(async () => {
        testApp = await fin.Application.create({
            name: `adapter-test-app-${counter}`,
            url: 'about:blank',
            // tslint:disable-next-line
            uuid: `adapter-application-test-app-${counter++}`,
            nonPersistent: true,
            autoShow: true,
            accelerator: {
                devtools: true
            }
        });
        await testApp.run();
    });

    afterEach(() => testApp.close());

    describe('isRunning()', () => {

        it('Fulfilled', () => {
            testApp.isRunning().then(data => {
                assert(data === true);
            });
        });
    });

    describe('close()', () => {
        const appToCloseConfig = {
            name: 'adapter-test-app-to-close',
            url: 'about:blank',
            uuid: 'adapter-test-app-to-close',
            autoShow: true,
            nonPersistent: true
        };
        let appToClose: Application;

        before(() => {
            return fin.Application.create(appToCloseConfig).then(a => {
                appToClose = a;
                return appToClose.run();
            });
        });

        it('Fulfilled', (done) => {
            appToClose.close().then(() => appToClose.isRunning()
                .then(data => {
                    assert(data === false);
                    return done();
                }));
        });
    });

    describe('getChildWindows()', () => {

        it('Fulfilled', () => testApp.getChildWindows().then(data => assert(data instanceof Array)));
    });

    describe('getGroups() cross different applications', () => {
        const app2Config = {
            name: 'app3',
            url: 'about:blank',
            uuid: 'app3',
            autoShow: true,
            nonPersistent: true
        };

        let app2Win: Window;
        let testAppWin: Window;
        before(async () => {
            // create a second app
            const app2 = await fin.Application.create(app2Config);
            await app2.run();
            app2Win = await app2.getWindow();
        });

        it('Fulfilled', async () => {
            testAppWin = await testApp.getWindow();
            await app2Win.joinGroup(testAppWin);
            const data = await testApp.getGroups();
            assert(data instanceof Array);
            assert(data[0] instanceof Array);
            assert(data[0].length === 2);
            assert(data[0][0].identity.uuid === app2Config.uuid);
            assert(data[0][1].identity.uuid === testApp.identity.uuid);
        });
    });

    describe('getGroups()', () => {

        it('Fulfilled', () => testApp.getGroups().then(data => assert(data instanceof Array)));
    });

    describe('getParentUuid()', () => {

        it('Fulfilled', () => {
            return testApp.getParentUuid().then(data => assert(data === fin.me.uuid));
        });
    });

    describe.skip('getShortcuts()', () => {
        // need to create an application using manifest url
        let localApp: Application;
        let localFin: Fin;
        before(async () => {
            localFin = await rawConnect({
                uuid: 'test-getshortcuts',
                manifestUrl: path.resolve('test/app.json')});
            localApp = await localFin.Application.wrap({uuid: 'testapp'});
        });

        after(() => localApp.close());

        it('Fulfilled', () => localApp.isRunning()
        .then(() => localApp.getShortcuts())
            .then(data => {
                assert(typeof(data.desktop) === 'boolean');
                assert(typeof(data.startMenu) === 'boolean');
                assert(typeof(data.systemStartup) === 'boolean');
            }));
    });

    describe('getTrayIconInfo()', () => {

       it('Fulfilled', () => testApp.setTrayIcon('http://cdn.openfin.co/assets/testing/icons/circled-digit-one.png')
            .then(() => {
            return testApp.getTrayIconInfo().then(info => {
                assert(typeof(info.x) === 'number');
                assert(typeof(info.y) === 'number');
                assert(typeof(info.bounds) === 'object');
                assert(typeof(info.monitorInfo) === 'object');
            });
        }));
    });
    /*
    describe('registerUser()', () => {

        it('Fulfilled', () => testApp.registerUser('mockUser', 'myApp').then(() => assert(true)));
    });
    */
    describe('removeTrayIcon()', () => {

        it('Fulfilled', () => testApp.removeTrayIcon().then(data => assert(true)));
    });

    describe('run()', () => {

        const appToCloseConfig = {
            name: 'adapter-test-app-to-close',
            url: 'about:blank',
            uuid: 'adapter-test-app-to-close',
            autoShow: true
        };

        let appToClose: Application;

        after(() => appToClose.close());

        it('Fulfilled', () => {
            return fin.Application.create(appToCloseConfig).then(a => {
                appToClose = a;
                return appToClose.run().then(() => appToClose.isRunning().then(data => assert(data === true)));
            });
        });
    });

    describe.skip('setShortcuts()', () => {
        // need to create an application using manifest url
        let localApp: Application;
        let localFin: Fin;
        before(async () => {
            localFin = await rawConnect({
                uuid: 'test-setshortcuts',
                manifestUrl: path.resolve('test/app.json')});
            localApp = await localFin.Application.wrap({uuid: 'testapp'});
        });

        after(() => localApp.close());

        it('Fulfilled', () => localApp.isRunning()
            .then(() => {
                localApp.setShortcuts({
                    desktop: true,
                    startMenu: false,
                    systemStartup: true
                }).then(() => {
                    assert(true);
                });
        }));
    });

    describe('terminate()', () => {

        const appToCloseConfig = {
            name: 'adapter-test-app-to-close',
            url: 'about:blank',
            uuid: 'adapter-test-app-to-close',
            autoShow: true
        };
        let appToClose: Application;

        before(() => {
            return fin.Application.create(appToCloseConfig).then(a => {
                appToClose = a;
                return appToClose.run();
            });
        });

        it('Fulfilled', () => {
            return appToClose.terminate().then(() => appToClose.isRunning().then(data => assert(data === false)));
        });
    });

    describe('getInfo()', () => {

        it('Should contain some information', () => {
            return testApp.getInfo().then(info => {
                const expectedLaunchMode = 'adapter';

                return assert.equal(info.launchMode, expectedLaunchMode, `Expected launchMode to be "${expectedLaunchMode}"`);
            });
        });
    });

    describe('createFromManifest()', () => {

        it('should create and run the app', () => {
            const manifestUrl = path.resolve('test/service-app.json');
            return fin.Application.createFromManifest(manifestUrl).then(app => {
                return app.run().then(() => {
                    return app.isRunning().then(data => {
                        app.close();
                        return assert(data === true);
                    });
                });
            });
        });
    });

    describe('wrapSync()', () => {
        it('exists', () => {
            assert(typeof fin.Application.wrapSync === 'function');
        });

        it('should return Application', () => {
            const returnVal = fin.Application.wrapSync(testApp.identity);
            assert(returnVal instanceof Application);
        });

        it('should return App with matching identity', () => {
            const returnVal = fin.Application.wrapSync(testApp.identity);
            assert.deepEqual(returnVal.identity, testApp.identity);
        });
    });

    describe('getCurrentSync()', () => {
        it('exists', () => {
            assert(typeof fin.Application.getCurrentSync === 'function');
        });

        it('should return Application', () => {
            const returnVal = fin.Application.getCurrentSync();
            assert(returnVal instanceof Application);
        });
    });

    describe('getZoomLevel()', () => {

        it('Fulfilled', () => testApp.getZoomLevel().then(level => assert(level === 0)));  // by default, it's zero.
    });

    describe('setZoomLevel()', () => {

        const zoomLevel = 2;
        it('Fulfilled', async () => {

            await testApp.setZoomLevel(zoomLevel);
            const newZoomLevel = await testApp.getZoomLevel();
            assert(newZoomLevel === zoomLevel);
        });
    });
});
