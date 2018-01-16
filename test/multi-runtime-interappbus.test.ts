import * as assert from 'assert';
import { delayPromise } from './delay-promise';
import { cleanOpenRuntimes, DELAY_MS, TEST_TIMEOUT, launchX } from './multi-runtime-utils';

describe('Multi Runtime', function () {

    afterEach(async () => {
        return await cleanOpenRuntimes();
    });

    describe('InterApplicationBus', () => {
        it('should subscribe to * and publish', function (done: Function) {
            // tslint:disable-next-line no-invalid-this
            this.timeout(TEST_TIMEOUT);

            async function test() {
                const conns = await launchX(2);
                const finA = conns[0];
                const finB = conns[1];
                const topic = 'my-topic';
                const data = 'hello';

                await delayPromise(DELAY_MS);

                await finA.InterApplicationBus.subscribe({ uuid: '*' }, topic, (message: any, source: any) => {
                    assert.equal(finB.wire.me.uuid, source.uuid, 'Expected source to be runtimeB');
                    assert.equal(data, message, 'Expected message to be the data sent');
                    done();
                });
                return await finB.InterApplicationBus.publish('my-topic', data);
            }

            test();
        });

        it('should subscribe to a uuid and publish', function (done: Function) {
            // tslint:disable-next-line no-invalid-this
            this.timeout(TEST_TIMEOUT);

            async function test() {
                const conns = await launchX(2);
                const finA = conns[0];
                const finB = conns[1];
                const topic = 'my-topic';
                const data = 'hello';
                await finA.InterApplicationBus
                    .subscribe({ uuid: finB.wire.me.uuid }, topic, (message: any, source: any) => {
                        assert.equal(finB.wire.me.uuid, source.uuid, 'Expected source to be runtimeB');
                        assert.equal(data, message, 'Expected message to be the data sent');
                        done();
                    });
                await delayPromise(DELAY_MS);
                await finB.InterApplicationBus.publish(topic, data);
            }

            test();
        });

        it('should subscribe to * and send', function (done: Function) {
            // tslint:disable-next-line no-invalid-this
            this.timeout(TEST_TIMEOUT);

            async function test() {
                const conns = await launchX(2);
                const finA = conns[0];
                const finB = conns[1];
                const topic = 'my-topic';
                const data = 'hello';

                await finA.InterApplicationBus.subscribe({ uuid: '*' }, topic, (message: any, source: any) => {
                    assert.equal(finB.wire.me.uuid, source.uuid, 'Expected source to be runtimeB');
                    assert.equal(data, message, 'Expected message to be the data sent');
                    done();
                });
                await delayPromise(DELAY_MS);
                return await finB.InterApplicationBus.send({ uuid: finA.wire.me.uuid }, topic, data);

            }

            test();
        });

        it('should subscribe to uuid and send', function (done: Function) {
            // tslint:disable-next-line no-invalid-this
            this.timeout(TEST_TIMEOUT);

            async function test() {
                const conns = await launchX(2);
                const finA = conns[0];
                const finB = conns[1];
                const topic = 'my-topic';
                const data = 'hello';

                await finA.InterApplicationBus.subscribe({ uuid: finB.wire.me.uuid },
                    topic, (message: any, source: any) => {
                        assert.equal(finB.wire.me.uuid, source.uuid, 'Expected source to be runtimeB');
                        assert.equal(data, message, 'Expected message to be the data sent');
                        done();
                    });

                await delayPromise(DELAY_MS);

                await finB.InterApplicationBus.send({ uuid: finA.wire.me.uuid }, topic, data);
            }

            test();
        });

        it('should get subscriberAdded Events', function (done: Function) {
            // tslint:disable-next-line no-invalid-this
            this.timeout(TEST_TIMEOUT);

            async function test() {
                const conns = await launchX(2);
                const finA = conns[0];
                const finB = conns[1];
                const topic = 'my-topic';
                const expectedUuid = finB.wire.me.uuid;

                await finA.InterApplicationBus.on('subscriber-added', (sub: any, b: any) => {
                    assert.equal(expectedUuid, sub.uuid, 'Expected UUIDs to match');
                    assert.equal(sub.topic, topic, 'Expected topics to match');
                    done();
                });
                await delayPromise(DELAY_MS);
                // tslint:disable-next-line
                return await finB.InterApplicationBus.subscribe({ uuid: finA.wire.me.uuid }, 'my-topic', () => { });
            }

            test();
        });

        it('should get subscriberRemoved Events', function (done: Function) {
            // tslint:disable-next-line no-invalid-this
            this.timeout(TEST_TIMEOUT);

            async function test() {
                const conns = await launchX(2);
                const finA = conns[0];
                const finB = conns[1];
                const topic = 'my-topic';
                const expectedUuid = finB.wire.me.uuid;

                await finA.InterApplicationBus.on('subscriber-removed', (sub: any, b: any) => {
                    assert.equal(expectedUuid, sub.uuid, 'Expected UUIDs to match');
                    assert.equal(sub.topic, topic, 'Expected topics to match');
                    done();
                });

                // tslint:disable-next-line
                function listener() { };
                await finB.InterApplicationBus.subscribe({ uuid: finA.wire.me.uuid }, topic, listener);
                await delayPromise(DELAY_MS);
                await finB.InterApplicationBus.unsubscribe({ uuid: finA.wire.me.uuid }, topic, listener);
            }

            test();
        });
    });

});
