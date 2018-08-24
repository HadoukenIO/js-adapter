/* tslint:disable:no-invalid-this no-function-expression insecure-random mocha-no-side-effect-code no-empty */
import * as assert from 'assert';
import { cleanOpenRuntimes, launchAndConnect, TEST_TIMEOUT, DELAY_MS } from './multi-runtime-utils';
import { delayPromise } from './delay-promise';
import * as fs from 'fs';
import * as path from 'path';
import * as sinon from 'sinon';
import { conn } from './connect';
import Fin from '../src/api/fin';

describe ('Multi Runtime Channels', function() {
    this.retries(2);
    this.slow(TEST_TIMEOUT / 2 );
    this.timeout(TEST_TIMEOUT);

    let fin: Fin;
    const appConfig = JSON.parse(fs.readFileSync(path.resolve('test/app.json')).toString());

    before(async () => {
        fin = await conn();
    });

    beforeEach(async () => {
        return await cleanOpenRuntimes();
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
                const [finA, finB] = await Promise.all([launchAndConnect(), launchAndConnect()]);
                const provider = await finB.InterApplicationBus.Channel.create('test-ext-provider');
                provider.register('test', () => {
                    spy();
                    return 'return-test';
                });
                provider.onConnection(c => {
                    spy();
                });
                const client = await finA.Application.create(clientConfig);
                await client.run();
                await delayPromise(DELAY_MS);
                await finA.InterApplicationBus.subscribe({uuid: 'channel-client-test'}, 'return', (msg: any) => {
                    assert.ok(spy.calledTwice, 'Did not get IAB from dispatch');
                    assert.equal(msg, 'return-test');
                    done();
                });
                await finB.InterApplicationBus.publish('start', 'test-ext-provider');
            }
            test().catch(() => cleanOpenRuntimes());
        });
    });

    describe('Multi Runtime with External Client', function () {

        it('Should work in multi runtime with an External Client', function(done: any) {
            const url = appConfig.startup_app.url;
            const newUrl = url.slice(0, url.lastIndexOf('/')) + '/service.html';

            const providerConfig = {
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
                const [finA, finB] = await Promise.all([launchAndConnect(), launchAndConnect()]);
                const provider = await finA.Application.create(providerConfig);
                await provider.run();
                await delayPromise(DELAY_MS);
                const client = await finB.InterApplicationBus.Channel.connect('test');
                client.register('multi-runtime-test', (r: string) => {
                    assert.equal(r, 'return-mrt', 'wrong payload sent from provider');
                    done();
                });
                client.dispatch('test').then(res => {
                    assert.equal(res, 'return-test', 'wrong return payload from service');
                });
            }
            test().catch(() => cleanOpenRuntimes());
        });
    });

    describe('Multi Runtime getAllChannels', function () {

        it('Should get all channels from across multiple runtimes', function(done: any) {
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
                const [finA, finB] = await Promise.all([launchAndConnect(), launchAndConnect()]);
                const service = await finA.Application.create(serviceConfig);
                await service.run();
                await finB.InterApplicationBus.Channel.create('getAllChannels-multi-runtime');
                await delayPromise(DELAY_MS * 3);
                const allChannels = await fin.InterApplicationBus.Channel.getAllChannels();
                assert.equal(allChannels.length, 2, `expected 2 channels in allChannels: ${JSON.stringify(allChannels)}`);
                done();
            }
            test().catch(() => cleanOpenRuntimes());
        });
    });

    describe('Multi Runtime connect before channel creation with wait', function () {

        it('Should be able to connect before channel creation', function(done: any) {
            const url = appConfig.startup_app.url;
            const newUrl = url.slice(0, url.lastIndexOf('/')) + '/service.html';

            const serviceConfig = {
                'name': 'channel-provider-mrtest',
                'url': newUrl,
                'uuid': 'channel-provider-mrtest',
                'autoShow': true,
                'saveWindowState': false,
                'nonPersistent': true,
                'experimental': {
                    'v2Api': true
                }
            };

            async function test() {
                const [finA, finB] = await Promise.all([launchAndConnect(), launchAndConnect()]);
                finB.InterApplicationBus.Channel.connect('test')
                .then((c) => {
                    c.register('multi-runtime-test', (r: string) => {
                        assert.equal(r, 'return-mrt', 'wrong payload sent from service');
                        done();
                    });
                    c.dispatch('test').then((res: any) => {
                        assert.equal(res, 'return-test', 'wrong return payload from service');
                    });
                });
                await delayPromise(DELAY_MS * 2);
                const service = await finA.Application.create(serviceConfig);
                await service.run();
            }
            test().catch(() => cleanOpenRuntimes());
        });
    });

    describe('Multi Runtime two channel with same name', function () {

        it('Should not be able to create two channels with the same name', function(done: any) {
            async function test() {
                const [finA, finB] = await Promise.all([launchAndConnect(), launchAndConnect()]);
                await delayPromise(DELAY_MS);
                try {
                    await finA.InterApplicationBus.Channel.create('mr-channel-name-test');
                    await finB.InterApplicationBus.Channel.create('mr-channel-name-test');
                } catch {
                    assert(true, 'no error on second channel creation');
                    done();
                }
                assert(false, 'no error on second channel creation');
                done();
            }
            test().catch(() => cleanOpenRuntimes());
        });
    });
});
