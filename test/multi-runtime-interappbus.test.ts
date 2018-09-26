/* tslint:disable:no-invalid-this no-function-expression insecure-random mocha-no-side-effect-code no-empty max-func-body-length */
import { conn } from './connect';
import { Fin } from '../src/main';
import * as assert from 'assert';
import { delayPromise } from './delay-promise';
import { cleanOpenRuntimes, DELAY_MS, TEST_TIMEOUT, launchAndConnect } from './multi-runtime-utils';

describe.skip('Multi Runtime', function () {
    let fin: Fin;

    this.retries(2);
    this.slow(TEST_TIMEOUT / 2 );
    this.timeout(TEST_TIMEOUT);

    before(async () => {
        fin = await conn();
    });

    beforeEach(async function () {
        return await cleanOpenRuntimes();
    });

    describe('InterApplicationBus', function () {
        it('should subscribe to * and publish', function (done: any) {

            async function test() {
                const [finA, finB] = await Promise.all([launchAndConnect(), launchAndConnect()]);
                const topic = 'my-topic';
                const data = 'hello';

                await delayPromise(DELAY_MS);

                await finA.InterApplicationBus.subscribe({ uuid: '*' }, topic, (message: any, source: any) => {
                    assert.equal(finB.me.uuid, source.uuid, 'Expected source to be runtimeB');
                    assert.equal(data, message, 'Expected message to be the data sent');
                    done();
                });
                await delayPromise(DELAY_MS);
                return await finB.InterApplicationBus.publish('my-topic', data);
            }

            test().catch(err => {
                cleanOpenRuntimes().then(done(err));
            });
        });

        it('should subscribe to a uuid and publish', function (done: any) {

            async function test() {
                const [finA, finB] = await Promise.all([launchAndConnect(), launchAndConnect()]);
                const topic = 'my-topic';
                const data = 'hello';

                await delayPromise(DELAY_MS);

                await finA.InterApplicationBus
                    .subscribe({ uuid: finB.me.uuid }, topic, (message: any, source: any) => {
                        assert.equal(finB.me.uuid, source.uuid, 'Expected source to be runtimeB');
                        assert.equal(data, message, 'Expected message to be the data sent');
                        done();
                    });
                await delayPromise(DELAY_MS);
                await finB.InterApplicationBus.publish(topic, data);
            }

            test().catch(err => {
                cleanOpenRuntimes().then(done(err));
            });
        });

        it('should subscribe to * and send', function (done: any) {

            async function test() {
                const [finA, finB] = await Promise.all([launchAndConnect(), launchAndConnect()]);
                const topic = 'my-topic';
                const data = 'hello';

                await delayPromise(DELAY_MS);

                await finA.InterApplicationBus.subscribe({ uuid: '*' }, topic, (message: any, source: any) => {
                    assert.equal(finB.me.uuid, source.uuid, 'Expected source to be runtimeB');
                    assert.equal(data, message, 'Expected message to be the data sent');
                    done();
                });
                await delayPromise(DELAY_MS);
                return await finB.InterApplicationBus.send({ uuid: finA.me.uuid }, topic, data);

            }

            test().catch(err => {
                cleanOpenRuntimes().then(done(err));
            });
        });

        it('should subscribe to uuid and send', function (done: any) {

            async function test() {
                const [finA, finB] = await Promise.all([launchAndConnect(), launchAndConnect()]);
                const topic = 'my-topic';
                const data = 'hello';

                await delayPromise(DELAY_MS);

                await finA.InterApplicationBus.subscribe({ uuid: finB.me.uuid },
                    topic, (message: any, source: any) => {
                        assert.equal(finB.me.uuid, source.uuid, 'Expected source to be runtimeB');
                        assert.equal(data, message, 'Expected message to be the data sent');
                        done();
                    });

                await delayPromise(DELAY_MS);

                await finB.InterApplicationBus.send({ uuid: finA.me.uuid }, topic, data);
            }

            test().catch(err => {
                cleanOpenRuntimes().then(done(err));
            });
        });

        it('should get subscriberAdded Events', function (done: any) {

            async function test() {
                const [finA, finB] = await Promise.all([launchAndConnect(), launchAndConnect()]);
                const topic = 'my-topic';
                const expectedUuid = finB.me.uuid;

                await delayPromise(DELAY_MS);

                await finA.InterApplicationBus.on('subscriber-added', (sub: any, b: any) => {
                    assert.equal(expectedUuid, sub.uuid, 'Expected UUIDs to match');
                    assert.equal(sub.topic, topic, 'Expected topics to match');
                    done();
                });
                await delayPromise(DELAY_MS);
                return await finB.InterApplicationBus.subscribe({ uuid: finA.me.uuid }, 'my-topic', function () { });
            }

            test().catch(err => {
                cleanOpenRuntimes().then(done(err));
            });
        });

        it('should get subscriberRemoved Events', function (done: any) {

            async function test() {
                const [finA, finB] = await Promise.all([launchAndConnect(), launchAndConnect()]);
                const topic = 'my-topic';
                const expectedUuid = finB.me.uuid;

                await delayPromise(DELAY_MS);

                await finA.InterApplicationBus.on('subscriber-removed', (sub: any, b: any) => {
                    assert.equal(expectedUuid, sub.uuid, 'Expected UUIDs to match');
                    assert.equal(sub.topic, topic, 'Expected topics to match');
                    done();
                });

                function listener() { }
                await finB.InterApplicationBus.subscribe({ uuid: finA.me.uuid }, topic, listener);
                await delayPromise(DELAY_MS);
                await finB.InterApplicationBus.unsubscribe({ uuid: finA.me.uuid }, topic, listener);
            }

            test().catch(err => {
                cleanOpenRuntimes().then(done(err));
            });
        });
    });

});
