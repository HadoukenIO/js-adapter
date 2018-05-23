import * as assert from 'assert';
import * as path from 'path';
import { cleanOpenRuntimes, launchAndConnect } from './multi-runtime-utils';
import { delayPromise } from './delay-promise';
import * as sinon from 'sinon';
import * as fs from 'fs';

describe ('Multi Runtime Services', () => {
    beforeEach(async () => {
        await cleanOpenRuntimes();
    });

    after(async () => {
        await cleanOpenRuntimes();
    });

    // tslint:disable-next-line
    describe('Multi Runtime with External Provider', function () {

        it('Should work in multi runtime with an external Provider', function(done: any) {
            // tslint:disable-next-line no-invalid-this
            this.timeout(8000);
            const appConfig = JSON.parse(fs.readFileSync(path.resolve('test/app.json')).toString());
            const url = appConfig.startup_app.url;
            const newUrl = url.slice(0, url.lastIndexOf('/')) + '/client.html';

            const clientConfig = {
                'name': 'service-client-test',
                'url': newUrl,
                'uuid': 'service-client-test',
                'autoShow': true,
                'saveWindowState': false,
                'nonPersistent': true,
                'experimental': {
                    'v2Api': true
                }
            };

            async function test () {
                const spy = sinon.spy();
                const [fin, finA] = await Promise.all([launchAndConnect(), launchAndConnect()]);
                const provider = await finA.Service.register();
                provider.register('test', () => {
                    spy();
                    return 'return-test';
                });
                provider.onConnection(c => {
                    spy();
                });
                const client = await fin.Application.create(clientConfig);
                await client.run();
                await delayPromise(1000);
                await fin.InterApplicationBus.subscribe({uuid: 'service-client-test'}, 'return', (msg: any) => {
                    assert(spy.calledTwice && msg === 'return-test', 'Did not get IAB from dispatch');
                    done();
                });
                await finA.InterApplicationBus.publish('start', 'hi');
            }
            test();
        });

    });

    // tslint:disable-next-line
    describe('Multi Runtime with External Client', function () {

        it('Should work in multi runtime with an External Client', function(done: any) {
            // tslint:disable-next-line no-invalid-this
            this.timeout(8000);
            const appConfig = JSON.parse(fs.readFileSync(path.resolve('test/app.json')).toString());
            const url = appConfig.startup_app.url;
            const newUrl = url.slice(0, url.lastIndexOf('/')) + '/service.html';

            const serviceConfig = {
                'name': 'service-provider-test',
                'url': newUrl,
                'uuid': 'service-provider-test',
                'autoShow': true,
                'saveWindowState': false,
                'nonPersistent': true,
                'experimental': {
                    'v2Api': true
                }
            };

            async function test() {
                const [fin, finA] = await Promise.all([launchAndConnect(), launchAndConnect()]);
                const service = await fin.Application.create(serviceConfig);
                await service.run();
                await delayPromise(1000);
                const client = await finA.Service.connect({uuid: 'service-provider-test'});
                client.register('multi-runtime-test', (r: string) => {
                    assert(r === 'return-mrt', 'wrong payload sent from service');
                    done();
                });
                client.dispatch('test').then(res => {
                    assert(res === 'return-test', 'wrong return payload from service');
                });
            }
            test();
        });
    });
});
