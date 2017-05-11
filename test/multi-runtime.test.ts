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
    it('shoudl quickly launch and connect to multiple runtimes', function(done: Function)  {
        // tslint:disable-next-line no-invalid-this
        this.timeout(120000);
        Promise.all([launchAndConnect(), launchAndConnect(), launchAndConnect(),
                     launchAndConnect(), launchAndConnect(), launchAndConnect()]).then((conns: any) => {

                         // give the initial runtime app a bit to complete spinup
                         setTimeout(() => {
                             conns[2].fin.System.getAllExternalApplications().then((apps: any) => {
                                 try {
                                     assert(conns.length <= apps.length, 'Expected connections to match external applications');
                                     done();
                                 } catch (err) {
                                     done(err);
                                 }
                             });
                         }, 3000);
        });
    });

});
