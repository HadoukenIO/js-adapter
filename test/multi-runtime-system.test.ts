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
        appConfigTemplate.uuid += Math.floor(Math.random() * 10000);
        return appConfigTemplate;
    }

    afterEach(async () => {
        return await cleanOpenRuntimes();
    });

    describe('System', () => {

        describe('getAllApplications', () => {
            it('should return the application information from all runtimes', async function () {
                // tslint:disable-next-line no-invalid-this
                this.timeout(15000);

                const appConfigA = getAppConfig();
                const appConfigB = getAppConfig();
                const appConfigC = getAppConfig();
                const appConfigD = getAppConfig();
                const conns = await Promise.all([launchAndConnect(), launchAndConnect(), launchAndConnect()]);
                // Why delay here?
                await delayPromise(DELAY_MS);

                const [runtimeA, runtimeB, runtimeC] = conns;

                const [appA, appB, appC, appD] = await Promise.all([runtimeA.fin.Application.create(appConfigA),
                                                runtimeB.fin.Application.create(appConfigB),
                                                runtimeB.fin.Application.create(appConfigC),
                                                runtimeC.fin.Application.create(appConfigD)]);

                await Promise.all([appA.run(), appB.run(), appC.run(), appD.run()]);

                const allApplications = await runtimeA.fin.System.getAllApplications();
                const allUuids = allApplications.map((app: any) => app.uuid);
                assert.ok(allUuids.includes(appConfigA.uuid) &&
                          allUuids.includes(appConfigB.uuid) &&
                          allUuids.includes(appConfigC.uuid) &&
                          allUuids.includes(appConfigD.uuid),
                           `Expected Applications to include the following Uuids: "${ appConfigA.uuid }",
                           ${ appConfigB.uuid }, ${ appConfigC.uuid }, ${ appConfigD.uuid }, instead the array looks like: ${allUuids}`);
                return allApplications;
            });
        });

        describe('getAllExternalApplications', () => {
            it('should return the external application information from all runtimes', async function () {
                // tslint:disable-next-line no-invalid-this
                this.timeout(TEST_TIMEOUT);

                const conns = await Promise.all([launchAndConnect(), launchAndConnect(), launchAndConnect()]);
                await delayPromise(DELAY_MS);

                const [runtimeA] = conns;
                const connStrings = conns.map(conn => `${conn.version}/${conn.port}/${conn.realm}`);
                // Does not include the runtime it is called from as an External Application
                connStrings.shift();

                const allExternalApplications = await runtimeA.fin.System.getAllExternalApplications();
                const allUuids = allExternalApplications.map((app: any) => app.uuid);

                assert.ok(connStrings.every(str => allUuids.includes(str)),
                          `Expected External Applications to include the following Uuids: "${ connStrings }",
                          instead the array looks like: ${allUuids}`);
                return allExternalApplications;
            });
        });

        describe('getAllWindows', () => {
            it('should return the window information from all runtimes', async function () {
                // tslint:disable-next-line no-invalid-this
                this.timeout(TEST_TIMEOUT);

                const appConfigA = getAppConfig();
                const appConfigB = getAppConfig();
                const appConfigC = getAppConfig();
                const appConfigD = getAppConfig();
                const conns = await Promise.all([launchAndConnect(), launchAndConnect(), launchAndConnect()]);
                // Why delay here?
                await delayPromise(DELAY_MS);

                const [runtimeA, runtimeB, runtimeC] = conns;

                const [appA, appB, appC, appD] = await Promise.all([runtimeA.fin.Application.create(appConfigA),
                                                runtimeB.fin.Application.create(appConfigB),
                                                runtimeB.fin.Application.create(appConfigC),
                                                runtimeC.fin.Application.create(appConfigD)]);

                await Promise.all([appA.run(), appB.run(), appC.run(), appD.run()]);

                const allWindows = await runtimeA.fin.System.getAllWindows();
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
                           `Expected Windows to include the following Uuids: "${ appConfigA.uuid }, ${ appConfigB.uuid },
                            ${ appConfigC.uuid }, ${ appConfigD.uuid }, instead the array has these UUIDs: ${allWindows}`);
                return allWindows;
            });
        });

        describe('getProcessList', () => {
            it('should return the process information from all runtimes', async function () {
                // tslint:disable-next-line no-invalid-this
                this.timeout(TEST_TIMEOUT);

                const appConfigA = getAppConfig();
                const appConfigB = getAppConfig();
                const appConfigC = getAppConfig();
                const appConfigD = getAppConfig();
                const conns = await Promise.all([launchAndConnect(), launchAndConnect(), launchAndConnect()]);
                // Why delay here?
                await delayPromise(DELAY_MS);

                const [runtimeA, runtimeB, runtimeC] = conns;

                const [appA, appB, appC, appD] = await Promise.all([runtimeA.fin.Application.create(appConfigA),
                                                runtimeB.fin.Application.create(appConfigB),
                                                runtimeB.fin.Application.create(appConfigC),
                                                runtimeC.fin.Application.create(appConfigD)]);

                await Promise.all([appA.run(), appB.run(), appC.run(), appD.run()]);

                const allProcesses = await runtimeA.fin.System.getProcessList();
                const allUuids = allProcesses.map((app: any) => app.uuid);
                assert.ok(allUuids.includes(appConfigA.uuid) &&
                            allUuids.includes(appConfigB.uuid) &&
                            allUuids.includes(appConfigC.uuid) &&
                            allUuids.includes(appConfigD.uuid),
                            `Expected process list to include the following Uuids: "${ appConfigA.uuid }", ${ appConfigB.uuid },
                            ${ appConfigC.uuid }, ${ appConfigD.uuid }, instead the array has these: ${allUuids}`);
                return allProcesses;
            });
        });
    });
});