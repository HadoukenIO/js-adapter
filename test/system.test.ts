import { conn } from './connect';
import { Fin } from '../src/main';
import * as assert from 'assert';

describe('System.', function () {
    let fin: Fin;
    // tslint:disable-next-line
    this.timeout(30000);

    beforeEach(() => {
        return conn().then((a: Fin) => fin = a);
    });

    describe('getVersion()', () => {

        it('Fulfilled', () => fin.System.getVersion().then(() => assert(true)));
    });

    describe('clearCache()', () => {

        it('Fulfilled', () => fin.System.clearCache().then(() => assert(true)));
    });

    describe('deleteCacheOnExit()', () => {

        it('Fulfilled', () => fin.System.deleteCacheOnExit().then(() => assert(true)));
    });

    describe('downloadPreloadScripts()', () => {
        it('should download code from github', async () => {
            const downloadOptions = {
                url: 'http://localhost:8689/download.js'
            };

            const expected = {
                url: downloadOptions.url,
                success: true
            };

            return fin.System.downloadPreloadScripts([downloadOptions]).then(result => {
                return assert.deepEqual(result[0], expected, 'Expected objects to match');
            });
        });

        it('should fail if given a bad url', async () => {
            const downloadOptions = {
                url: 'http://localhost:8689/download.bad.js'
            };

            const expected = {
                url: downloadOptions.url,
                success: false,
                error: 'Error: Failed to download resource. Status code: 404'
            };

            return fin.System.downloadPreloadScripts([downloadOptions]).then(result => {
                return assert.deepEqual(result[0], expected, 'Expected objects to match');
            });
        });
    });

    describe('flushCookieStore', () => {
        it('Fulfilled', () => fin.System.flushCookieStore().then(() => assert(true)));
    });

    describe('getAllWindows()', () => {

        it('Fulfilled', () => fin.System.getAllWindows().then(() => assert(true)));
    });

    describe('getAllApplications()', () => {

        it('Fulfilled', () => fin.System.getAllApplications().then(() => assert(true)));
    });

    describe('getCommandLineArguments()', () => {

        it('Fulfilled', () => fin.System.getCommandLineArguments().then(() => assert(true)));
    });

    describe('getDeviceId()', () => {

        it('Fulfilled', () => fin.System.getDeviceId().then(() => assert(true)));
    });

    describe('getDeviceUserId()', () => {

        it('Fulfilled', () => fin.System.getDeviceUserId().then(id => {
            assert(typeof (id) === 'string');
        }));
    });

    describe('getEntityInfo()', () => {

        it('Fulfilled', () => fin.System.getEntityInfo('testapp', 'OpenfinPOC').then(entity => {
            assert(typeof (entity) === 'object');
        }));
    });

    describe('getEnvironmentVariable()', () => {

        it('Fulfilled', () => fin.System.getEnvironmentVariable('HOME').then(env => assert(true)));
    });

    describe('getFocusedWindow()', () => {

        it('Fulfilled', () => fin.System.getFocusedWindow().then(win => assert(true)));
    });

    describe('getLog()', () => {
        const logOpts = {
            name: 'debug.log'
        };

        it('Fulfilled', () => fin.System.getLog(logOpts).then(() => assert(true)));
    });

    describe('getLogList()', () => {

        it('Fulfilled', () => fin.System.getLogList().then(() => assert(true)));
    });

    describe('getMinLogLevel()', () => {

        it('Fulfilled', () => fin.System.getMinLogLevel().then(level => assert(typeof level === 'string')));
    });

    describe('getMonitorInfo()', () => {

        it('Fulfilled', () => fin.System.getMonitorInfo().then(() => assert(true)));
    });

    describe('getMousePosition()', () => {

        it('Fulfilled', () => fin.System.getMousePosition().then(() => assert(true)));
    });

    describe('getProcessList()', () => {

        it('Fulfilled', () => fin.System.getProcessList().then(() => assert(true)));
    });

    describe('getProxySettings()', () => {

        it('Fulfilled', () => fin.System.getProxySettings().then(() => assert(true)));
    });

    describe('getHostSpecs()', () => {

        it('Fulfilled', () => fin.System.getHostSpecs().then(specs => assert(true)));
    });

    describe('launchExternalProcess()', () => {
        const processOptions = {
            path: 'notepad',
            arguments: '',
            listener: (code: any) => { code = 'a'; }
        };

        it('Fulfilled', (done) => {
            fin.System.launchExternalProcess(processOptions)
                .then(() => {
                    assert(true);
                    return done();
                });
        });
    });

    describe('log()', () => {
        const level = 'info';
        const message = 'log this';

        it('Fulfilled', () => fin.System.log(level, message));
    });

    describe('openUrlWithBrowser()', () => {
        const url = 'http://www.openfin.co';

        it('Fulfilled', (done) => {
            fin.System.openUrlWithBrowser(url)
                .then(() => {
                    assert(true);
                    return done();
                });
        });
    });

    describe('readRegistryValue()', () => {

        it('Fulfilled', () => {
            fin.System.readRegistryValue('HKEY_LOCAL_MACHINE', 'HARDWARE\\DESCRIPTION\\System', 'BootArchitecture')
                .then(val => {
                    assert(typeof val === 'object');
                });
        });
    });

    describe('registerExternalConnection()', () => {

        it('Fulfilled', () => {
            fin.System.registerExternalConnection('testapp')
                .then(data => {
                    assert(typeof data === 'object');
                });
        });
    });

    describe('setMinLogLevel()', () => {

        it('Fulfilled', () => {
            fin.System.setMinLogLevel('info')
                .then(() => {
                    fin.System.getMinLogLevel().then(level => assert(level === 'info'));
                });
        });
    });

    //TODO: Need to start a test app as part of the test setup.
    describe('showDeveloperTools()', () => {
        const identity = {
            uuid: 'testerApp',
            name: 'testerApp'
        };

        it('Fulfilled', () => fin.System.showDeveloperTools(identity)
            .then(() => assert(true)));
    });

    describe('updateProxySettings()', () => {
        const proxySettings = {
            type: 'system',
            proxyAddress: 'address',
            proxyPort: 8080
        };

        it('Fulfilled', () => fin.System.updateProxySettings(proxySettings)
            .then(() => assert(true)));
    });

    describe('getAllExternalApplications()', () => {

        it('Fulfilled', () => fin.System.getAllExternalApplications()
            .then(() => assert(true)));
    });

    describe('resolveUuid()', () => {
        it('should resolve a known uuid', () => fin.System.resolveUuid(fin.me.uuid).then(data => {
            assert(data.uuid === fin.me.uuid, `Expected ${data.uuid} to match ${fin.me.uuid}`);
            assert(data.type === 'external-app', `Expected ${data.type} to be 'external-app'`);
        }));

        it('should fail on a unknown uuid', () => fin.System.resolveUuid('fake_uuid').catch(() => assert(true)));
    });

});
