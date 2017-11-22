import { conn } from './connect';
import { Fin, Application } from '../src/main';
import * as assert from 'assert';
import * as path from 'path';

describe('Application.', () => {
    let fin: Fin;
    let testApp: Application;

    const appConfigTemplate = {
        name: 'adapter-test-app',
        url: 'about:blank',
        uuid: 'adapter-test-app',
        autoShow: true,
        accelerator: {
            devtools: true
        }
    };

    before(() => conn().then((a: Fin) => fin = a));

    beforeEach(() => {
        return fin.Application.create(appConfigTemplate).then(a => {
            testApp = a;
            return testApp.run();
        });
    });

    afterEach(() => testApp.close());

    describe('isRunning()', () => {

        it('Fulfilled', (done) => {
            testApp.isRunning().then(data => {
                assert(data === true);
                return done();
            });
        });
    });

    describe('close()', () => {
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

    describe('getGroups()', () => {

        it('Fulfilled', () => testApp.getGroups().then(data => assert(data instanceof Array)));
    });

    describe('getParentUuid()', () => {

        it('Fulfilled', () => {
            return testApp.getParentUuid().then(data => assert(data === fin.me.uuid));
        });
    });

    describe('getShortcuts()', () => {

        it('Fulfilled', () => fin.Application.createFromManifest(path.resolve('test/app.json'))
            .then(app => {
            return app.getShortcuts().then(data => {
                assert(typeof(data.desktop) === 'boolean');
                assert(typeof(data.startMenu) === 'boolean');
                assert(typeof(data.systemStartup) === 'boolean');
            });
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

    describe('registerCustomData()', () => {

        const customData = {
            userId: 'mockUser',
            organization: 'mockOrg'
        };

        it('Fulfilled', () => testApp.registerCustomData(customData).then(data => assert(true)));
    });

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

        after((done) => {
            appToClose.close().then(done);
        });

        it('Fulfilled', () => {
            return fin.Application.create(appToCloseConfig).then(a => {
                appToClose = a;
                return appToClose.run().then(() => appToClose.isRunning().then(data => assert(data === true)));
            });
        });
    });

    describe('setShortcuts()', () => {

        it('Fulfilled', () => fin.Application.createFromManifest(path.resolve('test/app.json'))
            .then(app => {
                app.setShortcuts({
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
});
