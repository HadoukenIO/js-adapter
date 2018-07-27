/* tslint:disable:no-invalid-this no-function-expression insecure-random mocha-no-side-effect-code no-empty */
import * as assert from 'assert';
import { cleanOpenRuntimes, DELAY_MS, TEST_TIMEOUT } from './multi-runtime-utils';
import { conn } from './connect';
import { delayPromise } from './delay-promise';
import { Fin } from '../src/main';
import * as fs from 'fs';
import * as path from 'path';
import * as sinon from 'sinon';

describe ('External Services', function() {
    let fin: Fin;
    const appConfig = JSON.parse(fs.readFileSync(path.resolve('test/app.json')).toString());
    this.timeout(TEST_TIMEOUT / 4);

    beforeEach(async () => {
        await cleanOpenRuntimes();
        fin = await conn();
    });

    after(async () => {
        const apps = await fin.System.getAllApplications();
        await Promise.all(apps.map(a => {
            const { uuid } = a;
            return fin.Application.wrap({uuid}).then(app => app.close());
        }));
    });

    describe('External Provider', function () {

        it('Should be able to register as Provider', function(done: any) {
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
                const provider = await fin.InterApplicationBus.Channel.create();
                provider.register('test', () => {
                    spy();
                    return 'return-test';
                });
                provider.onConnection(c => {
                    spy();
                });
                const client = await fin.Application.create(clientConfig);
                await client.run();
                const listener = (msg: any) => {
                    assert(spy.calledTwice && msg === 'return-test', 'Did not get IAB from dispatch');
                    fin.InterApplicationBus.unsubscribe({uuid: 'service-client-test'}, 'return', listener);
                    done();
                };
                await fin.InterApplicationBus.subscribe({uuid: 'service-client-test'}, 'return', listener);
                await delayPromise(DELAY_MS);
                await fin.InterApplicationBus.publish('start', 'hi');
                await delayPromise(DELAY_MS);
            }
            test();
        });

    });

    describe('External Client', function () {

        it('Should be able to connect as Client', function(done: any) {

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
                const service = await fin.Application.create(serviceConfig);
                await service.run();
                const client = await fin.InterApplicationBus.Channel.connect({uuid: 'service-provider-test'});
                client.dispatch('test').then(res => {
                    assert(res === 'return-test');
                    done();
                });
            }
            test();
        });
    });
});
