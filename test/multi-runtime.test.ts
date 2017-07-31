import * as assert from 'assert';
import { launchAndConnect, cleanOpenRuntimes } from './multi-runtime-utils';

describe('multi runtime', function() {

    // tslint:disable-next-line no-function-expression
    afterEach(function(done: Function) {
        cleanOpenRuntimes().then(() => done());
    });

    // tslint:disable-next-line no-function-expression
    it('should fire listener on remote runtime', function(done: Function)  {
        // tslint:disable-next-line no-invalid-this
        this.timeout(60000);
        Promise.all([launchAndConnect(), launchAndConnect()]).then((conns: any) => {
            const [{appConfig: {startup_app: {uuid}}},
                   {fin}] = conns;

            // give the initial runtime app a bit to complete spinup
            setTimeout(() => {
                fin.Window.wrap({uuid, name: uuid}).once('bounds-changed', () => {
                    assert(true);
                    done();
                });
                fin.Window.wrap({uuid, name: uuid}).moveBy(500, 500);
            }, 3000);

        });
    });

    // tslint:disable-next-line no-function-expression
    it('should quickly launch and connect to multiple runtimes', function(done: Function)  {
        // tslint:disable-next-line no-invalid-this
        this.timeout(120000);
        Promise.all([launchAndConnect(), launchAndConnect(), launchAndConnect(), launchAndConnect()]).then((conns: any) => {
            // give the initial runtime app a bit to complete spinup
            setTimeout(() => {
                conns[0].fin.System.getAllExternalApplications().then((apps: any) => {
                    try {
                        //We need to +1 because node-adapter is connected.
                        const expected = conns.length + 1;
                        assert.equal(apps.length, expected , 'Expected connections to match external applications');
                        done();
                    } catch (err) {
                        done(err);
                    }
                });
            }, 5000);
        });
    });

    it('should not connect to non --enable-mesh realms', function(done: Function) {
        const args = ['--security-realm=supersecret'];

        // tslint:disable-next-line no-invalid-this
        this.timeout(120000);
        Promise.all([launchAndConnect(undefined, undefined, true, args), launchAndConnect()]).then((conns: any) => {

            setTimeout(() => {
                conns[0].fin.System.getAllExternalApplications().then((apps: any) => {
                    try {
                        //Expect only the node adapter to be connected.
                        const expected = conns.length - 1;
                        assert.equal(apps.length, expected , 'Expected connections to match external applications');
                        done();
                    } catch (err) {
                        done(err);
                    }
                }).catch((err: Error) => {
                    // tslint:disable-next-line
                    console.log(err);
                });
            }, 5000);

        });
    });

    it('should connect to --enable-mesh realms', function(done: Function) {
        const args = [
            '--security-realm=supersecret2',
            '--enable-mesh',
            '--enable-multi-runtime'
        ];

        // tslint:disable-next-line no-invalid-this
        this.timeout(120000);
        Promise.all([launchAndConnect(undefined, undefined, true, args), launchAndConnect()]).then((conns: any) => {

            setTimeout(() => {
                conns[0].fin.System.getAllExternalApplications().then((apps: any) => {
                    try {
                        //Expect only the node adapter to be connected.
                        const expected = conns.length + 1;
                        assert.equal(apps.length, expected , 'Expected connections to match external applications');
                        done();
                    } catch (err) {
                        done(err);
                    }
                }).catch((err: Error) => {
                    // tslint:disable-next-line
                    console.log(err);
                });
            }, 5000);

        });
    });

});
