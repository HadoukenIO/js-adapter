import * as assert from 'assert';
import { delayPromise } from './delay-promise';
import { launchAndConnect, cleanOpenRuntimes } from './multi-runtime-utils';

describe('Multi Runtime', function() {

    afterEach(async () => {
        return await cleanOpenRuntimes();
    });

    describe('InterApplicationBus', () => {
        it('should subscribe to * and publish', function(done: Function) {
            // tslint:disable-next-line no-invalid-this
            this.timeout(120000);

            async function test() {
                const conns = await Promise.all([launchAndConnect(), launchAndConnect()]);
                const runtimeA = conns[0];
                const runtimeB = conns[1];
                const topic = 'my-topic';
                const data = 'hello';

                await delayPromise(3000);

                await runtimeA.fin.InterApplicationBus.subscribe({ uuid: '*' }, topic, (message: any, source: any) => {
                    assert.equal(runtimeB.fin.wire.me.uuid, source.uuid, 'Expected source to be runtimeB');
                    assert.equal(data, message, 'Expected message to be the data sent');
                    done();
                });
                return await runtimeB.fin.InterApplicationBus.publish('my-topic', data);
            }

            test();
        });

        it('should subscribe to a uuid and publish', function(done: Function) {
            // tslint:disable-next-line no-invalid-this
            this.timeout(120000);

            async function test() {
                const conns = await Promise.all([launchAndConnect(), launchAndConnect()]);
                const runtimeA = conns[0];
                const runtimeB = conns[1];
                const topic = 'my-topic';
                const data = 'hello';

                await delayPromise(3000);

                await runtimeA.fin.InterApplicationBus
                    .subscribe({ uuid: runtimeB.fin.wire.me.uuid }, topic, (message: any, source: any) => {
                        assert.equal(runtimeB.fin.wire.me.uuid, source.uuid, 'Expected source to be runtimeB');
                        assert.equal(data, message, 'Expected message to be the data sent');
                        done();
                   });
                return await runtimeB.fin.InterApplicationBus.publish(topic, data);

            }

            test();
        });

        it('should subscribe to * and send', function(done: Function) {
            // tslint:disable-next-line no-invalid-this
            this.timeout(120000);

            async function test() {
                const conns = await Promise.all([launchAndConnect(), launchAndConnect()]);
                const runtimeA = conns[0];
                const runtimeB = conns[1];
                const topic = 'my-topic';
                const data = 'hello';

                await delayPromise(3000);

                await runtimeA.fin.InterApplicationBus.subscribe({ uuid: '*' }, topic, (message: any, source: any) => {
                    assert.equal(runtimeB.fin.wire.me.uuid, source.uuid, 'Expected source to be runtimeB');
                    assert.equal(data, message, 'Expected message to be the data sent');
                    done();
                });
                return await runtimeB.fin.InterApplicationBus.send({ uuid: runtimeA.fin.wire.me.uuid }, topic, data);

            }

            test();
        });

        it('should subscribe to uuid and send', function(done: Function) {
            // tslint:disable-next-line no-invalid-this
            this.timeout(120000);

            async function test() {
                const conns = await Promise.all([launchAndConnect(), launchAndConnect()]);
                const runtimeA = conns[0];
                const runtimeB = conns[1];
                const topic = 'my-topic';
                const data = 'hello';

                await delayPromise(3000);

                await runtimeA.fin.InterApplicationBus.subscribe({ uuid: runtimeB.fin.wire.me.uuid },
                                                                 topic, (message: any, source: any) => {
                    assert.equal(runtimeB.fin.wire.me.uuid, source.uuid, 'Expected source to be runtimeB');
                    assert.equal(data, message, 'Expected message to be the data sent');
                    done();
                });

                await runtimeB.fin.InterApplicationBus.send({ uuid: runtimeA.fin.wire.me.uuid }, topic, data);
            }

            test();
        });

        it('should get subscriberAdded Events', function(done: Function) {
            // tslint:disable-next-line no-invalid-this
            this.timeout(120000);

            async function test() {
                const conns = await Promise.all([launchAndConnect(), launchAndConnect()]);
                const runtimeA = conns[0];
                const runtimeB = conns[1];
                const topic = 'my-topic';
                const expectedUuid = runtimeB.fin.wire.me.uuid;

                await delayPromise(3000);

                await runtimeA.fin.InterApplicationBus.on('subscriber-added', (sub: any, b: any) => {
                    assert.equal(expectedUuid, sub.uuid, 'Expected UUIDs to match');
                    assert.equal(sub.topic, topic, 'Expected topics to match');
                    done();
                });
                await delayPromise(300);
                // tslint:disable-next-line
                return await runtimeB.fin.InterApplicationBus.subscribe({ uuid: runtimeA.fin.wire.me.uuid }, 'my-topic', () => {});
            }

            test();
        });

        it('should get subscriberRemoved Events', function(done: Function) {
            // tslint:disable-next-line no-invalid-this
            this.timeout(120000);

            async function test() {
                const conns = await Promise.all([launchAndConnect(), launchAndConnect()]);
                const runtimeA = conns[0];
                const runtimeB = conns[1];
                const topic = 'my-topic';
                const expectedUuid = runtimeB.fin.wire.me.uuid;

                await delayPromise(3000);

                await runtimeA.fin.InterApplicationBus.on('subscriber-removed', (sub: any, b: any) => {
                    assert.equal(expectedUuid, sub.uuid, 'Expected UUIDs to match');
                    assert.equal(sub.topic, topic, 'Expected topics to match');
                    done();
                });

                // tslint:disable-next-line
                function listener() {};
                await runtimeB.fin.InterApplicationBus.subscribe({ uuid: runtimeA.fin.wire.me.uuid }, topic, listener);
                await delayPromise(300);
                await runtimeB.fin.InterApplicationBus.unsubscribe({ uuid: runtimeA.fin.wire.me.uuid }, topic, listener);
            }

            test();
        });
    });

});
