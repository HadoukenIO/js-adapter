/* tslint:disable:no-invalid-this no-function-expression insecure-random mocha-no-side-effect-code no-empty */
import * as assert from 'assert';
import { cleanOpenRuntimes, launchAndConnect, TEST_TIMEOUT, DELAY_MS } from './multi-runtime-utils';
import { delayPromise } from './delay-promise';
import * as fs from 'fs';
import * as path from 'path';
import * as sinon from 'sinon';

describe ('Multi Runtime Services', function() {
    this.timeout(TEST_TIMEOUT / 4);
    const appConfig = JSON.parse(fs.readFileSync(path.resolve('test/app.json')).toString());

    beforeEach(async () => {
        await cleanOpenRuntimes();
    });

    after(async () => {
        await cleanOpenRuntimes();
    });

    describe('Multi Runtime with External Provider', function () {

        it('Should work in multi runtime with an external Provider', function(done: any) {
            // tslint:disable-next-line no-invalid-this
            const url = appConfig.startup_app.url;
            const newUrl = url.slice(0, url.lastIndexOf('/')) + '/client.html';

            const clientConfig = {
                'name': 'channel-client-test',
                'url': newUrl,
                'uuid': 'channel-client-test',
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
                const provider = await finA.InterApplicationBus.Channel.create();
                provider.register('test', () => {
                    spy();
                    return 'return-test';
                });
                provider.onConnection(c => {
                    spy();
                });
                const client = await fin.Application.create(clientConfig);
                await client.run();
                await delayPromise(DELAY_MS);
                await fin.InterApplicationBus.subscribe({uuid: 'channel-client-test'}, 'return', (msg: any) => {
                    assert.ok(spy.calledTwice, 'Did not get IAB from dispatch');
                    assert.equal(msg, 'return-test');
                    done();
                });
                await finA.InterApplicationBus.publish('start', 'hi');
            }
            test();
        });

    });

    describe('Multi Runtime with External Client', function () {

        it('Should work in multi runtime with an External Client', function(done: any) {
            const url = appConfig.startup_app.url;
            const newUrl = url.slice(0, url.lastIndexOf('/')) + '/service.html';

            const serviceConfig = {
                'name': 'channel-provider-test',
                'url': newUrl,
                'uuid': 'channel-provider-test',
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
                const client = await finA.InterApplicationBus.Channel.connect({uuid: 'channel-provider-test'});
                client.register('multi-runtime-test', (r: string) => {
                    assert.equal(r, 'return-mrt', 'wrong payload sent from service');
                    done();
                });
                client.dispatch('test').then(res => {
                    assert.equal(res, 'return-test', 'wrong return payload from service');
                });

            }
            test();
        });
    });

    describe('Multi Runtime getAllChannels', function () {

        it('Should get all channels from across multiple runtimes', function() {
            const url = appConfig.startup_app.url;
            const newUrl = url.slice(0, url.lastIndexOf('/')) + '/service.html';

            const serviceConfig = {
                'name': 'channel-provider-test',
                'url': newUrl,
                'uuid': 'channel-provider-test',
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
                await finA.InterApplicationBus.Channel.create('test-channel-multi-runtime');
                const allChannels = await fin.InterApplicationBus.Channel.getAllChannels();
                console.error(allChannels);
                assert.equal(allChannels.length, 3, `expected 2 channels in allChannels: ${allChannels}`);
            }
            test();
        });
    });
});
