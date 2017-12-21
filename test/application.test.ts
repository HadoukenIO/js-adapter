import { conn } from './connect';
import { Fin, Application } from '../src/main';
import * as assert from 'assert';

// tslint:disable-next-line
describe('Application.', function() {
    let fin: Fin;
    let testApp: Application;
    // tslint:disable-next-line
    this.timeout(30000);

    let counter = 0;
    before(() => conn().then((a: Fin) => {

        fin = a;
    }));

    beforeEach(async () => {
        testApp = await fin.Application.create({
            name: `adapter-test-app-${counter}`,
            url: 'about:blank',
            // tslint:disable-next-line
            uuid: `adapter-test-app____-${counter++}`,
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

        after(() => appToClose.close());

        it('Fulfilled', () => {
            return fin.Application.create(appToCloseConfig).then(a => {
                appToClose = a;
                return appToClose.run().then(() => appToClose.isRunning().then(data => assert(data === true)));
            });
        });
    });

    /*
    describe('setShortcuts()', () => {

        it('Fulfilled', (done) => {
            testApp.setShortcuts({
                desktop: true,
                startMenu: false,
                systemStartup: true
            }).then(() => {
                assert(true);
                return done();
            });
        });
    });
    */

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
