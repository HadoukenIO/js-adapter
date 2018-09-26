/* tslint:disable:no-invalid-this no-function-expression insecure-random mocha-no-side-effect-code no-empty max-func-body-length */
import { conn } from './connect';
import { Fin } from '../src/main';
import * as assert from 'assert';
import { delayPromise } from './delay-promise';
import { launchAndConnect, cleanOpenRuntimes, DELAY_MS, TEST_TIMEOUT, getRuntimeProcessInfo } from './multi-runtime-utils';

describe.skip('Multi Runtime', function () {
    let fin: Fin;

    this.retries(2);
    this.slow(TEST_TIMEOUT / 2 );
    this.timeout(TEST_TIMEOUT);

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
        return await cleanOpenRuntimes();
    });

    describe('System', function () {

        describe('getAllApplications', function () {
            it('should return the application information from all runtimes', async function() {
                this.timeout(TEST_TIMEOUT);

                const appConfigA = getAppConfig();
                const appConfigB = getAppConfig();
                const appConfigC = getAppConfig();
                const appConfigD = getAppConfig();

                const [finA, finB, finC] = await Promise.all([launchAndConnect(), launchAndConnect(), launchAndConnect()]);
                await delayPromise(DELAY_MS);

                const [appA, appB, appC, appD] = await Promise.all([finA.Application.create(appConfigA),
                finB.Application.create(appConfigB),
                finB.Application.create(appConfigC),
                finC.Application.create(appConfigD)]);

                await Promise.all([appA.run(), appB.run(), appC.run(), appD.run()]);

                const allApplications = await finA.System.getAllApplications();
                const allUuids = allApplications.map((app: any) => app.uuid);
                assert.ok(allUuids.includes(appConfigA.uuid) &&
                    allUuids.includes(appConfigB.uuid) &&
                    allUuids.includes(appConfigC.uuid) &&
                    allUuids.includes(appConfigD.uuid),
                    `Expected Applications to include the following Uuids: "${appConfigA.uuid}",
                           ${ appConfigB.uuid}, ${appConfigC.uuid}, ${appConfigD.uuid}, instead the array looks like: ${allUuids}`);
                return allApplications;
            });
        });

        describe('getAllExternalApplications', function () {
            it('should return the external application information from all runtimes', async function() {
                this.timeout(TEST_TIMEOUT);

                const conns = await Promise.all([launchAndConnect(), launchAndConnect(), launchAndConnect()]);
                const finA = conns[0];
                await delayPromise(DELAY_MS);

                const connStrings = conns.map(f => {
                    const conn = getRuntimeProcessInfo(f);
                    return `${conn.version}/${conn.port}/${conn.realm}`;
                });
                // Does not include the runtime it is called from as an External Application
                connStrings.shift();

                const allExternalApplications = await finA.System.getAllExternalApplications();
                const allUuids = allExternalApplications.map((app: any) => app.uuid);

                assert.ok(connStrings.every(str => allUuids.includes(str)),
                    `Expected External Applications to include the following Uuids: "${connStrings}",
                          instead the array looks like: ${allUuids}`);
                return allExternalApplications;
            });
        });

        describe('getAllWindows', function () {
            it('should return the window information from all runtimes', async function() {
                this.timeout(TEST_TIMEOUT);

                const appConfigA = getAppConfig();
                const appConfigB = getAppConfig();
                const appConfigC = getAppConfig();
                const appConfigD = getAppConfig();
                const [finA, finB, finC] = await Promise.all([launchAndConnect(), launchAndConnect(), launchAndConnect()]);
                await delayPromise(DELAY_MS);

                const [appA, appB, appC, appD] = await Promise.all([finA.Application.create(appConfigA),
                finB.Application.create(appConfigB),
                finB.Application.create(appConfigC),
                finC.Application.create(appConfigD)]);

                await Promise.all([appA.run(), appB.run(), appC.run(), appD.run()]);

                const allWindows = await finA.System.getAllWindows();
                const allUuids = allWindows.map((app: any) => app.uuid);
                const mainWins = allWindows.map((app: any) => app.mainWindow.name);

                // DO I need to check childWindows?  I think tests for call itself should suffice... >>>>>>>>
                assert.ok(allUuids.includes(appConfigA.uuid) &&
                    allUuids.includes(appConfigB.uuid) &&
                    allUuids.includes(appConfigC.uuid) &&
                    allUuids.includes(appConfigD.uuid) &&
                    mainWins.includes(appConfigA.uuid) &&
                    mainWins.includes(appConfigB.uuid) &&
                    mainWins.includes(appConfigC.uuid) &&
                    mainWins.includes(appConfigD.uuid),
                    `Expected Windows to include the following Uuids: "${appConfigA.uuid}, ${appConfigB.uuid},
                            ${ appConfigC.uuid}, ${appConfigD.uuid}, instead the array has these UUIDs: ${allWindows}`);
                return allWindows;
            });
        });

        describe('getProcessList', function () {
            it('should return the process information from all runtimes', async function() {
                this.timeout(TEST_TIMEOUT);

                const appConfigA = getAppConfig();
                const appConfigB = getAppConfig();
                const appConfigC = getAppConfig();
                const appConfigD = getAppConfig();
                const [finA, finB, finC] = await Promise.all([launchAndConnect(), launchAndConnect(), launchAndConnect()]);
                await delayPromise(DELAY_MS);

                const [appA, appB, appC, appD] = await Promise.all([finA.Application.create(appConfigA),
                finB.Application.create(appConfigB),
                finB.Application.create(appConfigC),
                finC.Application.create(appConfigD)]);

                await Promise.all([appA.run(), appB.run(), appC.run(), appD.run()]);

                const allProcesses = await finA.System.getProcessList();
                const allUuids = allProcesses.map((app: any) => app.uuid);
                assert.ok(allUuids.includes(appConfigA.uuid) &&
                    allUuids.includes(appConfigB.uuid) &&
                    allUuids.includes(appConfigC.uuid) &&
                    allUuids.includes(appConfigD.uuid),
                    `Expected process list to include the following Uuids: "${appConfigA.uuid}", ${appConfigB.uuid},
                            ${ appConfigC.uuid}, ${appConfigD.uuid}, instead the array has these: ${allUuids}`);
                return allProcesses;
            });
        });
    });
});
