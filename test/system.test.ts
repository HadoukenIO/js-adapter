import { conn } from './connect';
import { Fin } from '../src/main';
import * as assert from 'assert';
import { cleanOpenRuntimes } from './multi-runtime-utils';
import { ExternalProcessRequestType, ExitCode } from '../src/api/system/external-process';
import { ExternalWindow } from '../src/api/external-window/external-window';

describe('System.', function () {
    let fin: Fin;
    // tslint:disable-next-line
    this.timeout(30000);

    before(async () => {
        await cleanOpenRuntimes();
        fin = await conn();
    });

    describe('getVersion()', () => {

        it('Fulfilled', () => fin.System.getVersion().then(() => assert(true)));
    });

    describe('clearCache()', () => {
        const clearCacheOptions = {
            appcache: true,
            cache: true,
            cookies: true,
            localStorage: true
        };
        it('Fulfilled', () => fin.System.clearCache(clearCacheOptions).then(() => assert(true)));
    });

    describe('deleteCacheOnExit()', () => {

        it('Fulfilled', () => fin.System.deleteCacheOnExit().then(() => assert(true)));
    });

    describe('downloadAsset()', () => {
        it('should fail', async () => {
            const appAsset = {
                src: 'http://localhost:8698/assets.zip',
                alias: 'dirApp',
                version: '1.23.24',
                target: 'assets/run.bat'
            };
            try {
                // tslint:disable-next-line
                await fin.System.downloadAsset(appAsset, () => {});
            } catch (err) {
                assert.ok(err instanceof Error, 'Expected error thrown to be an instance of Error');
                assert.equal(err.message, 'downloadAsset only supported in an OpenFin Render process',
                             'Expected error messages to match');
            }

        });
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

    describe('downloadRuntime()', () => {
        it('should fail', async () => {
            const runtimeInfo = { version: '9.61.35.1' };

            try {
                // tslint:disable-next-line
                await fin.System.downloadRuntime(runtimeInfo, () =>{});
            } catch (err) {
                assert.ok(err instanceof Error, 'Expected error thrown to be an instance of Error');
                assert.equal(err.message, 'downloadRuntime only supported in an OpenFin Render process',
                             'Expected error messages to match');
            }
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

    describe('getCrashReporterState()', () => {

        it('Fulfilled', () => fin.System.getCrashReporterState().then(state => {
            assert(typeof(state.diagnosticMode) === 'boolean');
            assert(typeof(state.isRunning) === 'boolean');
        }));
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

    describe('getMachineId()', () => {

        it('Fulfilled', () => fin.System.getMachineId().then(() => assert(true)));
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

    describe('getRuntimeInfo()', () => {

        it('Fulfilled', () => fin.System.getRuntimeInfo().then(runtimeInfo => {
            assert(typeof (runtimeInfo) === 'object');
        }));
    });

    describe('getRuntimeInfo()', () => {

        it('has args as part of the Runtime Info Object', () => fin.System.getRuntimeInfo().then(runtimeInfo => {
            assert(typeof (runtimeInfo.args) === 'object');
        }));
    });

    describe('launchExternalProcess()', () => {
        it('Fulfilled', (done) => {
            const processOptions: ExternalProcessRequestType = {
                path: 'notepad',
                arguments: '',
                listener: (result: ExitCode) => {
                    assert(result.topic === 'exited', 'Expected topic is "exited"');
                    assert(result.exitCode === 0);
                    done();
                }
            };

            fin.System.launchExternalProcess(processOptions).then(identity => {
                fin.System.terminateExternalProcess({ uuid: identity.uuid, timeout: 1000, killTree: true});
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

    describe('startCrashReporter()', () => {

        it('Fulfilled', () => fin.System.startCrashReporter({diagnosticMode: true}).then(reporter => {
            assert(typeof(reporter.diagnosticMode) === 'boolean');
            assert(typeof(reporter.isRunning) === 'boolean');
        }));
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

    describe('getAllExternalWindows()', () => {
        it('should not include uuids for unregistered windows', async () => {
            const externalWindows = await fin.System.getAllExternalWindows();
            const windowWithUuid = externalWindows.find(win => !!win.uuid);
            assert(!windowWithUuid);
        });
        it('should include uuids for registered windows', (done) => {
            let listener: (externalWindowInfo: any) => void;
            let wrapped: ExternalWindow;
            let timeout: NodeJS.Timer;
            const cleanup = async () => {
                clearTimeout(timeout);
                if (wrapped) {
                    wrapped.close();
                }
                fin.System.removeListener('external-window-shown', listener);
            };
            const runTest = () => {
                // Returning a promise because Mocha tests will not fail gracefully if our
                // assert fails in an event listener.
                return new Promise(async (resolve, reject) => {
                    const uuid = 'trev';
                    listener = async (externalWindowInfo: any) => {
                        if (externalWindowInfo.uuid === uuid) {
                            wrapped = await fin.ExternalWindow.wrap(externalWindowInfo);
                            const externalWindows = await fin.System.getAllExternalWindows();
                            const uuidFound = !!externalWindows.find(win => win.uuid === uuid);
                            resolve(uuidFound);
                        }
                    };
                    await fin.System.addListener('external-window-shown', listener);
                    await fin.System.launchExternalProcess({ path: 'notepad', uuid });
                    timeout = setTimeout(async () => {
                        await cleanup();
                        assert(false, '"external-window-shown" event did not fire');
                        done();
                    }, 3000);
                });
            };
            runTest()
            .then(async uuidFound => {
                await cleanup();
                assert(uuidFound, 'Failed to find requested uuid assigned to external window');
                done();
            })
            .catch(async err => {
                await cleanup();
                assert(false, err);
                done();
            });
        });
        it('should include nativeId for all windows', async () => {
            const externalWindows = await fin.System.getAllExternalWindows();
            assert(externalWindows.every(win => win.hasOwnProperty('nativeId')));
        });
    });

    describe('resolveUuid()', () => {
        it('should resolve a known uuid', () => fin.System.resolveUuid(fin.me.uuid).then(data => {
            assert(data.uuid === fin.me.uuid, `Expected ${data.uuid} to match ${fin.me.uuid}`);
            assert(data.type === 'external-app', `Expected ${data.type} to be 'external-app'`);
        }));

        it('should fail on a unknown uuid', () => fin.System.resolveUuid('fake_uuid').catch(() => assert(true)));
    });

});
