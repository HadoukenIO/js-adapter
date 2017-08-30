import * as assert from 'assert';
//import { Application } from '../src/main';
import { launchAndConnect, cleanOpenRuntimes } from './multi-runtime-utils';

describe('Multi Runtime', () =>  {
    const appConfigTemplate = {
        name: 'adapter-test-app',
        url: 'about:blank',
        uuid: 'adapter-test-app',
        autoShow: true,
        accelerator: {
            devtools: true
        }
    };
    // tslint:disable-next-line no-function-expression
    afterEach(function(done: Function) {
        cleanOpenRuntimes().then(() => done());
    });

    describe('Application', () => {

        describe('getInfo', () => {
            it('should return the application Information', function (done: Function) {
                // tslint:disable-next-line no-invalid-this
                this.timeout(12000);
                const expectedLaunchMode = 'adapter';

                Promise.all([launchAndConnect(), launchAndConnect()]).then((conns: any) => {
                    setTimeout(() => {
                        const r1 = conns[0];
                        const r2 = conns[1];

                        r2.fin.Application.create(appConfigTemplate).then((app: any) => {
                            app.run().then(() => {
                                r1.fin.Application.wrap({ uuid: appConfigTemplate.uuid }).getInfo().then((info: any) => {
                                    assert.equal(info.launchMode, expectedLaunchMode,
                                                 `Expected launchMode to be "${ expectedLaunchMode }"`);
                                    app.close().then(done);
                                });
                            });
                        });
                    }, 5000);
                });
            });
        });

        describe('getParentUuid', () => {
            it('should return the uuid of the parent adapter connection', function (done: Function) {
                // tslint:disable-next-line no-invalid-this
                this.timeout(12000);
                setTimeout(() => {
                    Promise.all([launchAndConnect(), launchAndConnect()]).then((conns: any) => {
                        setTimeout(() => {
                            const r1 = conns[0];
                            const r2 = conns[1];
                            const expectedUuid = r2.fin.wire.me.uuid;

                            r2.fin.Application.create(appConfigTemplate).then((app: any) => {
                                app.run().then(() => {
                                    r1.fin.Application.wrap({ uuid: appConfigTemplate.uuid }).getParentUuid().then((info: any) => {
                                        assert.equal(info, expectedUuid,
                                                     `Expected uuid to be "${ expectedUuid }"`);
                                        app.close().then(done);
                                    }).catch(done);
                                });
                            });
                        }, 5000);
                    });
                }, 5000);
            });
        });

        describe('isRunning', () => {
            it('should return the running state of an application', function (done: Function) {
                // tslint:disable-next-line no-invalid-this
                this.timeout(12000);
                setTimeout(() => {
                    Promise.all([launchAndConnect(), launchAndConnect()]).then((conns: any) => {
                        setTimeout(() => {
                            const r1 = conns[0];
                            const r2 = conns[1];

                            r2.fin.Application.create(appConfigTemplate).then((app: any) => {
                                app.run().then(() => {
                                    r1.fin.Application.wrap({ uuid: appConfigTemplate.uuid }).isRunning().then((running: boolean) => {
                                        assert.equal(running, true, 'Expected application to be running');
                                        app.close().then(done);
                                    }).catch(done);
                                });
                            });
                        }, 5000);
                    });
                }, 5000);
            });
        });
    });
});
